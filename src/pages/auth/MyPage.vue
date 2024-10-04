<template>
  <div class="mypage-page">
    <div class="top-section">
      <MyType />
    </div>
    <br /><br />

    <div class="middle-section">
      <MyAsset />
    </div>

    <!-- 하단 컴포넌트 (MyPoint, MyBoard) -->
    <div class="bottom-section">
      <div class="bottom-components">
        <MyPoint />
        <MyBoard />
      </div>
    </div>
  </div>
</template>

<script>
// 컴포넌트 임포트
import MyPoint from '@/components/MyPage/MyPoint.vue'
import MyType from '@/components/MyPage/MyType.vue'
import MyAsset from '@/components/MyPage/MyAsset.vue'
import MyBoard from '@/components/MyPage/MyBoard.vue'

export default {
  name: 'App',
  components: {
    MyPoint,
    MyType,
    MyAsset,
    MyBoard
  }
}
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
  margin-bottom: 30px; /* 아래 여백 추가 */
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
  display: flex; /* Flexbox 사용 */
  justify-content: space-between; /* 좌우로 배치 */
}
</style>
