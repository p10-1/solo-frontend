//src/api/policyApi.js
import axios from 'axios'

const API_URL = '/api/policy'
const DEFAULT_AMOUNT = 10

export const fetchPolicies = async (currentPage, keyword, policyType) => {
  try {
    const response = await axios.get(`${API_URL}/list`, {
      params: {
        page: currentPage,
        amount: DEFAULT_AMOUNT,
        keyword: keyword,
        category: policyType
      }
    })
    return response.data
  } catch (error) {
    console.error('정책을 가져오는 데 실패했습니다:', error)
    throw error
  }
}

export const recommendPolicies = async () => {
  try {
    const response = await axios.get(`${API_URL}/recommend`)
    return response.data
  } catch (error) {
    console.error('추천 정책을 가져오는 데 실패했습니다:', error)
    throw error
  }
}
