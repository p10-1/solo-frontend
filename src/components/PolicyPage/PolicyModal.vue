<template>
  <Teleport to="body">
    <div v-if="isVisible" class="policy-modal modal-overlay" @click.self="closeModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-header">
          <h4>정책 <b class="text-accent">내용</b></h4>
          <button @click="closeModal" class="close"><span>&times;</span></button>
        </div>
        <div class="modal-content">
          <div class="modal-body">
            <div class="policy-type">{{ policy.polyBizTy }}</div>
            <h3 class="policy-title">{{ policy.polyBizSjnm }}</h3>
            <div class="policy-description">{{ policy.polyItcnCn }}</div>
            <div class="policy-details margin-top-1rem" v-html="formattedPolicyDetails"></div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, watch } from 'vue'

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

watch(
  () => props.isVisible,
  (newVal) => {
    if (newVal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)
</script>

<style scoped>
.policy-modal .modal-dialog {
  max-width: 50vw;
  max-height: 70vh;
  overflow-y: auto;
}

.policy-modal .modal-content {
  padding: 1.7rem;
  animation: slide-down 0.3s ease;
  max-height: 100%;
  overflow-y: auto;
}

.policy-modal .policy-type {
  display: inline-block;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.5px;
  border: 1px solid #6846f5;
  color: #6846f5;
  padding: 3px 8px;
  line-height: 1;
  border-radius: 20px;
  margin-bottom: 8px;
}

.policy-modal .policy-title {
  margin-top: 0;
  color: #6846f5;
  font-size: 1.6rem;
  word-break: keep-all;
  font-weight: 600;
  letter-spacing: -1px;
}

.policy-modal .policy-description {
  font-size: 1.05rem;
  color: #333;
  word-break: keep-all;
  line-height: 26px;
  letter-spacing: -1px;
  font-weight: 400;
  margin: 10px 0;
}

.policy-modal .policy-details {
  color: #454545;
  font-size: 17px;
  margin-bottom: 15px;
  border-left: 4px solid #cfc6fd;
  padding: 10px;
  background-color: #f3f3ff;
  white-space: pre-line;
  line-height: 28px;
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
