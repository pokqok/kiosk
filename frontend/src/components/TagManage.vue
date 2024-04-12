<template>
    <v-subheader class = "subheader">옵션(태그) 관리
      <v-btn color="primary" @click="showAddCategory">옵션 추가</v-btn>
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
          <th class="text-left">옵션명</th>
          <th class="text-left">키오스크 적용 여부</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in Tags" :key="item.name">
          <td>
            <div>{{ item.name }}</div>
          </td>
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
        Tags: [
          { id: 1, name: '온도' },
          { id: 2, name: '휘핑크림' },
          { id: 3, name: '시럽' },
          { id: 4, name: '얼음 양? 이건 ice에만 적용시키려면 제한을 걸어야 할수도 있을듯' },
          { id: 5, name: '샷' },
          { id: 6, name: '토핑' },
          { id: 7, name: '포장여부?는 주문테이블에서 해야할 부분?' },
          { id: 8, name: '여기도 전용 스크롤을 추가할 예정 v-simple-table 사용해서' },
          // 필요한 만큼 태그를 추가를 해서 가져오도록 할 예정임.
        ],
  
        };
      },
      methods: {
        searchItems() {
          //검색기능 구현 예정
        },
        showAddCategory(){
            //추가 화면도... 구현 예정
        }
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

  </style>