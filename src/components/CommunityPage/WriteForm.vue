<template>
  <div class="write-form">
    <h2>{{ isEditing ? '글 수정' : '글 작성' }}</h2>
    <input v-model="title" placeholder="제목" class="form-control mb-3" />
    <textarea v-model="content" placeholder="내용" class="form-control mb-3" rows="5"></textarea>
    <div class="d-flex justify-content-between">
      <button @click="$emit('cancel')" class="btn btn-secondary">취소</button>
      <button @click="submitPost" class="btn btn-primary">
        {{ isEditing ? '수정' : '작성' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  editingPost: Object,
  isEditing: Boolean
})

const title = ref('')
const content = ref('')

const emit = defineEmits(['submit', 'cancel'])

onMounted(() => {
  if (props.isEditing && props.editingPost) {
    title.value = props.editingPost.title
    content.value = props.editingPost.content
  }
})

const submitPost = () => {
  const postData = {
    title: title.value,
    content: content.value,
    author: 'KB' // 실제로는 로그인한 사용자 정보를 사용해야 합니다
  }

  if (props.isEditing) {
    postData.id = props.editingPost.id
  }

  emit('submit', postData)
  title.value = ''
  content.value = ''
}
</script>
