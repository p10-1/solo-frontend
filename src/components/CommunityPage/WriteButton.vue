<template>
  <button @click="$emit('write-click')" class="btn btn-primary">글 작성</button>
</template>

<script setup>
defineEmits(['write-click'])
</script>
