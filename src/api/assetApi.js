//src/api/assetApi.js
import axios from 'axios'

const API_URL = 'http://localhost:9000/api/asset'

export const fetchAssetData = async () => {
  try {
    const response = await axios.get(`${API_URL}`, { withCredentials: true })
    console.log('fetch asset data: ', response.data)
    return response.data
  } catch (error) {
    console.error('자산 데이터를 가져오는 데 실패했습니다:', error)
    throw error
  }
}
