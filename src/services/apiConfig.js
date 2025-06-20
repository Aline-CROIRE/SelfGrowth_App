// API Configuration
const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://192.168.1.218:3000" // Local development
    : "https://production-api.com" // Production

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
}

// HTTP Methods
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
}

// Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    ME: "/api/auth/me",
    VERIFY_EMAIL: "/api/auth/verify-email",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
  },
  USER: {
    PROFILE: "/api/users/profile",
    CHANGE_PASSWORD: "/api/users/change-password",
    UPLOAD_AVATAR: "/api/users/upload-avatar",
  },
  POSTS: {
    LIST: "/api/posts",
    CREATE: "/api/posts",
    DETAIL: (id) => `/api/posts/${id}`,
    UPDATE: (id) => `/api/posts/${id}`,
    DELETE: (id) => `/api/posts/${id}`,
    LIKE: (id) => `/api/posts/${id}/like`,
    COMMENT: (id) => `/api/posts/${id}/comment`,
  },
  JOURNAL: {
    LIST: "/api/journals",
    CREATE: "/api/journals",
    DETAIL: (id) => `/api/journals/${id}`,
    UPDATE: (id) => `/api/journals/${id}`,
    DELETE: (id) => `/api/journals/${id}`,
  },
  GOALS: {
    LIST: "/api/goals",
    CREATE: "/api/goals",
    DETAIL: (id) => `/api/goals/${id}`,
    UPDATE: (id) => `/api/goals/${id}`,
    DELETE: (id) => `/api/goals/${id}`,
    COMPLETE: (id) => `/api/goals/${id}/complete`,
  },
  STATISTICS: {
    DASHBOARD: "/api/statistics/dashboard",
    GOALS: "/api/statistics/goals",
    JOURNAL: "/api/statistics/journal",
    POSTS: "/api/statistics/posts",
  },
}

// Build full URL
export const createApiUrl = (endpoint) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`
  console.log("API URL:", url)
  return url
}

// Auth headers
export const createAuthHeaders = (token) => ({
  ...API_CONFIG.HEADERS,
  Authorization: `Bearer ${token}`,
})

// Alias
export const getHeaders = createAuthHeaders

// Make API request
export const apiRequest = async (endpoint, options = {}) => {
  const url = createApiUrl(endpoint)
  logRequest(url, options)

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...API_CONFIG.HEADERS,
        ...options.headers,
      },
    })

    let data
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    logResponse(url, response, data)

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      data,
      status: response.status,
    }
  } catch (error) {
    console.error("API Request failed:", error)
    return {
      success: false,
      message: error.message || "Unknown error",
      status: error.status || 500,
    }
  }
}

// Network status check
export const checkNetworkStatus = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: "GET",
      timeout: 5000,
    })
    return response.ok
  } catch (error) {
    console.error("Network check failed:", error)
    return false
  }
}

// Logging
export const logRequest = (url, options) => {
  console.log("🚀 API Request:", {
    url,
    method: options.method,
    headers: options.headers,
    body: options.body ? safelyParseBody(options.body) : null,
  })
}

export const logResponse = (url, response, data) => {
  console.log("📥 API Response:", {
    url,
    status: response.status,
    statusText: response.statusText,
    data,
  })
}

// Safe body parse
const safelyParseBody = (body) => {
  try {
    return JSON.parse(body)
  } catch (e) {
    return body
  }
}
