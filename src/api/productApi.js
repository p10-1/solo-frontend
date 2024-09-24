import axios from 'axios'

const API_URL = 'http://localhost:9000/api/product'
const DEFAULT_AMOUNT = 10

export const fetchKbProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/kb`)
    console.log('kb: ', response.data)
    return response.data
  } catch (error) {
    console.error('KB예적금 상품을 가져오는 데 실패했습니다:', error)
    throw error // 에러를 다시 던져서 호출하는 곳에서 처리할 수 있게 함
  }
}

export const fetchProducts = async (currentPage, keyword) => {
  try {
    const response = await axios.get(`${API_URL}/list`, {
      params: {
        page: currentPage,
        amount: DEFAULT_AMOUNT,
        keyword: keyword
      }
    })
    console.log('fetch: ', response.data)
    return response.data // API 응답 데이터를 반환
  } catch (error) {
    console.error('예적금 상품을 가져오는 데 실패했습니다:', error)
    throw error // 에러를 다시 던져서 호출하는 곳에서 처리할 수 있게 함
  }
}
