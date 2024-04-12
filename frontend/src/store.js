import { createStore } from 'vuex'
import testdata from './assets/testdata'

const store = createStore({
    state() {
        return {
            file: null,
            numSpeakers: 0,
            messages: [],
            socket: null,
            jwt: null,
            productName: '',
            testdata: testdata,
            ShopID: -1,
            orderType: -1, // init -1, if == 0 is 포장, if == 1 is 매장
            cart: [],
            totalPrice: 0,
        }
    },

    mutations: {
        setFile(state, file) {
            state.file = file
        },
        setNumSpeakers(state, value) {
            state.numSpeakers = value
        },
        setSocket(state, socket) {
            state.socket = socket;
        },
        addMessage(state, msg) {
            state.messages.push(msg);
        },
        setJwt(state, token) {
            state.jwt = token;
            sessionStorage.setItem('jwt', token); // Vuex 밖에서는 sessionStorage에 저장
        },
        setProductName(state, name) {
            state.productName = name
        },
        setTotalPrice(state, price) {
            state.totalPrice += price
        },
        setShopID(state, ID){
            state.ShopID = ID
        },
        setOrderType(state, type){
            state.orderType = type
        },
        addCart(state, product){
            state.cart.push(product)
        },
        subCart(state, product){
            const index = state.cart.indexOf(product)
            if (index != -1) {
                state.cart.splice(index, 1)
            }
        },
    },

    actions: {
        async initSocket() {
            // const socket = new WebSocket()

            // // socket.on('jwt', function (token) {
            // //     context.commit('setJwt', token);
            // // });

            // context.commit('setSocket', socket);
            
            // socket.onopen = (event) => {
            //     console.log(event);
            //     console.log('WS connection is stable! ~uWu~')
            // }

            // socket.onmessage = (message) => {
            //     console.log('Got a message from the WS: ', message)
            //     context.commit('addMessage', message);
            //     window.scrollTo(0, document.body.scrollHeight);
            // }

            // socket.onclose = (event) => {
            //     console.log(event);
            //     console.log('No way, connection has been closed')
            // }

            // socket.onerror = (error) => {
            //     console.error('Error: ', error)
            // }

            // console.log('Socket: ', socket);
            // context.commit('setSocket', socket)
        }
    }
})

export default store