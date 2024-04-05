<template>
    <div class="black-bg">
        <div class="white-bg">
            <img :src="selectedProduct.ProductImage" alt="">
        </div>
        <div class="white-bg futter">
            <button @click="$emit('closeProductOptionModal')" type="button" class="btn-close" aria-label="Close"></button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProductOptionModal',
    props: {
        selectedProduct: Object
    },
}
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

    top: 0; /* 모달을 화면 상단에 고정 */
    display: flex; /* 모달을 수평 및 수직 가운데 정렬하기 위해 flex 사용 */
    justify-content: center; /* 가로 가운데 정렬 */
}

.white-bg {
    width: 50%;
    background: white;
    border-radius: 8px;
    padding: 20px;
}

.futter {
    width: 100%;
    height: 15%;
    position: fixed;
    bottom: 0;
}
</style>