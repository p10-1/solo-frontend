<template>
  <div class="mypage-page">
    <h1>나의 계정 관리</h1>

    <!-- 상단 두 개 컴포넌트를 좌우로 배치 -->
    <div class="top-section">
        <MyPoint />
    
    </div>

    <!-- 중간 컴포넌트 (MyType) -->
    <div class="middle-section">
      <MyAsset />
    </div>

    <!-- 하단 컴포넌트 (MyAsset) -->
    <div class="bottom-section">
      <!-- <AssetEdit/> -->
      
    </div>
  </div>
</template>

<script>
// 컴포넌트 임포트
import MyPoint from '@/components/MyPage/MyPoint.vue'
// import MyGrade from '@/components/MyPage/MyGrade.vue'
// import MyType from '@/components/MyPage/MyType.vue'
import MyAsset from '@/components/MyPage/MyAsset.vue'
// import AssetEdit from '@/components/MyPage/AssetEdit.vue';

export default {
  name: 'App',
  components: {
    MyPoint,
    //MyGrade,
    // MyType,
    MyAsset,
    // AssetEdit
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

/* 상단 좌우 컴포넌트 배치 */
.top-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.left,
.right {
  width: 50%;
}

/* 중간 섹션 (MyType) */
.middle-section {
  margin-bottom: 50px;
}

/* 하단 섹션 (MyAsset) */
.bottom-section {
  margin-bottom: 50px;
}
</style>
