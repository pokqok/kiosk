<template>
  <div class="head-container">
    <v-row>
      <v-col cols="4">
        <v-btn color="#3498db" @click="$router.go(-1)">
          <v-icon>mdi-close</v-icon>
          <p>취소</p>
        </v-btn>
      </v-col>
      <v-col cols="4">
        <h2 class="mb-4">실타래 {{ ShopID }}</h2>
      </v-col>
    </v-row>
  </div>

  <div style="margin-top: 10%;"></div>

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
        <v-btn
          @click="startRecording"
          color="accent"
          large
          dark
          class="mx-auto d-block mt-3"
          >추가로 주문하기</v-btn
        >
        <div v-if="showVolumeMeter" class="volume-meter-container">
          <div class="outer-meter">
            <div
              :style="{ width: volumeMeterWidth + 'px' }"
              class="inner-meter"
            ></div>
          </div>
        </div>
        <v-col cols="3">
          <ProductItem
            v-for="item in filteredItems"
            :product="item"
            :key="item.ProductNO"
            @selectProduct="openProductOptionModal($event)"
          ></ProductItem>
        </v-col>
      </v-row>
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
  </v-container>
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
  emits: ["comeBack"],
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
      minVolume: 0.5,
      microphone: null,
      volumeCheckInterval: null,
      silenceTimer: null,
      silenceDuration: 2000,
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
        this.playAddAudio();
      }
    },
  },
  computed: mapState(["testdata", "ShopID", "orderType", "cart"]),
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
    this.initializeMediaRecorder();
    if (this.cart.length != 0) this.showCartModal = true;
    setTimeout(this.playMenuAudio, 300);
  },
  methods: {
    ...mapMutations(["addCart", "subCart", "setTotalPrice"]),
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
      this.stopAllAudios();
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
        this.volumeCheckInterval = setInterval(this.checkVolume, 100);
        this.recordedChunks = []; // Ensure recordedChunks is reset
        this.mediaRecorder.start(); // Start the media recorder
        this.audio_recording = true;
      }
    },
    initializeMediaRecorder() {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.mediaRecorder = new MediaRecorder(stream);
          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              this.recordedChunks.push(event.data);
            }
          };
          this.mediaRecorder.onstop = () => {
            console.log("Recording stopped.");
            const blob = new Blob(this.recordedChunks, { type: "audio/wav" });
            this.uploadAudio(blob);
            this.audio_recording = false;
            this.step = 1;
          };
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
    },
    checkVolume() {
      this.analyser.getByteFrequencyData(this.dataArray);
      const avgVolume =
        this.dataArray.reduce((acc, cur) => acc + cur, 0) /
        this.dataArray.length;
      console.log("Average volume:", avgVolume); // 볼륨 확인용 로그

      if (avgVolume < 45) {
        if (!this.silenceTimer) {
          console.log("Starting silence timer"); // 타이머 시작 로그
          this.silenceTimer = setTimeout(() => {
            console.log("Silence detected, stopping recording"); // 타이머 만료 로그
            this.stopRecording();
          }, this.silenceDuration);
        }
      } else {
        if (this.silenceTimer) {
          console.log("Resetting silence timer"); // 타이머 초기화 로그
          clearTimeout(this.silenceTimer);
          this.silenceTimer = null;
        }
      }
    },

    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
        console.log("stop0");
        this.audio_recording = false;
        this.showVolumeMeter = false;
        clearInterval(this.volumeCheckInterval);
        clearTimeout(this.silenceTimer);
        this.silenceTimer = null;
        this.uploadAudioAndSubmit();
      }
    },

    async uploadAudioAndSubmit() {
      if (this.recordedChunks.length > 0) {
        const blob = new Blob(this.recordedChunks, { type: "audio/wav" });
        try {
          await this.uploadAudio(blob);
          this.submitAudio();
        } catch (error) {
          console.error("Error uploading audio:", error);
        }
      } else {
        console.warn("No recorded chunks to upload.");
      }
    },

    async uploadAudio(blob) {
      const formData = new FormData();
      formData.append("audio", blob);
      try {
        const response = await axios.post("/api/upload", formData);
        this.$store.commit("setFile", response.data.uploaded_file);
        console.log("upload");
      } catch (error) {
        console.error("Error uploading file:", error);
        throw error; // 에러를 호출자에게 다시 전파
      }
      this.recordedChunks = []; // 업로드 후 recordedChunks 초기화
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
      if (!this.showVolumeMeter) return;
      requestAnimationFrame(this.updateVolumeMeter);
      this.analyser.getByteFrequencyData(this.dataArray);
      const average =
        this.dataArray.reduce((a, b) => a + b, 0) / this.dataArray.length;
      const scaleFactor = 1.5;
      const maxVolumeWidth = 200;
      this.volumeMeterWidth = Math.min(maxVolumeWidth, average * scaleFactor);
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