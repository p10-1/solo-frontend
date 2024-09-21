<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const authStore = useAuthStore()

const login = async () => {
  try {
    const response = await axios.post('http://localhost:3000/auth/login', {
      username: username.value,
      password: password.value
    })
    const token = response.data.token
    authStore.login(username.value, token) // 로그인 성공 시 스토어 업데이트
    router.push('/') // 홈으로 이동
  } catch (error) {
    errorMessage.value = '로그인에 실패했습니다.'
  }
}
</script>
