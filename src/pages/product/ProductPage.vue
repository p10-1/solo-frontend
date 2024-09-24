<template>
  <div class="product-page">
    <ProductKBList />
    <ProductList />
  </div>
</template>

<script>
import ProductList from '@/components/ProductPage/ProductList.vue'
import ProductKBList from '@/components/ProductPage/ProductKBList.vue'

export default {
  components: {
    ProductList,
    ProductKBList
  }
}
</script>

<style scoped>
/* 스타일링 추가 */
</style>
