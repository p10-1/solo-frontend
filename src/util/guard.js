import { useAuthStore } from '@/stores/authStore'

//////////////////////////////////////////////////////////
export const isAuthenticated = (to, from) => {
  const auth = useAuthStore()

  if (!auth.isLoggedIn) {
    console.log('로그인 필요.....')

    return { name: 'login', query: { next: to.name } }
  }
  console.log('로그인 인증')
}
//////////////////////////////////////////////////////////
