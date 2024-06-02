<template>
  <v-subheader class="subheader"
    >메뉴 관리
    <v-btn color="primary" @click="showAddProductModal">상품 추가</v-btn>
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
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in products" :key="item.name">
        <td>
          <div class="d-flex align-center">
            <img
              :src="item.image"
              alt="Product Image"
              class="mr-2"
              style="max-width: 50px; max-height: 50px"
            />
            <div>
              <div>{{ item.name }}</div>
              <div>{{ item.price }}</div>
            </div>
          </div>
        </td>
        <td><v-switch color="green"></v-switch></td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import { product } from "@/data/PageProduct";
import { category } from "@/data/PageCategory.js";
export default {
  data() {
    return {
      search: "",
      selectedCategorys: [],
      //Categorys: CategoryData,
      Categorys: category,
      products: product,
    };
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
      //console.log(`../../public/image/${imageFileName}`);
      
      return `/image/${imageFileName}`;
    },
    showNewMenuModal() {
      this.showNewMenuCard = true;
    },
    addNewMenu() {
      // 새로운 메뉴 추가 로직 구현
      this.showNewMenuCard = false;
    },
    showManageCard(productId) {
      this.selectedProductId = productId;
      this.showManageCardModal = true;
    }, 

    submitNewProduct() {
      const newProductId = this.products.length ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
      const newProduct = { ...this.newProduct, id: newProductId };
      this.sortTags();
      alert(JSON.stringify(newProduct, null, 2));
      this.$store.dispatch('addProduct', newProduct);
      this.showNewMenuCard = false;
      this.resetNewProductForm();
    },

    submitChangedProduct() {
      const productId = this.selectedProductId;
      //onst productIndex = this.products.findIndex(p => p.id == productId);
      //const selectedProduct = this.products[productIndex];
      const setProduct = { ...this.newProduct,  id: productId };
      this.sortTags();
      alert(JSON.stringify(setProduct, null, 2));
      this.$store.dispatch('changeProduct', setProduct);
      this.showManageCardModal = false;
      this.resetNewProductForm();
    },
    deleteProduct(){
      alert("삭제 상품 id:"+this.selectedProductId)
      this.$store.dispatch('deleteProduct', this.selectedProductId);
      this.showManageCardModal = false;
      this.selectedProductId = null;
    },
    resetNewProductForm() {
      this.selectedFile = null;
      this.newProduct = {
        id: null,
        name: '',
        alias: '',
        detail: '',
        price: 0,
        image: '',
        isOn: false,
        category: null,
        tags: [],
      };
    },
   
    updateImageName() {
    if (this.selectedFile) {
      console.log("선택 파일 이름은:",this.selectedFile)
      this.newProduct.image = this.selectedFile.name;
    } else {
      this.newProduct.image = null;
    }
    },
    sortTags() {
      console.log("변경 실시")
      this.newProduct.tags.sort((a, b) => a - b);
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
  /*버튼의 스타일도 여기에 넣어서 따로 분리할 예정 */
}
.left-aligned-container {
  /* 카테고리 선택 창 스타일*/
  max-width: none; /* 최대 너비 제한 해제 */
  width: 100%; /* 페이지 너비에 맞게 설정 */
  /*아니 이거 크기 어떻게 늘리는데 */
}
/*
.v-slide-group {
}*/

/* 더 추가해야 할 것
  드롭다운 박스에서 정렬 순서 지정하는 기능?
*/
</style>
