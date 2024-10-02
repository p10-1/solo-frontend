<template>
  <div class="user-points margin-bottom-1rem">
    <span class="label">적립 포인트</span>
    <span class="text-accent">{{ points }}P</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      points: 100 // 예시 포인트, 실제 앱에서는 동적으로 데이터를 받아올 수 있습니다.
    }
  }
}
</script>

<style scoped></style>
