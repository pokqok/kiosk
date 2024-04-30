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
    // navigator.mediaDevices.getUserMedia({...}) 코드는 삭제
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

        if (average < 25 && this.audio_recording == true) {
          // Adjust this threshold as needed
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
            this.transcription = response.data.data; // 서버로부터 받은 음성 인식 결과
            console.log("Transcription:", this.transcription);
            this.$emit("transcription-complete", this.transcription); // 이벤트 발생
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
    startRecording() {
      // 녹음 시작 버튼 클릭 시에만 호출됨
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.mediaRecorder = new MediaRecorder(stream);

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
        this.submitAudio(); // Stop recording 시에 submitAudio() 함수 실행
        console.log("submit");
      }
    },
  },
};
</script>

<style scoped>
/* 컴포넌트 전체 스타일 */
div {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  background: #f4f4f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 녹음 및 제출 버튼 스타일 */
button {
  padding: 10px 15px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  background-color: #5c67f2;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #4a54e1;
}

/* 녹음 중지 버튼 스타일 - 빨간색으로 강조 */
#stopRecording {
  background-color: #ff6347;
}

#stopRecording:hover {
  background-color: #e05335;
}

/* 인식 결과 표시 스타일 */
p {
  font-size: 16px;
  color: #333;
  background-color: #dff0d8;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #d6e9c6;
  margin-top: 20px;
}

/* 입력 중 상태를 표시할 때 사용하는 스타일 */
.loading {
  color: #5c67f2;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
}
</style>
