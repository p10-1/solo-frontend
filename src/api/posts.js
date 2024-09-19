import axios from 'axios'

const API_URL = 'http://localhost:3000/community'

export const getPosts = async (page, limit = 10) => {
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

// 다른 함수들도 비슷하게 try-catch로 감싸주세요

export const createPost = async (postData) => {
  const response = await axios.post(API_URL, postData)
  return response.data
}

export const updatePost = async (postData) => {
  const response = await axios.put(`${API_URL}/${postData.id}`, postData)
  return response.data
}

export const deletePost = async (postId) => {
  await axios.delete(`${API_URL}/${postId}`)
}
export const likePost = async (postId) => {
  const post = await axios.get(`${API_URL}/${postId}`)
  const updatedPost = { ...post.data, likes: (post.data.likes || 0) + 1 }
  const response = await axios.put(`${API_URL}/${postId}`, updatedPost)
  return response.data
}

export const addComment = async (postId, commentData) => {
  const post = await axios.get(`${API_URL}/${postId}`)
  const newComment = {
    id: Date.now().toString(),
    ...commentData
  }
  const updatedPost = {
    ...post.data,
    comments: [...(post.data.comments || []), newComment]
  }
  const response = await axios.put(`${API_URL}/${postId}`, updatedPost)
  return response.data
}
