<template>
  <v-app>
    <v-main>
      <RouterView @comeBack="showButton = true"></RouterView>
      <RouterLink to="/login/admin"> <button v-if="showButton" @click="showButton = false">go admin Login</button>
      </RouterLink>
      <RouterLink to="/login/shop"> <button v-if="showButton" @click="showButton = false">go shop Login</button>
      </RouterLink>
      <RouterLink to="/audio-upload"> <button v-if="showButton" @click="showButton = false">Audio Upload</button>
      </RouterLink>
    </v-main>
  </v-app>


</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      showButton: true
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
