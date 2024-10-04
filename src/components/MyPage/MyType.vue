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

<script setup>
import { ref, onMounted } from 'vue';
import { getType, updateType } from '@/api/mypageApi'; // api.js에서 함수 가져오기

const selectedType = ref(null);
const nickName = ref('');
const assetTypes = ref([
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
]);

const loadUserAsset = async () => {
  try {
    const userAsset = await getType(); // 요청 호출
    selectedType.value = userAsset;
  } catch (error) {
    alert('사용자 자산을 가져오는 데 실패했습니다.');
  }
};

const selectType = (type) => {
  selectedType.value = type.title;
  updateTypeValue(type);
};

const updateTypeValue = async (type) => {
  console.log('자산:', type.title);
  try {
    const response = await updateType(type.title); // 요청 호출
    console.log('서버 응답:', response);
    alert(response);
  } catch (error) {
    alert('업데이트 실패. 다시 시도해 주세요.');
  }
};

onMounted(() => {
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  nickName.value = userInfo ? userInfo.nickName : '사용자';
  loadUserAsset(); // 사용자 자산 로드
});
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn {
  border: 2px solid black;
  padding: 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
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
}
</style>
