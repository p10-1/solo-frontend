<template>
  <div class="kb-product-list">
    <div v-if="loading" class="loading margin-top-3rem">
      <i class="fa-solid fa-spinner margin-bottom-1rem"></i>
      <br />로딩 중...
    </div>
    <div v-else-if="error" class="error">
      <i class="fa-solid fa-xmark argin-bottom-1rem"></i>
      {{ error }}
    </div>
    <div class="product-cards">
      <ProductKBItem
        v-for="product in products"
        :key="product.productNo"
        :product="product"
        @mouseover="onMouseOver"
        @mouseleave="onMouseLeave"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { fetchKbProducts } from '@/api/productApi'
import ProductKBItem from './ProductKBItem.vue'

const props = defineProps({
  productType: {
    type: String,
    required: true
  }
})

const products = ref([])
const loading = ref(true)
const error = ref(null)
const hoveredCard = ref(null)

const loadProducts = async () => {
  try {
    products.value = await fetchKbProducts(props.productType)
  } catch (err) {
    error.value = '상품을 가져오는 데 실패했습니다. 다시 시도해주세요.'
  } finally {
    loading.value = false
  }
}

watch(
  () => props.productType,
  async (newValue) => {
    console.log('새로운 productType:', newValue)
    await loadProducts()
  }
)

const onMouseOver = (productNo) => {
  hoveredCard.value = productNo
}

const onMouseLeave = () => {
  hoveredCard.value = null
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.kb-product-list {
  margin-top: 1rem;
}

.kb-product-list .title {
  text-align: center;
  line-height: 2.5rem;
  margin: 2rem 1rem 1.5rem;
  padding: 0;
  border: none;
  word-break: keep-all;
}

.kb-product-list .product-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 17px;
  background: #f3f3ff;
  padding: 2rem 1.5rem;
  min-height: 3rem;
  border-radius: 28px;
}
</style>
