<template>
  <ProductFilter v-model:productType="productType" />
  <ProductKBList :product-type="productType" />
  <div class="infinite-scroll">
    <h2 class="title margin-top-3rem">
      <span class="text-accent"
        ><span class="text-accent">
          {{ productType == '대출' ? '전세자금대출' : productType }}
        </span>
      </span>
      목록
    </h2>
    <div class="search-bar">
      <!-- SearchBar 컴포넌트 사용 -->
      <SearchBar v-model="keyword" @search="searchProducts" />
    </div>
    <dl class="total margin-bottom-1rem">
      <dt>전체</dt>
      <dd>
        <b>{{ totalCnt }}</b
        >건
      </dd>
    </dl>
    <ul class="product-list">
      <template v-if="productType === '대출'">
        <LoanItem v-for="loan in list" :key="`${loan.finPrdtCd}-${loan.korCoNm}`" :loan="loan" />
      </template>
      <template v-else>
        <ProductItem
          v-for="product in list"
          :key="`${product.finPrdtNm}-${product.spclCnd}`"
          :product="product"
        />
      </template>
    </ul>

    <!-- 로딩 상태 표시 -->
    <div v-if="loading" class="loading margin-top-3rem">
      <i class="fa-solid fa-spinner margin-bottom-1rem"></i><br />로딩 중...
    </div>
    <div v-if="noMoreData" class="no-more">
      <i class="fa-solid fa-xmark argin-bottom-1rem"></i><br />상품이 더 이상 없습니다.
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { fetchProducts } from '@/api/productApi'
import ProductItem from './ProductItem.vue'
import LoanItem from './LoanItem.vue'
import ProductKBList from './ProductKBList.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import ProductFilter from './ProductFilter.vue'

const list = ref([])
const pageNum = ref(1)
const totalPage = ref(0)
const keyword = ref('')
const loading = ref(false)
const noMoreData = ref(false)
const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const productType = ref(productStore.productType)
const totalCnt = ref(0)

const loadProducts = async () => {
  if (loading.value || noMoreData.value) return
  loading.value = true

  setTimeout(async () => {
    try {
      console.log('fetch: ', productType.value)
      const data = await fetchProducts(pageNum.value, keyword.value, productType.value)
      console.log(data)
      totalCnt.value = data.totalCount || 0
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

watch(productType, async (newType) => {
  pageNum.value = 1
  list.value = []
  noMoreData.value = false
  productStore.setProductType(newType)
  await loadProducts() // Load products whenever productType changes
})

watch(keyword, async () => {
  pageNum.value = 1
  list.value = []
  noMoreData.value = false
  await loadProducts() // Load products whenever keyword changes
})

const handleScroll = () => {
  const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
  if (scrollBottom && !loading.value) {
    loadProducts()
  }
}

onMounted(() => {
  keyword.value = route.query.keyword || ''
  pageNum.value = parseInt(route.query.page) || 1
  // productType.value = route.query.productType || '에금'
  loadProducts()

  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 17px;
  padding: 2rem 1.5rem;
  min-height: 3rem;
  border-radius: 28px;
  background: linear-gradient(180deg, #e4deff 63.02%, #fff);
}
</style>
