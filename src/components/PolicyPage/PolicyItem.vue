<template>
  <li>
    <h2>{{ policy.polyBizSjnm }}</h2>
    <p>{{ policy.polyItcnCn }}</p>
    <a :href="policy.rqutUrla" target="_blank">{{ policy.rqutUrla }}</a>
  </li>
</template>

<script>
export default {
  props: {
    policy: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
/* 아이템 스타일링 추가 */
</style>
