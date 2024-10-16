import axios from 'axios'
const API_URL = '/api/quiz'

export const makeQuiz = async () => {
  try {
    const response = await axios.get(`${API_URL}/create`)
    return response.data
  } catch (error) {
    console.error('퀴즈를 불러오는 데 실패했습니다.', error)
    throw error
  }
}

export const submitAnswer = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/point`, {
      userId
    })
    return response.data
  } catch (error) {
    console.error('정답 제출 실패:', error)
    throw error
  }
}
