import axios from 'axios'

const API_URL = 'http://localhost:9000/api/board'
const DEFAULT_AMOUNT = 10
const headers = { 'Content-Type': 'multipart/form-data' }

export const getList = async (pageNum, category, keyword, sortBy) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        page: pageNum,
        amount: DEFAULT_AMOUNT,
        category,
        keyword,
        sort: sortBy
      }
    })
    return response.data
  } catch (error) {
    console.error('게시판을 가져오는 데 실패했습니다:', error)
    throw error
  }
}

export const getBest = async () => {
  try {
    const response = await axios.get(`${API_URL}/best`)
    console.log('best: ', response.data)
    return response.data
  } catch (error) {
    console.error('인기글을 가져오는 데 실패했습니다.', error)
    throw error
  }
}

export const getComments = async (boardNo) => {
  try {
    const response = await axios.get(`${API_URL}/${boardNo}/comments`)
    return response
  } catch (error) {
    console.error('댓글을 가져오는 데 실패했습니다.', error)
    throw error
  }
}

export const createComment = async (commentData) => {
  try {
    const response = await axios.post(`${API_URL}/comment`, commentData)
    return response.data
  } catch (error) {
    console.error('댓글 작성 중 오류 발생:', error)
    throw error
  }
}

export const get = async (boardNo) => {
  const { data } = await axios.get(`${API_URL}/${boardNo}`)
  return data
}

export const create = async (article) => {
  const formData = new FormData()

  formData.append('title', article.title)
  formData.append('userName', article.userName)
  formData.append('content', article.content)

  if (article.files) {
    for (let i = 0; i < article.files.length; i++) {
      formData.append('files', article.files[i])
    }
  }

  const { data } = await axios.post(API_URL, formData, { headers })
  return data
}

export const update = async (article) => {
  const formData = new FormData()

  formData.append('boardNo', article.boardNo)
  formData.append('title', article.title)
  formData.append('userName', article.userName)
  formData.append('content', article.content)

  if (article.files && article.files.length > 0) {
    for (let i = 0; i < article.files.length; i++) {
      formData.append('files', article.files[i])
    }
  }

  try {
    const { data } = await axios.put(`${API_URL}/${article.boardNo}`, formData, { headers })
    return data
  } catch (error) {
    console.error('게시글 수정 실패:', error)
    throw error
  }
}

export const deleteBoard = async (boardNo) => {
  const { data } = await axios.delete(`${API_URL}/${boardNo}`)
  return data
}

export const downloadAttachment = async (no) => {
  const response = await axios.get(`${API_URL}/download/${no}`)
  return response
}

export const deleteAttachment = async (no) => {
  const { data } = await axios.delete(`${API_URL}/deleteAttachment/${no}`)
  return data
}

export const likeBoard = async (boardNo, userName) => {
  try {
    const response = await axios.get(`${API_URL}/like`, {
      params: {
        boardNo: boardNo,
        userName: userName
      }
    })
    return response
  } catch (error) {
    console.error('좋아요을 가져오는 데 실패했습니다.', error)
    throw error
  }
}

export const myBoard = async (userName) => {
  try {
    const response = await axios.get(`${API_URL}/mine`, {
      params: {
        userName: userName
      }
    })
    return response.data
  } catch (error) {
    console.error('내 게시물을 가져오는 데 실패했습니다.', error)
    throw error
  }
}
