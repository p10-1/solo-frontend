<template>
  <div class="mypage-page">
    <div class="top-section">
      <MyType />
    </div>
    <br /><br />

    <div class="middle-section">
      <MyAsset />
    </div>

    <div class="bottom-section">
      <div class="bottom-components">
        <MyPoint @update="handleUpdate" />
        <MyBoard />
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
  refreshPage();
};

const refreshPage = () => {
  window.location.reload(); // 페이지 새로 고침
};
</script>

<style scoped>
#app {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  margin-bottom: 30px;
}

/* 상단 섹션 (MyType) */
.top-section {
  margin-bottom: 30px; 
}

/* 중간 섹션 (MyType) */
.middle-section {
  margin-bottom: 50px;
}

/* 하단 섹션 (MyPoint, MyBoard) */
.bottom-section {
  margin-bottom: 50px;
}

.bottom-components {
  display: flex; 
  justify-content: space-between; 
}
</style>
