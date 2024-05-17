<!-- HelperPage.vue -->

<template>
  <div class="head-container row">
    <div class="col-4">
      <button @click="$router.go(-1)" type="button" class="btn btn-light">
        <i class="bi bi-x-lg icon"></i>
        <p>취소</p>
      </button>
    </div>
    <h2 class="title mb-4 col-4">실타래 {{ ShopID }}</h2>
  </div>
  <div style="margin-top: 15%">
    <div v-if="step == 0">
      <button @click="startRecording" size="x-large" icon="$vuetify">
        <i class="bi bi-mic-fill x-lg"></i>
      </button>
      <h3 style="margin-top: 3%">버튼을 눌러서 음성인식을 실행해주세요</h3>
    </div>
    <div v-if="step == 1">
      <v-progress-circular
        indeterminate
        :size="60"
        :width="6"
      ></v-progress-circular>
    </div>
    <p>인식결과: <span v-html="formattedTranscription"></span></p>
    <!--<p><span v-html="formattedResponse"></span></p>-->
    <div v-if="step == 2">
      <div v-if="loading">추천 중...</div>
      <div v-else class="row">
        <ProductItem
          v-for="item in filteredItems"
          :product="item"
          class="col-3"
          @selectProduct="openProductOptionModal($event)"
          :key="item.id"
        ></ProductItem>
        <h3>
          <v-btn
            @click="startRecording"
            color="accent"
            large
            dark
            class="mx-auto d-block mt-3"
            >추가로 주문하기</v-btn
          >
        </h3>
        <!-- 수정된 추가로 주문하기 버튼 -->
      </div>
    </div>
    <!-- 옵션 모달 -->
    <ProductOptionModal
      @closeProductOptionModal="closeProductOptionModal"
      @payment="payment"
      @pickProduct="pickProduct"
      :selectedProduct="selectedProduct"
      :tag=filteredTagsByProductId().tags
      :option=filteredTagsByProductId().options
      v-if="showOptionModal"
    />
    <CartModal
      @subProduct="subProduct"
      @payment="payment"
      v-if="showCartModal"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import ProductItem from "./Product.vue";
import ProductOptionModal from "./ProductOptionModal.vue";
import CartModal from "./CartModal.vue";
import axios from "axios";
import menuData from "@/assets/testdata.js";

export default {
  props: ["autoQuery"],
  name: "HelperPage",
  components: {
    ProductItem,
    ProductOptionModal,
    CartModal,
  },
  data() {
    return {
      step: 0,
      transcription: "",
      recordedChunks: [],
      userInput: "",
      response: null,
      loading: false,
      filteredItems: [],
      selectedProduct: null,
      testdata: menuData,
      showOptionModal: false,
      showCartModal: false,
      //전체 데이터 저장 배열
      productsWithTagOptions: [],
    };
  },
  watch: {
    autoQuery(newVal) {
      if (newVal) {
        this.userInput = newVal;
        this.sendChat();
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
      console.log("MediaRecorder created:", this.mediaRecorder);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        let blob = new Blob(this.recordedChunks, { type: "audio/wav" });
        this.uploadAudio(blob);
        this.audio_recording = false;
        this.step = 1; // 프로그레스 인디케이터 표시
      };
    });

    if (this.cart.length != 0) {
      this.showCartModal = true;
    }
    console.log("computedProducts:", this.computedProducts);
  },
  methods: {
    ...mapMutations(["addCart", "setProductName", "subCart", "setTotalPrice"]),

    async startRecording() {
      if (this.mediaRecorder) {
        this.audio_recording = true;
        this.mediaRecorder.start();
        setTimeout(() => {
          this.stopRecording();
        }, 5000);
      }
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
        this.audio_recording = false;
        setTimeout(() => {
          this.submitAudio();
        }, 1000);
      }
    },
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
    },
    submitAudio() {
      if (this.audio_recording) {
        alert("녹음 중에는 파일을 올릴 수 없습니다.");
      } else if (this.$store.state.file == null) {
        alert("녹음된 파일이 없습니다.");
      } else {
        let formData = new FormData();
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
          console.log("Response:", this.response);
          this.loading = false;
          this.step = 2;
       
     

          // // 응답을 바탕으로 아이템 필터링
          // const responseItems = this.response.split("\n").map((line) => {
          //   const match = line.match(/\[(.*?)\]/);
          //   console.log("추가적 처리중입니다");
          //   return match ? match[1] : null;
          // });

          const responseItems = this.response.match(/\[(\d+(?:,\s*\d+)*)\]/m);

          // if (responseItems) {
          //     const matchString = responseItems[1];
          //     const productIds = matchString.split(',').map(id => parseInt(id.trim()));
          //     console.log("최종 배열 값: ", productIds);
          // } else {
          //     console.log("배열 찾기 실패");
          // }

          //const matchItem = this.response.match(/productId:\s*\[([^\]]+)\]/);
          // let match = str.match(/\[(.*?)\]/);
         // let totalArray = matchArray ? result.split(",").map(Number) : [];

          // testdata.js 데이터에서 응답에 포함된 항목만 추출
          console.log("this is what you Got: ",responseItems[1]);
           this.filteredItems = this.products.filter((item) =>
             responseItems[1].includes(item.id)
           );
        
        })
        .catch((error) => {
          console.error("Error sending chat:", error);
          this.response = "Failed to get response from server.";
          this.loading = false;
          this.step = 2;
        });
    },
    openProductOptionModal(product) {
      this.selectedProduct = product;
      console.log("선택된 메뉴: ", product);
      this.showOptionModal = true;
      this.showCartModal = false;
    },
    closeProductOptionModal() {
      this.showOptionModal = false;
      if (this.cart.length != 0) {
        this.showCartModal = true;
      }
    },

    payment($event) {
      console.log("개수: ",$event.num);
      console.log("가격:",$event.price);
      if ($event !== undefined) {
        for (let i = 0; i < $event.num; i++) {
          this.addCart({productName:this.selectedProduct.name, productPrice: $event.price, option:$event.option});
          this.setTotalPrice($event.price);
        }
        this.setProductName(this.selectedProduct.name) //이름 추가하기
      }else{
        this.setProductName('다중 메뉴')//이름 추가하기
        //나중에 이름 추가하는거 좀더 상세히(개수랑 종류까지 다 포함) == 서버에 데이터 넘겨주는걸 하기 위해서 필요
      }
      this.showOptionModal = false;
      this.showCartModal = false;
      this.$router.push("/payment");
    },

    pickProduct($event) {
        this.showOptionModal = false;
        console.log("개수: ",$event.num);
        console.log("가격:",$event.price);
        for (let i = 0; i < $event.num; i++) {
          this.addCart({productName:this.selectedProduct.name, productPrice: $event.price, option:$event.option});
          this.setTotalPrice($event.price);
        }
        this.showCartModal = true;
    },

    subProduct($event) {
      this.subCart($event);
      this.setTotalPrice(-$event.productPrice);
      if (this.cart.length == 0) {
        this.showCartModal = false;
      }
    },

    //데이터 변환 관련
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

    
    

  },
};
</script>

<style>
/* 스타일 추가 가능 */
</style>
