import axios from 'axios'
const API_URL = 'http://localhost:9000/api/quiz'

export const makeQuiz = async () => {
  try {
    const response = await axios.get(`${API_URL}/create`)
    return response.data
  } catch (error) {
    console.error('퀴즈를 불러오는 데 실패했습니다.', error)
    throw error
  }
}
