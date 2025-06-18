"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { useAuth } from "./AuthContext"
import { journalService } from "../services/journalService"
import { goalService } from "../services/goalService"
import { postService } from "../services/postService"

const DataContext = createContext()

const initialState = {
  journals: [],
  goals: [],
  posts: [],
  achievements: [],
  statistics: {
    totalJournals: 0,
    totalGoals: 0,
    completedGoals: 0,
    currentStreak: 0,
    totalWords: 0,
    unlockedAchievements: 0,
    totalAchievements: 12,
    moodCounts: {
      amazing: 0,
      good: 0,
      okay: 0,
      bad: 0,
      terrible: 0,
    },
    weeklyActivity: {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
    },
    uniqueMoods: 0,
    earlyMorningJournals: 0,
    lateNightJournals: 0,
    totalJournalDays: 0,
  },
  isLoading: false,
  error: null,
}

const dataReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_JOURNALS":
      return { ...state, journals: action.payload }

    case "ADD_JOURNAL":
      return { ...state, journals: [action.payload, ...state.journals] }

    case "UPDATE_JOURNAL":
      return {
        ...state,
        journals: state.journals.map((journal) => (journal.id === action.payload.id ? action.payload : journal)),
      }

    case "DELETE_JOURNAL":
      return {
        ...state,
        journals: state.journals.filter((journal) => journal.id !== action.payload),
      }

    case "SET_GOALS":
      return { ...state, goals: action.payload }

    case "ADD_GOAL":
      return { ...state, goals: [action.payload, ...state.goals] }

    case "UPDATE_GOAL":
      return {
        ...state,
        goals: state.goals.map((goal) => (goal.id === action.payload.id ? action.payload : goal)),
      }

    case "DELETE_GOAL":
      return {
        ...state,
        goals: state.goals.filter((goal) => goal.id !== action.payload),
      }

    case "SET_POSTS":
      return { ...state, posts: action.payload }

    case "ADD_POST":
      return { ...state, posts: [action.payload, ...state.posts] }

    case "UPDATE_POST":
      return {
        ...state,
        posts: state.posts.map((post) => (post.id === action.payload.id ? action.payload : post)),
      }

    case "SET_ACHIEVEMENTS":
      return { ...state, achievements: action.payload }

    case "SET_STATISTICS":
      return { ...state, statistics: { ...state.statistics, ...action.payload } }

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false }

    case "CLEAR_ERROR":
      return { ...state, error: null }

    case "CLEAR_DATA":
      return initialState

    default:
      return state
  }
}

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState)
  const { user, token, isAuthenticated } = useAuth()

  // Load data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      loadAllData()
    } else {
      dispatch({ type: "CLEAR_DATA" })
    }
  }, [isAuthenticated, token])

  const loadAllData = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      // Load data in parallel
      const [journalsData, goalsData, postsData, achievementsData, statsData] = await Promise.all([
        journalService.getJournals(token),
        goalService.getGoals(token),
        postService.getPosts(),
        journalService.getAchievements(token),
        journalService.getStatistics(token),
      ])

      if (journalsData.success) {
        dispatch({ type: "SET_JOURNALS", payload: journalsData.data.journals || [] })
      }

      if (goalsData.success) {
        dispatch({ type: "SET_GOALS", payload: goalsData.data.goals || [] })
      }

      if (postsData.success) {
        dispatch({ type: "SET_POSTS", payload: postsData.data.posts || [] })
      }

      if (achievementsData.success) {
        dispatch({ type: "SET_ACHIEVEMENTS", payload: achievementsData.data.achievements || [] })
      }

      if (statsData.success) {
        dispatch({ type: "SET_STATISTICS", payload: statsData.data || {} })
      }

      dispatch({ type: "SET_LOADING", payload: false })
    } catch (error) {
      console.error("Error loading data:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to load data" })
    }
  }

  const loadPosts = async () => {
    try {
      const response = await postService.getPosts()
      if (response.success) {
        dispatch({ type: "SET_POSTS", payload: response.data.posts || [] })
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const loadStatistics = async () => {
    try {
      const response = await journalService.getStatistics(token)
      if (response.success) {
        dispatch({ type: "SET_STATISTICS", payload: response.data || {} })
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const loadPostComments = async (postId) => {
    try {
      const response = await postService.getPostComments(postId)
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  // Journal operations
  const createJournal = async (journalData) => {
    try {
      const response = await journalService.createJournal(journalData, token)

      if (response.success) {
        dispatch({ type: "ADD_JOURNAL", payload: response.data.journal })
        await updateStatistics()
        return { success: true }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const updateJournal = async (journalId, journalData) => {
    try {
      const response = await journalService.updateJournal(journalId, journalData, token)

      if (response.success) {
        dispatch({ type: "UPDATE_JOURNAL", payload: response.data.journal })
        return { success: true }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const deleteJournal = async (journalId) => {
    try {
      const response = await journalService.deleteJournal(journalId, token)

      if (response.success) {
        dispatch({ type: "DELETE_JOURNAL", payload: journalId })
        await updateStatistics()
        return { success: true }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  // Goal operations
  const createGoal = async (goalData) => {
    try {
      const response = await goalService.createGoal(goalData, token)

      if (response.success) {
        dispatch({ type: "ADD_GOAL", payload: response.data.goal })
        await updateStatistics()
        return { success: true }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const updateGoal = async (goalId, goalData) => {
    try {
      const response = await goalService.updateGoal(goalId, goalData, token)

      if (response.success) {
        dispatch({ type: "UPDATE_GOAL", payload: response.data.goal })
        await updateStatistics()
        return { success: true }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const deleteGoal = async (goalId) => {
    try {
      const response = await goalService.deleteGoal(goalId, token)

      if (response.success) {
        dispatch({ type: "DELETE_GOAL", payload: goalId })
        await updateStatistics()
        return { success: true }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  // Blog operations
  const likePost = async (postId) => {
    try {
      const response = await postService.likePost(postId, token)
      if (response.success) {
        // Update the post in the state
        dispatch({
          type: "UPDATE_POST",
          payload: response.data.post,
        })
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const addComment = async (postId, commentData) => {
    try {
      const response = await postService.addComment(postId, commentData, token)
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  // Statistics update
  const updateStatistics = async () => {
    try {
      const response = await journalService.getStatistics(token)
      if (response.success) {
        dispatch({ type: "SET_STATISTICS", payload: response.data })
      }
    } catch (error) {
      console.error("Error updating statistics:", error)
    }
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  const value = {
    ...state,
    createJournal,
    updateJournal,
    deleteJournal,
    createGoal,
    updateGoal,
    deleteGoal,
    loadAllData,
    loadPosts,
    loadStatistics,
    loadPostComments,
    likePost,
    addComment,
    clearError,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
