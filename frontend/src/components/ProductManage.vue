<template>
  <v-container>
    <v-subheader class="subheader">
      메뉴 관리
    </v-subheader>
    <v-divider></v-divider>

    <v-text-field
      v-model="search"
      label="Search"
      solo-inverted
      hide-details
      @input="searchItems"
    ></v-text-field>

    <v-sheet class="left-aligned-container" max-width="600">
      <v-slide-group multiple show-arrows v-model="selectedCategorys">
        <v-slide-group-item
          v-for="n in Categorys"
          :key="n"
          v-slot="{ isSelected, toggle }"
        >
          <v-btn
            :color="isSelected ? 'primary' : undefined"
            class="ma-2"
            rounded
            @click="toggle"
          >
            {{ n.name }}
          </v-btn>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>

    <v-table>
      <thead>
        <tr>
          <th class="text-left">상품명</th>
          <th class="text-left">키오스크 표시 여부</th>
          <th class="text-left">이미지 업로드</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>
            <div class="d-flex align-center">
              <img
                v-if="item.image"
                :src="getImageUrl(item.image)"
                alt="Product Image"
                class="mr-2"
                style="max-width: 50px; max-height: 50px"
              />
              <div>
                <div>{{ item.name }}</div>
                <div>{{ parseInt(item.price) }}</div>
              </div>
            </div>
          </td>
          <td><v-switch color="green"></v-switch></td>
          <td>
            <v-btn color="primary" @click="showUploadModal(item.id)">업로드</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <file-upload-modal
      :dialog="showModal"
      :product-id="selectedProductId"
      @close="showModal = false"
      @upload-success="handleUploadSuccess"
    ></file-upload-modal>
  </v-container>
</template>

<script>

//import { product } from "@/data/PageProduct";
import { CategoryData } from "@/data/PageCategory.js";
import FileUploadModal from "@/components/FileUploadModal.vue";
import { mapState,} from "vuex";
export default {
  components: {
    FileUploadModal
  },
  data() {
    return {
      search: "",
      selectedCategorys: [],
      //Categorys: CategoryData,
      Categorys: CategoryData,
        //products: product,
        showModal: false,
      selectedProductId: null
    };
  },
  computed: {
    //...mapState(["testdata", "ShopID", "orderType", "cart"]),
    //테스트 데이터 추가 버전
    ...mapState(["testProduct","testTag","testOption","testCategory","testTagMenu", "ShopID", "orderType", "cart"]),
    products(){
      return this.$store.state.kioskModule.products;
    },
  },
  async created() {
      // 데이터를 비동기적으로 로드
      this.$store.dispatch('fetchProducts');
  },
  methods: {
    searchItems() {
      // 검색기능 구현 예정
    },
    showUploadModal(productId) {
      this.selectedProductId = productId;
      this.showModal = true;
    },
    handleUploadSuccess(updatedProduct) {
      const productIndex = this.products.findIndex(p => p.id === updatedProduct.id);
      if (productIndex !== -1) {
        this.$set(this.products, productIndex, updatedProduct);
      }
    },
    getImageUrl(imageFileName) {
      // public/image/ 디렉토리에서 이미지를 가져옵니다.
      console.log(`../../public/image/${imageFileName}`);
      
      return `/image/${imageFileName}`;
    },
  }
};
</script>

<!--제목줄 스타일-->
<style scoped>
.subheader {
  font-size: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left-aligned-container {
  max-width: none;
  width: 100%;
}
</style>
