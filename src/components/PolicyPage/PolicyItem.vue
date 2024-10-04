<template>
  <a :href="policy.rqutUrla" target="_blank" class="policy-link-wrapper">
    <div class="policy-card">
      <h2 class="policy-title">{{ policy.polyBizSjnm }}</h2>
      <p class="policy-description" @click.stop="openModal" @click.prevent="handleLinkClick">
        더 알아보기
      </p>
    </div>
  </a>
  <PolicyModal :isVisible="isModalVisible" :policy="policy" @close="isModalVisible = false" />
</template>

<script setup>
import { ref } from 'vue'
import PolicyModal from './PolicyModal.vue'

defineProps({
  policy: {
    type: Object,
    required: true
  }
})

const isModalVisible = ref(false)

function openModal() {
  isModalVisible.value = true
}
</script>

<style scoped>
.policy-link-wrapper {
  text-decoration: none; /* 링크에 밑줄 추가 */
}

.policy-card {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 상하 중앙 정렬 */
  position: relative; /* 자식 요소의 절대 위치를 허용 */
  background-color: #fffff9;
  width: 500px; /* 카드의 고정 너비 */
  height: 150px; /* 카드의 고정 높이 */
  color: black;
  border-radius: 12px;
  padding: 16px;
  margin: 16px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.policy-card:hover {
  background-color: #ffffed;
  transform: translateY(-5px);
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.35);
}

.policy-title {
  text-align: center;
  font-size: 1.2em; /* title 글자 크기 */
  font-weight: bold;
  margin: 0; /* 기본 마진 제거 */
}

.policy-description {
  position: absolute;
  bottom: 16px; /* 카드의 하단에 위치 */
  right: 16px; /* 카드의 우측에 위치 */
  font-size: 0.75em; /* 더 작은 글씨 크기 */
  color: #6c757d; /* 회색 글자 */
  text-decoration: underline;
  cursor: pointer; /* 마우스 커서를 포인터로 변경 */
}

@media (max-width: 768px) {
  .policy-card {
    width: 100%;
  }
}
</style>
