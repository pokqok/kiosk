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
      <!-- 볼륨 미터 추가 -->
      <!-- 이후에 쓸 수 도 있는 레이아웃
      <div v-if="showVolumeMeter" class="volume-meter-container">
        <div class="outer-meter">
          <div
            :style="{ width: volumeMeterWidth + 'px' }"
            class="inner-meter"
          ></div>
        </div>
      </div> -->
      <div
        v-if="showVolumeMeter"
        style="display: flex; justify-content: center; margin-top: 10px"
      >
        <div
          style="
            background-color: grey;
            height: 20px;
            width: 100%;
            max-width: 200px;
          "
        >
          <div
            :style="{
              height: '100%',
              backgroundColor: 'green',
              width: volumeMeterWidth + 'px',
            }"
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
          :key="item.ProductNO"
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
        <!-- 볼륨 미터 추가 -->
        <div
          v-if="showVolumeMeter"
          style="display: flex; justify-content: center; margin-top: 10px"
        >
          <div
            style="
              background-color: grey;
              height: 20px;
              width: 100%;
              max-width: 200px;
            "
          >
            <div
              :style="{
                height: '100%',
                backgroundColor: 'green',
                width: volumeMeterWidth + 'px',
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 옵션 모달 -->
    <ProductOptionModal
      @closeProductOptionModal="closeProductOptionModal"
      @payment="payment"
      @pickProduct="pickProduct"
      :selectedProduct="selectedProduct"
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

let lastVolume = 0; // 이전 볼륨 값을 저장하기 위한 변수

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
      // 오디오 분석을 위한 추가 데이터
      audioContext: null,
      analyser: null,
      dataArray: null,
      volumeMeterWidth: 0, // 볼륨 미터의 폭을 저장
      showVolumeMeter: false,
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
  computed: {
    ...mapState(["testdata", "ShopID", "orderType", "cart"]),
    formattedTranscription() {
      return this.transcription
        ? this.transcription.replace(/\n/g, "<br>")
        : "";
    },
    formattedResponse() {
      return this.response ? this.response.replace(/\n/g, "<br>") : "";
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
  },
  methods: {
    ...mapMutations(["addCart", "subCart", "setTotalPrice"]),

    async startRecording() {
      if (this.mediaRecorder && !this.audio_recording) {
        this.showVolumeMeter = true;
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        // 오디오 컨텍스트 및 분석기 설정
        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        this.streamSource = this.audioContext.createMediaStreamSource(stream);
        this.streamSource.connect(this.analyser);
        this.analyser.fftSize = 256;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        // 볼륨 미터 업데이트 함수 호출
        this.updateVolumeMeter();

        // 미디어 레코더 시작
        this.audio_recording = true;
        this.mediaRecorder.start();

        // 녹음 자동 종료 로직
        setTimeout(() => {
          this.stopRecording();
        }, 5000);
      }
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
        this.audio_recording = false;
        this.showVolumeMeter = false; // 볼륨 미터 숨기기
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

          // 응답을 바탕으로 아이템 필터링
          const responseItems = this.response.split("\n").map((line) => {
            const match = line.match(/\.\s*(.*?)\s*-/);
            return match ? match[1] : null;
          });

          // testdata.js 데이터에서 응답에 포함된 항목만 추출
          this.filteredItems = this.testdata.filter((item) =>
            responseItems.includes(item.ProductName)
          );
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

      let scaleFactor = 1.5; // 스케일링 팩터
      let maxVolumeWidth = 200; // 최대 너비
      let newWidth = Math.min(maxVolumeWidth, average * scaleFactor);

      // 볼륨이 감소하는 경우, 빠르게 반응
      if (newWidth < lastVolume) {
        this.volumeMeterWidth = newWidth;
      } else {
        // 볼륨이 증가하거나 같을 때는 부드럽게 증가
        this.volumeMeterWidth = (lastVolume + newWidth) / 2;
      }

      lastVolume = newWidth; // 현재 볼륨을 이전 볼륨으로 저장
    },

    openProductOptionModal(product) {
      this.selectedProduct = product;
      this.showOptionModal = true;
      this.showCartModal = false;
    },
    closeProductOptionModal() {
      this.selectedProduct = null;
      this.showProductOptionModal = false;
    },
    payment($event) {
      if ($event !== undefined) {
        for (let i = 0; i < $event; i++) {
          this.addCart(this.selectedProduct);
          this.setTotalPrice(this.selectedProduct.Price);
        }
      }
      this.showOptionModal = false;
      this.showCartModal = false;
      this.$router.push("/payment");
    },

    pickProduct($event) {
      this.showOptionModal = false;
      for (let i = 0; i < $event; i++) {
        this.addCart(this.selectedProduct);
        this.setTotalPrice(this.selectedProduct.Price);
      }

      this.showCartModal = true;
    },

    subProduct($event) {
      this.subCart($event);
      this.setTotalPrice(-$event.Price);
      if (this.cart.length == 0) {
        this.showCartModal = false;
      }
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
  background-color: #ccc; /* 더 부드러운 그레이 색상 */
  height: 20px;
  width: 100%;
  max-width: 200px;
  border-radius: 10px; /* 둥근 모서리 추가 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 부드러운 그림자 추가 */
  overflow: hidden; /* 내부 요소가 밖으로 나가지 않도록 */
}
.inner-meter {
  height: 100%;
  background: linear-gradient(to right, #4caf50, #8bc34a); /* 그라디언트 배경 */
  transition: width 0.05s ease-out; /* 감소할 때 더 빠른 반응 */
}
</style>
