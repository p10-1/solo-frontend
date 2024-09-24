import axios from 'axios'

const BASE_URL = 'http://localhost:9000/api/board' // 실제 API 엔드포인트로 변경해야 합니다

export const getPosts = async (page = 1, amount = 10) => {
  const response = await axios.get(BASE_URL, { params: { page, amount } })
  return response.data
}

export const getPostDetail = async (no) => {
  const response = await axios.get(`${BASE_URL}/${no}`)
  return response.data
}

export const createPost = async (postData) => {
  const response = await axios.post(BASE_URL, postData)
  return response.data
}

export const updatePost = async (no, postData) => {
  const response = await axios.put(`${BASE_URL}/${no}`, postData)
  return response.data
}

export const deletePost = async (no) => {
  const response = await axios.delete(`${BASE_URL}/${no}`)
  return response.data
}
