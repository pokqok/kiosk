<template>
  <div>
    <audio-record @transcription-complete="handleTranscription"></audio-record>
    <recommend-view :autoQuery="transcription"></recommend-view>
    <!--메인페이지로 돌아가기-->
    <button @click="goToRootPage">메인 페이지로 돌아가기</button>
  </div>
</template>

<script>
import AudioRecord from "./AudioRecord.vue";
import RecommendView from "./RecommendView.vue";

export default {
  components: {
    AudioRecord,
    RecommendView,
  },
  data() {
    return {
      transcription: "",
    };
  },
  methods: {
    handleTranscription(transcribedText) {
      this.transcription = transcribedText;
    },
    goToRootPage() {
      this.$router.push("/");
      this.$emit("comeBack");
    },
  },
};
</script>
