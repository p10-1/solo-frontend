<template>
  <div class="asset-page">
    <h1>자산 정보</h1>
    <AssetList />
  </div>
</template>

<script setup>
import AssetList from '@/components/AssetPage/AssetList.vue'
</script>

<style scoped>
.asset-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}
</style>
