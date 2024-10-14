<template>
  <div class="catagory-box">
    <h2 class="main-title">자산 형성 도움</h2>
    <ul class="catagory-list margin-top-1rem">
      <li>
        <a @click="handleClick('예금')"><i class="fa-solid fa-coins"></i>예금</a>
      </li>
      <li>
        <a @click="handleClick('적금')"><i class="fa-solid fa-piggy-bank"></i>적금</a>
      </li>
      <li>
        <a @click="handleClick('대출')"><i class="fa-solid fa-house-circle-check"></i>전세대출</a>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'

const router = useRouter()
const productStore = useProductStore()

const handleClick = (type) => {
  setProductType(type)
  navigateToProduct()
}

const setProductType = (type) => {
  productStore.setProductType(type)
}

const navigateToProduct = () => {
  router.push({ name: 'product' })
}
</script>
<style scope>
.main-title {
  font-size: 24px;
  letter-spacing: -0.9px;
}
.catagory-box {
  width: 100%;
  padding: 1rem 0;
}
.catagory-list {
  display: flex;
  gap: 20px;
}
.catagory-list li {
  width: calc(33.3% - 12px);
  height: 7.4rem;
  border-radius: 25px;
  background-color: #fff;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}
.catagory-list li:hover {
  transform: translateY(-10px);
}
.catagory-list li a {
  display: block;
  padding: 1.7rem;
  font-size: 17px;
  letter-spacing: -0.8px;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
}
.catagory-list li a:hover {
  font-weight: 600;
  color: #6846f5 !important;
}
.catagory-list li a i {
  display: block;
  margin-bottom: 15px;
  font-size: 2.2rem;
  background: linear-gradient(to right top, #7d64da, #a686f3);
  color: transparent;
  -webkit-background-clip: text;
  transition: all 0.6s;
}
.catagory-list li a:hover i {
  color: #6846f5;
}
</style>
