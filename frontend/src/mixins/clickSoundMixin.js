// src/mixins/clickSoundMixin.js
export default {
  mounted() {
    this.addClickSound();
  },
  methods: {
    addClickSound() {
      const buttons = document.querySelectorAll('button');
          buttons.forEach(button => {
          console.log("button clicked");
        button.addEventListener('click', this.playClickSound);
      });
    },
    playClickSound() {
      const clickSound = new Audio(require('@/assets/click-sound.wav'));
      clickSound.play();
    }
  },
  beforeDestroy() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.removeEventListener('click', this.playClickSound);
    });
  }
};
