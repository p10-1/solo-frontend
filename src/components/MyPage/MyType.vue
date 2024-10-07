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
  padding: 12px 16px;
  border-radius: 12px;
  background-color: #f3f3ff;
}
.my-type .text-black {
  color: #333;
}
.my-type .user-type-info {
  font-size: 20px;
  color: #555;
  letter-spacing: -0.7px;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: #fffbec;
  color: var(--font-secondary, #475067);
}
.my-type .user-type-info i {
  color: #f7d095;
  margin-right: 5px;
}
.my-type .user-type-info .text-accent {
  font-weight: 600;
}
.my-type .button-container {
  display: flex;
  gap: 10px;
}
.my-type .button-container .btn {
  padding: 1.6rem 1.4rem;
  border-radius: 28px;
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

<script setup>
import { ref, onMounted } from 'vue'
import { getType, updateType } from '@/api/mypageApi' // api.js에서 함수 가져오기

const selectedType = ref(null)
const nickName = ref('')
const assetTypes = ref([
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
])

const loadUserAsset = async () => {
  try {
    const userAsset = await getType() // 요청 호출
    selectedType.value = userAsset
  } catch (error) {
    alert('사용자 자산을 가져오는 데 실패했습니다.')
  }
}

const selectType = (type) => {
  selectedType.value = type.title
  updateTypeValue(type)
}

const updateTypeValue = async (type) => {
  try {
    const response = await updateType(type.title) // 요청 호출
    alert(response)
  } catch (error) {
    alert('업데이트 실패. 다시 시도해 주세요.')
  }
}

onMounted(() => {
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  nickName.value = userInfo ? userInfo.nickName : '사용자'
  loadUserAsset() // 사용자 자산 로드
})
</script>

<style scoped></style>
