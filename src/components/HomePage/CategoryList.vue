<template>
  <div class="catagory-box">
    <h2 class="main-title">자산 형성 도움</h2>
    <ul class="catagory-list margin-top-1rem margin-bottom-2rem">
      <li>
        <router-link :to="{ name: 'product' }"> <i class="fa-solid fa-coins"></i>예금 </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'product' }"><i class="fa-solid fa-coins"></i>적금</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'product' }">
          <i class="fa-solid fa-coins"></i>전세대출
        </router-link>
      </li>
    </ul>
    <h2 class="main-title">제공 서비스</h2>
    <ul class="catagory-list margin-top-1rem">
      <li>
        <router-link :to="{ name: 'asset' }">
          <i class="fa-solid fa-coins"></i>자산분석
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'board' }"><i class="fa-solid fa-coins"></i>커뮤니티</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'mypage' }">
          <i class="fa-solid fa-coins"></i>마이페이지
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script></script>
<style scope>
.main-title {
  font-size: 24px;
  letter-spacing: -0.9px;
}
.catagory-box {
  width: 100%;
  padding: 1rem;
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
  padding: 2rem 1.7rem;
  font-size: 17px;
  letter-spacing: -0.8px;
  text-align: center;
  transition: all 0.6s;
}
.catagory-list li a:hover {
  color: #6846f5;
  font-weight: 600;
}
.catagory-list li i {
  display: block;
  margin-bottom: 15px;
  font-size: 2.2rem;
}
</style>
