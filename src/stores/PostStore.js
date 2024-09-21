import { defineStore } from 'pinia'
import { getPosts, createPost, getPostById, updatePost } from '@/api/boardApi'

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [],
    totalPages: 0
  }),
  actions: {
    async fetchPosts(page = 1) {
      try {
        const response = await getPosts(page)
        this.posts = response.data
        this.totalPages = response.totalPages
      } catch (error) {
        console.error('Error fetching posts:', error)
        throw error
      }
    },
    async createPost(postData) {
      try {
        await createPost(postData)
        await this.fetchPosts()
      } catch (error) {
        console.error('Error creating post:', error)
        throw error
      }
    },
    async getPostById(id) {
      try {
        return await getPostById(id)
      } catch (error) {
        console.error('Error fetching post by ID:', error)
        throw error
      }
    },
    async likePost(postId) {
      try {
        const post = await this.getPostById(postId)
        post.likes = (post.likes || 0) + 1
        await updatePost(postId, post)
        return post
      } catch (error) {
        console.error('Error liking post:', error)
        throw error
      }
    },
    async addComment(postId, commentData) {
      try {
        const post = await this.getPostById(postId)
        post.comments = post.comments || []
        post.comments.push({
          id: Date.now().toString(),
          ...commentData,
          date: new Date().toISOString()
        })
        await updatePost(postId, post)
        return post
      } catch (error) {
        console.error('Error adding comment:', error)
        throw error
      }
    }
  }
})
