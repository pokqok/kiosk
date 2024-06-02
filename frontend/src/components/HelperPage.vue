<template>
  <div class="head-container">
    <v-row>
      <v-col cols="4">
        <v-btn color="white" @click="$router.go(-1)">
          <v-icon>mdi-close</v-icon>
          <p>뒤로가기</p>
        </v-btn>
      </v-col>
      <v-col cols="4">
        <h2 class="mb-4">실타래 {{ ShopID }}</h2>
      </v-col>
    </v-row>
  </div>

  <div style="margin-top: 10%"></div>

    <v-container>
    <audio ref="menuAudio" :src="menuAudioSource" type="audio/mp3"></audio>
    <audio ref="addAudio" :src="addAudioSource" type="audio/mp3"></audio>
    <audio ref="optionAudio" :src="optionAudioSource" type="audio/mp3"></audio>
    <div v-if="step == 0">
      <v-btn
        @click="startRecording"
        width="50%"
        height="50vh"
        color="rgb(30, 144, 255)"
      >
        <v-icon size="xxx-large" color="white">mdi-microphone</v-icon>
      </v-btn>
      <h3 style="margin-top: 3%">버튼을 눌러서 음성인식을 실행해주세요</h3>
      <div v-if="showVolumeMeter" class="volume-meter-container">
        <div class="outer-meter">
          <div
            :style="{ width: volumeMeterWidth + 'px' }"
            class="inner-meter"
          ></div>
        </div>
      </div>
    </div>
    <div v-if="step == 1">
      <v-progress-circular
        indeterminate
        :size="60"
        :width="6"
      ></v-progress-circular>
      <p>인식결과: <span v-html="formattedTranscription"></span></p>
    </div>
    <div v-if="step == 2">
      <div v-if="loading">추천 중...</div>
      <v-row v-else>
        <v-col cols="12">
          <v-btn
            @click="startRecording"
            color="accent"
            dark
            width="80%"
            height="150%"
            >
              <v-icon size="x-large">mdi-microphone</v-icon>
              <h3>추가로 주문하기</h3>
            </v-btn>
        </v-col>

        <v-col cols="12">
          <div v-if="showVolumeMeter" class="volume-meter-container">
            <div class="outer-meter">
              <div
                :style="{ width: volumeMeterWidth + 'px' }"
                class="inner-meter"
              ></div>
            </div>
          </div>
        </v-col>

        <v-col cols="4" v-for="item in filteredItems" :key="item.id">
          <ProductItem            
            :product="item"
            @selectProduct="openProductOptionModal($event)"
          ></ProductItem>
        </v-col>
      </v-row>


      
    </div>
  </v-container>
    

    <ProductOptionModal
      @closeProductOptionModal="closeProductOptionModal"
      @payment="payment"
      @pickProduct="pickProduct"
      :selectedProduct="selectedProduct"
      :tag=filteredTagsByProductId().tags
      :option=filteredTagsByProductId().options
      :category="getCategoryNameById(selectedProduct.category)"
      v-if="showOptionModal"
    />
    <CartModal
      @subProduct="subProduct"
      @payment="payment"
      v-if="showCartModal"
    />
</template>

<script>
import { mapState, mapMutations } from "vuex";
import ProductItem from "./Product.vue";
import ProductOptionModal from "./ProductOptionModal.vue";
import CartModal from "./CartModal.vue";
import axios from "axios";
import menuData from "@/assets/testdata.js";

let lastVolume = 0;

