<template>
  <div class="infinite-scroll">
    <h1>예적금 상품 목록</h1>
    <div class="search-bar">
      <!-- SearchBar 컴포넌트 사용 -->
      <SearchBar v-model="keyword" @search="searchProducts" />
    </div>
    <ul>
      <ProductItem
        v-for="product in list"
        :key="`${product.finPrdtNm}-${product.spclCnd}`"
        :product="product"
      />
    </ul>

    <!-- 로딩 상태 표시 -->
    <div v-if="loading" class="loading">로딩 중...</div>
    <div v-if="noMoreData" class="no-more">더 이상 데이터가 없습니다.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchProducts } from '@/api/productApi'
import ProductItem from './ProductItem.vue'
import SearchBar from '@/components/common/SearchBar.vue'

const list = ref([])
const pageNum = ref(1)
const totalPage = ref(0)
const keyword = ref('')
const loading = ref(false)
const noMoreData = ref(false)

const route = useRoute()
const router = useRouter()

const loadProducts = async () => {
  if (loading.value || noMoreData.value) return
  loading.value = true

  setTimeout(async () => {
    try {
      const data = await fetchProducts(pageNum.value, keyword.value)
      if (data.list.length > 0) {
        list.value = [...list.value, ...data.list]
        totalPage.value = data.totalPage
        pageNum.value++
      } else {
        noMoreData.value = true
      }
    } catch (error) {
      console.error('데이터를 불러오는 중 오류 발생', error)
    } finally {
      loading.value = false
    }
  }, 500)
}

const searchProducts = async (searchTerm) => {
  keyword.value = searchTerm
  pageNum.value = 1
  list.value = []
  noMoreData.value = false
  router.push({
    path: '/product',
    query: { keyword: keyword.value, page: pageNum.value }
  })
  await loadProducts()
}

const handleScroll = () => {
  const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
  if (scrollBottom && !loading.value) {
    loadProducts()
  }
}

onMounted(() => {
  keyword.value = route.query.keyword || ''
  pageNum.value = parseInt(route.query.page) || 1

  loadProducts()

  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.loading {
  text-align: center;
  padding: 20px;
  color: gray;
}
.no-more {
  text-align: center;
  padding: 20px;
  color: gray;
}
</style>
