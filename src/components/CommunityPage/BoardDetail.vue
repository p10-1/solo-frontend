<template>
  <div class="container mt-5" v-if="board">
    <div class="card mb-4">
      <div class="card-body">
        <h2 class="title card-title">{{ board.title }}</h2>
        <div class="box">
          <dl class="card-text">
            <dt>작성자:</dt>
            <dd class="badge bg-secondary">{{ board.userName }}</dd>
            <dt>작성일:</dt>
            <dd class="text-muted">{{ moment(board.regDate).format('YYYY-MM-DD HH:mm:ss') }}</dd>
          </dl>
          <div class="post-stats mb-3">
            <p>
              <strong>추천수: </strong> <span class="badge bg-success">{{ board.likes }}</span>
              <strong> 댓글수: </strong> <span class="badge bg-info">{{ board.comments }}</span>
              <strong> 조회수: </strong> <span class="badge bg-warning">{{ board.views }}</span>
            </p>
          </div>
        </div>
        <div class="post-content margin-top-1rem mb-3">
          <p>{{ board.content }}</p>
          <div v-if="board.attaches && board.attaches.length" class="mt-3">
            <ul class="list-group">
              <li
                v-for="attach in board.attaches"
                :key="attach.attachmentNo"
                class="list-group-item"
              >
                <img
                  v-if="attach.filename.endsWith('.jpg') || attach.filename.endsWith('.png')"
                  :src="`http://localhost:9000/api/board/download/${attach.attachmentNo}`"
                  alt="첨부파일 미리보기"
                  class="img-thumbnail mt-2"
                  style="max-width: 100%; height: auto"
                />
              </li>
            </ul>
          </div>
        </div>
        <div class="button-box">
          <button @click="increaseLikes" class="button-sub btn btn-success me-2">좋아요 👍</button>
          <div v-if="isAuthor" class="mt-3">
            <button @click="goToUpdate" class="button-sub btn btn-primary me-2">수정하기</button>
            <button @click="deleteBoardConfirm" class="button-sub margin-left-1rem btn btn-danger">
              삭제하기
            </button>
          </div>
          <button @click="goBack" class="button-sub btn btn-secondary mt-3">뒤로 가기</button>
        </div>
      </div>
    </div>

    <!-- 댓글 리스트 -->
    <div class="comments-section mt-4">
      <h2 class="title">댓글</h2>
      <div v-if="comments && comments.length">
        <ul class="list-group">
          <li v-for="comment in comments" :key="comment.commentNo" class="list-group-item">
            <p class="margin-bottom">
              <span class="badge bg-light text-dark">{{ comment.userName }}</span>
              <strong>{{ comment.commentText }}</strong>
            </p>
            <p class="text-muted">
              {{ moment(comment.regDate).format('YYYY-MM-DD HH:mm:ss') }}
            </p>
          </li>
        </ul>
      </div>
      <div v-else>
        <p class="text-muted">댓글이 없습니다.</p>
      </div>

      <div class="comment-form mt-4">
        <h4 class="title">댓글 작성</h4>
        <div class="flex">
          <textarea
            v-model="commentText"
            placeholder="댓글을 입력하세요..."
            rows="3"
            class="form-control mb-2"
          ></textarea>
          <button @click="submitComment" class="button-main btn btn-primary">댓글 작성</button>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <p>게시물을 로드하는 중입니다...</p>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  get,
  deleteBoard,
  deleteAttachment,
  getComments,
  createComment,
  likeBoard
} from '@/api/boardApi'
import { useAuthStore } from '@/stores/authStore'
import moment from 'moment'

const board = ref(null)
const comments = ref([])
const commentText = ref('')
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore() // 인증 스토어 가져오기

const loadBoardDetail = async () => {
  const boardNo = route.params.boardNo // URL 파라미터에서 게시물 번호 가져오기
  try {
    const response = await get(boardNo)
    board.value = response
  } catch (error) {
    console.error('게시물 상세 정보 로드 실패: ', error)
  }
}

const loadComments = async () => {
  const boardNo = route.params.boardNo // 게시물 번호
  console.log('댓글 뽑기전 boardNo: ', boardNo)
  try {
    const response = await getComments(boardNo)
    comments.value = response.data // 댓글 리스트 상태에 저장
  } catch (error) {
    console.error('댓글을 가져오는 데 실패했습니다.', error)
  }
}

