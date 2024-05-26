<template>
  <div>
    <audio ref="orderMenu" :src="orderMenuSource" type="audio/mp3"></audio>
    <audio ref="addOrder" :src="addOrderSource" type="audio/mp3"></audio>
    <audio ref="subOrder" :src="subOrderSource" type="audio/mp3"></audio>
    <audio ref="option" :src="optionAudioSource" type="audio/mp3"></audio>
    <audio ref="clickSound" :src="clickSoundSource" type="audio/mp3"></audio>
    <v-toolbar class="head-container pb-0" tabs>
      <v-col cols="4">
        <v-btn color="white" @click="goToBack">
          <v-icon left>mdi-arrow-left</v-icon>
          <p>뒤로가기</p>
        </v-btn>
      </v-col>
      <v-col cols="4">
        <h2>실타래 {{ ShopID }}</h2>
      </v-col>
      <template v-slot:extension>
        <v-tabs v-model="tab" grow>
          <v-tab
            v-for="i in testCategory"
            :key="i"
            :href="'#CategoryTitle' + i.name"
          >
            #{{ i.name }}
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
  </div>

  <div style="margin-top: 140px"></div>
  <v-container v-for="i in testCategory" :key="i">
    <h4 style="scroll-margin: 140px" :id="'CategoryTitle' + i.name">
      #{{ i.name }}
    </h4>
    <v-row>
      <v-col cols="4" v-for="item in filteredProducts(i.id)" :key="item.id">
        <ProductItem
          :product="item"
          @selectProduct="handleProductClick($event)"
        ></ProductItem>
      </v-col>
    </v-row>
    <v-divider class="my-5"></v-divider>
  </v-container>

  <ProductOptionModal
    @closeProductOptionModal="closeProductOptionModal"
    @payment="payment"
    @pickProduct="pickProduct"
    :selectedProduct="selectedProduct"
    v-if="showOptionModal"
    :tag="filteredTagsByProductId().tags"
    :option="filteredTagsByProductId().options"
    :category="getCategoryNameById(selectedProduct.category)"
  />

  <CartModal @subProduct="subProduct" @payment="payment" v-if="showCartModal" />
</template>

<script>
import ProductItem from "./Product.vue";
import ProductOptionModal from "./ProductOptionModal.vue";
import CartModal from "./CartModal.vue";
import { mapState, mapMutations } from "vuex";

export default {
  name: "ShopPage",
  data() {
    return {
      tab: null,
      activeCategory: null,
      showOptionModal: false,
      showCartModal: false,
      selectedProduct: null,
      orderMenuSource: require("@/assets/원하시는메뉴를선택해주세요.mp3"),
      addOrderSource: require("@/assets/장바구니추가.mp3"),
      subOrderSource: require("@/assets/장바구니취소.mp3"),
      optionAudioSource: require("@/assets/옵션.mp3"),
      clickSoundSource: require("@/assets/click-sound.mp3"), // 추가된 클릭 사운드
    };
  },

  computed: {
    ...mapState([
      "testProduct",
      "testTag",
      "testOption",
      "testCategory",
      "testTagMenu",
      "ShopID",
      "orderType",
      "cart",
    ]),

    filteredTagsByProductId() {
      return () => {
        if (!this.selectedProduct) return { tags: [], options: [] };

        const productId = this.selectedProduct.id;
        const matchedTags = this.testTagMenu.filter(
          (tag) => tag.productId === productId
        );
        const matchedTagIds = matchedTags.map((tag) => tag.tagId);
        const filteredTags = this.testTag.filter((tag) =>
          matchedTagIds.includes(tag.id)
        );

        const matchedOptionIds = [];
        matchedTagIds.forEach((tag) => {
          const options = this.testOption.filter((option) => option.tag == tag);
          matchedOptionIds.push(...options.map((option) => option.id));
        });

        const filteredOptions = this.testOption.filter((option) =>
          matchedOptionIds.includes(option.id)
        );
        return { tags: filteredTags, options: filteredOptions };
      };
    },
  },

  components: {
    ProductItem,
    ProductOptionModal,
    CartModal,
  },

  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    if (this.cart.length != 0) {
      this.showCartModal = true;
    }
    this.playMenuAudio();
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  methods: {
    playMenuAudio() {
      this.resetAndPlay(this.$refs.orderMenu);
    },
    playAddOrderAudio() {
      this.resetAndPlay(this.$refs.addOrder);
    },
    playSubOrderAudio() {
      this.resetAndPlay(this.$refs.subOrder);
    },
    playOptionAudio() {
      this.resetAndPlay(this.$refs.option);
    },
    playClickSound() {
      this.resetAndPlay(this.$refs.clickSound);
    },
    stopAllAudio() {
      const audios = [
        this.$refs.orderMenu,
        this.$refs.addOrder,
        this.$refs.subOrder,
        this.$refs.option,
        this.$refs.clickSound,
      ];
      audios.forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    },
    resetAndPlay(audio) {
      this.stopAllAudio();
      if (audio) {
        audio.currentTime = 0; // 초기화
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
    },

    ...mapMutations([
      "addCart",
      "subCart",
      "setTotalPrice",
      "setProductName",
      "orderType",
    ]),

    handleScroll() {
      for (let i = 0; i < this.testCategory.length; i++) {
        const category = this.testCategory[i];
        const element = document.getElementById(
          "CategoryTitle" + category.name
        );
        if (window.scrollY >= element.offsetTop - 140) {
          this.tab = i;
        }
      }
    },

    openProductOptionModal(data) {
      this.stopAllAudio();
      this.playOptionAudio();
      this.selectedProduct = data;
      this.showOptionModal = true;
      this.showCartModal = false;
    },

    handleProductClick(data) {
      this.playClickSound();
      this.openProductOptionModal(data);
    },

    filteredProducts(categoryId) {
      return this.testProduct.filter(
        (product) => product.category == categoryId
      );
    },

    pickProduct($event) {
      this.stopAllAudio();
      this.playAddOrderAudio();
      this.showOptionModal = false;
      for (let i = 0; i < $event.num; i++) {
        this.addCart({
          product: {
            name: this.selectedProduct.name,
            price: $event.price,
          },
          options: $event.option,
        });
      }
      this.showCartModal = true;
    },

    closeProductOptionModal() {
      this.showOptionModal = false;
      if (this.cart.length != 0) {
        this.showCartModal = true;
      }
    },

    subProduct($event) {
      this.stopAllAudio();
      this.playSubOrderAudio();
      this.subCart($event);
      this.setTotalPrice(-$event.productPrice);
      if (this.cart.length == 0) {
        this.showCartModal = false;
      }
    },

    goToBack() {
      this.$store.commit("clearCart");
      this.$router.push("/order-type/common");
    },

    getCategoryNameById(id) {
      const category = this.categories.find((cat) => cat.id === id);
      return category ? category.name : null;
    },
  },
};
</script>

<style scoped>
h2,
h4 {
  color: #70320d;
  text-align: center;
}

v-toolbar-title {
  font-family: MapleStory;
}
</style>