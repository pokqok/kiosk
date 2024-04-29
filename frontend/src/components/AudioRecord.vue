<template>
  <div>
    <!-- Record Button -->
    <button
      v-if="audio_recording == false"
      id="startRecording"
      type="button"
      @click="startRecording"
    >
      Start Recording
    </button>
    <button
      v-if="audio_recording == true"
      id="stopRecording"
      type="button"
      @click="stopRecording"
    >
      Stop Recording
    </button>
    <button @click="submitAudio">Submit</button>
    <!-- Transcription -->
    <p>인식결과:{{ transcription }}</p>
  </div>

  <button @click="goToRootPage">메인 페이지로 돌아가기</button>
</template>

<script>
import axios from "axios";
export default {
  name: "AudioRecord",
  data() {
    return {
      transcription: "",
      mediaRecorder: null,
      recordedChunks: [],
      audio_recording: false,
    };
  },
  mounted() {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);
        // log media recorder
        console.log("MediaRecorder created:", this.mediaRecorder);

        // Start monitoring audio levels for silence detection
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

        // Automatically start recording when media stream is available
        this.startRecording();
      });
  },
  methods: {
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

        if (average < 10) {
          // Adjust this threshold as needed
          this.stopRecording();
        } else {
          setTimeout(checkSilence, 1000); // Check every second
        }
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
            this.transcription = response.data.data; // 서버로부터 받은 음성 인식 결과
            console.log("Transcription:", this.transcription);
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
    goToRootPage() {
      this.$router.push("/");
      this.$emit("comeBack");
    },
  },
};
</script>

<style>
/* 스타일 추가 */
</style>
