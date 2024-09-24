import axios from 'axios'

const BASE_URL = 'http://localhost:9000/api/board'
const headers = { 'Content-Type': 'multipart/form-data' }

export const getList = async (params) => {
  const { data } = await axios.get(BASE_URL, { params })
  console.log('BOARD GET LIST: ', data)
  return data
}

export const get = async (no) => {
  const { data } = await axios.get(`${BASE_URL}/${no}`)
  console.log('BOARD GET', data)
  return data
}

export const create = async (article) => {
  const formData = new FormData()

  formData.append('title', article.title)
  formData.append('userID', article.userID)
  formData.append('content', article.content)

  if (article.files) {
    for (let i = 0; i < article.files.length; i++) {
      formData.append('files', article.files[i])
    }
  }

  const { data } = await axios.post(BASE_URL, formData, { headers })
  console.log('BOARD POST: ', data)
  return data
}

export const update = async (article) => {
  const formData = new FormData()
  formData.append('boardNo', article.boardNo)
  formData.append('title', article.title)
  formData.append('userID', article.userID)
  formData.append('content', article.content)

  if (article.files) {
    for (let i = 0; i < article.files.length; i++) {
      formData.append('files', article.files[i])
    }
  }

  const { data } = await axios.put(`${BASE_URL}/${article.boardNo}`, formData, { headers })
  console.log('BOARD PUT: ', data)
  return data
}

export const deleteBoard = async (no) => {
  const { data } = await axios.delete(`${BASE_URL}/${no}`)
  console.log('BOARD DELETE: ', data)
  return data
}

export const deleteAttachment = async (no) => {
  const { data } = await axios.delete(`${BASE_URL}/deleteAttachment/${no}`)
  console.log('ATTACHMENT DELETE: ', data)
  return data
}
