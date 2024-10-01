//src/api/assetApi.js
import axios from 'axios'

const API_URL = 'http://localhost:9000/api/asset'

// 일부 수정 준영님의 코드를 참고 함!
// 자산 데이터를 서버에서 가져오는 함수

export const fetchAssetData = async () => {
  try {
    // GET 요청으로 자산 데이터를 서버에서 가져오기
    const response = await axios.get(API_URL, { withCredentials: true })
    console.log('fetch asset data: ', response.data) // 콘솔에 데이터를 출력
    return response.data // 데이터를 반환
  } catch (error) {
    console.error('자산 데이터를 가져오는 데 실패했습니다:', error)
    throw error
  }
}
// 평균 자산 데이터를 서버에서 가져오는 함수 새로추가
export const fetchAssetAverages = async () => {
  try {
    // 평균 데이터를 API로부터 가져옴

    const response = await axios.get(`${API_URL}/average`, { withCredentials: true })
    console.log('fetch asset averages: ', response.data)
    return response.data
  } catch (error) {
    console.error('평균 자산 데이터를 가져오는 데 실패했습니다:', error)
    throw error
  }
}
