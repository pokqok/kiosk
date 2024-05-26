<template>
  <v-container>
    <v-subheader class="subheader">
      메뉴 관리
      <v-btn color="primary" @click="showNewMenuModal">메뉴 추가하기</v-btn>
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
          v-for="n in categories"
          :key="n"
          v-slot="{ isSelected, toggle }"
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
          <!--<th class="text-left">키오스크 표시 여부</th>-->
          <th class="text-left">이미지 업로드</th>
          <th class="text-left">관리</th>
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
          <!-- <td><v-switch color="green"></v-switch></td> -->
          <td>
            <v-btn color="primary" @click="showUploadModal(item.id)">업로드</v-btn>
          </td>
          <td>
            <v-btn icon @click="showManageCard(item.id)">
              <v-icon>mdi-cog</v-icon>
            </v-btn>
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

    <v-dialog v-model="showNewMenuCard" max-width="500">
      <v-card>
        <v-card-title>
          <span class="headline">새로운 메뉴 추가</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitNewProduct">
            <v-text-field
              v-model="newProduct.name"
              label="상품명"
              required
            ></v-text-field>
            <v-text-field
              v-model="newProduct.alias"
              label="별명"
            ></v-text-field>
            <v-textarea
              v-model="newProduct.detail"
              label="상세 설명"
            ></v-textarea>
            <v-text-field
              v-model="newProduct.price"
              label="가격"
              type="number"
            ></v-text-field>
            <!-- <v-file-input
              v-model="selectedFile"
              label="이미지 업로드"
              @change="updateImageName"
            ></v-file-input> -->
            
            <v-switch
              v-model="newProduct.isOn"
              color="green"
              label="키오스크 표시 여부"
            ></v-switch>
            <!-- <v-combobox
              v-model="newProduct.category"
              clearable
              chips
              label="카테고리 설정"
              :items="categories"
            >
            </v-combobox> -->
            <v-select
              v-model="newProduct.category"
              :items="categories"
              item-title="name"
              item-value="id"
              label="카테고리 선택"
            ></v-select>
            <v-select
              v-model="newProduct.tags"
              :items="tags"
              item-title="name"
              item-value="id"
              label="태그 선택"
              multiple
            ></v-select>
            <v-btn type="submit" color="primary">추가</v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <!-- <v-btn color="primary" @click="addNewMenu">추가</v-btn> -->
          <v-btn @click="showNewMenuCard = false">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showManageCardModal" max-width="500">
      <v-card>
        <v-card-title>상품 관리</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitChangedProduct">
            <v-text-field
              v-model="newProduct.name"
              label="상품명"
              required
            ></v-text-field>
            <v-text-field
              v-model="newProduct.alias"
              label="별명"
            ></v-text-field>
            <v-textarea
              v-model="newProduct.detail"
              label="상세 설명"
            ></v-textarea>
            <v-text-field
              v-model="newProduct.price"
              label="가격"
              type="number"
            ></v-text-field>
            <!-- <v-file-input
              v-model="selectedFile"
              label="이미지 업로드"
              @change="updateImageName"
            ></v-file-input> -->
            
            <v-switch
              v-model="newProduct.isOn"
              color="green"
              label="키오스크 표시 여부"
            ></v-switch>
            <!-- <v-combobox
              v-model="newProduct.category"
              clearable
              chips
              label="카테고리 설정"
              :items="categories"
            >
            </v-combobox> -->
            <v-select
              v-model="newProduct.category"
              :items="categories"
              item-title="name"
              item-value="id"
              label="카테고리 선택"
            ></v-select>
            <v-select
              v-model="newProduct.tags"
              :items="tags"
              item-title="name"
              item-value="id"
              label="태그 선택"
              multiple
            ></v-select>
            <v-btn type="submit" color="primary">수정하기</v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="showManageCardModal = false">닫기</v-btn>
          <v-btn @click="deleteProduct()">삭제하기</v-btn>  
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>

//import { product } from "@/data/PageProduct";
//import { CategoryData } from "@/data/PageCategory.js";
import FileUploadModal from "@/components/FileUploadModal.vue";
import { mapState,} from "vuex";

export default {
  data() {
    return {
      search: "",
      selectedCategorys: [],
      showModal: false,
      showNewMenuCard: false,
      showManageCardModal: false,
      selectedProductId: null,
      selectedFile: null,
      newProduct: {
        id: null,
        name: '',
        alias: '',
        detail: '',
        price: 0,
        image: '',
        isOn: false,
        category: null,
        tags: [],
      },
    };
  },
  computed: {
    //...mapState(["testdata", "ShopID", "orderType", "cart"]),
    //테스트 데이터 추가 버전
    ...mapState(["testProduct","testTag","testOption","testCategory","testTagMenu", "ShopID", "orderType", "cart"]),
    products(){
      return this.$store.state.kioskModule.products;
    },
    tags() {
      return this.$store.state.kioskModule.tags;
    },
    categories() {
      return this.$store.state.kioskModule.categories;
    },
  },
  async created() {
      // 데이터를 비동기적으로 로드
      this.$store.dispatch('fetchProducts');
      this.$store.dispatch('fetchCategories');
      this.$store.dispatch('fetchTags');
  },

  methods: {
    searchItems() {
      //검색기능 구현 예정
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
      alert("삭제 상품 id:",this.selectedProductId);
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
