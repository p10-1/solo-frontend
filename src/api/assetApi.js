//src/api/assetApi.js
import axios from 'axios'

const API_URL = 'http://localhost:9000/api/asset'

const handleApiError = (error, message) => {
  console.error(message, error)
  throw error
}

// 일부 수정 준영님의 코드를 참고 함!
// 자산 데이터를 서버에서 가져오는 함수

export const fetchAssetData = async () => {
  try {
    console.log('assetApi: Fetching asset data')
    const response = await axios.get(API_URL, { withCredentials: true })
    console.log('Fetched asset data:', response.data)
    return response.data
  } catch (error) {
    console.error('assetApi: Error fetching asset data:', error)
    handleApiError(error, '자산 데이터를 가져오는 데 실패했습니다:')
  }
}
// 평균 자산 데이터를 서버에서 가져오는 함수 새로추가
export const fetchAssetAverages = async () => {
  try {
    const response = await axios.get(`${API_URL}/average`, { withCredentials: true })
    console.log('Fetched asset averages:', response.data)
    return response.data
  } catch (error) {
    handleApiError(error, '평균 자산 데이터를 가져오는 데 실패했습니다:')
  }
}
