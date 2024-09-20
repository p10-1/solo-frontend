<template>
  <div class="user-points">
    <span class="label">적립 포인트</span>
    <span class="points">{{ points }}P</span>
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

<style scoped>
.user-points {
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #333;
}

.label {
  margin-right: 10px;
}

.points {
  color: #007bff; /* Bootstrap primary blue */
  font-weight: bold;
}
</style>
