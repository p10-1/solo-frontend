<template>
  <div class="total-asset">
    <h2>KB님의 총 자산은 {{ totalAmount.toLocaleString() }}원입니다</h2>
  </div>
</template>

<script setup>
defineProps({
  totalAmount: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.total-asset {
  text-align: center;
  background-color: #fff9e6;
  padding: 20px;
  font-size: 1.5em;
  border-radius: 8px;
}
</style>
