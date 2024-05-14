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
    <audio ref="menuAudio" :src="menuAudioSource" type="audio/mp3"></audio>
    <audio ref="addAudio" :src="addAudioSource" type="audio/mp3"></audio>
    <audio ref="optionAudio" :src="optionAudioSource" type="audio/mp3"></audio>
    <div v-if="step == 0">
      <button @click="startRecording" size="x-large" icon="$vuetify">
        <i class="bi bi-mic-fill x-lg"></i>
      </button>
      <h3 style="margin-top: 3%">버튼을 눌러서 음성인식을 실행해주세요</h3>
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
      <p>인식결과: <span v-html="formattedTranscription"></span></p>
    </div>
    <div v-if="step == 2">
      <div v-if="loading">추천 중...</div>
      <div v-else class="row">
        <v-btn
          @click="startRecording"
          color="accent"
          large
          dark
          class="mx-auto d-block mt-3"
          >추가로 주문하기</v-btn
        >
        <ProductItem
          v-for="item in filteredItems"
          :product="item"
          class="col-3"
          @selectProduct="openProductOptionModal($event)"
          :key="item.ProductNO"
        ></ProductItem>
      </div>
    </div>
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

let lastVolume = 0;

export default {
  props: ["autoQuery"],
  name: "HelperPage",
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
      audioContext: null,
      analyser: null,
      dataArray: null,
      volumeMeterWidth: 0,
      showVolumeMeter: false,
      menuAudioSource: require("@/assets/음성인식 설명.mp3"),
      addAudioSource: require("@/assets/추가주문.mp3"),
      optionAudioSource: require("@/assets/옵션.mp3"),
      minVolume: 0.5, // 일정 이하로 감지할 최소 음량
      audioContext: null,
      analyser: null,
      microphone: null,
      volumeCheckInterval: null,
      silenceTimer: null,
      silenceDuration: 2000, // 무음 지속 시간 (2초)
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
  computed: mapState(["testdata", "ShopID", "orderType", "cart"]),
  mounted() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.mediaRecorder = new MediaRecorder(stream);
      console.log("MediaRecorder created:", this.mediaRecorder);
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
    if (this.cart.length != 0) this.showCartModal = true;
    setTimeout(() => {
      this.playMenuAudio();
    }, 300);
  },
  methods: {
    ...mapMutations(["addCart", "subCart", "setTotalPrice"]),
    stopAllAudios() {
      // 모든 오디오 요소를 배열로 정의하고 반복 처리
      [
        this.$refs.menuAudio,
        this.$refs.addAudio,
        this.$refs.optionAudio,
      ].forEach((audio) => {
        if (audio) {
          // 오디오 요소가 존재하는지 확인
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
=======
    initializeMicrophone() {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.microphone = this.audioContext.createMediaStreamSource(stream);
          this.analyser = this.audioContext.createAnalyser();
          this.analyser.fftSize = 256;
          this.microphone.connect(this.analyser);
          this.volumeCheckInterval = setInterval(this.checkVolume, 100);
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
    },
    checkVolume() {
      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(dataArray);
      const avgVolume =
        dataArray.reduce((acc, cur) => acc + cur, 0) / dataArray.length;
      if (avgVolume < this.minVolume * 255) {
        if (!this.silenceTimer) {
          this.silenceTimer = setTimeout(() => {
            this.stopRecording();
          }, this.silenceDuration);
        }
      } else {
        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
          this.silenceTimer = null;
        }
      }
    },
    startRecording() {
      if (this.mediaRecorder && this.mediaRecorder.state !== "recording") {
        this.audio_recording = true;
        this.mediaRecorder.start();
      }
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
        this.audio_recording = false;
        this.showVolumeMeter = false;
        clearInterval(this.volumeCheckInterval);
        clearTimeout(this.silenceTimer);
        this.silenceTimer = null;
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
      } else if (!this.$store.state.file) {
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
          this.loading = false;
          this.step = 2;
          const responseItems = this.response.split("\n").map((line) => {
            const match = line.match(/\.\s*(.*?)\s*-/);
            return match ? match[1] : null;
          });
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
      let scaleFactor = 1.5;
      let maxVolumeWidth = 200;
      let newWidth = Math.min(maxVolumeWidth, average * scaleFactor);
      if (newWidth < lastVolume) {
        this.volumeMeterWidth = newWidth;
      } else {
        this.volumeMeterWidth = (lastVolume + newWidth) / 2;
      }
      lastVolume = newWidth;
    },
    openProductOptionModal(product) {
      this.playOptionAudio();
      this.selectedProduct = product;
      this.showOptionModal = true;
      this.showCartModal = false;
    },
    closeProductOptionModal() {
      this.stopOptionAudio();
      this.selectedProduct = null;
      this.showProductOptionModal = false;
    },
    payment($event) {
      this.stopOptionAudio();
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
      this.stopOptionAudio();
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
