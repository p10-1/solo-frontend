<template>
  <div class="product-page">
    <ProductKBList />
    <ProductList />
    <!-- <ProductLoan /> -->
  </div>
</template>

<script>
import ProductList from '@/components/ProductPage/ProductList.vue'
import ProductKBList from '@/components/ProductPage/ProductKBList.vue'
// import ProductLoan from '@/components/ProductPage/ProductLoan.vue'

export default {
  components: {
    ProductList,
    ProductKBList
    // ProductLoan
  }
}
</script>

<style scoped>
/* 스타일링 추가 */
</style>
