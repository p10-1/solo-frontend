import axios from 'axios'

const API_URL = 'http://localhost:9000/api/board'
const DEFAULT_AMOUNT = 10
const headers = { 'Content-Type': 'multipart/form-data' }

export const getList = async (pageNum, category, keyword, sortBy) => {
  try {
    console.log('API 요청 파라미터:', pageNum, category, keyword, sortBy)
    const response = await axios.get(API_URL, {
      params: {
        page: pageNum,
        amount: DEFAULT_AMOUNT,
        category,
        keyword,
        sort: sortBy
      }
    })
    console.log('BOARD GET LIST: ', response.data)
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
    console.log('댓글을 요청한 boardNo: ', boardNo)
    const response = await axios.get(`${API_URL}/${boardNo}/comments`)
    console.log('댓글 리스트: ', response.data)
    return response
  } catch (error) {
    console.error('댓글을 가져오는 데 실패했습니다.', error)
    throw error
  }
}

export const createComment = async (commentData) => {
  try {
    console.log('commentData: ', commentData)
    const response = await axios.post(`${API_URL}/comment`, commentData)
    return response.data
  } catch (error) {
    console.error('댓글 작성 중 오류 발생:', error)
    throw error
  }
}

export const get = async (boardNo) => {
  console.log('get no: ', boardNo)
  const { data } = await axios.get(`${API_URL}/${boardNo}`)
  console.log('BOARD GET', data)
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
  console.log('BOARD POST: ', data)
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
    console.log('BOARD PUT: ', data)
    return data
  } catch (error) {
    console.error('게시글 수정 실패:', error)
    throw error
  }
}

export const deleteBoard = async (boardNo) => {
  const { data } = await axios.delete(`${API_URL}/${boardNo}`)
  console.log('BOARD DELETE: ', data)
  return data
}

export const downloadAttachment = async (no) => {
  const response = await axios.get(`${API_URL}/download/${no}`)
  return response
}

export const deleteAttachment = async (no) => {
  const { data } = await axios.delete(`${API_URL}/deleteAttachment/${no}`)
  console.log('ATTACHMENT DELETE: ', data)
  return data
}

export const likeBoard = async (boardNo, userName) => {
  try {
    console.log('api 안에서: ', boardNo, userName)
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
    console.log(userName)
    const response = await axios.get(`${API_URL}/mine`, {
      params: {
        userName: userName
      }
    })
    console.log('resp:', response.data)
    return response.data
  } catch (error) {
    console.error('내 게시물을 가져오는 데 실패했습니다.', error)
    throw error
  }
}
