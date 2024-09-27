import axios from 'axios'

const BASE_URL = 'http://localhost:9000/api/asset' // 기본 URL 설정

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // 쿠키를 포함한 요청을 위해
})

export const assetApi = {
  // 사용자의 자산 데이터 가져오기
  getAssetData: async () => {
    try {
      const response = await apiClient.get('')
      return response.data
    } catch (error) {
      console.error('Error fetching asset data:', error)
      throw error
    }
  },

  // 새로운 자산 데이터 추가
  addAsset: async (assetData) => {
    try {
      const response = await apiClient.post('', assetData)
      return response.data
    } catch (error) {
      console.error('Error adding asset data:', error)
      throw error
    }
  },

  // 자산 데이터 수정
  updateAsset: async (assetData) => {
    try {
      const response = await apiClient.put('', assetData)
      return response.data
    } catch (error) {
      console.error('Error updating asset data:', error)
      throw error
    }
  },

  // 자산 데이터 삭제
  deleteAsset: async (assetId) => {
    try {
      const response = await apiClient.delete(`/${assetId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting asset data:', error)
      throw error
    }
  },

  // 특정 카테고리의 자산 데이터 가져오기
  getAssetByCategory: async (category) => {
    try {
      const response = await apiClient.get(`/category/${category}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching asset data for category ${category}:`, error)
      throw error
    }
  },

  // 자산 비교 데이터 가져오기
  getAssetComparison: async () => {
    try {
      const response = await apiClient.get('/comparison')
      return response.data
    } catch (error) {
      console.error('Error fetching asset comparison data:', error)
      throw error
    }
  }
}
