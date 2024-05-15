<template>
  <v-dialog
    v-model="temp"
    width="80%"
    height="80%"
    persistent
    style="overflow-y: scroll;"
    >
    <v-card>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="6">
            <div class="d-flex justify-center">
              <v-img
              :src="getImageSrc(selectedProduct)"
              aspect-ratio="1.7"
              contain
              style="margin-top: 10%;"></v-img>
            </div>
          </v-col>
          <v-col md="6">
            <v-row class="d-flex justify-center mt-5">
                <h2>{{ selectedProduct.name }}</h2>
            </v-row>
            <v-row>
              <v-col
              class="d-flex justify-center"
              style="display: flex; flex-direction: column; align-items: center;"
              cols="4">
                <v-btn icon @click="subNumProduct">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <p>제거</p>
              </v-col>
              <v-col class="d-flex justify-center mt-5" cols="4">
                <span>{{ numProduct }}</span>
              </v-col>
              <v-col
              class="d-flex justify-center"
              style="display: flex; flex-direction: column; align-items: center;"
              cols="4">
                <v-btn icon @click="numProduct++">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <p>추가</p>
              </v-col>
            </v-row>
            <v-divider class="my-4"></v-divider>
            <div class="text-center">
              <h3>{{ totalPrice }}원</h3>
            </div>
            <v-divider class="my-4"></v-divider>
            <div v-for="(tags, i) in tag" :key="tags.id" class="my-3">
              <div class="text-h6">{{ tags.name }}</div>
              <v-btn-toggle
              v-model="selectedOption[i]"
              color="primary"
              mandatory
              dense>
                <v-btn
                v-for="options in getOptionByID(tags)"
                :key="options.id"
                @click="setOptionPrice(tags.id, options.price)">
                  {{ options.name }}
                </v-btn>
              </v-btn-toggle>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions class="justify-end mb-12 mr-5">
        <v-row>
          <v-col cols="4">
            <v-btn
            block
            height="175%"
            color="green darken-1"
            text
            @click="$emit('pickProduct', {
                num: numProduct,
                price: parseInt(this.selectedProduct.price) + optionPrice,
                option: optionPrice,
              })">
              <v-icon left>mdi-cart</v-icon>
              <h3>장바구니</h3>
            </v-btn>
          </v-col>
          <v-col cols="4">
            <v-btn
            block
            height="175%"
            color="blue darken-1"
            text
            @click="$emit('payment', {
                num: numProduct,
                price: parseInt(this.selectedProduct.price) + optionPrice,
                option: optionPrice,
              })">
              <v-icon left>mdi-cash</v-icon>
              <h3>결제</h3>
            </v-btn>
          </v-col>
          <v-col cols="4">
            <v-btn
            block
            height="175%"
            color="grey"
            text
            @click="$emit('closeProductOptionModal')">
              <v-icon left>mdi-close</v-icon>
              <h3>취소</h3>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script>
export default {
  name: "ProductOptionModal",
  data() {
    return {
      numProduct: 1,
      price: parseInt(this.selectedProduct.price),
      optionPrices: {},
      temp: true,
      selectedOption: []
    };
  },
  props: {
    selectedProduct: Object,
    tag: Object,
    option: Object,
  },
  computed: {
    optionPrice() {
      let totalPrice = 0;
      // optionPrices 객체의 각 값을 합산합니다.
      for (const tagId in this.optionPrices) {
        totalPrice += parseInt(this.optionPrices[tagId]);
      }
      return totalPrice;
    },
    totalPrice() {
      return (this.price + this.optionPrice) * this.numProduct;
    },
  },
  methods: {
    subNumProduct() {
      console.log("태그 테스트:", this.tag);
      console.log("옵션 테스트:", this.option);
      if (this.numProduct <= 1) {
        alert("1개 이하로 주문 하실 수 없습니다");
      } else {
        this.numProduct--;
      }
    },
    getOptionByID(tag) {
      return this.option.filter((option) => option.tag === tag.id);
    },
    setOptionPrice(tagId, price) {
      // 해당 태그에 대한 optionPrice를 업데이트합니다.
      this.optionPrices[tagId] = price;
      console.log("가격 근황", this.optionPrice);
    },
    getImageSrc(selectedProduct) {
      // 이미지 경로가 비어있을 경우 빈 이미지를 반환하고,
      // 비어있지 않을 경우 제품 이미지 경로를 반환합니다.
      //return image ? image:"https://picsum.photos/100?random=1";
      console.log("가져온 데이터 테스트: ",selectedProduct)
      
      console.log("가져온 이름들 ",selectedProduct.id)
      return "https://picsum.photos/100?random=1";
    },
  },
};
</script>

<style>
body {
  margin: 0;
}

div {
  box-sizing: border-box;
}

.futter {
  background: white;
  border-radius: 8px;
  width: 100%;
  height: 15%;
  position: fixed;
  bottom: 0;
  z-index: 9999;
}

.icon {
  font-size: xx-large;
}
</style>
