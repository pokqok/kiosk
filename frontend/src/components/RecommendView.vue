<template>
  <div class="chat-gpt">
    <h1>Chat with GPT-3.5 Turbo</h1>
    <input
      v-model="userInput"
      placeholder="Enter your question here..."
      @keyup.enter="sendChat"
    />
    <button @click="sendChat">Send</button>
    <div v-if="loading">Loading...</div>
    <p v-if="response">{{ response }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      userInput: "",
      response: null,
      loading: false,
    };
  },
  methods: {
    sendChat() {
      console.log("Sending chat:", this.userInput);
      this.loading = true;
      axios
        .post("/chat", {
          userInput:
            "커피가 마시고 싶은데 아이스 아메리카노, 바닐라 라떼, 카라멜 마키아토, 그린 티 라떼, 에스프레소, 콜드 브루, 플랫 화이트, 모카 라떼, 마끼아토, 아이스 티 중에 선택할꺼야 내 요청은 메뉴 이름만 부탁해" +
            this.userInput,
        })
        .then((result) => {
          this.response = result.data.message;
          this.loading = false;
        })
        .catch((error) => {
          console.error("Error sending chat:", error);
          this.response = "Failed to get response from server.";
          this.loading = false;
        });
    },
  },
};
</script>

<style>
.chat-gpt {
  text-align: center;
  margin-top: 20px;
}
button {
  margin-top: 10px;
}
</style>
