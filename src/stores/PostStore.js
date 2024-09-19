import { defineStore } from 'pinia'
import { getPosts, createPost, updatePost, deletePost, likePost, addComment } from '@/api/posts'

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [],
    totalPages: 0
  }),
  actions: {
    async fetchPosts(page) {
      try {
        const response = await getPosts(page)
        this.posts = response.data || []
        this.totalPages = response.totalPages || 0
      } catch (error) {
        console.error('Error fetching posts:', error)
        this.posts = []
        this.totalPages = 0
        throw error
      }
    },
    async createPost(postData) {
      try {
        const newPost = await createPost(postData)
        this.posts.unshift(newPost)
      } catch (error) {
        console.error('Error creating post:', error)
        throw error
      }
    },
    async updatePost(postData) {
      const updatedPost = await updatePost(postData)
      const index = this.posts.findIndex((post) => post.id === updatedPost.id)
      if (index !== -1) {
        this.posts[index] = updatedPost
      }
    },
    async deletePost(postId) {
      await deletePost(postId)
      this.posts = this.posts.filter((post) => post.id !== postId)
    },
    async likePost(postId) {
      const updatedPost = await likePost(postId)
      const index = this.posts.findIndex((post) => post.id === updatedPost.id)
      if (index !== -1) {
        this.posts[index] = updatedPost
      }
    },
    async addComment(postId, commentData) {
      const updatedPost = await addComment(postId, commentData)
      const index = this.posts.findIndex((post) => post.id === updatedPost.id)
      if (index !== -1) {
        this.posts[index] = updatedPost
      }
    }
  }
})
