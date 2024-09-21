import axios from 'axios'

const API_URL = 'http://localhost:3000/board'

export const getPosts = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}?_page=${page}&_limit=${limit}`)
    return {
      data: response.data,
      totalPages: Math.ceil(response.headers['x-total-count'] / limit) || 0
    }
  } catch (error) {
    console.error('Error in getPosts:', error)
    throw error
  }
}

export const getPostById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error('Error in getPostById:', error)
    throw error
  }
}

export const createPost = async (postData) => {
  try {
    const response = await axios.post(API_URL, postData)
    return response.data
  } catch (error) {
    console.error('Error in createPost:', error)
    throw error
  }
}

export const getHotPosts = async () => {
  try {
    // 인기 게시글을 가져오는 로직을 서버에 맞게 수정해야 할 수 있습니다.
    // 예: 좋아요 수로 정렬하여 상위 10개 게시글 가져오기
    const response = await axios.get(`${API_URL}?_sort=likes&_order=desc&_limit=10`)
    return response.data
  } catch (error) {
    console.error('Error in getHotPosts:', error)
    throw error
  }
}

export const updatePost = async (boardNo, postData) => {
  try {
    const response = await axios.put(`${API_URL}/${boardNo}`, postData)
    return response.data
  } catch (error) {
    console.error('Error in updatePost:', error)
    throw error
  }
}
