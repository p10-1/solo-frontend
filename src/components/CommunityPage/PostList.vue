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
          {{ post.title }}
          <span class="text-muted ml-2">[{{ post.comments?.length || 0 }}]</span>
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
defineProps({
  posts: Array
})

defineEmits(['post-click'])
</script>

