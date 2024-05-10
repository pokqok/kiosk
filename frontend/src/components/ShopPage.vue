<template>
  <div class="head-container row">
    <h2 class="title mb-4">실타래 {{ ShopID }}</h2>
    <nav id="navbar-menu" class="navbar row px-3 mb-3">
      <ul class="nav nav-pills">
        <!-- test 나중에 6 대신 카테고리 -->
        <li class="nav-item col custom-item" v-for="i in categories" :key="i">
          <a class="custom-link" :href="'#CategoryTitle' + i.name"
            >Category {{ i.name }}</a
          >
        </li>
      </ul>
    </nav>
  </div>

  <div style="margin-top: 140px"></div>

  <div
    data-bs-spy="scroll"
    data-bs-target="#navbar-menu"
    data-bs-root-margin="0px 0px -40%"
    data-bs-smooth-scroll="true"
    class="scrollspy-example bg-body-tertiary p-3 rounded-2"
    tabindex="0"
  >
    <!-- test, 나중에 6 대신 카테고리 -->
    <div class="category-container" v-for="i in categories" :key="i">
      <h4 style="scroll-margin: 140px" :id="'CategoryTitle' + i.name">
        #{{ i.name }} 
      </h4>
      <div class="row">
        <!-- test, 나중에 testdata대신 카테고리에 있는 메뉴목록 -->
        <ProductItem
        v-for="item in filteredProducts(i.id)"
        :key="item.id"
        :product="item"
        class="col-3"
        @selectProduct="openProductOptionModal($event)"
        ></ProductItem>
      </div>
      <hr />
    </div>
  </div>

  <ProductOptionModal
    @closeProductOptionModal="closeProductOptionModal"
    @payment="payment"
    @pickProduct="pickProduct"
    :selectedProduct="selectedProduct"
    v-if="showOptionModal"
    :tag = "filteredTagsByProductId().tags"
    :option = "filteredTagsByProductId().options"
  />

  <CartModal @subProduct="subProduct" @payment="payment" v-if="showCartModal" />
</template>

<script>
import ProductItem from "./Product.vue";
import ProductOptionModal from "./ProductOptionModal.vue";
import CartModal from "./CartModal.vue";
import { mapState, mapMutations } from "vuex";
import { ScrollSpy } from "bootstrap";

