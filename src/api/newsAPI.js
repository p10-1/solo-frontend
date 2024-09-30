import axios from 'axios'

const API_URL = 'http://localhost:9000/api/news' // 환경 변수 사용
// const DEFAULT_AMOUNT = 10 // 기본 요청 수

// 뉴스 목록을 가져오는 함수
export const fetchNews = async (currentPage) => {
  try {
    const response = await axios.get(`${API_URL}/fetch`,{
      params:{
        page: currentPage,
        amount: 20,
      }
    })
      
    console.log('Fetched News: ', response.data)
    return response.data // API 응답 데이터를 반환
  } catch (error) {
    console.error('뉴스를 가져오는 데 실패했습니다:', error)
    throw error // 에러를 다시 던져서 호출하는 곳에서 처리할 수 있게 함
  }
}
