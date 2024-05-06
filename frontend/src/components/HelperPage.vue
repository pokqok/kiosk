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
    <p><span v-html="formattedResponse"></span></p>
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
        <h3>추천 메뉴입니다</h3>
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
    <CartModal @subProduct="subProduct" @payment="payment" v-if="showCartModal" />
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
/* 스타일 추가 가능 */
</style>
