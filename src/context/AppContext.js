"use client"

// 🧠 ENHANCED APP CONTEXT - Multi-user support with proper authentication
import { createContext, useContext, useReducer, useEffect } from "react"
import { UserDatabase, createDemoData } from "../utils/userDatabase"

// 🎯 INITIAL STATE - Enhanced with user management
const initialState = {
  // User Information
  user: null,
  isAuthenticated: false,
  allUsers: [], // List of all registered users

  // User Preferences
  selectedHobbies: [],
  theme: "default",

  // User Data (specific to current user)
  entries: [],
  goals: [],
  achievements: [],

  // App State
  isLoading: true,
  isInitialized: false,
  currentScreen: "Welcome",

  // Statistics (calculated for current user)
  stats: {
    totalEntries: 0,
    currentStreak: 0,
    longestStreak: 0,
    goalsCompleted: 0,
    totalWords: 0,
    joinDate: null,
  },
}

// 🎬 ACTION TYPES - Enhanced with user management
const ActionTypes = {
  // Authentication
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",

  // User Management
  LOAD_ALL_USERS: "LOAD_ALL_USERS",
  SWITCH_USER: "SWITCH_USER",

  // User Preferences
  SET_HOBBIES: "SET_HOBBIES",
  SET_THEME: "SET_THEME",

  // Journal Operations
  ADD_ENTRY: "ADD_ENTRY",
  UPDATE_ENTRY: "UPDATE_ENTRY",
  DELETE_ENTRY: "DELETE_ENTRY",

  // Goals & Achievements
  ADD_GOAL: "ADD_GOAL",
  UPDATE_GOAL: "UPDATE_GOAL",
  DELETE_GOAL: "DELETE_GOAL",
  COMPLETE_GOAL: "COMPLETE_GOAL",

  // App State
  SET_LOADING: "SET_LOADING",
  SET_INITIALIZED: "SET_INITIALIZED",
  LOAD_USER_DATA: "LOAD_USER_DATA",
  UPDATE_STATS: "UPDATE_STATS",
}

