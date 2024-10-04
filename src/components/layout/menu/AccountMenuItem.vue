<script setup>
defineProps({ username: String })
</script>
<template>
  <li class="nav-list">
    <router-link class="" to="/mypage">
      <div class="user-icon">
        <img src="../../../assets/images/user-icon.png" alt="user-icon" />
      </div>
      <div class="user-info">
        <div class="user-ranking">대장솔로</div>
        <br />
        <b>{{ username }}</b
        >님
        <i class="fa-solid fa-caret-down margin-left"></i>
      </div>
    </router-link>
    <!-- 드롭 다운 메뉴 -->
    <ul class="dropdown-menu">
      <li>
        <router-link to="/mypage">마이 페이지</router-link>
      </li>
      <li>
        <a href="/points">나의 포인트</a>
        <div class="text-accent">0점</div>
      </li>
    </ul>
  </li>
</template>
<style scope>
.margin-left {
  margin-left: 7px;
}
</style>
