import axios from 'axios'

const API_BASE_URL = '/api/mypage'

// 자산조회
export const getAsset = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAsset`, { withCredentials: true })
    return response.data
  } catch (error) {
    console.error('자산 불러오기 실패:', error)
    throw error
  }
}

// 포인트 조회
export const fetchPoints = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getPoint`, { withCredentials: true })
    return response.data
  } catch (error) {
    console.error('포인트 조회 오류:', error)
    throw error
  }
}

// 포인트 출금
export const pointsToCash = async (accountIndex, withdrawAmount) => {
  try {
    const requestData = { point: withdrawAmount }
    const response = await axios.post(`${API_BASE_URL}/withdraw?idx=${accountIndex}`, requestData, {
      withCredentials: true
    })
    return response.data
  } catch (error) {
    console.error('출금 오류:', error)
    throw error
  }
}

// 사용자의 계좌 조회
export const getBank = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getBank`, { withCredentials: true })
    console.log("getBank:", response.data);
    return response.data // 은행 정보 반환
  } catch (error) {
    console.error('계좌 조회 오류:', error)
    throw error
  }
}

// MyType에서 사용

// 사용자의 타입 조회
export const getType = async () => {
  try {
    const response = await axios.get('/api/mypage/getType')
    return response.data
  } catch (error) {
    console.error('사용자 자산 로드 실패:', error)
    throw error
  }
}

// 사용자의 타입 수정
export const updateType = async (selectedType) => {
  try {
    const response = await axios.put('/api/mypage/updateType', { selectedType })
    return response.data
  } catch (error) {
    console.error('업데이트 실패:', error)
    throw error
  }
}
