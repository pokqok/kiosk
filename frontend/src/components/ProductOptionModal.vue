<template>
  <v-dialog v-model="temp" width="80%" persistent>
    <v-card>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="6">
            <div class="d-flex justify-center">
              <v-img
                :src="getImageUrl(selectedProduct.image)"
                aspect-ratio="1.7"
                contain
                style="margin-top: 10%"
              ></v-img>
            </div>
          </v-col>
          <v-col md="6">
            <v-row class="d-flex justify-center mt-5">
              <h2>{{ selectedProduct.name }}</h2>
            </v-row>
            <v-row class="d-flex justify-center mt-2">
              <p>{{ selectedProduct.detail }}</p>
            </v-row>
            <v-row>
              <v-col
                class="d-flex flex-column justify-center align-center"
                cols="4"
              >
                <v-btn icon @click="handleSubNumProductClick">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <p>제거</p>
              </v-col>
              <v-col class="d-flex justify-center mt-5" cols="4">
                <span>{{ numProduct }}</span>
              </v-col>
              <v-col
                class="d-flex flex-column justify-center align-center"
                cols="4"
              >
                <v-btn icon @click="handleAddNumProductClick">
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
                divided
                variant="outlined"
                rounded="xl"
              >
                <v-btn
                  v-for="options in getOptionByID(tags)"
                  :key="options.id"
                  class="ma-0"
                  @click="setOptionPrice(tags, options)"
                >
                  {{ options.name }} ({{ options.price }}원)
                </v-btn>
              </v-btn-toggle>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions class="justify-end mb-12 mr-5">
        <v-row>
          <v-col cols="6">
            <v-btn
              block
              height="175%"
              color="green darken-1"
              text
              @click="handlePickProductClick"
            >
              <v-icon size="x-large" left>mdi-cart</v-icon>
              <h2>장바구니</h2>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              block
              height="175%"
              color="grey"
              text
              @click="handleCloseButtonClick"
            >
              <v-icon size="x-large" left>mdi-close</v-icon>
              <h2>취소</h2>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, reactive, computed } from "vue";

export default {
  name: "ProductOptionModal",
  props: {
    selectedProduct: {
      type: Object,
      required: true,
    },
    tag: {
      type: Array,
      required: true,
    },
    option: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const numProduct = ref(1);
    const optionPrices = reactive({});
    const temp = ref(true);
    const selectedOption = reactive(Array(props.tag.length).fill(undefined));
    const totalOption = reactive({});
    const price = computed(() => parseInt(props.selectedProduct.price));
    const optionPrice = computed(() => {
      return Object.values(optionPrices).reduce(
        (sum, price) => sum + parseInt(price),
        0
      );
    });
    const totalPrice = computed(
      () => (price.value + optionPrice.value) * numProduct.value
    );

    const subNumProduct = () => {
      if (numProduct.value > 1) {
        numProduct.value--;
      } else {
        alert("1개 이하로 주문 하실 수 없습니다");
      }
    };
    
    const getOptionByID = (tag) => {
      return props.option.filter((option) => option.tag === tag.id);
    };

    const setOptionPrice = (tag, option) => {
      optionPrices[tag.id] = option.price;
      totalOption[tag.id] = {
        tagName: tag.name,
        optionId: option.id,
        optionName: option.name,
        optionPrice: option.price
      };
    };

    const getImageUrl = (imageFileName) => {
      if (!imageFileName) {
        return "https://picsum.photos/100?random=1";
      }
      return `/image/${imageFileName}`;
    };

    const handlePickProduct = () => {
      if (selectedOption.includes(undefined)) {
        alert("옵션을 전부 선택해 주세요");
      } else {
        emit("pickProduct", {
          num: numProduct.value,
          price: price.value + optionPrice.value,
          option: Object.values(totalOption),
          optionPrice: optionPrice.value
        });
      }
    };

    const playClickSound = () => {
      const clickSound = new Audio(require("@/assets/click-sound.mp3"));
      clickSound.play().catch((error) => {
        console.error("Error playing click sound:", error);
      });
    };

    const handlePickProductClick = () => {
      playClickSound();
      handlePickProduct();
    };

    const handleCloseButtonClick = () => {
      playClickSound();
      emit("closeProductOptionModal");
    };

    const handleSubNumProductClick = () => {
      playClickSound();
      subNumProduct();
    };

    const handleAddNumProductClick = () => {
      playClickSound();
      numProduct.value++;
    };

    return {
      numProduct,
      optionPrices,
      temp,
      selectedOption,
      price,
      optionPrice,
      totalPrice,
      subNumProduct,
      getOptionByID,
      setOptionPrice,
      getImageUrl,
      handlePickProduct,
      playClickSound,
      handlePickProductClick,
      handleCloseButtonClick,
      handleSubNumProductClick,
      handleAddNumProductClick,
    };
  },
};
</script>
