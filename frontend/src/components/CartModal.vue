<template>
    <div>
        <div class="futter cart-container row align-items-center shadow">
            <div class="col-6 gy-2 rounded align-items-center p-3" style="background-color: #ffffff;">
                <div class="row mb-1" v-for="item in cart" :key="item" style="align-items: center;">
                    <p class="col-10 m-0">{{ item.ProductName }} - {{ item.Price }}원</p>
                    <button type="button" class="btn btn-outline-danger col-2" @click="$emit('subProduct', item)"><i class="bi bi-x-lg"></i></button>
                </div>
            </div>
            <div class="col-1 price-fixed shadow">
                <p class="m-0">{{ totalPrice }}원</p>
            </div>
            <button @click="$emit('payment')" type="button" class="btn btn-outline-primary btn-fixed col-4 shadow"><i class="bi bi-coin icon"></i>
                <p>결제</p>
            </button>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'CartModal',

    computed: {
        ...mapState(['cart', 'totalPrice']),
    },
}
</script>

<style>
.cart-container {
    background-color: #f8f9fa;
    height: 25%;
    overflow-y: auto;
}

.btn-fixed {
    position: fixed;
    right: 2vw;
}

.price-fixed {
    position: fixed;
    right: 40vw;
    padding: 10px;
    border-radius: 5px;
}

.shadow {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