const submitComment = async () => {
  if (!commentText.value) {
    alert('댓글 내용을 입력하세요.')
    return
  }

  const boardNo = route.params.boardNo
  const commentData = {
    userName: authStore.userInfo.userName, // 현재 로그인된 userName
    boardNo: boardNo, // 현재 게시글 번호
    commentText: commentText.value // 댓글 내용
  }

  try {
    await createComment(commentData) // 댓글 작성 API 호출
    alert('댓글이 작성되었습니다.')
    commentText.value = '' // 입력 필드 초기화
    await loadComments() // 댓글 리스트 다시 로드
    board.value.comments += 1
    // await loadBoardDetail()
  } catch (error) {
    console.error('댓글 작성 실패:', error)
    alert('댓글 작성에 실패했습니다.')
  }
}

// 현재 사용자가 작성자인지 확인
const isAuthor = computed(() => {
  return authStore.userInfo && authStore.userInfo.userName === board.value?.userName
})

const goBack = () => {
  router.go(-1) // 이전 페이지로 돌아가기
}

// 좋아요 증가
const increaseLikes = async () => {
  const boardNo = route.params.boardNo
  const userName = authStore.userInfo.userName
  try {
    const response = await likeBoard(boardNo, userName) // 좋아요 증가 API 호출
    if (response.data == 'success') {
      board.value.likes += 1 // 좋아요 수 증가
      // alert('좋아요를 눌렀습니다')
    } else {
      alert('이미 좋아요를 눌렀습니다')
    }
  } catch (error) {
    console.error('좋아요 실패:', error)
    alert('좋아요에 실패했습니다.')
  }
}

// 수정 페이지로 이동
const goToUpdate = () => {
  router.push({
    name: 'board/update',
    params: { boardNo: route.params.boardNo },
    query: route.query
  })
}

const deleteBoardConfirm = async () => {
  if (confirm('이 게시물을 삭제하시겠습니까?')) {
    try {
      // 게시글에 첨부파일이 있는지 확인
      console.log('board: ', board.value)
      if (board.value.attaches && board.value.attaches.length) {
        // 첨부파일 먼저 삭제
        for (const attach of board.value.attaches) {
          await deleteAttachment(attach.attachmentNo)
        }
      }
      await deleteBoard(route.params.boardNo) // 게시글 삭제
      alert('게시물이 삭제되었습니다.')
      router.push('/board') // 목록 페이지로 이동
    } catch (error) {
      console.error('게시물 삭제 실패:', error)
      alert('게시물 삭제에 실패했습니다.')
    }
  }
}

onMounted(() => {
  loadBoardDetail()
  loadComments()
})
</script>

<style>
.card-title {
  font-size: 36px;
  font-weight: 700;
  word-break: keep-all;
  margin-bottom: 24px;
}

dl.card-text {
  position: relative;
}

dl.card-text dt {
  display: inline-block;
  font-size: 18px;
  letter-spacing: -1px;
}

dl.card-text dd {
  display: inline-block;
  font-size: 18px;
  margin-left: 5px;
  margin-right: 20px;
  font-weight: 600;
}

.box {
  position: relative;
}

.post-stats {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 18px;
}

.card .post-content {
  min-height: 200px;
  padding: 80px 20px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}

.responsive-img {
  max-width: 100%; /* 최대 너비를 100%로 설정 */
  height: auto; /* 비율을 유지하며 자동으로 높이 조절 */
  cursor: pointer; /* 클릭 가능하게 표시 */
}

.card .button-box {
  position: relative;
  margin-top: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
}

.comment-form {
  margin-top: 3rem;
}

.comment-form h4 {
  margin-bottom: 1rem;
}

textarea {
  width: 100%;
  min-height: 4rem;
  font-size: 17px;
  padding: 0.7rem;
}

.flex {
  display: flex;
  gap: 10px;
}

.comments-section .button-main {
  border-color: #fee500;
  width: 180px;
  height: 6rem;
}

.comments-section .list-group li {
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-top: 1px dashed #eee;
}

.comments-section .list-group li:first-child {
  border-top: none;
}

.comments-section .list-group li p {
  font-size: 18px;
}

.comments-section .list-group li p span.badge {
  display: inline-block;
  height: 20px;
  line-height: 19px;
  padding: 0 10px;
  border: 1px solid #4567ad;
  border-radius: 10px;
  background: #fff;
  font-size: 14px;
  color: #4567ad;
  vertical-align: middle;
  text-align: center;
  font-weight: 600;
  margin-right: 5px;
}

.comments-section .list-group li p.margin-bottom {
  margin-bottom: 8px;
}

.comments-section .list-group li p.text-muted {
  font-size: 13px;
}
</style>
