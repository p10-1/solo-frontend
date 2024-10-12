<template>
  <div class="main-slide-box">
    <!-- 슬라이더 전체 컨테이너 -->
    <h2 class="main-title">내 자산 현황</h2>
    <!-- 자산 현황 타이틀 -->
    <div class="main-slide-contents margin-top-1rem">
      <swiper
        :pagination="{ clickable: true }"
        :modules="modules"
        :loop="true"
        :slides-per-view="1"
        :space-between="20"
        class="mySwiper"
      >
        <!-- 슬라이더 컴포넌트 설정 -->
        <swiper-slide>
          <!-- 첫 번째 슬라이드 - 내 자산 분포 -->
          <router-link to="asset">
            <div class="main-card">
              <div class="card-body">
                <h5 class="card-title text-align-left link">내 자산 분포</h5>
                <!-- 도넛 차트를 보여주는 섹션 -->
                <div class="card-content">
                  <ChartComponent
                    type="doughnut"
                    :data="myAssetChartData"
                    :options="chartOptions"
                  />
                  <div class="asset-legend">
                    <!-- 자산 분포 범례 -->
                    <ul
                      v-for="(value, key) in myAssetChartData.labels"
                      :key="key"
                      class="asset-type"
                    >
                      <li class="asset-name">
                        <!-- 자산 종류와 색상 표시 -->
                        <span
                          :style="{ backgroundColor: assetColors[key] }"
                          class="type-color"
                        ></span>
                        {{ value }}
                      </li>
                      <li class="asset-percentage">
                        <!-- 자산 비율 계산 및 표시 -->
                        {{
                          Math.round(calculatePercentage(myAssetChartData.datasets[0].data[key]))
                        }}%
                      </li>
                      <li class="asset-amount">
                        <!-- 자산 총액 표시 -->
                        {{ formatCurrency(Math.round(myAssetChartData.datasets[0].data[key])) }} 원
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card-bottom">
                <!-- 자세히 보기 버튼 -->
                <button class="button-main">
                  <i class="fa-solid fa-magnifying-glass"></i> 자세히 보기
                </button>
              </div>
            </div>
          </router-link>
        </swiper-slide>
        <swiper-slide>
          <!-- 두 번째 슬라이드 - 사용자 유형 평균 자산 분포 -->
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
                  <div class="asset-legend">
                    <!-- 자산 분포 범례 -->
                    <ul
                      v-for="(value, key) in typeAssetChartData.labels"
                      :key="key"
                      class="asset-type"
                    >
                      <li class="asset-name">
                        <!-- 자산 종류와 색상 표시 -->
                        <span
                          :style="{ backgroundColor: assetColors[key] }"
                          class="type-color"
                        ></span>
                        {{ value }}
                      </li>
                      <li class="asset-percentage">
                        <!-- 자산 비율 계산 및 표시 -->
                        {{
                          Math.round(calculatePercentage(typeAssetChartData.datasets[0].data[key]))
                        }}%
                      </li>
                      <li class="asset-amount">
                        <!-- 자산 총액 표시 -->
                        {{
                          formatCurrency(Math.round(typeAssetChartData.datasets[0].data[key]))
                        }}
                        원
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card-bottom">
                <!-- 자세히 보기 버튼 -->
                <button class="button-main">
                  <i class="fa-solid fa-magnifying-glass"></i> 자세히 보기
                </button>
              </div>
            </div>
          </router-link>
        </swiper-slide>
        <swiper-slide>
          <!-- 세 번째 슬라이드 - 전체 평균 자산 분포 -->
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
                  <div class="asset-legend">
                    <!-- 자산 분포 범례 -->
                    <ul
                      v-for="(value, key) in overallAssetChartData.labels"
                      :key="key"
                      class="asset-type"
                    >
                      <li class="asset-name">
                        <!-- 자산 종류와 색상 표시 -->
                        <span
                          :style="{ backgroundColor: assetColors[key] }"
                          class="type-color"
                        ></span>
                        {{ value }}
                      </li>
                      <li class="asset-percentage">
                        <!-- 자산 비율 계산 및 표시 -->
                        {{
                          Math.round(
                            calculatePercentage(overallAssetChartData.datasets[0].data[key])
                          )
                        }}%
                      </li>
                      <li class="asset-amount">
                        <!-- 자산 총액 표시 -->
                        {{ formatCurrency(Math.round(myAssetChartData.datasets[0].data[key])) }} 원
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card-bottom">
                <!-- 자세히 보기 버튼 -->
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
import 'swiper/css'
import 'swiper/css/pagination'