// 📊 ENHANCED STATS CALCULATION - More accurate and comprehensive
const calculateStats = (entries, goals) => {
  const stats = {
    totalEntries: entries.length,
    currentStreak: 0,
    longestStreak: 0,
    goalsCompleted: goals.filter((goal) => goal.completed).length,
    totalWords: 0,
    joinDate: null,
  }

  // Calculate total words
  stats.totalWords = entries.reduce((total, entry) => {
    return total + (entry.content ? entry.content.split(" ").length : 0)
  }, 0)

  // Calculate writing streaks
  if (entries.length > 0) {
    const sortedEntries = entries.map((entry) => new Date(entry.createdAt)).sort((a, b) => b - a)

    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 1

    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // Check current streak
    const latestEntry = sortedEntries[0]
    const isToday = latestEntry.toDateString() === today.toDateString()
    const isYesterday = latestEntry.toDateString() === yesterday.toDateString()

    if (isToday || isYesterday) {
      currentStreak = 1

      for (let i = 1; i < sortedEntries.length; i++) {
        const currentDate = sortedEntries[i]
        const previousDate = sortedEntries[i - 1]
        const dayDiff = Math.floor((previousDate - currentDate) / (1000 * 60 * 60 * 24))

        if (dayDiff === 1) {
          currentStreak++
        } else {
          break
        }
      }
    }

    // Calculate longest streak
    for (let i = 1; i < sortedEntries.length; i++) {
      const currentDate = sortedEntries[i]
      const previousDate = sortedEntries[i - 1]
      const dayDiff = Math.floor((previousDate - currentDate) / (1000 * 60 * 60 * 24))

      if (dayDiff === 1) {
        tempStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak)

    stats.currentStreak = currentStreak
    stats.longestStreak = longestStreak
  }

  return stats
}

// 🎭 ENHANCED REDUCER - Handles user management
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_SUCCESS:
    case ActionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        entries: action.payload.entries || [],
        goals: action.payload.goals || [],
        selectedHobbies: action.payload.hobbies || [],
        stats: calculateStats(action.payload.entries || [], action.payload.goals || []),
      }

    case ActionTypes.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
        isInitialized: true,
        allUsers: state.allUsers, // Keep the users list
      }

    case ActionTypes.LOAD_ALL_USERS:
      return {
        ...state,
        allUsers: action.payload,
      }

    case ActionTypes.SET_HOBBIES:
      return {
        ...state,
        selectedHobbies: action.payload,
      }

    case ActionTypes.ADD_ENTRY:
      const newEntry = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        userId: state.user?.id,
      }
      const updatedEntries = [newEntry, ...state.entries]
      return {
        ...state,
        entries: updatedEntries,
        stats: calculateStats(updatedEntries, state.goals),
      }

    case ActionTypes.UPDATE_ENTRY:
      const updatedEntriesAfterUpdate = state.entries.map((entry) =>
        entry.id === action.payload.id ? { ...entry, ...action.payload, updatedAt: new Date().toISOString() } : entry,
      )
      return {
        ...state,
        entries: updatedEntriesAfterUpdate,
        stats: calculateStats(updatedEntriesAfterUpdate, state.goals),
      }

    case ActionTypes.DELETE_ENTRY:
      const filteredEntries = state.entries.filter((entry) => entry.id !== action.payload)
      return {
        ...state,
        entries: filteredEntries,
        stats: calculateStats(filteredEntries, state.goals),
      }

    case ActionTypes.ADD_GOAL:
      const newGoal = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        completed: false,
        userId: state.user?.id,
      }
      const updatedGoals = [...state.goals, newGoal]
      return {
        ...state,
        goals: updatedGoals,
        stats: calculateStats(state.entries, updatedGoals),
      }

    case ActionTypes.UPDATE_GOAL:
      const updatedGoalsAfterUpdate = state.goals.map((goal) =>
        goal.id === action.payload.id ? { ...goal, ...action.payload, updatedAt: new Date().toISOString() } : goal,
      )
      return {
        ...state,
        goals: updatedGoalsAfterUpdate,
        stats: calculateStats(state.entries, updatedGoalsAfterUpdate),
      }

    case ActionTypes.DELETE_GOAL:
      const filteredGoals = state.goals.filter((goal) => goal.id !== action.payload)
      return {
        ...state,
        goals: filteredGoals,
        stats: calculateStats(state.entries, filteredGoals),
      }

    case ActionTypes.COMPLETE_GOAL:
      const completedGoals = state.goals.map((goal) =>
        goal.id === action.payload ? { ...goal, completed: true, completedAt: new Date().toISOString() } : goal,
      )
      return {
        ...state,
        goals: completedGoals,
        stats: calculateStats(state.entries, completedGoals),
      }

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      }

    case ActionTypes.SET_INITIALIZED:
      return {
        ...state,
        isInitialized: action.payload,
      }

    case ActionTypes.LOAD_USER_DATA:
      return {
        ...state,
        ...action.payload,
        stats: calculateStats(action.payload.entries || [], action.payload.goals || []),
      }

    default:
      return state
  }
}

// 🌟 CREATE CONTEXT
const AppContext = createContext()

