import axios from 'axios'

const API_URL = 'http://localhost:9000/api/member'

export const loginWithKakao = async () => {
  try {
    const response = await axios.get(`${API_URL}/login`, { withCredentials: true })
    window.location.href = response.data
  } catch (error) {
    console.error('Login error:', error)
  }
}

export const logoutWithKakao = async () => {
  try {
    const response = await axios.get(`${API_URL}/logout`, { withCredentials: true })
    window.location.href = response.data // 로그아웃 페이지로 리다이렉트
  } catch (error) {
    console.error('Logout error:', error)
  }
}

export const handleLoginCallback = (code) => {
  return axios.get(`${API_URL}/login/callback?code=${code}`, { withCredentials: true })
}

export const registerFirstUser = (userName, birthdate) => {
  console.log('registerFirstUser까진 들어옴', userName, birthdate)
  return axios.post(
    `${API_URL}/firstUser`,
    { userName, birthdate },
    {
      withCredentials: true
    }
  )
}

export const checkuserName = (nickName) => {
  console.log('checkUsername: ', nickName)
  const response = axios.get(`${API_URL}/checkUser`, {
    params: {
      nickName
    }
  })
  return response
}
