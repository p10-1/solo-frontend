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

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    policy: {
      type: Object,
      required: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    }
  },
  computed: {
    formattedPolicyDetails() {
      return this.policy.sporCn
        .replace('○', '<br>○') // ○ 기호 앞에 줄바꿈 추가
        .replace('□', '<br>□') // ~ 기호 뒤에 줄바꿈 추가
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7); /* 어두운 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* 모달이 다른 요소 위에 나타나도록 */
  transition: opacity 0.3s ease;
}

.modal-content {
  background-color: #fff; /* 흰색 배경 */
  border-radius: 8px; /* 모서리 둥글게 */
  padding: 30px; /* 내부 여백 추가 */
  max-width: 700px; /* 최대 너비 */
  width: 90%; /* 반응형 너비 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 효과 */
  animation: slide-down 0.3s ease; /* 애니메이션 효과 */
}

/* 정책 제목 스타일 */
.policy-title {
  margin-top: 0; /* 제목 위 여백 제거 */
  color: #007bff; /* 파란색 텍스트 */
  font-size: 28px; /* 제목 크기 */
  font-weight: bold; /* 제목 두께 */
}

/* 정책 내용 스타일 */
.policy-description {
  color: #333; /* 어두운 텍스트 색상 */
  font-size: 18px; /* 본문 크기 */
  margin-bottom: 15px; /* 본문 아래 여백 */
}

/* 정책 상세 내용 스타일 */
.policy-details {
  color: #666; /* 본문 텍스트 색상 */
  font-size: 16px; /* 본문 크기 */
  margin-bottom: 15px; /* 본문 아래 여백 */
  border-left: 4px solid gray; /* 강조 표시를 위한 왼쪽 테두리 */
  padding-left: 10px; /* 테두리와의 여백 */
  background-color: #f8f9fa; /* 연한 배경색 */
  white-space: pre-line;
}

/* 정책 분류 스타일 */
.policy-type {
  color: gray; /* 빨간색 텍스트 */
  font-size: 16px; /* 본문 크기 */
  font-style: italic; /* 이탤릭체 */
  margin-top: 10px; /* 위 여백 */
  padding-top: 10px; /* 테두리와의 여백 */
}

/* 닫기 버튼 스타일 */
.close-button {
  background-color: #007bff; /* 버튼 배경 색상 */
  color: white; /* 버튼 텍스트 색상 */
  border: none; /* 기본 테두리 제거 */
  border-radius: 5px; /* 버튼 모서리 둥글게 */
  padding: 10px 15px; /* 버튼 내부 여백 */
  cursor: pointer; /* 커서 변경 */
  transition: background-color 0.3s; /* 배경 색상 전환 */
}

.close-button:hover {
  background-color: #0056b3; /* 버튼 hover 효과 */
}

/* 모달 슬라이드 애니메이션 */
@keyframes slide-down {
  from {
    transform: translateY(-30px); /* 위에서 아래로 */
    opacity: 0; /* 처음에는 보이지 않음 */
  }
  to {
    transform: translateY(0);
    opacity: 1; /* 완전히 보임 */
  }
}
</style>
