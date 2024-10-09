<template>
  <div class="mypage-page">
    <div class="top-section">
      <MyType />
    </div>

    <div class="middle-section">
      <MyAsset />
    </div>

    <div class="bottom-section">
      <div class="bottom-components">
        <div :style="{ width: '35%' }">
          <MyPoint @update="handleUpdate" />
        </div>
        <div :style="{ width: '65%' }">
          <MyBoard />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MyPoint from '@/components/MyPage/MyPoint.vue'
import MyType from '@/components/MyPage/MyType.vue'
import MyAsset from '@/components/MyPage/MyAsset.vue'
import MyBoard from '@/components/MyPage/MyBoard.vue'

const handleUpdate = () => {
  refreshPage()
}

const refreshPage = () => {
  window.location.reload() // 페이지 새로 고침
}
</script>

<style scoped>
#app {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}
/* 상단 섹션 (MyType) */
.top-section {
  margin-bottom: 3rem; /* 아래 여백 추가 */
}

/* 중간 섹션 (MyType) */
.middle-section {
  margin-bottom: 3rem;
}

/* 하단 섹션 (MyPoint, MyBoard) */
.bottom-section {
  margin-bottom: 3rem;
}

.bottom-components {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 3rem;
}
</style>
