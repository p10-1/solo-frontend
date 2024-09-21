<template>
  <table class="table">
    <thead>
      <tr>
        <th>번호</th>
        <th>제목</th>
        <th>작성자</th>
        <th>작성일</th>
        <th>조회수</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="post in posts"
        :key="post.id"
        @click="$emit('post-click', post)"
        style="cursor: pointer"
      >
        <td>{{ post.id }}</td>
        <td>
          {{ getPostTitle(post.title) }}
          <span class="text-muted ml-2">[{{ getCommentCount(post) }}]</span>
          <span v-if="post.likes" class="text-success ml-2">👍 {{ post.likes }}</span>
        </td>
        <td>{{ post.author }}</td>
        <td>{{ post.date }}</td>
        <td>{{ post.views }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  posts: Array
})

defineEmits(['post-click'])

function getPostTitle(title) {
  try {
    const parsedTitle = JSON.parse(title)
    return parsedTitle.title || '제목 없음'
  } catch (e) {
    return title || '제목 없음'
  }
}

function getCommentCount(post) {
  return post.comments ? (Array.isArray(post.comments) ? post.comments.length : post.comments) : 0
}
</script>
