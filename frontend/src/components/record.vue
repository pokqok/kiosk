<template>
  <div>
    <!-- Record Button -->
    <button id="startRecording" @click="startRecording">Start Recording</button>
    <button id="stopRecording" @click="stopRecording">Stop Recording</button>
  </div>
</template>

<script>
export default {
  name: 'AudioRecord',
  data() {
    return {
      mediaRecorder: null,
      recordedChunks: []
    };
  },
  methods: {
    async startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };
        this.mediaRecorder.start();
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
        const blob = new Blob(this.recordedChunks, { type: 'audio/wav' });
        this.uploadAudio(blob);
      }
    },
    async uploadAudio(blob) {
      const formData = new FormData();
      formData.append('audio', blob);

      try {
        const response = await fetch('/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        console.log('Upload successful:', data);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }
};
</script>

<style>
/* 스타일 추가 */
</style>
