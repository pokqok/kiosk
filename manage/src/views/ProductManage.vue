<template>
  <v-subheader class = "subheader">메뉴 관리
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
          {{n.name}}
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
        <td><div class="d-flex align-center">
        <img :src="item.image" alt="Product Image" class="mr-2" style="max-width: 50px; max-height: 50px;">
        <div>
          <div>{{ item.name }}</div>
          <div>{{ item.price }}</div>
        </div>
      </div></td>
        <td> <v-switch color="green"></v-switch> </td>
      </tr>
    </tbody>
  </v-table>

  </template>
  
  <script>
  import {product} from "@/data/PageProduct"
  import {CategoryData} from "@/data/PageCategory.js"
  export default {
    data() {
      return {
        search: '',
        selectedCategorys: [],
        //Categorys: CategoryData,
        Categorys: CategoryData,
        products: product,
      };
    },
    methods: {
      searchItems() {
        //검색기능 구현 예정
      },
      //버튼 기능 추가 바람
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