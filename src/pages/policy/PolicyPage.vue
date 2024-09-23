<template>
  <div class="policy-page">
    <!-- 추천 정책 Carousel -->
    <!-- <PolicyCarousel :policies="recommendedPolicies" /> -->
    <PolicyList />
  </div>
</template>

<script>
import PolicyList from '@/components/PolicyPage/PolicyList.vue'
// import PolicyCarousel from '@/components/PolicyPage/PolicyCarousel.vue'

export default {
  components: {
    PolicyList
    // PolicyCarousel
  }
}
</script>

<style scoped>
/* 스타일링 추가 */
</style>
