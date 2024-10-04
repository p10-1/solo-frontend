<template>
  <div class="footer">
    <div class="container">
      <h1>
        <router-link to="/" class="logo">
          <img src="../../assets/images/logo2.png" />
        </router-link>
      </h1>
      <div class="dic">
        <ul>
          <li><i class="fa-solid fa-ghost"></i> <a href="#"> Creative solo </a></li>
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
<style scope>
.footer {
  clear: both;
  background: #0e0e0e;
  margin: 0;
  text-align: center;
  display: flex;
  justify-content: center;
  min-height: 220px;
}

.footer .container {
  padding: 2.5vw 1vw 5vw;
}

.footer h1 {
  margin: 0;
}

.footer .dic {
  margin-top: 2vw;
  margin-bottom: 2vw;
}

.footer .dic ul li {
  margin: 0.5rem 0.8rem;
}

.footer .dic ul li,
.footer .dic ul li a {
  display: inline-block;
  color: #e9e9e9;
  padding: 0;
  vertical-align: inherit;
  font-size: 13px;
}

.footer .dic ul li a:hover {
  color: #fee500;
}

.footer .copyright {
  margin-top: 20px;
  color: #666;
  font-size: 13px;
}
</style>
