import axios from 'axios';

const API_URL = 'http://localhost:9000/api/news';



 // 전체 뉴스를 가져오는 함수
export const getNews = async (currentPage) => {
  try {
    const response = await axios.get(`${API_URL}/getNews`, {
      params: {
        page: currentPage,
        amount: 20
      }
    });

    console.log('Fetched News: ', response.data);
    return response.data; 
  } catch (error) {
    console.error('뉴스를 가져오는 데 실패했습니다:', error);
    throw error;
  }
}

// 카테고리별로 가져오는 함수
export const getNewsBycategory = async (currentPage, category) => {
  try {
    const response = await axios.get(`${API_URL}/getNewsBycategory`, {
      params: {
        page: currentPage,
        amount: 20,
        category: category, // 카테고리 파라미터 추가
      }
    });

    console.log('Fetched News: ', response.data);
    return response.data; 
  } catch (error) {
    console.error('뉴스를 가져오는 데 실패했습니다:', error);
    throw error; 
  }
}

