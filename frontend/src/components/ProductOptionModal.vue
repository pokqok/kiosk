<template>
  <div class="black-bg">
    <div class="white-bg">
      <div class="option-container">
        <div class="row">
          <img :src="selectedProduct.image" class="col-4" alt="" />
          <button
            class="btn btn-outline-dark vol-btn col-2"
            type="button"
            style="margin-left: 10%"
            @click="numProduct++"
          >
            <i class="bi bi-arrow-up"></i>
          </button>
          <p class="col-2" style="margin-top: 5%">{{ numProduct }}</p>
          <button
            class="btn btn-outline-dark vol-btn col-2"
            type="button"
            @click="subNumProduct"
          >
            <i class="bi bi-arrow-down"></i>
          </button>
          <hr />
          <!-- {{ (parseInt(selectedProduct.price) + optionPrice) * numProduct }} -->
          <p>{{ totalPrice }}원</p>
          <hr />
        </div>

        <!-- 옵션 테스트 -->
        <!-- 체크박스 그룹 -->

        <!-- 
           <div
          class="container"
          v-for="tagOption in tag"
          :key="tagOption.id"
        >
          <div class="row" v-for="item in tag" :key="item.id">
            <div class="col">
              <h4>{{ tagOption.name }}</h4>
            </div>
          </div>
          <div class="row">
            <div
              class="btn-group btn-group-lg"
              role="group"
              aria-label="Basic checkbox toggle button group"
            >
              <div class="col" v-for="options in option" :key="options.id">
                <input
                  type="checkbox"
                  class="btn-check"
                  :id="'btncheck' + tagOption.id + '-' + options.id"
                  autocomplete="off"
                />
                <label
                  class="btn btn-outline-dark col-12"
                  :for="'btncheck' + tagOption.id  + '-' + options.id"
                  >{{ options.name }}</label
                >
                <hr />
              </div>
            </div>
          </div>
        </div>
        -->
       
        <!-- 라디오버튼 그룹 -->
        <div
          class="container"
          v-for="tags in tag"
          :key="tags.id"
        >
          <div class="row">
            <h4>{{ tags.name }}</h4>
          </div>
          <div class="row" >
            <div 
              class="btn-group btn-group-lg"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              <div class="col" v-for="options in getOptionByID(tags)" :key="options.id">
                <!-- v-if="options.tag == tags.id"-->
                  <input 
                    type="radio"
                    class="btn-check"
                    :name="'btnradio' + tags.id"
                    :id="'btnradio' + tags.id + '-' + options.id"
                    autocomplete="off"
                    @click="setOptionPrice(tags.id, options.price)"
                  />
                  <label
                    class="btn btn-outline-dark col-12"
                    :for="'btnradio' + tags.id+ '-' + options.id"
                    >{{ options.name }} </label
                  >
                  <hr />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="white-bg futter row">
    <button
      @click="$emit('pickProduct', {num: numProduct, price: (parseInt(this.selectedProduct.price) + optionPrice)})"
      type="button"
      class="btn col"
    >
      <i class="bi bi-cart icon"></i>
      <p>장바구니</p>
    </button>

    <!-- 결제페이지에도 수정 예정-->
    <button @click="$emit('payment', {num: numProduct, price: (parseInt(this.selectedProduct.price) + optionPrice)})" type="button" class="btn col">
      <i class="bi bi-coin icon"></i>
      <p>결제</p>
    </button>
    <button
      @click="$emit('closeProductOptionModal')"
      type="button"
      class="btn col"
    >
      <i class="bi bi-x-lg icon"></i>
      <p>취소</p>
    </button>
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

      //test Data
      /*
      optionTitle: ["안녕", "하세", "요", "이것", "은", "테스트", "최애"],
      checkBoxOptions: [
        [1, 2, 3],
        ["a", "b", "c", "d"],
        ["x", "y", "z"],
      ],
      radioOptions: [
        ["q", "w", "e", "r"],
        ["ㄱ", "ㄴ", "ㄷ"],
        ["Yes", "No"],
        ["족발", "피자", "보쌈", "치킨"],
      ],*/

    };
  },
  props: {
    selectedProduct: Object,
    tag: Object,
    option: Object,
  },
  computed:{
    optionPrice() {
      let totalPrice = 0;
      // optionPrices 객체의 각 값을 합산합니다.
      for (const tagId in this.optionPrices) {
        totalPrice += parseInt(this.optionPrices[tagId]);
      }
      return totalPrice;
    },
    totalPrice(){
      return (this.price + this.optionPrice)*this.numProduct;
    }
  },
  methods: {
    subNumProduct() {
      console.log("태그 테스트:",this.tag);
      console.log("옵션 테스트:", this.option)
      if (this.numProduct <= 1) {
        alert("1개 이하로 주문 하실 수 없습니다");
      } else {
        this.numProduct--;
      }
    },
    getOptionByID(tag){
      return this.option.filter(option => option.tag === tag.id);
    },
    setOptionPrice(tagId, price) {
      // 해당 태그에 대한 optionPrice를 업데이트합니다.
      this.optionPrices[tagId] = price;
      console.log("가격 근황",this.optionPrice)
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

.black-bg {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  padding: 20px;

  top: 0;
  display: flex;
  justify-content: center;
  z-index: 1000;
}

.white-bg {
  width: 50%;
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-height: 90%;
  overflow-y: auto;
  overflow-x: visible;
}

.futter {
  width: 100%;
  height: 15%;
  position: fixed;
  bottom: 0;
  z-index: 1001;
}

.icon {
  font-size: xx-large;
}

.option-container {
  margin: 5%;
}

.vol-btn {
  margin-bottom: 20%;
}
</style>
