<template>
  <v-dialog
      v-model="temp"
      height="90%"
      >
    <v-card
      width="80%"
      max-height="90%"
      style="overflow-y: auto; margin-left: 10%"
      >
      <v-container>
          <v-row>
            <v-col cols="4">
              <div class="product-img-container">
                <img class="product-img" :src="getImageSrc(selectedProduct)" alt="" />
              </div>
            </v-col>
            <v-row
              style="margin-left: 15%; margin-top: 35px;"
            >
              <v-col cols="3">
                <v-btn @click="subNumProduct">
                  <i class="bi bi-arrow-down"></i>
                </v-btn>
              </v-col>
              <v-col cols="2">
                <p>{{ numProduct }}</p>
              </v-col>
              <v-col cols="2">
                <v-btn @click="numProduct++">
                  <i class="bi bi-arrow-up"></i>
                </v-btn>
              </v-col>
            </v-row>
          </v-row>

          <v-divider
            :thickness="2"
            class="border-opacity-100"
            color="info"
            ></v-divider
          >
          <div style="text-align: center; font-size: 20px;">
            <h3>{{ totalPrice }}원</h3>
          </div>
          <v-divider
            :thickness="2"
            class="border-opacity-100"
            color="info"
            ></v-divider
          >

          <div
            class="d-flex flex-column align-center bg-grey-lighten-4 pa-6"
            v-for="tags, i in tag" :key="tags.id">
            <pre class="pt-2"><h4>{{ tags.name }}</h4></pre>
            <v-btn-toggle
              v-model="selectedOption[i]"
              color="primary"
              mandatory
            >
              <v-btn
                v-for="options in getOptionByID(tags)"
                :key="options.id"
                :id="'btnradio' + tags.id + '-' + options.id"
                @click="setOptionPrice(tags.id, options.price)"
                > {{ options.name }} </v-btn
              >
            </v-btn-toggle>
            <v-divider
              :thickness="2"
              class="border-opacity-100"
              color="info"
            ></v-divider> 
          </div>
        </v-container>
      </v-card>
  </v-dialog>

  <div class="futter">
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-btn
            size="x-large"
            height="70px"
            block
            @click="$emit('pickProduct', {
              num: numProduct,
              price: parseInt(this.selectedProduct.price) + optionPrice,
              option: optionPrice,
              })">
            <i class="bi bi-cart icon"></i>
            <p>장바구니</p>
          </v-btn>
        </v-col>
        <!-- 결제페이지에도 수정 예정-->
        <v-col cols="4">
          <v-btn
            size="x-large"
            height="70px"
            block
            @click="$emit('payment', {
              num: numProduct,
              price: parseInt(this.selectedProduct.price) + optionPrice,
              option: optionPrice,
              })">
            <i class="bi bi-coin icon"></i>
            <p>결제</p>
          </v-btn>
        </v-col>
        <v-col cols="4">
          <v-btn
            size="x-large"
            height="70px"
            block
            @click="$emit('closeProductOptionModal')">
            <i class="bi bi-x-lg icon"></i>
            <p>취소</p>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
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
