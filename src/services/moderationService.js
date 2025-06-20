const BASE_URL = "https://your-api.com/api/moderation" // replace with your real base URL

const moderationService = {
  async getContentForModeration(token, status) {
    const res = await fetch(`${BASE_URL}?status=${status}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error("Failed to fetch moderation content")
    }

    const data = await res.json()
    return data
  },

  async approveContent(token, contentId) {
    const res = await fetch(`${BASE_URL}/${contentId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error("Failed to approve content")
    }

    return await res.json()
  },

  async rejectContent(token, contentId) {
    const res = await fetch(`${BASE_URL}/${contentId}/reject`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error("Failed to reject content")
    }

    return await res.json()
  },

  async dismissReports(token, contentId) {
    const res = await fetch(`${BASE_URL}/${contentId}/dismiss`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error("Failed to dismiss reports")
    }

    return await res.json()
  },

  async removeContent(token, contentId) {
    const res = await fetch(`${BASE_URL}/${contentId}/remove`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error("Failed to remove content")
    }

    return await res.json()
  },
}

export default moderationService
