import { apiRequest, ENDPOINTS, HTTP_METHODS, getHeaders } from "./apiConfig"

export const journalService = {
  // Get all journals
  getJournals: async (token) => {
    return await apiRequest(ENDPOINTS.JOURNALS, {
      method: HTTP_METHODS.GET,
      headers: getHeaders(token),
    })
  },

  // Get journal by ID
  getJournalById: async (id, token) => {
    return await apiRequest(ENDPOINTS.JOURNAL_BY_ID(id), {
      method: HTTP_METHODS.GET,
      headers: getHeaders(token),
    })
  },

  // Create new journal
  createJournal: async (journalData, token) => {
    const wordCount = journalData.content ? journalData.content.trim().split(/\s+/).length : 0

    return await apiRequest(ENDPOINTS.JOURNALS, {
      method: HTTP_METHODS.POST,
      headers: getHeaders(token),
      body: JSON.stringify({
        ...journalData,
        wordCount,
      }),
    })
  },

  // Update journal
  updateJournal: async (id, journalData, token) => {
    const wordCount = journalData.content ? journalData.content.trim().split(/\s+/).length : 0

    return await apiRequest(ENDPOINTS.JOURNAL_BY_ID(id), {
      method: HTTP_METHODS.PUT,
      headers: getHeaders(token),
      body: JSON.stringify({
        ...journalData,
        wordCount,
      }),
    })
  },

  // Delete journal
  deleteJournal: async (id, token) => {
    return await apiRequest(ENDPOINTS.JOURNAL_BY_ID(id), {
      method: HTTP_METHODS.DELETE,
      headers: getHeaders(token),
    })
  },

  // Get achievements related to journals
  getAchievements: async (token) => {
    const ACHIEVEMENTS_ENDPOINT = "/journals/achievements"  // Adjust if different
    return await apiRequest(ACHIEVEMENTS_ENDPOINT, {
      method: HTTP_METHODS.GET,
      headers: getHeaders(token),
    })
  },

// Get statistics 

  getStatistics: async (token) => {
    const STATISTICS_ENDPOINT = "/ journals/stats"  // Adjust if your endpoint differs
    return await apiRequest(STATISTICS_ENDPOINT, {
      method: HTTP_METHODS.GET,
      headers: getHeaders(token),
    })
  },
}