// 🎯 ENHANCED CONTEXT PROVIDER
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // 🚀 INITIALIZE APP - Load users and restore session
  useEffect(() => {
    const initializeApp = async () => {
      console.log("🚀 Initializing SelfGrow App with user management...")
      dispatch({ type: ActionTypes.SET_LOADING, payload: true })

      try {
        // Load all registered users
        const allUsers = await UserDatabase.getAllUsers()
        dispatch({ type: ActionTypes.LOAD_ALL_USERS, payload: allUsers })

        // Check for current user session
        const currentUser = await UserDatabase.getCurrentUser()

        if (currentUser) {
          // Load user-specific data
          const [entries, goals, hobbies] = await Promise.all([
            UserDatabase.loadUserData(currentUser.id, "entries"),
            UserDatabase.loadUserData(currentUser.id, "goals"),
            UserDatabase.loadUserData(currentUser.id, "hobbies"),
          ])

          dispatch({
            type: ActionTypes.LOGIN_SUCCESS,
            payload: {
              user: currentUser,
              entries: entries || [],
              goals: goals || [],
              hobbies: hobbies || [],
            },
          })

          console.log(`✅ Session restored for user: ${currentUser.name}`)
        }
      } catch (error) {
        console.error("❌ Error initializing app:", error)
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false })
        dispatch({ type: ActionTypes.SET_INITIALIZED, payload: true })
      }
    }

    initializeApp()
  }, [])

  // 💾 AUTO-SAVE USER DATA - Save when data changes
  useEffect(() => {
    if (state.isInitialized && state.user) {
      UserDatabase.saveUserData(state.user.id, "entries", state.entries)
    }
  }, [state.entries, state.isInitialized, state.user])

  useEffect(() => {
    if (state.isInitialized && state.user) {
      UserDatabase.saveUserData(state.user.id, "goals", state.goals)
    }
  }, [state.goals, state.isInitialized, state.user])

  useEffect(() => {
    if (state.isInitialized && state.user) {
      UserDatabase.saveUserData(state.user.id, "hobbies", state.selectedHobbies)
    }
  }, [state.selectedHobbies, state.isInitialized, state.user])

  // 🎯 ENHANCED ACTION CREATORS
  const actions = {
    // Authentication with proper user management
    login: async (email, password) => {
      try {
        const user = await UserDatabase.authenticateUser(email, password)

        // Load user-specific data
        const [entries, goals, hobbies] = await Promise.all([
          UserDatabase.loadUserData(user.id, "entries"),
          UserDatabase.loadUserData(user.id, "goals"),
          UserDatabase.loadUserData(user.id, "hobbies"),
        ])

        // Set as current user
        await UserDatabase.setCurrentUser(user)

        dispatch({
          type: ActionTypes.LOGIN_SUCCESS,
          payload: {
            user,
            entries: entries || [],
            goals: goals || [],
            hobbies: hobbies || [],
          },
        })

        console.log(`✅ User logged in: ${user.name}`)
        return { success: true, user }
      } catch (error) {
        console.error("❌ Login error:", error)
        return { success: false, error: error.message }
      }
    },

    register: async (userData) => {
      try {
        const user = await UserDatabase.registerUser(userData)

        // Create demo data for new user
        const demoData = createDemoData()

        // Save demo data
        await Promise.all([
          UserDatabase.saveUserData(user.id, "entries", demoData.entries),
          UserDatabase.saveUserData(user.id, "goals", demoData.goals),
          UserDatabase.saveUserData(user.id, "hobbies", userData.hobbies || []),
        ])

        // Set as current user
        await UserDatabase.setCurrentUser(user)

        dispatch({
          type: ActionTypes.REGISTER_SUCCESS,
          payload: {
            user,
            entries: demoData.entries,
            goals: demoData.goals,
            hobbies: userData.hobbies || [],
          },
        })

        console.log(`✅ User registered: ${user.name}`)
        return { success: true, user }
      } catch (error) {
        console.error("❌ Registration error:", error)
        return { success: false, error: error.message }
      }
    },

    logout: async () => {
      await UserDatabase.clearUserSession()
      dispatch({ type: ActionTypes.LOGOUT })
      console.log("✅ User logged out")
    },

    // Demo login with sample data
    loginDemo: async () => {
      const demoUser = {
        id: "demo_user_123",
        name: "Alex Demo",
        email: "demo@selfgrow.app",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date().toISOString(),
      }

      const demoData = createDemoData()

      await UserDatabase.setCurrentUser(demoUser)

      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: {
          user: demoUser,
          entries: demoData.entries,
          goals: demoData.goals,
          hobbies: ["art", "reading", "music"],
        },
      })

      return { success: true, user: demoUser }
    },

    // Data operations (same as before)
    setHobbies: (hobbies) => {
      dispatch({ type: ActionTypes.SET_HOBBIES, payload: hobbies })
    },

    addEntry: (entryData) => {
      dispatch({ type: ActionTypes.ADD_ENTRY, payload: entryData })
    },

    updateEntry: (entryData) => {
      dispatch({ type: ActionTypes.UPDATE_ENTRY, payload: entryData })
    },

    deleteEntry: (entryId) => {
      dispatch({ type: ActionTypes.DELETE_ENTRY, payload: entryId })
    },

    addGoal: (goalData) => {
      dispatch({ type: ActionTypes.ADD_GOAL, payload: goalData })
    },

    updateGoal: (goalData) => {
      dispatch({ type: ActionTypes.UPDATE_GOAL, payload: goalData })
    },

    deleteGoal: (goalId) => {
      dispatch({ type: ActionTypes.DELETE_GOAL, payload: goalId })
    },

    completeGoal: (goalId) => {
      dispatch({ type: ActionTypes.COMPLETE_GOAL, payload: goalId })
    },

    setLoading: (loading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading })
    },
  }

  return <AppContext.Provider value={{ state, actions }}>{children}</AppContext.Provider>
}

// 🎯 CUSTOM HOOK
export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}

export default AppContext
