<template>
  <div class="login-container">
    <h2 class="title">로그인</h2>
    <div class="login-body default-content-bgDark">
      <div class="login-content">
        <span class="introduce">Introduce</span>
        <h3 class="title">
          청년 1인 가구를 위한 금융 자산 분석 서비스, <br />
          <span class="text-accent">빚이 없는 솔로</span>입니다.
        </h3>
        <a href="#" class="button-main button-kakao" @click.prevent="login">
          <img src="../../assets/images/kakao-talk-icon.png" alt="카카오 icon" />
          {{ isProcessing ? '로그인 중...' : '카카오톡 로그인' }}
        </a>
        <div class="text">
          <h4 class="text-accent">이제는 1인 가구 시대!</h4>
          <p>우리 서비스는 사용자의 금융 자산을 분석하고 비교해줍니다.</p>
          <p>
            자산 유형별로 비교 및 분석할 수 있으며, 청년 정책과 예적금, 전세자금대출 등 다양한 금융
            상품에 대한 정보를 제공합니다.
          </p>
          <p>
            또한, 커뮤니티를 통해 사용자 간의 금융 자산에 대한 정보 교류의 장을 마련하고 있습니다.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { loginWithKakao } from '@/api/authApi'

const isProcessing = ref(false)

const login = () => {
  isProcessing.value = true
  loginWithKakao()
}
</script>
<style scope>
.default-content-bgDark {
  /* 이 색은 너무 어두운 듯 */
  /* background: rgb(58, 46, 134); */
  /* 이 색으로 변경 */
  background: rgb(77, 61, 180);
  border-radius: 27px;
}
.login-body {
  padding-top: 4rem;
  padding-bottom: 4rem;
  padding-right: 2.5rem;
  padding-left: 28rem;
  background-image: url('../../assets/images/login-bg.png');
  background-position: left bottom;
  background-repeat: no-repeat;
  background-size: auto;
}
.login-content {
  padding: 10px;
}
.introduce {
  display: block;
  color: #cfc6fd;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
  opacity: 0.5;
}
.login-content h3.title {
  color: #fff;
  font-size: 2rem;
  line-height: 2.7rem;
  font-weight: 300;
  letter-spacing: -1.8px;
  margin-bottom: 2rem;
  padding-bottom: 0;
}
.login-content h3.title .text-accent {
  position: relative;
  z-index: 3;
  font-weight: 600;
  color: #fff;
}
.login-content h3.title .text-accent::after {
  content: '';
  position: absolute;
  z-index: 2;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1.3rem;
  background: rgb(247, 208, 149, 0.3);
}
.login-content .text {
  margin-top: 2rem;
  color: #fff;
  font-weight: 300;
  line-height: 1.55rem;
  word-break: keep-all;
}
.login-content .text p {
  margin-bottom: 7px;
}
.login-content .text p:last-child {
  margin-bottom: 0;
}
.login-content .text .text-accent {
  font-size: 1.4rem;
  color: #fff;
  line-height: 1;
  font-weight: 500;
  margin-bottom: 2rem;
}
.login-content .button-kakao {
  background-color: #fae44c;
  border-color: #fae44c;
  color: #333;
  font-weight: 500;
  padding: 0 30px !important;
  height: 55px;
  line-height: 52px;
}
.login-content .button-kakao:hover {
  background-color: #cfb50b !important;
  color: #333 !important;
  border-color: #cfb50b !important;
}
.button-kakao img {
  width: 25px;
  vertical-align: middle;
  margin-right: 5px;
}
</style>
