<template>
  <div class="container" v-if="board">
    <div class="board-detail">
      <div>
        <h2 class="title">{{ board.title }}</h2>
        <div class="box">
          <dl class="card-text">
            <dt>작성자:</dt>
            <dd class="badge">{{ board.userName }}</dd>
            <dt>작성일:</dt>
            <dd class="text-muted">{{ moment(board.regDate).format('YYYY-MM-DD HH:mm:ss') }}</dd>
          </dl>
          <ul class="post-stats">
            <i class="fa-solid fa-heart"></i>
            <span class="badge">{{ board.likes }}</span>
            <i class="fa-solid fa-comment"></i>
            <span class="badge">{{ board.comments }}</span>
            <i class="fa-solid fa-user"></i>
            <span class="badge">{{ board.views }}</span>
          </ul>
        </div>
        <div class="post-content margin-top-1rem">
          <div>{{ board.content }}</div>
          <div v-if="board.attaches && board.attaches.length">
            <ul>
              <li v-for="attach in board.attaches" :key="attach.attachmentNo">
                <img
                  v-if="attach.filename.endsWith('.jpg') || attach.filename.endsWith('.png')"
                  :src="`http://localhost:9000/api/board/download/${attach.attachmentNo}`"
                  alt="첨부파일 미리보기"
                  style="max-width: 100%; height: auto"
                />
              </li>
            </ul>
          </div>
        </div>
        <div class="button-box">
          <button @click="increaseLikes" class="button-main">
            <i class="fa-solid fa-heart"></i> 좋아요
          </button>
          <div v-if="isAuthor" class="">
            <button @click="goToUpdate" class="button-sub">수정</button>
            <button @click="deleteBoardConfirm" class="button-sub margin-left-1rem btn-danger">
              삭제
            </button>
          </div>
          <button @click="goBack" class="button-sub"><i class="fa-solid fa-reply"></i> 뒤로</button>
        </div>
      </div>
    </div>

    <!-- 댓글 리스트 -->
    <div class="comments-section">
      <h2 class="title margin-top-3rem">댓글</h2>
      <div v-if="comments && comments.length">
        <ul>
          <li v-for="comment in comments" :key="comment.commentNo">
            <dl>
              <dt>
                <span class="badge">{{ comment.userName }}</span>
              </dt>
              <dd>
                {{ comment.commentText }}
                <div class="text-muted">
                  {{ moment(comment.regDate).format('YYYY-MM-DD HH:mm:ss') }}
                </div>
              </dd>
            </dl>
          </li>
        </ul>
      </div>
      <div v-else class="text-muted">
        <div>댓글이 없습니다.</div>
      </div>

      <div class="comment-form">
        <h2 class="title margin-top-3rem">댓글 작성</h2>
        <div class="flex">
          <textarea
            v-model="commentText"
            placeholder="댓글을 입력하세요..."
            rows="3"
            class="form-control"
          ></textarea>
          <button @click="submitComment" class="button-main">댓글 작성</button>
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

.board-detail .box {
  position: relative;
}
.post-stats {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 18px;
  color: #cfc6fd;
}

.board-detail .post-content {
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

.board-detail .button-box {
  position: relative;
  margin-top: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 댓글 */
.comments-section ul li {
  font-size: 18px;
  padding: 0.8rem;
  border-top: 1px dashed #e4deff;
}
.comments-section ul li:first-child {
  border-top: none;
}

.comments-section dt {
  width: 130px;
  display: inline-block;
  vertical-align: top;
  word-wrap: break-word;
  padding: 0 1rem;
}
.comments-section dt span.badge {
  height: 20px;
  line-height: 19px;
  padding: 0 10px;
  border-radius: 10px;
  background-color: #7d64da;
  font-size: 14px;
  color: #fff !important;
  vertical-align: middle;
  text-align: center;
  font-weight: 600;
  margin-right: 5px;
}
.comments-section dd {
  display: inline-block;
  margin-bottom: 0;
  padding: 1.7rem 1.5rem;
  background-color: #f3f3ff;
  border-radius: 0px 28px 28px 28px;
  width: calc(100% - 130px);
}

.comments-section .text-muted {
  font-size: 15px;
  margin-top: 1rem;
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
</style>
