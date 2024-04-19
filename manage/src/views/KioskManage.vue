<template>
    <v-subheader class = "subheader">키오스크 설정
      <v-btn color="primary" @click="setClear">초기화</v-btn>
    </v-subheader>
    <v-divider></v-divider>
    <div>
        여기에 다양한 옵션을 넣을 수 있게 설정g
    </div>
    <v-app-bar color="pink">
        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <v-toolbar-title>앙 테스트</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon="mdi-magnify"></v-btn>
    </v-app-bar>

    <v-main>
      <div class="menu">
        <v-container class="md-5">
          <v-layout row wrap>
            <v-flex xs12 sm6 md4 lg3 v-for="item in products" :key="item.name">
                <v-card flat class="text-xs-center">
                  <v-responsive class="pt-4">
                    image
                  </v-responsive>
                  <v-card-text>
                    <div class="subheading">{{ item.name }}</div>
                    <div class="grey--text">{{ item.price }}</div>
                  </v-card-text>

                </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </v-main>
</template>
    
    <script>
    import {product} from "@/data/PageProduct"
    export default {
      data() {
        return {
        //필요한 데이터 넣을 예정
          products: product,
        };
      },
      methods: {
        setClear(){
            //초기화버튼
        },
        //버튼 기능 추가 바람
      }
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