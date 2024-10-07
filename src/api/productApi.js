import axios from 'axios'

const API_URL = '/api/product'
const RENT_HOUSE_URL = '/finlife/finlifeapi/rentHouseLoanProductsSearch.json'
const auth = '6928010ff912e958af75e974b7c9696f'
const DEFAULT_AMOUNT = 10

export const fetchKbProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/kb`)
    return response.data
  } catch (error) {
    console.error('KB예적금 상품을 가져오는 데 실패했습니다:', error)
    throw error // 에러를 다시 던져서 호출하는 곳에서 처리할 수 있게 함
  }
}

export const fetchProducts = async (currentPage, keyword, productType) => {
  try {
    const response = await axios.get(`${API_URL}/list`, {
      params: {
        page: currentPage,
        amount: DEFAULT_AMOUNT,
        keyword: keyword,
        type: productType
      }
    })
    return response.data // API 응답 데이터를 반환
  } catch (error) {
    console.error('예적금 상품을 가져오는 데 실패했습니다:', error)
    throw error // 에러를 다시 던져서 호출하는 곳에서 처리할 수 있게 함
  }
}

export const fetchOption = async (optionId) => {
  try {
    const response = await axios.get(`${API_URL}/option/${optionId}`)
    return response.data
  } catch (error) {
    console.error('옵션 정보를 가져오는 데 실패했습니다:', error)
    throw error
  }
}

export const getRecommend = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/recommend/`, {
      params: {
        userId: userId
      }
    })
    return response.data
  } catch (error) {
    console.error('추천 상품을 가져오는 데 실패했습니다:', error)
    throw error
  }
}

export const getRentHouseLoan = async (topFinGrpNo, pageNo) => {
  try {
    const response = await axios.get(RENT_HOUSE_URL, {
      params: {
        auth: auth, 
        topFinGrpNo: topFinGrpNo,
        pageNo: pageNo
      }
    })
    return response.data.result.baseList
  } catch (error) {
    console.error('대출 상품을 가져오는 데 오류가 발생했습니다:', error)
  }
}
