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
          <!-- db 연결 시 -->
          <!-- <v-tab
            v-for="i in categories"
            :key="i"
            :href="'#CategoryTitle' + i.name"
          >
            Category {{ i.name }}
          </v-tab> -->

          <!-- testdata 사용 시 -->
          <v-tab
            v-for="i in testCategory"
            :key="i"
            :href="'#CategoryTitle' + i.name"
          >
            <h4>Category {{ i.name }}</h4>
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
  </div>

  <div style="margin-top: 140px"></div>
  <!-- db연결 시 -->
  <!-- <v-container v-for="i in categories" :key="i"> -->

  <!-- testdata 사용 시 -->
  <v-container v-for="i in testCategory" :key="i">
    <h4 style="scroll-margin: 140px" :id="'CategoryTitle' + i.name">
      #{{ i.name }}
    </h4>
    <v-row>
      <!-- test, 나중에 testdata대신 카테고리에 있는 메뉴목록 -->
      <v-col cols="4" v-for="item in filteredProducts(i.id)" :key="item.id">
        <ProductItem
          :product="item"
          @selectProduct="handleProductClick($event)"
        ></ProductItem>
      </v-col>
    </v-row>
    <v-divider class="my-5"></v-divider>
  </v-container>

  <!-- 이부분에 테스트 데이터는 아래 두개 filtered 메서드 부분에서 변경해줘야함 -->
  <ProductOptionModal
    @closeProductOptionModal="closeProductOptionModal"
    @payment="payment"
    @pickProduct="pickProduct"
    :selectedProduct="selectedProduct"
    v-if="showOptionModal"
    :tag="filteredTagsByProductId().tags"
    :option="filteredTagsByProductId().options"
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
    //...mapState(["testdata", "ShopID", "orderType", "cart"]),
    //테스트 데이터 추가 버전
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

    tags() {
      return this.$store.state.kioskModule.tags;
    },
    categories() {
      return this.$store.state.kioskModule.categories;
    },
    options() {
      return this.$store.state.kioskModule.options;
    },
    products() {
      return this.$store.state.kioskModule.products;
    },
    tagMenu() {
      return this.$store.state.kioskModule.tagMenu;
    },

    filteredTagsByProductId() {
      // db 사용 시
      // return () => {
      //   if (!this.selectedProduct) return { tags: [], options: [] }; // 선택된 상품이 없으면 빈 배열 반환

      //   const productId = this.selectedProduct.id; // 선택된 상품의 ID 가져오기
      //   const matchedTags = this.tagMenu.filter(tag => tag.productId === productId); // productId와 일치하는 tagMenu 찾기

      //   const matchedTagIds = matchedTags.map(tag => tag.tagId); // 일치하는 tag의 tagId 추출
      //   const filteredTags = this.tags.filter(tag => matchedTagIds.includes(tag.id)); // tagId와 일치하는 tag 필터링

      //   console.log('옵션들:',this.options);
      //   const matchedOptionIds = [];
      //     matchedTagIds.forEach(tag => {
      //       const options = this.options.filter(option => option.tag == tag);
      //       matchedOptionIds.push(...options.map(option => option.id));
      //     });
      //     // 옵션 ID를 사용하여 해당 옵션들을 필터링합니다.
      //     const filteredOptions = this.options.filter(option => matchedOptionIds.includes(option.id));
      //     console.log("선택 상품의 태그들 현황: ",filteredTags);
      //     console.log("선택 상품의 태그의 옵션들: ",filteredOptions);
      //     //return { tags: matchedTags, options: filteredOptions };
      //     return { tags: filteredTags, options: filteredOptions };

      //testdata 사용 시
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

        console.log("옵션들:", this.options);
        const matchedOptionIds = [];
        matchedTagIds.forEach((tag) => {
          const options = this.testOption.filter((option) => option.tag == tag);
          matchedOptionIds.push(...options.map((option) => option.id));
        });

        const filteredOptions = this.testOption.filter((option) =>
          matchedOptionIds.includes(option.id)
        );
        console.log("선택 상품의 태그들 현황: ", filteredTags);
        console.log("선택 상품의 태그의 옵션들: ", filteredOptions);
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

  // async created() {
  //   // 데이터를 비동기적으로 로드
  //   // this.$store.dispatch('fetchCategories');
  //   // this.$store.dispatch('fetchTags')
  //   // this.$store.dispatch('fetchOptions');
  //   // this.$store.dispatch('fetchProducts');
  //   // this.$store.dispatch('fetchTagMenu');
  // },

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
      //db연결 시
      // for (let i = 0; i < this.categories.length; i++) {
      //   const category = this.categories[i];
      //   const element = document.getElementById('CategoryTitle' + categories.name);
      //   if (window.scrollY >= element.offsetTop - 140) {
      //     this.tab = i;
      //   }
      // }

      // testdata 사용 시
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
      console.log("선택 상품: ", this.selectedProduct);
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
      console.log("개수: ", $event.num);
      console.log("가격:", $event.price);
      for (let i = 0; i < $event.num; i++) {
        console.log("옵션:", $event.option);
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
