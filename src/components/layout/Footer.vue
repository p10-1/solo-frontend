<template>
  <div class="footer">
    <div class="container">
      <h1>
        <router-link to="/" class="logo">
          <img src="../../assets/images/logo2.png" alt="푸터 로고" />
        </router-link>
      </h1>
      <div class="dic">
        <ul>
          <li>
            <router-link :to="{ SoloTeam }"
              ><i class="fa-solid fa-ghost"></i> Creative Solo Team</router-link
            >
          </li>
          <li>
            <i class="fa-solid fa-mobile-button"></i> 고객문의 :
            <a class="btn" href="tel:000-000-0000">051-125-2554</a>
          </li>
          <li>
            <i class="fa-solid fa-envelope"></i> 이메일 :
            <a class="btn" href="mailto:soloManager@naver.com">soloManager@naver.com</a>
          </li>
        </ul>
      </div>
      <div class="copyright">© 2024, 10, 12 Creative solo</div>
    </div>
  </div>
</template>
<style scope></style>
