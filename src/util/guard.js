import { useAuthStore } from '@/stores/authStore'

export const isAuthenticated = (to, from, next) => {
  const auth = useAuthStore()

  if (!auth.isLoggedIn) {
    console.log('로그인 필요.....')

    next({ name: 'login', query: { next: to.name } })
  }
  console.log('로그인 인증')
  next()
}
