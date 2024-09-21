<template>
  <div class="asset-rank">
    <div class="rank-display">
      <h2>자산 순위</h2>
      <p>{{ rankPercentage }}%</p>
    </div>
    <router-link to="/assets" class="explanation-link">설명글</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rankPercentage: 60 // 예를 들어, 사용자의 자산 순위가 60%인 경우
    }
  }
}
</script>

<style scoped>
.asset-rank {
  text-align: center;
  background: #f1f1f1;
  padding: 20px;
  border-radius: 8px;
}

.rank-display h2 {
  margin: 0;
  color: #333;
}

.rank-display p {
  font-size: 36px;
  color: #555;
  margin: 10px 0;
}

.explanation-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.explanation-link:hover {
  background-color: #0056b3;
}
</style>
