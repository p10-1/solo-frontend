<template>
  <Teleport to="body">
    <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2 class="policy-title">{{ policy.polyBizSjnm }}</h2>
        <p class="policy-description">{{ policy.polyItcnCn }}</p>
        <p class="policy-details" v-html="formattedPolicyDetails"></p>
        <p class="policy-type">{{ policy.polyBizTy }}</p>
        <button @click="closeModal" class="close-button">닫기</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  policy: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const formattedPolicyDetails = computed(() => {
  // 일단 동그라미 네모만 포멧해놓음
  return props.policy.sporCn.replace('○', '<br>○').replace('□', '<br>□')
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  transition: opacity 0.3s ease;
}

.modal-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  max-width: 700px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: slide-down 0.3s ease;
}

.policy-title {
  margin-top: 0;
  color: #007bff;
  font-size: 28px;
  font-weight: bold;
}

.policy-description {
  color: #333;
  font-size: 18px;
  margin-bottom: 15px;
}

.policy-details {
  color: #666;
  font-size: 16px;
  margin-bottom: 15px;
  border-left: 4px solid gray;
  padding-left: 10px;
  background-color: #f8f9fa;
  white-space: pre-line;
}

.policy-type {
  color: gray;
  font-size: 16px;
  font-style: italic;
  margin-top: 10px;
  padding-top: 10px;
}

.close-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.close-button:hover {
  background-color: #0056b3;
}

/* 모달 슬라이드 애니메이션 */
@keyframes slide-down {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
