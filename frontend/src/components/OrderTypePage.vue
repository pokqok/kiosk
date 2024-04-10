<template>
    <div>
        <p>world</p>
        <p>my</p>
        <button @click="goToShop">nex</button>
    </div>
</template>

<script>
    export default {
        name: 'OrderTypePage',

        methods: {
            goToShop(){
                this.$router.push('/shop/'+ this.$store.state.ShopID)
            }
        }
    }
</script>

<style>

</style>