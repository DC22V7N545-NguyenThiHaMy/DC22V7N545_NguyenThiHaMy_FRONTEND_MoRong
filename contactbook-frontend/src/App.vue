<script>
import AppHeader from "./components/AppHeader.vue";

export default {
  components: {
    AppHeader,
  },
}
</script>

<template>
  <div id="app">
    <AppHeader />
    
    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
/* Scoped: chỉ áp dụng cho App.vue, không gây đè lên component con */
.page {
  max-width: 400px;
  margin: auto;
}
</style>
