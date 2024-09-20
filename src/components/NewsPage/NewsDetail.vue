<template>
  <div class="news-detail">
    <div class="content">
      {{ news.content }}
    </div>
    <button @click="$emit('close')" class="btn btn-secondary mt-3">접기</button>
  </div>
</template>

<script setup>
defineProps({
  news: Object
})

defineEmits(['close'])
</script>

<style scoped>
.news-detail {
  background-color: #f9f9f9;
  padding: 15px;
  margin-top: 10px;
  border-radius: 5px;
}

.content {
  margin-bottom: 15px;
}
</style>
