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
        <v-img :src="item.image" alt="Product Image" class="mr-2" style="max-width: 50px; max-height: 50px;"/>
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
  export default {
    data() {
      return {
        search: '',
        selectedCategorys: [],
      Categorys: [
        { id: 1, name: '태그 1' },
        { id: 2, name: '태그 2' },
        { id: 3, name: '태그 3' },
        { id: 4, name: '태그 4' },
        { id: 5, name: '태그 5' },
        { id: 6, name: '태그 6' },
        { id: 7, name: '태그 7' },
        { id: 8, name: '태그 8' },
        // 필요한 만큼 태그를 추가를 해서 가져오도록 할 예정임.
      ],

      products: [
          {
            pid: 'P001',
            cid: 'C001',
            image: 'americano.txt',
            name: '아메리카노',
            detail: '미국카노',
            price: 1500,

          },
          {
            pid: 'P002',
            cid: 'C001',
            image: 'lattee.txt',
            name: '라떼는 말이야',
            detail: '라떼',
            price: 3500,

          },
          {
            pid: 'P003',
            cid: 'C001',
            image: 'lattee.txt',
            name: '수정 후 적용 버튼 추가, 메뉴 추가창, 정렬기능, 검색 상세 기능 필요, DB연동은?, 카테고리 너비왜 안늘려져, 스크롤은 테이블만 적용하기, 누르면 수정창 뜨게',
            detail: '라떼',
            price: 3500,

          },
          {
            pid: 'P004',
            cid: 'C001',
            image: 'lattee.txt',
            name: '위에 카테고리 선택은 v-slide-group이고, 검색에 뜨는 익숙한 카테고리는 <chip>으로 구현하면 좋을 듯',
            detail: '라떼',
            price: 3500,

          },
          //수정 예정, "상품명" 열에 그림, 이름, 가격을 하나의 <div> 안에 구성해서 넣을 예정 클릭해서 상세 페이지 설정
        ]

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
.v-slide-group {
}

/* 더 추가해야 할 것
  드롭다운 박스에서 정렬 순서 지정하는 기능?
*/
</style>