export default {
  components: {
    Swiper,
    SwiperSlide,
    ChartComponent
  },
  setup() {
    const assetData = ref(null)
    const comparisonData = ref(null)
    const userType = ref('')
    const modules = [Pagination, Autoplay]

    // 자산 종류와 이름 매핑
    const assetNames = {
      cash: '현금자산',
      deposit: '예적금',
      stock: '증권',
      insurance: '보험'
    }

    // 자산 종류와 색상 매핑
    const assetColors = {
      cash: '#FF6384',
      deposit: '#36A2EB',
      stock: '#FFCE56',
      insurance: '#4BC0C0'
    }

    // 자산 데이터를 로드하는 함수
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

    // 자산 데이터를 처리하는 함수
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

    // 차트 데이터를 생성하는 함수
    const createChartData = (data) => {
      return {
        labels: Object.keys(data).map((key) => assetNames[key]),
        datasets: [
          {
            data: Object.values(data).map((value) =>
              typeof value === 'object' ? value.total : value
            ),
            backgroundColor: Object.keys(data).map((key) => assetColors[key])
          }
        ]
      }
    }

    // 내 자산 차트 데이터 계산
    const myAssetChartData = computed(() => {
      const data = createChartData(assetData.value || {})
      return data
    })

    // 사용자 유형 평균 자산 차트 데이터 계산
    const typeAssetChartData = computed(() => {
      const data = createChartData(comparisonData.value?.typeAverage || {})
      return data
    })

    // 전체 평균 자산 차트 데이터 계산
    const overallAssetChartData = computed(() => {
      const data = createChartData(comparisonData.value?.overallAverage || {})
      return data
    })

    // 차트 옵션 설정
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

    // 자산 비율을 계산하는 함수
    const calculatePercentage = (value) => {
      const total = assetData.value
        ? Object.values(assetData.value).reduce((sum, asset) => sum + (asset.total || 0), 0)
        : 0
      if (total === 0 || isNaN(value)) return '0.00'
      return ((value / total) * 100).toFixed(2)
    }
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('ko-KR').format(value)
    }

    // 컴포넌트가 마운트될 때 자산 데이터 로드
    onMounted(() => {
      loadAssetData()
    })

    return {
      modules,
      myAssetChartData,
      typeAssetChartData,
      overallAssetChartData,
      chartOptions,
      userType,
      assetColors,
      calculatePercentage,
      formatCurrency // 새로 추가된 함수를 반환
    }
  }
}
</script>

<style scoped>
.card-content {
  /* 카드 내 콘텐츠 영역 설정 */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.asset-legend {
  /* 자산 범례 위치 및 레이아웃 설정 */
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}

.asset-type {
  /* 개별 자산 항목 스타일 */
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.asset-name {
  /* 자산 이름 스타일 */
  display: flex;
  align-items: center;
  font-weight: 500;
}

.type-color {
  /* 자산 색상 표시 스타일 */
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin-right: 8px;
}

.asset-percentage {
  /* 자산 비율 스타일 */
  font-weight: 500;
  margin-left: 10px;
  color: #333;
}

.asset-amount {
  /* 자산 금액 스타일 */
  font-weight: 700;
  margin-left: 10px;
}

.button-main {
  /* 버튼 스타일 설정 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 5px;
  background-color: #5b6dfc;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button-main:hover {
  /* 버튼 호버 스타일 */
  background-color: #4a5bdb;
}
</style>