export default {
  props: ["autoQuery"],
  name: "HelperPage",
  emits: ["comeBack"], // 추가된 부분
  components: { ProductItem, ProductOptionModal, CartModal },
  data() {
    return {
      step: 0,
      transcription: "",
      recordedChunks: [],
      loading: false,
      filteredItems: [],
      selectedProduct: null,
      testdata: menuData,
      showOptionModal: false,
      showCartModal: false,
      //전체 데이터 저장 배열
      productsWithTagOptions: [],
      audioContext: null,
      analyser: null,
      dataArray: null,
      volumeMeterWidth: 0,
      showVolumeMeter: false,
      menuAudioSource: require("@/assets/음성인식 설명.mp3"),
      addAudioSource: require("@/assets/추가주문.mp3"),
      optionAudioSource: require("@/assets/옵션.mp3"),
      // minVolume: 0.5,
      // microphone: null,
      // volumeCheckInterval: null,
      // silenceTimer: null,
      // silenceDuration: 2000,
    };
  },
  watch: {
    autoQuery(newVal) {
      if (newVal) {
        this.userInput = newVal;
        this.sendChat();
      }
    },
    step(newVal) {
      if (newVal === 2) {
        console.log("2번 확인");
        this.playAddAudio();
      }
    },
  },
  async created() {
      // 데이터를 비동기적으로 로드
      this.$store.dispatch('fetchCategories');
      this.$store.dispatch('fetchTags')
      this.$store.dispatch('fetchOptions');
      this.$store.dispatch('fetchProducts');
      this.$store.dispatch('fetchTagMenu');

    },
  computed: {
    ...mapState(["testdata","testProduct","testTag","testOption","testCategory","testTagMenu",  "ShopID", "orderType", "cart"]),
    formattedTranscription() {
      return this.transcription
        ? this.transcription.replace(/\n/g, "<br>")
        : "";
    },
    formattedResponse() {
      return this.response ? this.response.replace(/\n/g, "<br>") : "";
    },
    //실제 DB 데이터
    tags(){
      return this.$store.state.kioskModule.tags;
    },
    categories(){
      return this.$store.state.kioskModule.categories;
    },
    options(){
      return this.$store.state.kioskModule.options;
    },
    products(){
      return this.$store.state.kioskModule.products;
    },
    tagMenu(){
      return this.$store.state.kioskModule.tagMenu;
    },
    //데이터 포메팅
    computedProducts() {
    // 제품 데이터
    const products = this.products;

    // 태그와 옵션 매칭 정보
    const tags = this.tags;
    const options = this.options;
    const tagMenu = this.tagMenu;
    const categories = this.categories;
    // 각 제품에 대해 새로운 형식으로 변환
    return products.map(product => {
      // 제품에 대한 카테고리 정보 가져오기
      const productCategory = categories.find(category => category.id === product.category);

      // 제품과 매칭된 태그와 옵션 정보 찾기
      const productWithTagOptions = tagMenu.filter(item => item.productId === product.id);

      // 제품과 매칭된 태그 정보 가져오기
      const productTags = productWithTagOptions.map(tagOption => {
          const tag = tags.find(tag => tag.id === tagOption.tagId);
          return { id: tag.id, name: tag.name };
      });

      // 제품과 매칭된 옵션 정보 가져오기
      const productOptions = productWithTagOptions.map(tagOption => {
          const option = options.find(option => option.tag === tagOption.tagId);
          return {
              id: option.id,
              name: option.name,
              price: option.price,
              image: option.image,
              alias: option.alias,
              orderNo: option.orderNo,
              duplicate: option.duplicate
          };
      });

      // 제품 정보를 새로운 형식으로 변환하여 반환
      return {
          productId: product.id,
          productName: product.name,
          category: {
              id: productCategory.id,
              name: productCategory.name,
              alias: productCategory.alias,
              isOn: productCategory.isOn
          },
          tags: productTags,
          options: productOptions,
      };
    });
  },

  //필요 없는 기능
  filteredTagsByProductId() {
      return () => {
        
        if (!this.selectedProduct) return { tags: [], options: [] }; // 선택된 상품이 없으면 빈 배열 반환

        const productId = this.selectedProduct.id; // 선택된 상품의 ID 가져오기
        //console.log('선택 메뉴 아이디:',productId);
        const matchedTags = this.tagMenu.filter(tag => tag.productId == productId); // productId와 일치하는 tagMenu 찾기
        //console.log('상품 매치 태그들:',matchedTags);
        const matchedTagIds = matchedTags.map(tag => tag.tagId); // 일치하는 tag의 tagId 추출
        //console.log('일치하는 태그 아이디들:',matchedTagIds);
        const filteredTags = this.tags.filter(tag => matchedTagIds.includes(tag.id)); // tagId와 일치하는 tag 필터링
        //console.log('필터링된 태그들:',filteredTags);
        
        const matchedOptionIds = [];
          matchedTagIds.forEach(tag => {
            const options = this.options.filter(option => option.tag == tag);
            matchedOptionIds.push(...options.map(option => option.id));
          });
          // 옵션 ID를 사용하여 해당 옵션들을 필터링합니다.
          const filteredOptions = this.options.filter(option => matchedOptionIds.includes(option.id));
          console.log("선택 상품의 태그들 현황: ",filteredTags);
          console.log("선택 상품의 태그의 옵션들: ",filteredOptions);
          //return { tags: matchedTags, options: filteredOptions };
          return { tags: filteredTags, options: filteredOptions };

        
      };

         //테스트 데이터 이용시 아래 참고
          /*
         return () => {
        if (!this.selectedProduct) return { tags: [], options: [] }; // 선택된 상품이 없으면 빈 배열 반환

        const productId = this.selectedProduct.id; // 선택된 상품의 ID 가져오기
        const matchedTags = this.testTagMenu.filter(tag => tag.productId === productId); // productId와 일치하는 tagMenu 찾기
    
        const matchedTagIds = matchedTags.map(tag => tag.tagId); // 일치하는 tag의 tagId 추출
        const filteredTags = this.testTag.filter(tag => matchedTagIds.includes(tag.id)); // tagId와 일치하는 tag 필터링
      
        console.log('옵션들:',this.options);
        const matchedOptionIds = [];
          matchedTagIds.forEach(tag => {
            const options = this.testOption.filter(option => option.tag == tag);
            matchedOptionIds.push(...options.map(option => option.id));
          });
          // 옵션 ID를 사용하여 해당 옵션들을 필터링합니다.
          const filteredOptions = this.testOption.filter(option => matchedOptionIds.includes(option.id));
          console.log("선택 상품의 태그들 현황: ",filteredTags);
          console.log("선택 상품의 태그의 옵션들: ",filteredOptions);
          //return { tags: matchedTags, options: filteredOptions };
          return { tags: filteredTags, options: filteredOptions };
          
          */
    },
  },
  mounted() {
  
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) this.recordedChunks.push(event.data);
      };
      this.mediaRecorder.onstop = () => {
        let blob = new Blob(this.recordedChunks, { type: "audio/wav" });
        this.uploadAudio(blob);
        this.audio_recording = false;
        this.step = 1;
      };
    });
    //this.initializeMediaRecorder();
    if (this.cart.length != 0) this.showCartModal = true;
    setTimeout(() => {
      this.playMenuAudio();
    }, 300);
    //setTimeout(this.playMenuAudio, 300);
  },
  methods: {
    ...mapMutations(["addCart", "setProductName","subCart", "setTotalPrice"]),
    stopAllAudios() {
      [
        this.$refs.menuAudio,
        this.$refs.addAudio,
        this.$refs.optionAudio,
      ].forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    },
    stopOptionAudio() {
      if (this.$refs.optionAudio) {
        this.$refs.optionAudio.pause();
        this.$refs.optionAudio.currentTime = 0;
      }
    },
    playMenuAudio() {
      //this.stopAllAudios();
      this.$refs.menuAudio
        .play()
        .catch((error) => console.error("Audio play failed:", error));
    },
    playAddAudio() {
      this.stopAllAudios();
      this.$refs.addAudio
        .play()
        .catch((error) => console.error("Audio play failed:", error));
    },
    playOptionAudio() {
      this.stopAllAudios();
      this.$refs.optionAudio
        .play()
        .catch((error) => console.error("Option audio play failed:", error));
    },
    async startRecording() {
      this.stopAllAudios();
      if (this.mediaRecorder && !this.audio_recording) {
        this.showVolumeMeter = true;
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        this.streamSource = this.audioContext.createMediaStreamSource(stream);
        this.streamSource.connect(this.analyser);
        this.analyser.fftSize = 256;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.updateVolumeMeter();
        // this.volumeCheckInterval = setInterval(this.checkVolume, 100);
        // this.recordedChunks = []; // Ensure recordedChunks is reset
        // this.mediaRecorder.start(); // Start the media recorder
        // this.audio_recording = true;
        this.audio_recording = true;
        this.mediaRecorder.start();
        setTimeout(() => {
          this.stopRecording();
        }, 5000);
      }
    },
    // initializeMediaRecorder() {
    //     navigator.mediaDevices
    //       .getUserMedia({ audio: true })
    //       .then((stream) => {
    //         this.mediaRecorder = new MediaRecorder(stream);
    //         this.mediaRecorder.ondataavailable = (event) => {
    //           if (event.data.size > 0) {
    //             this.recordedChunks.push(event.data);
    //           }
    //         };
    //         this.mediaRecorder.onstop = () => {
    //           console.log("Recording stopped.");
    //           const blob = new Blob(this.recordedChunks, { type: "audio/wav" });
    //           this.uploadAudio(blob);
    //           this.audio_recording = false;
    //           this.step = 1;
    //         };
    //       })
    //       .catch((error) => {
    //         console.error("Error accessing microphone:", error);
    //       });
    //   },

    //   checkVolume() {
    //     this.analyser.getByteFrequencyData(this.dataArray);
    //     const avgVolume =
    //       this.dataArray.reduce((acc, cur) => acc + cur, 0) /
    //       this.dataArray.length;
    //     console.log("Average volume:", avgVolume); // 볼륨 확인용 로그
  
    //     if (avgVolume < 45) {
    //       if (!this.silenceTimer) {
    //         console.log("Starting silence timer"); // 타이머 시작 로그
    //         this.silenceTimer = setTimeout(() => {
    //           console.log("Silence detected, stopping recording"); // 타이머 만료 로그
    //           this.stopRecording();
    //         }, this.silenceDuration);
    //       }
    //     } else {
    //       if (this.silenceTimer) {
    //         console.log("Resetting silence timer"); // 타이머 초기화 로그
    //         clearTimeout(this.silenceTimer);
    //         this.silenceTimer = null;
    //       }
    //     }
    //   },

    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
        this.audio_recording = false;
        this.showVolumeMeter = false;
        setTimeout(() => {
          this.submitAudio();
        }, 1000);
      }
      // if (this.mediaRecorder) {
      //     this.mediaRecorder.stop();
      //     console.log("stop0");
      //     this.audio_recording = false;
      //     this.showVolumeMeter = false;
      //     clearInterval(this.volumeCheckInterval);
      //     clearTimeout(this.silenceTimer);
      //     this.silenceTimer = null;
      //     this.uploadAudioAndSubmit();
      //   }
    },

    // async uploadAudioAndSubmit() {
    //     if (this.recordedChunks.length > 0) {
    //       const blob = new Blob(this.recordedChunks, { type: "audio/wav" });
    //       try {
    //         await this.uploadAudio(blob);
    //         this.submitAudio();
    //       } catch (error) {
    //         console.error("Error uploading audio:", error);
    //       }
    //     } else {
    //       console.warn("No recorded chunks to upload.");
    //     }
    //   },
      
    async uploadAudio(blob) {
      let formData = new FormData();
      formData.append("audio", blob);
      axios
        .post("/api/upload", formData)
        .then((response) => {
          this.$store.commit("setFile", response.data.uploaded_file);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
      this.recordedChunks = [];
      // const formData = new FormData();
      //   formData.append("audio", blob);
      //   try {
      //     const response = await axios.post("/api/upload", formData);
      //     this.$store.commit("setFile", response.data.uploaded_file);
      //     console.log("upload");
      //     console.log("check");
      //   } catch (error) {
      //     console.error("Error uploading file:", error);
      //     throw error; // 에러를 호출자에게 다시 전파
      //   }
      //   console.log("ㅇㄴㄹㄴㅁㄻㄴㅇㄹ")
      //   this.recordedChunks = []; // 업로드 후 recordedChunks 초기화
    },
    submitAudio() {
      if (this.audio_recording) {
        alert("녹음 중에는 파일을 올릴 수 없습니다.");
      } else if (!this.$store.state.file) {
        alert("녹음된 파일이 없습니다.");
      } else {
        const formData = new FormData();
        formData.append("uploaded_file", this.$store.state.file);
        axios
          .post("/api/audio-upload", formData)
          .then((response) => {
            this.transcription = response.data.data;
            this.$emit("transcription-complete", this.transcription);
            this.sendChat();
          })
          .catch((error) => {
            console.error("Error:", error.response.data.message);
            alert("음성 인식에 실패했습니다.");
          })
          .finally(() => {
            this.$store.commit("setFile", null);
          });
      }
    },
    sendChat() {
      if (!this.transcription) return;
      this.loading = true;
      axios
        .post("/api/chat", { userInput: this.transcription })
        .then((result) => {
          this.response = result.data.message;
          this.loading = false;
          this.step = 2;

          const responseItems = this.response.match(/\[(\d+(?:,\s*\d+)*)\]/m);

        
          console.log("전체 결과:",result.data.message);
          console.log("this is what you Got: ",responseItems[1]);

          const responseArray = responseItems[1].split(',').map(item => parseInt(item.trim(), 10));
          console.log("배열 변환 결과 ",responseArray);

          this.filteredItems = this.products.filter((item) =>
            responseArray.includes((item.id)) // item.id를 문자열로 변환하여 비교
          );
          console.log("필터링 결과는: ",this.filteredItems);
        
        })
        .catch((error) => {
          console.error("Error sending chat:", error);
          this.response = "Failed to get response from server.";
          this.loading = false;
          this.step = 2;
        });
    },
    updateVolumeMeter() {
      requestAnimationFrame(this.updateVolumeMeter);
      this.analyser.getByteFrequencyData(this.dataArray);
      let sum = this.dataArray.reduce((a, b) => a + b, 0);
      let average = sum / this.dataArray.length;
      let scaleFactor = 1.5;
      let maxVolumeWidth = 200;
      let newWidth = Math.min(maxVolumeWidth, average * scaleFactor);
      if (newWidth < lastVolume) {
        this.volumeMeterWidth = newWidth;
      } else {
        this.volumeMeterWidth = (lastVolume + newWidth) / 2;
      }
      lastVolume = newWidth;
      // if (!this.showVolumeMeter) return;
      //   requestAnimationFrame(this.updateVolumeMeter);
      //   this.analyser.getByteFrequencyData(this.dataArray);
      //   const average =
      //     this.dataArray.reduce((a, b) => a + b, 0) / this.dataArray.length;
      //   const scaleFactor = 1.5;
      //   const maxVolumeWidth = 200;
      //   this.volumeMeterWidth = Math.min(maxVolumeWidth, average * scaleFactor);
    },
    openProductOptionModal(product) {
      this.playOptionAudio();
      this.selectedProduct = product;
      //console.log("선택된 메뉴: ", product);
      this.showOptionModal = true;
      this.showCartModal = false;
    },
    closeProductOptionModal() {
      // this.stopOptionAudio();
      // console.log("취소할 메뉴: ", this.selectedProduct);
      // this.selectedProduct = null;
      // this.showProductOptionModal = false;
      // if (this.cart.length != 0) {
      //   this.showCartModal = true;
      // }
      this.stopOptionAudio();
      this.showOptionModal = false;
      if (this.cart.length != 0) {
        this.showCartModal = true;
      }
    },
    

    // payment($event) {
    //   console.log("개수: ",$event.num);
    //   console.log("가격:",$event.price);
    //   this.stopOptionAudio();
    //   if ($event !== undefined) {
    //     for (let i = 0; i < $event.num; i++) {
    //       this.addCart({productName:this.selectedProduct.name, productPrice: $event.price, option:$event.option});
    //       this.setTotalPrice($event.price);
    //     }
    //     this.setProductName(this.selectedProduct.name) //이름 추가하기
    //   }else{
    //     this.setProductName('다중 메뉴')//이름 추가하기
    //     //나중에 이름 추가하는거 좀더 상세히(개수랑 종류까지 다 포함) == 서버에 데이터 넘겨주는걸 하기 위해서 필요
    //   }
    //   this.showOptionModal = false;
    //   this.showCartModal = false;
    //   this.$router.push("/payment");
    // },
    payment($event) {
      this.stopOptionAudio();
      console.log("개수: ", $event.num);
      console.log("가격:", $event.price);
      if ($event.num > 1) {
        this.setProductName("다중 메뉴"); //이름 추가하기
      } else {
        this.setProductName(this.selectedProduct.name); //이름 추가하기
      }
      this.showOptionModal = false;
      this.showCartModal = false;
      console.log("결제 들어가기전 payment확인(shop페이지):",$event.price);
      this.$router.push("/payment");
      //this.clearCart();
    },
    pickProduct($event) {
      this.stopOptionAudio();
      this.showOptionModal = false;
      console.log("개수: ", $event.num);
      console.log("가격:", $event.price);
      console.log("옵션:",$event.option);
      for (let i = 0; i < $event.num; i++) {
        this.addCart({
          product: {
            name: this.selectedProduct.name,
            price: $event.price,
          },
          options: $event.option,
        });
      }
      this.showCartModal = true;
      console.log("장바구니 크기:",this.cart.length);
    },
    subProduct($event) {
      this.subCart($event);
      //this.setTotalPrice(-$event.productPrice);
      if (this.cart.length == 0) {
        this.showCartModal = false;
      }
    },

    //데이터 변환 관련
    //사용 안함
    changeData(products) {
    return products.map(product => {
        return {
            ProductNO: product.id,
            ProductName: product.name,
            Price: product.price,
            CategoryNO: product.category,
            ProductDetail: product.detail,
            ProductImage: product.image,
            alias: '', // alias는 기존 데이터에 없으므로 비워두거나 적절한 값 할당
            isOn: true, // 기존 데이터에는 없지만 키오스크 표시 여부를 고려할 수 있습니다.
        };
      });
    },
    getCategoryNameById(id) {
      console.log("전체 카테고리는?:",this.categories);
      console.log("넘겨준 카테고리 id는?:",this.categories);
      const category = this.categories.find(cat => cat.id === id);
      return category ? category.name : null;
    },

    
    

  },
};
</script>

<style>
.volume-meter-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.outer-meter {
  background-color: #ccc;
  height: 20px;
  width: 100%;
  max-width: 200px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.inner-meter {
  height: 100%;
  background: linear-gradient(to right, #4caf50, #8bc34a);
  transition: width 0.05s ease-out;
}
</style>
