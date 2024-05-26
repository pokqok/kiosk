<!-- src/components/FontSizeControls.vue -->
<template>
  <div class="font-size-controls">
    <button @click="increaseFontSize">+</button>
    <button @click="decreaseFontSize">-</button>
  </div>
</template>

<script>
export default {
  methods: {
    increaseFontSize() {
      this.adjustFontSize(1);
    },
    decreaseFontSize() {
      this.adjustFontSize(-1);
    },
    adjustFontSize(change) {
      const body = document.body;
      const style = window
        .getComputedStyle(body, null)
        .getPropertyValue("font-size");
      const currentSize = parseFloat(style);
      body.style.fontSize = currentSize + change + "px";
    },
  },
};
</script>

<style scoped>
.font-size-controls {
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: row; /* 버튼을 가로로 배치 */
}

.font-size-controls button {
  margin: 5px;
  padding: 15px 20px; /* 버튼 패딩을 늘려 크기를 키움 */
  font-size: 24px; /* 폰트 크기를 키움 */
  cursor: pointer;
  border: none;
  background-color: #3498db;
  color: white;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s, box-shadow 0.3s;
}

.font-size-controls button:hover {
  background-color: #2980b9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}
</style>
