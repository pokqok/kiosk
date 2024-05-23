import { createStore } from "vuex";
import testdata from "./assets/testdata";
import { product } from "./data/PageProduct.js";
import { tag } from "./data/PageTags.js";
import { option } from "./data/PageOptions.js";
import { category } from "./data/PageCategory.js";
import { tagMenu } from "./data/PageTagMenu.js";
import categoryModule from "./categoryModule";
import tagModule from "./tagModule";
import kioskModule from "./kioskModule";

const store = createStore({
  state() {
    return {
      file: null,
      numSpeakers: 0,
      messages: [],
      socket: null,
      jwt: null,
      productName: "",
      testdata: testdata,
      testProduct: product,
      testTag: tag,
      testOption: option,
      testCategory: category,
      testTagMenu: tagMenu,
      ShopID: -1,
      orderType: -1,
      cart: [],
      totalPrice: 0,
      orderCounter: 0,
      optionsList: {},
      orders: [] // New state for storing orders
    };
  },
  mutations: {
    setFile(state, file) {
      state.file = file;
    },
    setNumSpeakers(state, value) {
      state.numSpeakers = value;
    },
    setSocket(state, socket) {
      state.socket = socket;
    },
    addMessage(state, msg) {
      state.messages.push(msg);
    },
    setJwt(state, token) {
      state.jwt = token;
      sessionStorage.setItem("jwt", token);
    },
    setProductName(state, name) {
      state.productName = name;
    },
    setTotalPrice(state, price) {
      state.totalPrice += price;
    },
    setShopID(state, ID) {
      state.ShopID = ID;
    },
    setOrderType(state, type) {
      state.orderType = type;
    },
    addCart(state, { product, options }) {
      const productPrice = parseFloat(product.price) || 0;
      const optionsPrice = options ? options.reduce((acc, option) => acc + (parseFloat(option.price) || 0), 0) : 0;
      const productWithPrice = {
        ...product,
        productPrice: productPrice + optionsPrice,
        option: options,
      };
      const index = state.cart.length;
      state.cart.push(productWithPrice);
      state.optionsList[index] = options || [];
      state.totalPrice += productWithPrice.productPrice;
    },
    subCart(state, index) {
      if (index !== -1 && index < state.cart.length) {
        state.totalPrice -= state.cart[index].productPrice;
        state.cart.splice(index, 1);
        delete state.optionsList[index];
        const newOptionsList = {};
        state.cart.forEach((item, i) => {
          newOptionsList[i] = state.optionsList[i] || [];
        });
        state.optionsList = newOptionsList;
      }
    },
    incrementOrderCounter(state) {
      state.orderCounter++;
      state.productName = "주문번호 : " + state.orderCounter;
    },
    decrementOrderCounter(state) {
      state.orderCounter--;
    },
    clearCart(state) {
      state.cart = [];
      state.totalPrice = 0;
      state.optionsList = {};
    },
    updateOptions(state, { index, options }) {
      state.optionsList[index] = options;
    },
    ADD_ORDER(state, order) {
      state.orders.push(order);
    }
  },
  modules: {
    categoryModule: categoryModule,
    tagModule: tagModule,
    kioskModule: kioskModule,
  },
  actions: {
    saveOrder({ commit }, order) {
      commit('ADD_ORDER', order);
    }
  },
  getters: {
    orders: state => state.orders
  }
});

export default store;
