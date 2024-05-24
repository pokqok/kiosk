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

const localStoragePlugin = store => {
  const savedOrders = localStorage.getItem('orders');
  if (savedOrders) {
    store.commit('setOrders', JSON.parse(savedOrders));
  }
  const savedOrderCounter = localStorage.getItem('orderCounter');
  if (savedOrderCounter) {
    store.commit('setOrderCounter', parseInt(savedOrderCounter));
  }

  store.subscribe((mutation, state) => {
    if (mutation.type !== 'resetOrders') {
      localStorage.setItem('orders', JSON.stringify(state.orders));
      localStorage.setItem('orderCounter', state.orderCounter);
    }
  });

  window.addEventListener('storage', event => {
    if (event.key === 'orders') {
      store.commit('setOrders', JSON.parse(event.newValue));
    }
    if (event.key === 'orderCounter') {
      store.commit('setOrderCounter', parseInt(event.newValue));
    }
  });
};

const store = createStore({
  state() {
    return {
      file: null,
      numSpeakers: 0,
      messages: [],
      socket: null,
      jwt: null,
      productName: "0",
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
      const productName = product.name || "알 수 없는 제품";
      const productPrice = parseFloat(product.price) || 0;
      const optionsPrice = options ? options.reduce((acc, option) => acc + (parseFloat(option.price) || 0), 0) : 0;
      const productWithPrice = {
        ...product,
        productName, // Ensure productName is set
        productPrice: productPrice + optionsPrice,
        option: options,
      };
      const index = state.cart.length;
      state.cart.push(productWithPrice);
      state.optionsList[index] = options || [];
      state.totalPrice += productWithPrice.productPrice;
      console.log(state.cart);
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
    addCartToOrders(state) {
      const newOrder = {
        id: state.orderCounter + 1,
        details: {
          products: state.cart.map((product, index) => ({
            productName: product.productName,
            option: state.optionsList[index],
            productPrice: product.productPrice,
          })),
          orderType: state.orderType,
          totalPrice: state.totalPrice
        },
        status: 'pending',
        minimized: false // Add minimized property with default value
      };
      state.orders.unshift(newOrder); // 최신 주문이 앞으로 오도록
      state.orderCounter += 1; // Increment orderCounter after adding to orders
      localStorage.setItem('orders', JSON.stringify(state.orders)); // Save updated orders to localStorage
      localStorage.setItem('orderCounter', state.orderCounter); // Save updated orderCounter to localStorage
    },
    completeOrder(state, orderId) {
      const order = state.orders.find(order => order.id === orderId);
      if (order) {
        order.status = 'completed';
      }
      localStorage.setItem('orders', JSON.stringify(state.orders)); // Save updated orders to localStorage
    },
    setOrders(state, orders) {
      state.orders = orders;
    },
    setOrderCounter(state, orderCounter) {
      state.orderCounter = orderCounter;
    },
    resetOrders(state) {
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toTimeString().split(' ')[0];
      const key = `orders_${date}_${time}`;
      localStorage.setItem(key, JSON.stringify(state.orders)); // Save orders to localStorage with date and time
      state.orders = [];
      state.orderCounter = 0;
      localStorage.removeItem('orders');
      localStorage.removeItem('orderCounter');
    },
    resetSingleOrder(state, orderId) {
      state.orders = state.orders.filter(order => order.id !== orderId);
      localStorage.setItem('orders', JSON.stringify(state.orders)); // Save updated orders to localStorage
    }
  },
  modules: {
    categoryModule: categoryModule,
    tagModule: tagModule,
    kioskModule: kioskModule,
  },
  plugins: [localStoragePlugin]
});

export default store;
