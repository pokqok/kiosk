<template>
  <div class="chat-gpt">
    <h1>Ask GPT Your Coffee Choice</h1>
    <div class="input-group">
      <input
        v-model="userInput"
        placeholder="Which coffee would you like to know about?"
        @keyup.enter="sendChat"
        class="input-field"
      />
      <button @click="sendChat" class="send-button">Send</button>
    </div>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="response" class="response">
      <p>{{ response }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["autoQuery"],
  data() {
    return {
      userInput: "",
      response: null,
      loading: false,
    };
  },
  watch: {
    autoQuery(newVal) {
      if (newVal) {
        this.userInput = newVal;
        this.sendChat(); // 자동으로 채팅을 보냄
      }
    },
  },
  methods: {
    sendChat() {
      if (!this.userInput) return; // 사용자 입력이 없으면 실행하지 않음
      this.loading = true;
      axios
        .post("/api/chat", { userInput: this.userInput })
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

<style scoped>
.chat-gpt {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.input-group {
  margin-bottom: 20px;
}

.input-field {
  width: 70%;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  color: #333;
}

.send-button {
  padding: 10px 20px;
  background-color: #5c67f2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.send-button:hover {
  background-color: #4a54e1;
}

.loading {
  color: #5c67f2;
  font-weight: bold;
}

.response {
  background-color: #dff0d8;
  color: #3c763d;
  padding: 15px;
  margin-top: 20px;
  border: 1px solid #d6e9c6;
  border-radius: 5px;
}
</style>
