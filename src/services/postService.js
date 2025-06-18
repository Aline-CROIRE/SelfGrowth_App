import { API_CONFIG, ENDPOINTS, createApiUrl, createAuthHeaders } from "./apiConfig"

class PostService {
  async getPosts(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString()
      const url = queryParams
        ? `${createApiUrl(ENDPOINTS.POSTS.LIST)}?${queryParams}`
        : createApiUrl(ENDPOINTS.POSTS.LIST)

      const response = await fetch(url, {
        method: "GET",
        headers: API_CONFIG.HEADERS,
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Get posts error:", error)
      throw new Error("Failed to fetch posts")
    }
  }

  async getPost(postId) {
    try {
      const response = await fetch(createApiUrl(ENDPOINTS.POSTS.GET(postId)), {
        method: "GET",
        headers: API_CONFIG.HEADERS,
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Get post error:", error)
      throw new Error("Failed to fetch post")
    }
  }

  async getPostComments(postId) {
    try {
      const response = await fetch(createApiUrl(`${ENDPOINTS.POSTS.GET(postId)}/comments`), {
        method: "GET",
        headers: API_CONFIG.HEADERS,
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Get post comments error:", error)
      throw new Error("Failed to fetch post comments")
    }
  }

  async createPost(postData, token) {
    try {
      const response = await fetch(createApiUrl(ENDPOINTS.POSTS.CREATE), {
        method: "POST",
        headers: createAuthHeaders(token),
        body: JSON.stringify(postData),
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Create post error:", error)
      throw new Error("Failed to create post")
    }
  }

  async updatePost(postId, postData, token) {
    try {
      const response = await fetch(createApiUrl(ENDPOINTS.POSTS.UPDATE(postId)), {
        method: "PUT",
        headers: createAuthHeaders(token),
        body: JSON.stringify(postData),
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Update post error:", error)
      throw new Error("Failed to update post")
    }
  }

  async deletePost(postId, token) {
    try {
      const response = await fetch(createApiUrl(ENDPOINTS.POSTS.DELETE(postId)), {
        method: "DELETE",
        headers: createAuthHeaders(token),
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Delete post error:", error)
      throw new Error("Failed to delete post")
    }
  }

  async addComment(postId, commentData, token) {
    try {
      const response = await fetch(createApiUrl(ENDPOINTS.POSTS.COMMENT(postId)), {
        method: "POST",
        headers: createAuthHeaders(token),
        body: JSON.stringify(commentData),
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Add comment error:", error)
      throw new Error("Failed to add comment")
    }
  }

  async likePost(postId, token) {
    try {
      const response = await fetch(createApiUrl(ENDPOINTS.POSTS.LIKE(postId)), {
        method: "POST",
        headers: createAuthHeaders(token),
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Like post error:", error)
      throw new Error("Failed to like post")
    }
  }

  // AI-powered content generation
  async generatePostContent(prompt, token) {
    try {
      const response = await fetch(createApiUrl("/api/ai/generate-content"), {
        method: "POST",
        headers: createAuthHeaders(token),
        body: JSON.stringify({ prompt, type: "blog_post" }),
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Generate content error:", error)
      throw new Error("Failed to generate content")
    }
  }

  async improveContent(content, token) {
    try {
      const response = await fetch(createApiUrl("/api/ai/improve-content"), {
        method: "POST",
        headers: createAuthHeaders(token),
        body: JSON.stringify({ content }),
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Improve content error:", error)
      throw new Error("Failed to improve content")
    }
  }
}

export const postService = new PostService()
