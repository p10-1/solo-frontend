<template>
  <h1>청년 1인 가구를 위한 금융 자산 분석 서비스,</h1>
  <h1>빚이 없는 솔로 입니다.</h1>
  <br /><br />
  <p>우리 서비스는 사용자의 금융 자산을 분석하고 비교해줍니다.</p>
  <p>
    자산 유형별로 비교 및 분석할 수 있으며, 청년 정책과 예적금, 전세자금대출 등 다양한 금융 상품에
    대한 정보를 제공합니다.
  </p>
  <p>또한, 커뮤니티를 통해 사용자 간의 금융 자산에 대한 정보 교류의 장을 마련하고 있습니다.</p>
  <br />
  <a href="#" class="button-main" @click.prevent="login">
    {{ isProcessing ? '로그인 중...' : '카카오 로그인' }}
  </a>
</template>

<script setup>
import { ref } from 'vue'
import { loginWithKakao } from '@/api/authApi'
import { useRoute, useRouter } from 'vue-router'

const isProcessing = ref(false)
const route = useRoute()
const router = useRouter()

const login = async () => {
  isProcessing.value = true
  try {
    // 카카오 로그인 처리 함수 호출
    await loginWithKakao()

    // 로그인 성공 후, 원래 가려던 페이지로 리디렉트
    const nextRoute = route.query.next || '/'
    console.log(nextRoute)
    router.push(nextRoute)
  } catch (error) {
    console.error('로그인 실패:', error)
    alert('로그인에 실패했습니다. 다시 시도해 주세요.')
  } finally {
    isProcessing.value = false
  }
}
</script>
