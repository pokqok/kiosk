<template>
  <div>
    <audio ref="orderMenu" :src="orderMenuSource" type="audio/mp3"></audio>
    <!--<audio ref="addOrder" :src="addOrderSource" type="audio/mp3"></audio>-->
    <!--<audio ref="subOrder" :src="subOrderSource" type="audio/mp3"></audio>-->
    <audio ref="option" :src="optionAudioSource" type="audio/mp3"></audio>
    <audio ref="clickSound" :src="clickSoundSource" type="audio/mp3"></audio>
    <!-- <v-toolbar color="#229954" tabs style="position: fixed; z-index: 1000"> -->
    <v-toolbar class="head-container pb-0" tabs>
      <v-col cols="4">
        <!-- <v-btn @click="handleBackButtonClick" style="background-color: #009688"> -->
        <v-btn color="black" @click="goToBack" style="background-color: white">
          <v-icon left>mdi-arrow-left</v-icon>
          <p>뒤로가기</p>
        </v-btn>
      </v-col>
      <v-col cols="4">
        <!-- <v-toolbar-title class="text-center">
          <h2>실타래 {{ ShopID }}</h2>
        </v-toolbar-title> -->
        <h2>실타래 {{ ShopID }}</h2>
      </v-col>
      <template v-slot:extension>
        <v-tabs v-model="tab" grow>
          <!-- <v-tab
            v-for="i in categories"
            :key="i"
            :href="'#CategoryTitle' + i.name"
          > -->
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
      <!-- test, 나중에 testdata대신 카테고리에 있는 메뉴목록 -->
      <v-col cols="4" v-for="item in filteredProducts(i.id)" :key="item.id">
        <!-- <ProductItem
          :product="item"
          @selectProduct="handleSelectProduct($event)"
        ></ProductItem> -->

        <!-- dev에서는 이걸 쓴다.-->
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
      activeCategory: null, // 현재 활성화된 카테고리
      showOptionModal: false,
      showCartModal: false,
      selectedProduct: null,
      orderMenuSource: require("@/assets/원하시는메뉴를선택해주세요.mp3"),
      //addOrderSource: require("@/assets/장바구니추가.mp3"),
      //subOrderSource: require("@/assets/장바구니취소.mp3"),
      optionAudioSource: require("@/assets/옵션.mp3"),
      clickSoundSource: require("@/assets/click-sound.mp3"),
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
        if (!this.selectedProduct) return { tags: [], options: [] }; // 선택된 상품이 없으면 빈 배열 반환

        const productId = this.selectedProduct.id; // 선택된 상품의 ID 가져오기
        const matchedTags = this.testTagMenu.filter(
          (tag) => tag.productId === productId
        ); // productId와 일치하는 tagMenu 찾기

        const matchedTagIds = matchedTags.map((tag) => tag.tagId); // 일치하는 tag의 tagId 추출
        const filteredTags = this.testTag.filter((tag) =>
          matchedTagIds.includes(tag.id)
        ); // tagId와 일치하는 tag 필터링

        console.log("옵션들:", this.options);
        const matchedOptionIds = [];
        matchedTagIds.forEach((tag) => {
          const options = this.options.filter((option) => option.tag == tag);
          matchedOptionIds.push(...options.map((option) => option.id));
        });
        // 옵션 ID를 사용하여 해당 옵션들을 필터링합니다.
        const filteredOptions = this.options.filter((option) =>
          matchedOptionIds.includes(option.id)
        );
        console.log("선택 상품의 태그들 현황: ", filteredTags);
        console.log("선택 상품의 태그의 옵션들: ", filteredOptions);
        //return { tags: matchedTags, options: filteredOptions };
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

    // shopID 받아 올 수 있을 때 사용
    // if(this.ShopID == -1) {
    //     alert('login error')
    // } else if(this.orderType == -1) {
    //     alert('orderType error')
    // }

    this.playMenuAudio();
  },
  async created() {
    // 데이터를 비동기적으로 로드
    this.$store.dispatch("fetchTestData");

    this.$store.dispatch("fetchCategories");
    this.$store.dispatch("fetchTags");
    this.$store.dispatch("fetchOptions");
    this.$store.dispatch("fetchProducts");
    this.$store.dispatch("fetchTagMenu");
    this.restoreSelectedProduct();
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    // playMenuAudio() {
    //   this.$refs.orderMenu.play();
    // },
    // playAddOrderAudio() {
    //   this.$refs.addOrder.play();
    // },
    // playSubOrderAudio() {
    //   this.$refs.subOrder.play();
    // },
    // playOptionAudio() {
    //   this.$refs.option.play();
    // },
    playMenuAudio() {
      this.resetAndPlay(this.$refs.orderMenu);
    },
    /*playAddOrderAudio() {
      this.resetAndPlay(this.$refs.addOrder);
    },
    playSubOrderAudio() {
      this.resetAndPlay(this.$refs.subOrder);
    },*/
    playOptionAudio() {
      this.resetAndPlay(this.$refs.option);
    },
    playClickSound() {
      this.resetAndPlay(this.$refs.clickSound);
    },
    stopAllAudio() {
      // this.$refs.orderMenu.pause();
      // this.$refs.addOrder.pause();
      // this.$refs.subOrder.pause();
      // this.$refs.option.pause();
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

    //dev에선 사용 안함
    resetAudio(audio) {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    },

    ...mapMutations([
      "addCart",
      "subCart",
      "clearCart",
      "setTotalPrice",
      "setProductName",
      "orderType",
    ]), //결제 시 이름 넣기 추가

    handleScroll() {
      // db연결 시
      // for (let i = 0; i < this.categories.length; i++) {
      //   const category = this.categories[i];
      //   const element = document.getElementById('CategoryTitle' + category.name);
      //   if (window.scrollY >= element.offsetTop - 140) {
      //     this.tab = i;
      //   }
      // }

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

    //사용 안함
    handleSelectProduct(data) {
      this.playClickSound();
      this.openProductOptionModal(data);
    },

    //카테고리별 품목 가져오기
    filteredProducts(categoryId) {
      //db
      //  return this.products.filter(product => product.category == categoryId);
      //테스트용
      return this.testProduct.filter(
        (product) => product.category == categoryId
      );
    },

    payment($event) {
      console.log("개수: ", $event.num);
      console.log("가격:", $event.price);
      if ($event.num > 1) {
        this.setProductName("다중 메뉴"); //이름 추가하기
      } else {
        this.setProductName(this.selectedProduct.name); //이름 추가하기
      }
      this.showOptionModal = false;
      this.showCartModal = false;
      console.log("결제 들어가기전 payment확인(shop페이지):", $event.price);
      this.$router.push("/payment");
      //this.clearCart();
      //이후 코드
    },

    restoreSelectedProduct() {
      // 예를 들어, localStorage 또는 Vuex 상태에서 이전 상태를 복구하는 로직
      this.selectedProduct = this.$store.state.selectedProduct || {};
    },
    /*
      pickProduct($event) {
        this.showOptionModal = false;
        console.log("개수: ",$event.num);
        console.log("가격:",$event.price)
        for (let i = 0; i < $event.num; i++) {
          this.addCart($event.price);
          this.setTotalPrice($event.price);
        }
        this.showCartModal = true;
      },
    */

    pickProduct($event) {
      this.stopAllAudio();
      //this.playAddOrderAudio();
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
      console.log("장바구니 크기:", this.cart.length);
    },

    closeProductOptionModal() {
      this.showOptionModal = false;
      if (this.cart.length != 0) {
        this.showCartModal = true;
      }
    },

    subProduct($event) {
      this.stopAllAudio();
      //this.playSubOrderAudio();
      console.log("장바구니 크기:", this.cart.length);
      this.subCart($event);

      //this.setTotalPrice(-$event.productPrice);
      //이걸하면 두번 빼지는 문제 발생, htod에서는 이 주석 풀 것

      if (this.cart.length == 0) {
        this.showCartModal = false;
      }
    },

    handleBackButtonClick() {
      //htod에서는 삭제함, playClicksound 없음 대신 goToBack으로 위에 click 이벤트 대신함
      this.playClickSound();
      this.goToBack();
    },

    goToBack() {
      this.$store.commit("clearCart");
      this.$router.push("/order-type/common");
    },

    getCategoryNameById(id) {
      //DB
      //const category = this.categories.find(cat => cat.id === id);
      const category = this.testCategory.find((cat) => cat.id === id);
      return category ? category.name : null;
    },
  },
};
</script>

<!-- <style>
.head-container {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #229954;
  padding: 10px 0;
  z-index: 100;
}

.title {
  color: white;
  text-align: center;
  font-weight: bold;
  margin: 0;
}
</style> -->
