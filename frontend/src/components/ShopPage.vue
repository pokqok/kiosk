<template>
    <div class="head-container">
        <h2 class="title">실타래 {{ $route.params.id }}</h2>
        <nav id="navbar-menu" class="navbar navbar-custom">
            <ul class="nav">
                <li :class="{ 'active': isScrollspyActive(i) }" class="nav-item-custom" v-for="i in 6"
                    :key="i">
                    <a class="nav-link" :href="'#CategoryTitle' + i" @click="handleItemClick(i)">Category {{ i }}</a>
                </li>
            </ul>
        </nav>
    </div>

    <div class="scrollspy-container">
        <div data-bs-spy="scroll" data-bs-target="#navbar-menu" data-bs-root-margin="0px 0px -40%"
            data-bs-smooth-scroll="true" class="scrollspy-example bg-body-tertiary p-3 rounded-2" tabindex="0">
            <div v-for="i in 6" :key="i">
                <h4 :id="'CategoryTitle' + i">{{ i }} 번째 카테고리</h4>
                <p>...</p>
                <p>...</p>
                <p>...</p>
                <p>...</p>
                <p>...</p>
                <p>...</p>
                <p>...</p>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    name: 'ShopPage',
    data() {
        return {
            activeScrollspy: 1
        }
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
}

.title {
    color: white;
    text-align: center;
    font-weight: bold;
    margin: 0;
}

.nav-item-custom {
    background-color: white;
    color: black;
    border-radius: 10px;
    padding: 5px 20px;
    margin: 0 10px;
}

.active {
    background-color: #c9c9c9;
    color: black;
    border-radius: 10px;
    padding: 5px 20px;
    margin: 0 10px;
}

.scrollspy-container {
    margin-top: 120px;
    /* head-container의 높이 만큼 아래로 내림 */
}
</style>