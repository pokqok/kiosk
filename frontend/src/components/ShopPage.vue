<template>
    <div class="head-container row">
        <h2 class="title">실타래 {{ $route.params.id }}</h2>
        <nav id="navbar-menu" class="navbar">
            <ul class="nav row">
                <!-- test 나중에 6 대신 카테고리 -->
                <li :class="{ 'active': isScrollspyActive(i) }" class="nav-item-custom col" v-for="i in 6" :key="i">
                    <a class="nav-link nav-link-custom" :href="'#CategoryTitle' + i"
                        @click="handleItemClick(i)">Category {{ i }}</a>
                </li>
            </ul>
        </nav>
    </div>

    <div class="scrollspy-container">
        <div data-bs-spy="scroll" data-bs-target="#navbar-menu" data-bs-root-margin="0px 0px -40%"
            data-bs-smooth-scroll="true" class="scrollspy-example bg-body-tertiary p-3 rounded-2" tabindex="0">
            <!-- test, 나중에 6 대신 카테고리 -->
            <div class="category-container" v-for="i in 6" :key="i">
                <h4 :id="'CategoryTitle' + i">{{ i }} 번째 카테고리</h4>
                <div class="row">
                    <!-- test, 나중에 testdata대신 카테고리에 있는 메뉴목록 -->
                    <ProductItem :product="product" class="col-3" @selectProduct="openProductOptionModal($event)" v-for="product in testdata"
                        :key="product"></ProductItem>
                </div>
                <hr>
            </div>
        </div>
    </div>
    <ProductOptionModal @closeProductOptionModal="showOptionModal = false" @payment="payment" @pickProduct="pickProduct" :selectedProduct="selectedProduct"
        v-if="showOptionModal"/>
</template>

<script>
import ProductItem from './Product.vue';
import ProductOptionModal from './ProductOptionModal.vue'
import { mapState } from 'vuex';

export default {
    name: 'ShopPage',
    data() {
        return {
            activeScrollspy: 1,
            showOptionModal: false,
            selectedProduct: null,
        }
    },

    computed: {
        ...mapState(['testdata'])
    },

    components: {
        ProductItem,
        ProductOptionModal,
    },

    mounted() {
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        handleScroll() {
            const scrollspyItems = document.querySelectorAll('.scrollspy-example h4');
            const scrollspyOffsets = Array.from(scrollspyItems).map(item => item.offsetTop);
            const currentScrollPos = window.scrollY + window.innerHeight / 2;
            for (let i = 0; i < scrollspyOffsets.length; i++) {
                if (currentScrollPos >= scrollspyOffsets[i] && currentScrollPos < scrollspyOffsets[i + 1]) {
                    this.activeScrollspy = i + 1;
                    break;
                }
            }
        },
        isScrollspyActive(index) {
            return index === this.activeScrollspy;
        },

        handleItemClick(index) {
            this.activeScrollspy = index;
        },

        openProductOptionModal(data) {
            this.selectedProduct = data
            this.showOptionModal = true
        },

        // 미구현
        payment() {
            this.showOptionModal = false
            alert('미구현')
        },

        //미구현
        pickProduct() {
            this.showOptionModal = false
            alert('미구현')
        },
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

.nav-item-custom {
    background-color: white;
    border-radius: 10px;
    padding: 5px 20px;
    margin: 0 10px;
}

.active {
    background-color: #c9c9c9;
}

.nav-link-custom {
    color: black;
}

.scrollspy-container {
    position: relative;
    margin-top: 120px;
}

.category-container {
    display: flex;
    flex-direction: column;
    margin: 5%;
}
</style>