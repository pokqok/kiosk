<template>
    <div class="black-bg">
        <div class="white-bg">
            <div class="option-container">
                <div class="row">
                    <img :src="selectedProduct.ProductImage" class="col-4" alt="">
                    <button class="btn btn-outline-dark vol-btn col-2" type="button" style="margin-left: 10%;"
                        @click="numProduct++"><i class="bi bi-arrow-up"></i></button>
                    <p class="col-2" style="margin-top: 5%;">{{ numProduct }}</p>
                    <button class="btn btn-outline-dark vol-btn col-2" type="button" @click="subNumProduct"><i
                            class="bi bi-arrow-down"></i></button>
                    <hr>
                    <p>{{ price * numProduct }}원</p>
                    <hr>
                </div>

                <!-- 옵션 테스트 -->
                <!-- 체크박스 그룹 -->
                <div class="container" v-for="(checkboxOption, i) in checkBoxOptions" :key="i">
                    <div class="row">
                        <div class="col">
                            <h4>{{ optionTitle[i] }}</h4>
                        </div>
                    </div>
                    <div class="row">
                        <div class="btn-group btn-group-lg" role="group"
                            aria-label="Basic checkbox toggle button group">
                            <div class="col" v-for="(option, j) in checkboxOption" :key="j">
                                <input type="checkbox" class="btn-check" :id="'btncheck' + i + '-' + j"
                                    autocomplete="off">
                                <label class="btn btn-outline-dark col-12" :for="'btncheck' + i + '-' + j">{{ option
                                    }}</label>
                                <hr>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 라디오버튼 그룹 -->
                <div class="container" v-for="(radioOption, i) in radioOptions" :key="i">
                    <div class="row">
                        <div class="col">
                            <h4>{{ optionTitle[i + checkBoxOptions.length] }}</h4>
                        </div>
                    </div>
                    <div class="row">
                        <div class="btn-group btn-group-lg" role="group"
                            aria-label="Basic radio toggle button group">
                            <div class="col" v-for="(option, j) in radioOption" :key="j">
                                <input type="radio" class="btn-check" :name="'btnradio' + i" :id="'btnradio' + i + '-' + j"
                                    autocomplete="off">
                                <label class="btn btn-outline-dark col-12" :for="'btnradio' + i + '-' + j">{{ option
                                    }}</label>
                                <hr>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="white-bg futter row">
        <button @click="$emit('pickProduct')" type="button" class="btn col">
            <i class="bi bi-cart icon"></i>
            <p>장바구니</p>
        </button>
        <button @click="$emit('payment')" type="button" class="btn col"><i class="bi bi-coin icon"></i>
            <p>결제</p>
        </button>
        <button @click="$emit('closeProductOptionModal')" type="button" class="btn col"><i class="bi bi-x-lg icon"></i>
            <p>취소</p>
        </button>
    </div>

</template>

<script>
export default {
    name: 'ProductOptionModal',
    data() {
        return {
            numProduct: 1,
            price: this.selectedProduct.Price,

            //test Data
            optionTitle: ['안녕', '하세', '요', '이것', '은', '테스트', '최애'],
            checkBoxOptions: [[1, 2, 3], ['a', 'b', 'c', 'd'], ['x', 'y', 'z']],
            radioOptions: [['q', 'w', 'e', 'r'], ['ㄱ', 'ㄴ', 'ㄷ'], ['Yes', 'No'], ['족발', '피자', '보쌈', '치킨']]
        }
    },
    props: {
        selectedProduct: Object
    },

    methods: {
        subNumProduct() {
            if (this.numProduct <= 1) {
                alert("1개 이하로 주문 하실 수 없습니다")
            } else {
                this.numProduct--
            }
        }
    }
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