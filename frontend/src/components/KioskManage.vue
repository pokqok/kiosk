<template>
  <v-subheader class="subheader"
    >키오스크 설정
    <v-btn color="primary" @click="setClear">초기화</v-btn>
  </v-subheader>
  <v-divider></v-divider>
  <div>여기에 다양한 옵션을 넣을 수 있게 설정</div>
</template>

<script>
export default {
  data() {
    return {
      //필요한 데이터 넣을 예정
    };
  },
  methods: {
    setClear() {
      //초기화버튼
    },
    //버튼 기능 추가 바람
  },
};
</script>

<style scoped>
.subheader {
  font-size: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /*버튼의 스타일도 여기에 넣어서 따로 분리할 예정 */
}
</style>
