// API Configuration
const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://172.31.243.124:3000" // Development
    : "https://your-production-api.com" // Production

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
}

// HTTP Methods - MISSING EXPORT ADDED
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
}

export const ENDPOINTS = {
  // Add the missing JOURNALS endpoint that journalService expects
  JOURNALS: "/api/journal",
  JOURNAL_BY_ID: (id) => `/api/journal/${id}`,
  
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
    PROFILE: "/api/user/profile",
    CHANGE_PASSWORD: "/api/user/change-password",
    UPLOAD_AVATAR: "/api/user/upload-avatar",
  },
  POSTS: {
    LIST: "/api/posts",
    CREATE: "/api/posts",
    DETAIL: "/api/posts",
    UPDATE: "/api/posts",
    DELETE: "/api/posts",
    LIKE: "/api/posts",
    COMMENT: "/api/posts",
  },
  JOURNAL: {
    LIST: "/api/journal",
    CREATE: "/api/journal",
    DETAIL: "/api/journal",
    UPDATE: "/api/journal",
    DELETE: "/api/journal",
  },
  GOALS: {
    LIST: "/api/goals",
    CREATE: "/api/goals",
    DETAIL: "/api/goals",
    UPDATE: "/api/goals",
    DELETE: "/api/goals",
    COMPLETE: "/api/goals",
  },
  STATISTICS: {
    DASHBOARD: "/api/statistics/dashboard",
    GOALS: "/api/statistics/goals",
    JOURNAL: "/api/statistics/journal",
    POSTS: "/api/statistics/posts",
  },
}

export const createApiUrl = (endpoint) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`
  console.log("API URL:", url) // Debug log
  return url
}

export const createAuthHeaders = (token) => {
  return {
    ...API_CONFIG.HEADERS,
    Authorization: `Bearer ${token}`,
  }
}

// ADD MISSING EXPORTS
// getHeaders - alias for createAuthHeaders to match journalService import
export const getHeaders = (token) => {
  return createAuthHeaders(token)
}

// apiRequest - the main API request function that journalService expects
export const apiRequest = async (endpoint, options = {}) => {
  const url = createApiUrl(endpoint)
  
  // Log the request for debugging
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
    const contentType = response.headers.get('content-type')
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    // Log the response for debugging
    logResponse(url, response, data)

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      data: data,
      status: response.status,
    }
  } catch (error) {
    console.error('API Request failed:', error)
    return {
      success: false,
      message: error.message,
      status: error.status || 500,
    }
  }
}

// Network status helper
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

// Request interceptor for debugging
export const logRequest = (url, options) => {
  console.log("🚀 API Request:", {
    url,
    method: options.method,
    headers: options.headers,
    body: options.body ? JSON.parse(options.body) : null,
  })
}

// Response interceptor for debugging
export const logResponse = (url, response, data) => {
  console.log("📥 API Response:", {
    url,
    status: response.status,
    statusText: response.statusText,
    data,
  })
}