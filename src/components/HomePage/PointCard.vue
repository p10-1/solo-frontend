<template>
  <div class="user-points">
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

<style scoped>
.user-points {
  position: relative;
  padding: 20px 0;
}

.user-points span {
  display: inline-block;
  margin-top: -10px;
  font-size: 22px;
  color: #222;
  letter-spacing: -1px;
}

.user-points span.text-accent {
  position: absolute;
  top: 15px;
  right: 0;
  margin-top: -10px;
  font-size: 32px;
  color: #222;
  font-weight: bold;
  letter-spacing: -1px;
}

.user-points span.text-accent::before {
  content: '';
  position: absolute;
  bottom: -5px;
  width: 100%;
  height: 8px;
  background-color: rgba(255, 230, 0, 0.712);
}
</style>
