<template>
  <a :href="policy.rqutUrla" target="_blank" class="policy-card">
    <div class="icon margin-bottom-1rem"><i class="fa-solid fa-landmark"></i></div>
    <div class="link"><i class="fa-solid fa-link"></i></div>
    <h3 class="title policy-title">{{ policy.polyBizSjnm }}</h3>

    <div class="button-main" @click.stop="openModal" @click.prevent="handleLinkClick">
      <i class="fa-solid fa-list-check"></i> 정책 미리 보기
    </div>
  </a>
  <PolicyModal :isVisible="isModalVisible" :policy="policy" @close="isModalVisible = false" />
</template>

<script setup>
import { ref } from 'vue'
import PolicyModal from './PolicyModal.vue'

defineProps({
  policy: {
    type: Object,
    required: true
  }
})

const isModalVisible = ref(false)

function openModal() {
  isModalVisible.value = true
}
</script>

<style scoped>
.policy-card {
  position: relative;
  width: 100%;
  min-height: 17rem;
  border-radius: 25px;
  padding: 2rem 1.7rem;
  background-color: #fff;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.policy-card:hover {
  transform: translateY(-10px);
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
}

.policy-card:hover .title {
  color: #6846f5;
  font-weight: 600;
}

.policy-card:hover .link {
  color: #a686f3;
  transition: all 0.6s;
}

.policy-card .icon {
  text-align: center;
  vertical-align: baseline;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(to left, #7d64da, #a686f3);
  color: #fff;
}

.policy-card .icon i {
  line-height: 50px;
  font-size: 25px;
}

.policy-card .title {
  font-size: 1.22rem;
  word-break: keep-all;
  line-height: 1.6rem;
  letter-spacing: -1px;
  padding: 0;
}

.policy-card .link {
  position: absolute;
  top: 2rem;
  right: 1.7rem;
  font-size: 1.8rem;
  color: #d3d3d3;
}

.policy-card .button-main {
  position: absolute;
  bottom: 2rem;
  margin-left: 0;
  margin-bottom: 0;
  width: 84%;
  font-size: 17px;
}
</style>
