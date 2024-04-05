<template>
    <div class="product" @click="$emit('selectProduct', product)">
        <img class="product-img" :src=product.ProductImage alt="">
        <p>{{ product.ProductName }}</p>
        <p>{{ product.Price }} 원</p>
    </div>
</template>

<script>
export default {
    name: 'ProductItem',
    data() {
        return {
            // test Data
            product: {
                ProductNO: 1,
                ProductName: '아메리카노',
                Price: 4500,
                CategoryNO: 1,
                ProductDetail: 'HP 포션',
                ProductImage: require("../assets/logo.png")
            }
        }
    }

    // db에서 받아오면 사용
    // props: {
    //     product: Object
    // }
}
</script>

<style>
.product {
    width: 150px;
    height: 150px;
    background-color: white;
    border-color: black;
    margin: 4%;
}

.product-img{
    width: 60px;
    height: 60px;
}
</style>