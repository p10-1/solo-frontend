<template>
  <div class="my-type">
    <h3>나의 자산 관리 유형은 어디?</h3><br/>
    <div v-if="selectedType">
      {{ nickName }}님의 자산 타입은 {{ selectedType }} 입니다.
    </div>
    <div v-else>
      자산을 선택해주세요!
    </div>
    <br />
    <div class="button-container">
      <button
        v-for="(type, index) in assetTypes"
        :key="index"
        :class="['btn', { 'selected': selectedType === type.title }]"
        @click="selectType(type)"
      >
        <div class="icon">{{ type.icon }}</div>
        <div class="text-container">
          <div class="title">{{ type.title }}</div>
          <div class="description">{{ type.description }}</div>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      selectedType: null,
      nickName: '', // 사용자 이름 변수 추가
      assetTypes: [
        {
          title: '위험 추구형',
          description: 'High Risk! High Return!',
          icon: '⚠️',
        },
        {
          title: '자산 분산형',
          description: '분산 투자가 자산관리의 왕도!',
          icon: '💨',
        },
        {
          title: '안정 추구형',
          description: 'Lisk는 싫어 안전이 좋아',
          icon: '🌱',
        },
        {
          title: '대출 우선형',
          description: '대출로 인해 더 많은 투자 기회!',
          icon: '🏦',
        },
      ],
    };
  },
  mounted() {
    // 세션 스토리지에서 userInfo 가져오기
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo')); // 객체로 변환

    // nickName 설정
    this.nickName = userInfo ? userInfo.nickName : '사용자'; // 기본값 설정
    this.fetchUserAsset(); // 사용자 자산 가져오기
  },
  methods: {
    async fetchUserAsset() {
      try {
        const response = await axios.get('/api/mypage/getType');
        const userAsset = response.data;

        console.log('사용자 자산:', userAsset); // 응답 로그 추가

        this.selectedType = userAsset; // userAsset이 문자열이므로 그대로 할당
      } catch (error) {
        console.error('사용자 자산 로드 실패:', error);
      }
    },
    selectType(type) {
      this.selectedType = type.title;
      this.updateType(type);
    },
    async updateType(type) {
      console.log('자산:', type.title);
      try {
        const response = await axios.post('/api/mypage/updateType', {
          selectedType: type.title,
        });
        console.log('서버 응답:', response.data);
        alert('유형이 성공적으로 업데이트되었습니다.');
      } catch (error) {
        console.error('업데이트 실패:', error);
        alert('업데이트 실패. 다시 시도해 주세요.');
      }
    },
  },
};
</script>

<style scoped>
.button-container {
  display: flex;
  /* Flexbox를 사용하여 버튼을 가로로 배치 */
  justify-content: space-between;
  /* 버튼 사이에 공간을 균등하게 배치 */
  margin-top: 20px;
}

.btn {
  border: 2px solid black;
  /* 검정색 테두리 추가 */
  padding: 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
  /* 테두리 색상 변화 추가 */
  width: 23%;
  /* 버튼 너비 설정 */
  text-align: left;
  /* 텍스트 왼쪽 정렬 */
  background-color: white;
  /* 기본 배경색 */
  display: flex;
  /* Flexbox를 사용 */
  align-items: center;
  /* 아이콘과 텍스트를 수직 중앙 정렬 */
}

.btn:hover {
  background-color: #f0f0f0;
}

.selected {
  background-color: #007bff;
  /* 선택된 버튼의 배경색 */
  color: white;
  /* 선택된 버튼의 텍스트 색상 */
  border-color: #0056b3;
  /* 선택된 상태의 테두리 색상 변경 */
}

.icon {
  font-size: 40px;
  /* 아이콘 크기 조정 */
  margin-right: 10px;
  /* 아이콘과 텍스트 사이의 간격 조정 */
}

.text-container {
  display: flex;
  flex-direction: column;
  /* 세로 방향으로 배치 */
  justify-content: center;
  /* 수직 중앙 정렬 */
}

.title {
  font-weight: bold;
}

.description {
  font-size: 14px;
}
</style>
