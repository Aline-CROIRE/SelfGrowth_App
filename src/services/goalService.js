import { apiRequest, ENDPOINTS, HTTP_METHODS, getHeaders } from "./apiConfig"

export const goalService = {
  // Get all goals
  getGoals: async (token) => {
    return await apiRequest(ENDPOINTS.GOALS, {
      method: HTTP_METHODS.GET,
      headers: getHeaders(token),
    })
  },

  // Get goal by ID
  getGoalById: async (id, token) => {
    return await apiRequest(ENDPOINTS.GOAL_BY_ID(id), {
      method: HTTP_METHODS.GET,
      headers: getHeaders(token),
    })
  },

  // Create new goal
  createGoal: async (goalData, token) => {
    return await apiRequest(ENDPOINTS.GOALS, {
      method: HTTP_METHODS.POST,
      headers: getHeaders(token),
      body: JSON.stringify({
        ...goalData,
        status: "ACTIVE",
        progress: goalData.progress || 0,
      }),
    })
  },

  // Update goal
  updateGoal: async (id, goalData, token) => {
    return await apiRequest(ENDPOINTS.GOAL_BY_ID(id), {
      method: HTTP_METHODS.PUT,
      headers: getHeaders(token),
      body: JSON.stringify(goalData),
    })
  },

  // Delete goal
  deleteGoal: async (id, token) => {
    return await apiRequest(ENDPOINTS.GOAL_BY_ID(id), {
      method: HTTP_METHODS.DELETE,
      headers: getHeaders(token),
    })
  },

  // Update goal progress
  updateGoalProgress: async (id, progress, token) => {
    return await apiRequest(ENDPOINTS.GOAL_BY_ID(id), {
      method: HTTP_METHODS.PATCH,
      headers: getHeaders(token),
      body: JSON.stringify({ progress }),
    })
  },

  // Complete goal
  completeGoal: async (id, token) => {
    return await apiRequest(ENDPOINTS.GOAL_BY_ID(id), {
      method: HTTP_METHODS.PATCH,
      headers: getHeaders(token),
      body: JSON.stringify({
        status: "COMPLETED",
        progress: 100,
        completedAt: new Date().toISOString(),
      }),
    })
  },
}
