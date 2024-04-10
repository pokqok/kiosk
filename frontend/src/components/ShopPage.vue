<template>
    <div class="head-container row">
        <h2 class="title mb-4">실타래 {{ ShopID }}</h2>
        <nav id="navbar-menu" class="navbar row px-3 mb-3">
            <ul class="nav nav-pills">
                <!-- test 나중에 6 대신 카테고리 -->
                <li class="nav-item col custom-item" v-for="i in 6" :key="i">
                    <a class="custom-link" :href="'#CategoryTitle' + i">Category {{ i }}</a>
                </li>
            </ul>
        </nav>
    </div>

    <div style="margin-top: 140px;"></div>

    <div data-bs-spy="scroll" data-bs-target="#navbar-menu" data-bs-root-margin="0px 0px -40%"
        data-bs-smooth-scroll="true" class="scrollspy-example bg-body-tertiary p-3 rounded-2" tabindex="0">
        <!-- test, 나중에 6 대신 카테고리 -->
        <div class="category-container" v-for="i in 6" :key="i">
            <h4  style="scroll-margin: 140px;" :id="'CategoryTitle' + i">{{ i }} 번째 카테고리</h4>
            <div class="row">
                <!-- test, 나중에 testdata대신 카테고리에 있는 메뉴목록 -->
                <ProductItem :product="product" class="col-3" @selectProduct="openProductOptionModal($event)"
                    v-for="product in testdata" :key="product"></ProductItem>
            </div>
            <hr>
        </div>
    </div>


    <ProductOptionModal @closeProductOptionModal="closeProductOptionModal" @payment="payment" @pickProduct="pickProduct"
        :selectedProduct="selectedProduct" v-if="showOptionModal" />

    <CartModal @subProduct="subProduct" @payment="payment" v-if="showCartModal" />


</template>

<script>
import ProductItem from './Product.vue';
import ProductOptionModal from './ProductOptionModal.vue'
import CartModal from './CartModal.vue'
import { mapState, mapMutations } from 'vuex';
import { ScrollSpy } from 'bootstrap';


export default {
    name: 'ShopPage',
    data() {
        return {
            showOptionModal: false,
            showCartModal: false,
            selectedProduct: null,
        }
    },

    computed: {
        ...mapState(['testdata', 'ShopID', 'orderType', 'cart'])
    },

    components: {
        ProductItem,
        ProductOptionModal,
        CartModal,
    },

    mounted() {
        this.$nextTick(() => {
            // eslint-disable-next-line no-unused-vars
            const scrollSpy = new ScrollSpy(document.body, {
                target: '#navbar-menu',
            });
        });

        if (this.cart.length != 0) {
            this.showCartModal = true
        }

        // shopID 받아 올 수 있을 때 사용
        // if(this.ShopID == -1) {
        //     alert('login error')
        // } else if(this.orderType == -1) {
        //     alert('orderType error')
        // }
    },

    methods: {
        ...mapMutations(['addCart', 'subCart', 'setTotalPrice']),

        openProductOptionModal(data) {
            this.selectedProduct = data
            this.showOptionModal = true
            this.showCartModal = false
        },

        payment($event) {
            if ($event !== undefined) {
                for (let i = 0; i < $event; i++) {
                    this.addCart(this.selectedProduct)
                    this.setTotalPrice(this.selectedProduct.Price)
                }
            }
            this.showOptionModal = false
            this.showCartModal = false
            this.$router.push("/payment")
        },

        pickProduct($event) {
            this.showOptionModal = false
            for (let i = 0; i < $event; i++) {
                this.addCart(this.selectedProduct)
                this.setTotalPrice(this.selectedProduct.Price)
            }

            this.showCartModal = true
        },

        closeProductOptionModal() {
            this.showOptionModal = false
            if (this.cart.length != 0) {
                this.showCartModal = true
            }
        },

        subProduct($event) {
            this.subCart($event)
            this.setTotalPrice(-($event.Price))
            if (this.cart.length == 0) {
                this.showCartModal = false
            }
        }
    }
}
</script>

<style>
.head-container {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #229954;
    padding: 10px 0;
    z-index: 100;
}

.title {
    color: white;
    text-align: center;
    font-weight: bold;
    margin: 0;
}

.custom-link {
    color: black;
    text-decoration: none;
    text-align: center;
    background-color: #ffffff;
    border-radius: 5px;
    margin-top: 5%;
    padding: 5%;
    padding-left: 25%;
    padding-right: 25%;
}

.active {
    background-color: #c9c9c9;
}
</style>