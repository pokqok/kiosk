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
  <div style="margin-top: 15%;">
    <div v-if="step == 0">
      <button @click="startRecording" size="x-large" icon="$vuetify">
        <i class="bi bi-mic-fill x-lg"></i>
      </button>
      <h3 style="margin-top: 3%;">버튼을 눌러서 음성인식을 실행해주세요</h3>
    </div>
    <div v-if="step == 1">
      <v-progress-circular indeterminate :size="60" :width="6"></v-progress-circular>
    </div>
    <p>인식결과:{{ transcription }}</p>
    <div v-if="step == 2">
      <div class="row">
        <!-- test, 나중에 testdata대신 음성인식 추천 목록-->
        <ProductItem
          :product="testdata[i]"
          class="col-3"
          @selectProduct="openProductOptionModal($event)"
          v-for="i in 3"
          :key="i"
        ></ProductItem>
        <h3>추천 메뉴입니다</h3>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ProductItem from "./Product.vue";
import axios from "axios";

export default {
  name: 'HelperPage',
  data() {
    return {
      step: 0,
      transcription: ""
    }
  },
  computed: {
    ...mapState(["ShopID", "testdata"])
  },
  components: {
    ProductItem,
  },
  methods: {
    openProductOptionModal(data) {
      console.log(data)
      alert("미구현")
    },
    
    monitorAudioLevel(stream) {
      const audioContext = new AudioContext();
      const audioStream = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 32;
      audioStream.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkSilence = () => {
        analyser.getByteFrequencyData(dataArray);
        const average =
          dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;

        if (average < 25 && this.audio_recording == true) {
          if (this.audio_recording) {
            this.stopRecording();
          }
        }
        setTimeout(checkSilence, 5000);
      };

      checkSilence();
    },
    async uploadAudio(blob) {
      let formData = new FormData();
      formData.append("audio", blob);

      axios
        .post("api/upload", formData)
        .then((response) => {
          console.log("Response:", response);
          console.log("uploaded_file:", response.data.uploaded_file);
          this.$store.commit("setFile", response.data.uploaded_file);
          console.log("file: ", this.$store.state.file);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
      this.recordedChunks = [];
    },
    submitAudio() {
      if (this.audio_recording == true) {
        return alert("녹음 중에는 파일을 올릴 수 없습니다.");
      } else if (this.$store.state.file == null) {
        return alert("녹음된 파일이 없습니다.");
      } else {
        let formData = new FormData();
        formData.append("uploaded_file", this.$store.state.file);

        axios
          .post("api/audio-upload", formData)
          .then((response) => {
            this.transcription = response.data.data;
            console.log("Transcription:", this.transcription);
            this.$emit("transcription-complete", this.transcription);
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
    startRecording() {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.mediaRecorder = new MediaRecorder(stream);
          this.monitorAudioLevel(stream);

          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              this.recordedChunks.push(event.data);
            }
          };

          this.mediaRecorder.onstop = () => {
            let blob = new Blob(this.recordedChunks, { type: "audio/wav" });
            this.uploadAudio(blob);
            this.audio_recording = false;
          };

          this.audio_recording = true;
          this.mediaRecorder.start();
          console.log("Recording started");
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
        console.log("stop");
        this.submitAudio();
        console.log("submit");
      }
    },
  },
};
</script>

<style></style>
