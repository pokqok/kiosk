import { createStore } from 'vuex'
import testdata from './assets/testdata'
import io from 'socket.io-client'

const store = createStore({
    state() {
        return {
            file: null,
            numSpeakers: 0,
            messages: [],
            socket: null,
            jwt: null,
            productName: '',
            productAmount: 0,
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
        setProductAmount(state, amount) {
            state.productAmount = amount
        }
    },

    actions: {
        async initSocket(context) {
            const socket = io();

            socket.on('jwt', function (token) {
                context.commit('setJwt', token);
            });

            socket.on('chat message', (msg) => {
                context.commit('addMessage', msg);
                window.scrollTo(0, document.body.scrollHeight);
            });

            context.commit('setSocket', socket);
        }
    }
})

export default store