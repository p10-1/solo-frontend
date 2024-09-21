<template>
  <table class="table">
    <thead>
      <tr>
        <th>번호</th>
        <th>제목</th>
        <th>작성자</th>
        <th>작성일</th>
        <th>조회수</th>
        <th>댓글</th>
        <th>좋아요</th>
      </tr>
    </thead>
    <tbody>
      <!-- 게시물이 있을 때 -->
      <template v-if="posts && posts.length > 0">
        <tr
          v-for="(post, index) in posts"
          :key="post.id || index"
          @click="$emit('post-click', post)"
          style="cursor: pointer"
        >
          <td>{{ index + 1 }}</td>
          <!-- 번호는 index 값으로 표시 -->
          <td>{{ post.title }}</td>
          <td>{{ post.author }}</td>
          <td>{{ formatDate(post.date) }}</td>
          <td>{{ post.views }}</td>
          <td>{{ post.comments?.length || 0 }}</td>
          <!-- 댓글 개수 -->
          <td>{{ post.likes || 0 }}</td>
          <!-- 좋아요 개수 -->
        </tr>
      </template>
      <!-- 게시물이 없을 때 -->
      <tr v-else>
        <td colspan="7" class="text-center">게시물이 없습니다.</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  posts: {
    type: Array,
    default: () => [] // 기본값을 빈 배열로 설정하여 안전하게 처리
  }
})

defineEmits(['post-click'])

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR')
}
</script>
