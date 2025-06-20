// src/services/userService.js

import { API_CONFIG, createApiUrl } from "./apiConfig"

const ERROR_MESSAGES = {
  NETWORK: "Network error. Please check your connection.",
  DEFAULT: "An unexpected error occurred.",
}

class UserService {
  /**
   * Private method to handle all API requests
   */
  async _makeRequest({ endpoint, method = "GET", token = null, body = null, params = null }) {
    try {
      const headers = { ...API_CONFIG.HEADERS }
      if (token) headers["Authorization"] = `Bearer ${token}`

      const config = { method, headers }

      if (body) config.body = JSON.stringify(body)

      let url = createApiUrl(endpoint)

      if (params) {
        Object.keys(params).forEach(
          (key) => (params[key] == null || params[key] === "") && delete params[key]
        )
        const queryParams = new URLSearchParams(params).toString()
        if (queryParams) url += `?${queryParams}`
      }

      console.debug(`API Request: ${method} ${url}`)

      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw {
          message: data.message || `Request failed with status ${response.status}`,
          status: response.status,
        }
      }

      return data
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error)
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT)
    }
  }

  // --- Super Admin Methods ---

  getAllUsers(token, params = {}) {
    return this._makeRequest({
      endpoint: "/api/super-admin/users",
      token,
      params,
    })
  }

  getUserById(userId, token) {
    return this._makeRequest({
      endpoint: `/api/super-admin/users/${userId}`,
      token,
    })
  }

  getUserStats(token) {
    return this._makeRequest({
      endpoint: "/api/super-admin/statistics",
      token,
    })
  }

  createUser(userData, token) {
    return this._makeRequest({
      endpoint: "/api/super-admin/users",
      method: "POST",
      token,
      body: userData,
    })
  }

  updateUser(userId, userData, token) {
    return this._makeRequest({
      endpoint: `/api/super-admin/users/${userId}`,
      method: "PUT",
      token,
      body: userData,
    })
  }

// NEW, CORRECT SECTION IN userService.js

  /**
   * Disables (suspends) or enables (activates) a user account.
   * This single function calls the PUT /api/super-admin/users/{id}/disable endpoint.
   * @param {string} userId - The ID of the user.
   * @param {boolean} disabled - `true` to disable (suspend), `false` to enable (activate).
   * @param {string} token - The super admin's auth token.
   * @returns {Promise<object>} The success response.
   */
  setUserDisabledStatus(userId, disabled, token) {
    return this._makeRequest({
      endpoint: `/api/super-admin/users/${userId}/disable`,
      method: "PUT",
      token,
      body: { disabled }, // The backend expects a 'disabled' boolean in the body
    });
  }
  activateUser(userId, token) {
    return this._makeRequest({
      endpoint: `/api/super-admin/users/${userId}/activate`,
      method: "PUT",
      token,
    })
  }

  deleteUser(userId, token) {
    return this._makeRequest({
      endpoint: `/api/super-admin/users/${userId}`,
      method: "DELETE",
      token,
    })
  }

  contactAdmin(message, email) {
    return this._makeRequest({
      endpoint: "/api/contact-admin",
      method: "POST",
      body: { message, email },
    })
  }
}

export const userService = new UserService()
