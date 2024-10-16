<script setup>
defineProps({ username: String })
</script>
<template>
  <li class="nav-list">
    <router-link class="" to="/mypage">
      <div class="user-info">
        <b>{{ username }}</b
        >님
      </div>
    </router-link>
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
