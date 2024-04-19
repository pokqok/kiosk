<template>
  <v-subheader class="subheader"
    >카테고리 관리
    <v-btn color="primary" @click="showAddCategory">카테고리 추가</v-btn>
  </v-subheader>
  <v-divider></v-divider>

  <v-text-field
    v-model="search"
    label="Search"
    solo-inverted
    hide-details
    @input="searchItems"
  ></v-text-field>

  <v-table>
    <thead>
      <tr>
        <th class="text-left">카테고리명</th>
        <th class="text-left">키오스크 적용 여부</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in Categorys" :key="item.name">
        <td>
          <div>{{ item.name }}</div>
        </td>
        <td><v-switch color="green"></v-switch></td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      Categorys: [
        { id: 1, name: "태그 1" },
        { id: 2, name: "태그 2" },
        { id: 3, name: "태그 3" },
        { id: 4, name: "태그 4" },
        { id: 5, name: "태그 5" },
        { id: 6, name: "태그 6" },
        { id: 7, name: "태그 7" },
        { id: 8, name: "태그 8" },
        // 필요한 만큼 태그를 추가를 해서 가져오도록 할 예정임.
      ],
    };
  },
  methods: {
    searchItems() {
      //검색기능 구현 예정
    },
    showAddCategory() {
      //추가 화면도... 구현 예정
    },
    //버튼 기능 추가 바람
  },
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
</style>
