import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useRouter } from 'vue-router' // Vue Router 훅 불러오기

// 초기 상태 정의
const initState = {
  token: '',
  user: {
    username: '',
    email: '',
    roles: []
  }
}

export const useAuthStore = defineStore('auth', () => {
  const state = ref({ ...initState })
  const router = useRouter() // Vue Router 인스턴스 가져오기

  // 로그인 여부 확인 (token이 있으면 로그인 상태)
  const isLogin = computed(() => !!state.value.token)

  const username = computed(() => state.value.user.username)
  const email = computed(() => state.value.user.email)

  // 로그인 함수
  const login = async (member) => {
    console.log('로그인 시도: ', member) // 로그로 사용자 입력 값 확인
    try {
      // 서버에 로그인 요청 (member는 { username, password } 객체)
      const response = await axios.get(
        `http://localhost:3000/users?username=${member.username}&password=${member.password}`
      )
      console.log('서버 응답: ', response) // 서버에서 받은 응답을 로그로 출력

      if (response.data.length > 0) {
        // 유저 데이터와 토큰을 받아와 상태에 저장
        state.value.user = response.data[0] // 첫 번째 사용자 데이터 (매칭된 사용자)
        state.value.token = 'sample-token' // 여기선 샘플 토큰, 실제로는 서버에서 받아온 토큰
        console.log('로그인 성공, 사용자 상태 업데이트: ', state.value)

        // 상태를 로컬 스토리지에 저장
        localStorage.setItem('auth', JSON.stringify(state.value))
        console.log('로컬 스토리지에 저장된 데이터: ', localStorage.getItem('auth'))

        // 로그인 성공 후 홈으로 리다이렉트
        router.push('/') // 수정: Vue Router로 홈으로 리다이렉트
      } else {
        console.log('로그인 실패: 사용자 정보가 일치하지 않음')
        throw new Error('로그인 실패: 사용자 정보가 일치하지 않습니다.')
      }
    } catch (error) {
      console.error('로그인 실패: ', error.response?.data || error.message)
      throw new Error('로그인에 실패했습니다. 다시 시도해 주세요.')
    }
  }

  // 로그아웃 함수: 상태 초기화 및 로컬 스토리지에서 인증 정보 제거
  const logout = () => {
    console.log('로그아웃 시도')
    localStorage.removeItem('auth')
    state.value = { ...initState }
    console.log('상태 초기화 완료: ', state.value)
  }

  // 토큰 가져오기
  const getToken = () => {
    console.log('토큰 요청: ', state.value.token)
    return state.value.token
  }

  // 로컬 스토리지에서 인증 정보 로드
  const load = () => {
    console.log('로컬 스토리지에서 인증 정보 로드 시도')
    const auth = localStorage.getItem('auth')
    if (auth) {
      state.value = JSON.parse(auth)
      console.log('로컬 스토리지에서 불러온 상태: ', state.value)
    } else {
      console.log('로컬 스토리지에 인증 정보 없음')
    }
  }

  load() // 초기화 시 로컬 스토리지에서 인증 정보 불러오기

  return { state, username, email, isLogin, login, logout, getToken }
})
