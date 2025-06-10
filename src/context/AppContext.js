"use client"

// 🧠 APP CONTEXT - The brain of our application
// Manages user data, hobbies, journal entries, and app state

import { createContext, useContext, useReducer, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

// 🎯 INITIAL STATE - What our app starts with
const initialState = {
  // User Information
  user: null,
  isAuthenticated: false,

  // User Preferences
  selectedHobbies: [],
  theme: "default",

  // Journal Data
  entries: [],
  goals: [],
  achievements: [],

  // App State
  isLoading: false,
  currentScreen: "Welcome",

  // Statistics
  stats: {
    totalEntries: 0,
    currentStreak: 0,
    longestStreak: 0,
    goalsCompleted: 0,
  },
}

// 🎬 ACTION TYPES - What can happen in our app
const ActionTypes = {
  // Authentication
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",

  // User Preferences
  SET_HOBBIES: "SET_HOBBIES",
  SET_THEME: "SET_THEME",

  // Journal Operations
  ADD_ENTRY: "ADD_ENTRY",
  UPDATE_ENTRY: "UPDATE_ENTRY",
  DELETE_ENTRY: "DELETE_ENTRY",

  // Goals & Achievements
  ADD_GOAL: "ADD_GOAL",
  COMPLETE_GOAL: "COMPLETE_GOAL",
  ADD_ACHIEVEMENT: "ADD_ACHIEVEMENT",

  // App State
  SET_LOADING: "SET_LOADING",
  SET_CURRENT_SCREEN: "SET_CURRENT_SCREEN",

  // Data Loading
  LOAD_DATA: "LOAD_DATA",
  UPDATE_STATS: "UPDATE_STATS",
}

// 🎭 REDUCER - How our app state changes
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      }

    case ActionTypes.LOGOUT:
      return {
        ...initialState,
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
      }
      return {
        ...state,
        entries: [newEntry, ...state.entries],
        stats: {
          ...state.stats,
          totalEntries: state.stats.totalEntries + 1,
        },
      }

    case ActionTypes.UPDATE_ENTRY:
      return {
        ...state,
        entries: state.entries.map((entry) =>
          entry.id === action.payload.id ? { ...entry, ...action.payload, updatedAt: new Date().toISOString() } : entry,
        ),
      }

    case ActionTypes.DELETE_ENTRY:
      return {
        ...state,
        entries: state.entries.filter((entry) => entry.id !== action.payload),
        stats: {
          ...state.stats,
          totalEntries: Math.max(0, state.stats.totalEntries - 1),
        },
      }

    case ActionTypes.ADD_GOAL:
      const newGoal = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        completed: false,
      }
      return {
        ...state,
        goals: [...state.goals, newGoal],
      }

    case ActionTypes.COMPLETE_GOAL:
      return {
        ...state,
        goals: state.goals.map((goal) =>
          goal.id === action.payload ? { ...goal, completed: true, completedAt: new Date().toISOString() } : goal,
        ),
        stats: {
          ...state.stats,
          goalsCompleted: state.stats.goalsCompleted + 1,
        },
      }

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      }

    case ActionTypes.LOAD_DATA:
      return {
        ...state,
        ...action.payload,
      }

    default:
      return state
  }
}

// 🌟 CREATE CONTEXT
const AppContext = createContext()

// 🎯 CONTEXT PROVIDER - Wraps our entire app
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // 💾 SAVE DATA TO STORAGE
  const saveToStorage = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error("Error saving to storage:", error)
    }
  }

  // 📱 LOAD DATA FROM STORAGE
  const loadFromStorage = async (key) => {
    try {
      const data = await AsyncStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error("Error loading from storage:", error)
      return null
    }
  }

  // 🚀 INITIALIZE APP - Load saved data when app starts
  useEffect(() => {
    const initializeApp = async () => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true })

      try {
        // Load user data
        const userData = await loadFromStorage("user")
        const hobbiesData = await loadFromStorage("hobbies")
        const entriesData = await loadFromStorage("entries")
        const goalsData = await loadFromStorage("goals")

        if (userData || hobbiesData || entriesData || goalsData) {
          dispatch({
            type: ActionTypes.LOAD_DATA,
            payload: {
              user: userData,
              isAuthenticated: !!userData,
              selectedHobbies: hobbiesData || [],
              entries: entriesData || [],
              goals: goalsData || [],
            },
          })
        }
      } catch (error) {
        console.error("Error initializing app:", error)
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false })
      }
    }

    initializeApp()
  }, [])

  // 💾 AUTO-SAVE - Save important data when it changes
  useEffect(() => {
    if (state.user) {
      saveToStorage("user", state.user)
    }
  }, [state.user])

  useEffect(() => {
    saveToStorage("hobbies", state.selectedHobbies)
  }, [state.selectedHobbies])

  useEffect(() => {
    saveToStorage("entries", state.entries)
  }, [state.entries])

  useEffect(() => {
    saveToStorage("goals", state.goals)
  }, [state.goals])

  // 🎯 ACTION CREATORS - Easy ways to update state
  const actions = {
    // Authentication
    login: (userData) => {
      dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: userData })
    },

    logout: () => {
      AsyncStorage.clear()
      dispatch({ type: ActionTypes.LOGOUT })
    },

    // Hobbies
    setHobbies: (hobbies) => {
      dispatch({ type: ActionTypes.SET_HOBBIES, payload: hobbies })
    },

    // Journal Entries
    addEntry: (entryData) => {
      dispatch({ type: ActionTypes.ADD_ENTRY, payload: entryData })
    },

    updateEntry: (entryData) => {
      dispatch({ type: ActionTypes.UPDATE_ENTRY, payload: entryData })
    },

    deleteEntry: (entryId) => {
      dispatch({ type: ActionTypes.DELETE_ENTRY, payload: entryId })
    },

    // Goals
    addGoal: (goalData) => {
      dispatch({ type: ActionTypes.ADD_GOAL, payload: goalData })
    },

    completeGoal: (goalId) => {
      dispatch({ type: ActionTypes.COMPLETE_GOAL, payload: goalId })
    },

    // App State
    setLoading: (loading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading })
    },
  }

  return <AppContext.Provider value={{ state, actions }}>{children}</AppContext.Provider>
}

// 🎯 CUSTOM HOOK - Easy way to use context
export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}

export default AppContext
