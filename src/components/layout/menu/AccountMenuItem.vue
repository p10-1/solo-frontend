<script setup>
defineProps({ username: String })
</script>
<template>
  <li class="nav-list">
    <router-link class="" to="/mypage">
      <div class="user-info">
        <b>{{ username }}</b
        >님<i class="fa-solid fa-caret-down margin-left"></i>
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
.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%; /* Makes the image circular */
  margin-right: 10px; /* Adds space between the image and the username */
  object-fit: cover; /* Ensures the image covers the area without distortion */
}

.margin-left {
  margin-left: 7px;
}
</style>
