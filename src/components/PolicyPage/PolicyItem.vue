<template>
  <li>
    <h2>{{ policy.polyBizSjnm }}</h2>
    <p>{{ policy.polyItcnCn }}</p>
    <div>
      <template v-if="policy.rqutUrla && policy.rqutUrla !== '-' && policy.rqutUrla !== 'null'">
        <a :href="policy.rqutUrla" target="_blank">{{ policy.rqutUrla }}</a>
      </template>
      <template v-else>
        <span>링크 없음</span>
      </template>
    </div>
    <button @click="toggleSporCn">{{ showSporCn ? '상세 숨기기' : '상세 보기' }}</button>
    <div v-if="showSporCn">
      <p>상세 정보: {{ policy.sporCn }}</p>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    policy: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showSporCn: false // 초기값은 false로 설정
    }
  },
  methods: {
    toggleSporCn() {
      this.showSporCn = !this.showSporCn // 클릭 시 상태 토글
    }
  }
}
</script>

<style scoped>
/* 아이템 스타일링 추가 */
</style>
