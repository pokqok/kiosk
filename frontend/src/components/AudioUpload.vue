<template>
  <div>
    <input type="file" @change="handleFileChange" accept="audio/*" />
    <button @click="submitAudio">음성 인식 시작</button>
    <p v-if="transcription">{{ transcription }}</p>
  </div>

  <button @click="goToRootPage">메인 페이지로 돌아가기</button>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      selectedFile: null,
      transcription: ''
    };
  },
  methods: {
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
      console.log('Selected file:', this.selectedFile);
    },
    submitAudio() {
      if (!this.selectedFile) {
        return alert('파일을 선택해 주세요.');
      }
      const formData = new FormData();
      formData.append('uploaded_file', this.selectedFile);

      axios.post('api/audio-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        this.transcription = response.data.data; // 서버로부터 받은 음성 인식 결과
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('음성 인식에 실패했습니다.');
      });
    },
    goToRootPage() {
      this.$router.push("/")
      this.$emit("comeBack")
    },
  }
};
</script>
