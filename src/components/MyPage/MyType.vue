<template>
  <div class="my-type">
    <h2 class="title">나의 <span class="text-accent">자산 관리 유형</span>은 어디?</h2>
    <br />
    <div v-if="selectedType" class="user-type-info">
      <span class="text-accent"><i class="fa-solid fa-circle-info"></i> {{ nickName }}</span
      >님의 자산 타입은 <span class="text-accent">"{{ selectedType }}"</span> 입니다.
    </div>
    <div v-else class="text-p">
      <span class="text-accent"><i class="fa-solid fa-circle-check"></i> 자산 관리 유형</span>을
      선택해주세요!
    </div>
    <br />
    <div class="button-container">
      <button
        v-for="(type, index) in assetTypes"
        :key="index"
        :class="['btn', { selected: selectedType === type.title }]"
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

<style scope>
.my-type h2.title {
  font-weight: 300;
}
.my-type h2.title span.text-accent {
  font-weight: 300;
}
.my-type .text-p {
  font-size: 20px;
  letter-spacing: -0.6px;
}
.my-type .text-black {
  color: #333;
}
.my-type .user-type-info {
  color: #555;
  letter-spacing: -0.7px;
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--gray020, #fffbec);
  color: var(--font-secondary, #475067);
}
.my-type .user-type-info i {
  color: #f7d095;
  margin-right: 5px;
}
.my-type .user-type-info .text-accent {
  font-size: 23px;
  font-weight: 600;
}
.my-type .button-container {
  display: flex;
  gap: 10px;
}
.my-type .button-container .btn {
  padding: 1.6rem 1.4rem;
  border-radius: 5px;
  border: 3px solid #e4deff;
  background-color: #fcfcfc;
  width: 100%;
  transition: all 0.6s;
}
.my-type .button-container .btn:hover {
  background-color: #fffbec;
  border: 3px solid #ffba62;
}
.my-type .button-container .btn.selected {
  background-color: #fffbec;
  border: 3px solid #ffba62;
}
.my-type .button-container .icon {
  display: inline-block;
  width: 35%;
}
.my-type .button-container .text-container {
  display: inline-block;
  width: 65%;
  text-align: left;
}
.my-type .button-container .title {
  line-height: 1;
  font-size: 22px;
  font-weight: 600;
  color: #3d3d3d;
  margin-bottom: 10px;
  word-break: keep-all;
}
.my-type .button-container .description {
  font-size: 15px;
  line-height: 20px;
  word-break: keep-all;
  letter-spacing: -0.5px;
}
</style>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      selectedType: null,
      nickName: '', // 사용자 이름 변수 추가
      assetTypes: [
        {
          title: '위험 추구형',
          description: 'High Risk! High Return!',
          icon: '⚠️'
        },
        {
          title: '자산 분산형',
          description: '분산 투자가 자산관리의 왕도!',
          icon: '💨'
        },
        {
          title: '안정 추구형',
          description: 'Lisk는 싫어 안전이 좋아',
          icon: '🌱'
        },
        {
          title: '대출 우선형',
          description: '대출로 인해 더 많은 투자 기회!',
          icon: '🏦'
        }
      ]
    }
  },
  mounted() {
    // 세션 스토리지에서 userInfo 가져오기
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo')) // 객체로 변환

    // nickName 설정
    this.nickName = userInfo ? userInfo.nickName : '사용자' // 기본값 설정
    this.fetchUserAsset() // 사용자 자산 가져오기
  },
  methods: {
    async fetchUserAsset() {
      try {
        const response = await axios.get('/api/mypage/getType')
        const userAsset = response.data

        console.log('사용자 자산:', userAsset) // 응답 로그 추가

        this.selectedType = userAsset // userAsset이 문자열이므로 그대로 할당
      } catch (error) {
        console.error('사용자 자산 로드 실패:', error)
      }
    },
    selectType(type) {
      this.selectedType = type.title
      this.updateType(type)
    },
    async updateType(type) {
      console.log('자산:', type.title)
      try {
        const response = await axios.post('/api/mypage/updateType', {
          selectedType: type.title
        })
        console.log('서버 응답:', response.data)
        alert('유형이 성공적으로 업데이트되었습니다.')
      } catch (error) {
        console.error('업데이트 실패:', error)
        alert('업데이트 실패. 다시 시도해 주세요.')
      }
    }
  }
}
</script>

<style scoped>
/* .button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn {
  border: 2px solid black;
  padding: 20px;
  border-radius: 5px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    border-color 0.3s;
  width: 23%;
  text-align: left;
  background-color: white;
  display: flex;
  align-items: center;
}

.btn:hover {
  background-color: #f0f0f0;
}

.selected {
  background-color: #007bff;
  color: white;
  border-color: #0056b3;
}

.icon {
  font-size: 40px;
  margin-right: 10px;
}

.text-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-weight: bold;
}

.description {
  font-size: 14px;
} */
</style>