export default {
  name: "ShopPage",
  data() {
    return {
      showOptionModal: false,
      showCartModal: false,
      selectedProduct: null,
    };
  },

  computed: {
    ...mapState(["testdata", "ShopID", "orderType", "cart"]),

    tags(){
      return this.$store.state.kioskModule.tags;
    },
    categories(){
      return this.$store.state.kioskModule.categories;
    },
    options(){
      return this.$store.state.kioskModule.options;
    },
    products(){
      return this.$store.state.kioskModule.products;
    },
    tagMenu(){
      return this.$store.state.kioskModule.tagMenu;
    },

    filteredTagsByProductId() {
      return () => {
        if (!this.selectedProduct) return { tags: [], options: [] }; // 선택된 상품이 없으면 빈 배열 반환

        const productId = this.selectedProduct.id; // 선택된 상품의 ID 가져오기
        const matchedTags = this.tagMenu.filter(tag => tag.productId === productId); // productId와 일치하는 tagMenu 찾기
        
    
        const matchedTagIds = matchedTags.map(tag => tag.tagId); // 일치하는 tag의 tagId 추출
        const filteredTags = this.tags.filter(tag => matchedTagIds.includes(tag.id)); // tagId와 일치하는 tag 필터링
      
        console.log('옵션들:',this.options);
        const matchedOptionIds = [];
          matchedTagIds.forEach(tag => {
            const options = this.options.filter(option => option.tag == tag);
            matchedOptionIds.push(...options.map(option => option.id));
          });
          // 옵션 ID를 사용하여 해당 옵션들을 필터링합니다.
          const filteredOptions = this.options.filter(option => matchedOptionIds.includes(option.id));
          console.log("선택 상품의 태그들 현황: ",filteredTags);
          console.log("선택 상품의 태그의 옵션들: ",filteredOptions);
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
    this.$nextTick(() => {
      // eslint-disable-next-line no-unused-vars
      const scrollSpy = new ScrollSpy(document.body, {
        target: "#navbar-menu",
      });
    });

    if (this.cart.length != 0) {
      this.showCartModal = true;
    }

    // shopID 받아 올 수 있을 때 사용
    // if(this.ShopID == -1) {
    //     alert('login error')
    // } else if(this.orderType == -1) {
    //     alert('orderType error')
    // }
  },
  async created() {
      // 데이터를 비동기적으로 로드
      this.$store.dispatch('fetchCategories');
      this.$store.dispatch('fetchTags')
      this.$store.dispatch('fetchOptions');
      this.$store.dispatch('fetchProducts');
      this.$store.dispatch('fetchTagMenu');

    },

  methods: {
    ...mapMutations(["addCart", "subCart", "setTotalPrice", "setProductName"]), //결제 시 이름 넣기 추가

    openProductOptionModal(data) {
      this.selectedProduct = data;
      console.log("선택 상품: ",this.selectedProduct);
      this.showOptionModal = true;
      this.showCartModal = false;
    },

    //카테고리별 품목 가져오기 
    filteredProducts(categoryId) {
      //console.log("가져온 카테고리 아이디: ",categoryId)
      //console.log("가져온 상품: ",this.products.filter(product => product.category == categoryId))
      return this.products.filter(product => product.category == categoryId);
    },
    /*
    //computed로 옮김
    filteredTagsByProductId(selectedProduct) {
      return () => {
        if (!selectedProduct) return []; // 선택된 상품이 없으면 빈 배열 반환

        const productId = selectedProduct.id; // 선택된 상품의 ID 가져오기
        const matchedTags = this.tagMenu.filter(tag => tag.productId == productId); // productId와 일치하는 tagMenu 찾기
        
        const matchedTagIds = matchedTags.map(tag => tag.tagId); // 일치하는 tag의 tagId 추출
        const filteredTags = this.tags.filter(tag => matchedTagIds.includes(tag.id)); // tagId와 일치하는 tag 필터링
        return filteredTags;
      };
    },*/

    payment($event) {
      console.log("개수: ",$event.num);
      console.log("가격:",$event.price);
      if ($event !== undefined) {
        for (let i = 0; i < $event.num; i++) {
          this.addCart({productName:this.selectedProduct.name, productPrice: $event.price, option:$event.option});
          this.setTotalPrice($event.price);
        }
        this.setProductName(this.selectedProduct.name) //이름 추가하기
      }else{
        this.setProductName('다중 메뉴')//이름 추가하기
        //나중에 이름 추가하는거 좀더 상세히(개수랑 종류까지 다 포함) == 서버에 데이터 넘겨주는걸 하기 위해서 필요
      }
      this.showOptionModal = false;
      this.showCartModal = false;
      this.$router.push("/payment");
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
        this.showOptionModal = false;
        console.log("개수: ",$event.num);
        console.log("가격:",$event.price);
        for (let i = 0; i < $event.num; i++) {
          this.addCart({productName:this.selectedProduct.name, productPrice: $event.price, option:$event.option});
          this.setTotalPrice($event.price);
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
      this.subCart($event);
      this.setTotalPrice(-$event.productPrice);
      if (this.cart.length == 0) {
        this.showCartModal = false;
      }
    },
  },
};
</script>

<style>
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

.custom-link {
  color: black;
  text-decoration: none;
  text-align: center;
  background-color: #ffffff;
  border-radius: 5px;
  margin-top: 5%;
  padding: 5%;
  padding-left: 25%;
  padding-right: 25%;
}

.active {
  background-color: #c9c9c9;
}
</style>
