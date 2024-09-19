<template>
  <div class="recommendation">
    <div class="recommend-product">
      <h4>추천 상품</h4>
      <p>자산 비율에서 높은 카테고리의 맞는 상품 추천</p>
    </div>
    <div class="recommend-policy">
      <h4>추천 정책</h4>
      <p>필터링한 정책 추천</p>
    </div>
  </div>
</template>

<style scoped>
.recommendation {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}
.recommend-product,
.recommend-policy {
  width: 48%;
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
}
</style>
