import { createStore } from "vuex";
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
      productName: "",

      testProduct: null,
      testTag: null,
      testOption: null,
      testCategory: null,
      testTagMenu: null,

      ShopID: -1,
      orderType: -1,
      cart: [],
      totalPrice: 0,
      orderCounter: 0,
      optionsList: {},
      orders: [],
    };
  },

  mutations: {
    setTestProduct(state, products) {
      state.testProduct = products;
    },
    setTestTag(state, tags) {
      state.testTag = tags;
    },
    setTestOption(state, options) {
      state.testOption = options;
    },
    setTestCategory(state, categories) {
      state.testCategory = categories;
    },
    setTestTagMenu(state, tagMenu) {
      state.testTagMenu = tagMenu;
    },
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
        productName,
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
        state.totalPrice -= parseInt(state.cart[index].price);
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
      console.log("Order Counter: ", state.orderCounter);
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
    addCartToOrders(state, { paymentMethod }) {
      if (!Array.isArray(state.cart) || state.cart.length === 0) {
        console.error('Cart is empty or not an array:', state.cart);
        return;
      }
      if (!Array.isArray(state.orders)) {
        console.error('Orders state is not an array:', state.orders);
        state.orders = [];
      }
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
        minimized: false,
        paymentMethod: paymentMethod || 'card' // Add paymentMethod to newOrder
      };
      state.orders.unshift(newOrder); // 최신 주문이 앞으로 오도록
      state.orderCounter += 1; // Increment orderCounter after adding to orders
      localStorage.setItem('orders', JSON.stringify(state.orders)); // Save updated orders to localStorage
      localStorage.setItem('orderCounter', state.orderCounter); // Save updated orderCounter to localStorage
    },
    completeOrder(state, orderId) {
      //play audio from assets folder
      const audio = new Audio(require('@/assets/제조완료.mp3'));
      //stop all audio first
      audio.pause();
      //then play audio
      audio.play();
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
      localStorage.setItem('orders', JSON.stringify(state.orders)); // Save updated orders to localStorage
      localStorage.setItem('orderCounter', state.orderCounter); // Save updated orderCounter to localStorage
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
  plugins: [localStoragePlugin],
  actions: {
    async initSocket() {
      // Socket 초기화 코드
    },
    async fetchTestData({ commit }) {
      try {
        const productRes = require('./data/product.json');
        const tagRes = require('./data/tag.json');
        const optionRes = require('./data/option.json');
        const categoryRes = require('./data/category.json');
        const tagMenuRes = require('./data/tagMenu.json');

        commit('setTestProduct', productRes);
        commit('setTestTag', tagRes);
        commit('setTestOption', optionRes);
        commit('setTestCategory', categoryRes);
        commit('setTestTagMenu', tagMenuRes);
      } catch (error) {
        console.error('Failed to fetch test data:', error);
      }
    },
  },
});

export default store;
