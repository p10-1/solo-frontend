<template>
  <div class="main-slide-box">
    <h2 class="main-title">내 자산 현황</h2>
    <div class="main-slide-contents margin-top-1rem">
      <swiper
        :pagination="{ clickable: true }"
        :modules="modules"
        :loop="true"
        :slides-per-view="1"
        :space-between="20"
        autoplay
        class="mySwiper"
      >
        <swiper-slide>
          <router-link to="asset">
            <div class="main-card">
              <div class="card-body">
                <h5 class="card-title text-align-left link">내 자산 분포</h5>
                <div class="card-content">
                  <ChartComponent
                    type="doughnut"
                    :data="myAssetChartData"
                    :options="chartOptions"
                  />
                </div>
              </div>
              <div class="card-bottom">
                <button class="button-main">
                  <i class="fa-solid fa-magnifying-glass"></i> 자세히 보기
                </button>
              </div>
            </div>
          </router-link>
        </swiper-slide>
        <swiper-slide>
          <router-link to="asset">
            <div class="main-card">
              <div class="card-body">
                <h5 class="card-title text-align-left">{{ userType }} 평균 자산 분포</h5>
                <div class="card-content">
                  <ChartComponent
                    type="doughnut"
                    :data="typeAssetChartData"
                    :options="chartOptions"
                  />
                </div>
              </div>
              <div class="card-bottom">
                <button class="button-main">
                  <i class="fa-solid fa-magnifying-glass"></i> 자세히 보기
                </button>
              </div>
            </div>
          </router-link>
        </swiper-slide>
        <swiper-slide>
          <router-link to="asset">
            <div class="main-card">
              <div class="card-body">
                <h5 class="card-title text-align-left">전체 평균 자산 분포</h5>
                <div class="card-content">
                  <ChartComponent
                    type="doughnut"
                    :data="overallAssetChartData"
                    :options="chartOptions"
                  />
                </div>
              </div>
              <div class="card-bottom">
                <button class="button-main">
                  <i class="fa-solid fa-magnifying-glass"></i> 자세히 보기
                </button>
              </div>
            </div>
          </router-link>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper/modules'
import { ref, computed, onMounted } from 'vue'
import ChartComponent from '@/components/common/ChartComponent.vue'
import { fetchAssetData, fetchAssetComparison } from '@/api/assetApi'
import { useAuthStore } from '@/stores/authStore'
import 'swiper/css'
import 'swiper/css/pagination'

export default {
  components: {
    Swiper,
    SwiperSlide,
    ChartComponent
  },
  setup() {
    const authStore = useAuthStore()
    const assetData = ref(null)
    const comparisonData = ref(null)
    const userType = ref('')
    const modules = [Pagination, Autoplay]

    const assetNames = {
      cash: '현금자산',
      deposit: '예적금',
      stock: '증권',
      insurance: '보험'
    }
    const assetColors = {
      cash: '#FF6384',
      deposit: '#36A2EB',
      stock: '#FFCE56',
      insurance: '#4BC0C0'
    }

    const loadAssetData = async () => {
      try {
        const data = await fetchAssetData()
        if (data && data.length > 0) {
          assetData.value = processAssetData(data[0])
          userType.value = data[0].type || '전체'
        }
        const comparison = await fetchAssetComparison(userType.value)
        comparisonData.value = comparison
      } catch (error) {
        console.error('Failed to load asset data:', error)
      }
    }

    const processAssetData = (data) => {
      const assetTypes = ['cash', 'deposit', 'stock', 'insurance']
      const processed = {}
      assetTypes.forEach((type) => {
        const values = JSON.parse(data[type] || '[]')
        processed[type] = {
          total: values.reduce((sum, val) => sum + Number(val), 0),
          details: values.map((value) => ({ value: Number(value) }))
        }
      })
      return processed
    }

    const createChartData = (data) => ({
      labels: Object.keys(data).map((key) => assetNames[key]),
      datasets: [
        {
          data: Object.values(data).map((value) =>
            typeof value === 'object' ? value.total : value
          ),
          backgroundColor: Object.keys(data).map((key) => assetColors[key])
        }
      ]
    })

    const myAssetChartData = computed(() => createChartData(assetData.value || {}))
    const typeAssetChartData = computed(() =>
      createChartData(comparisonData.value?.typeAverage || {})
    )
    const overallAssetChartData = computed(() =>
      createChartData(comparisonData.value?.overallAverage || {})
    )

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1,
      radius: '60%',
      plugins: {
        legend: {
          display: false
        }
      },
      layout: {
        padding: 5
      }
    }

    onMounted(loadAssetData)

    return {
      modules,
      myAssetChartData,
      typeAssetChartData,
      overallAssetChartData,
      chartOptions,
      userType
    }
  }
}
</script>

<style scoped>
/* 기존 스타일 유지 */
.card-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}
</style>
