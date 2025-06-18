"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { Appearance, Dimensions } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

const AppContext = createContext()

const initialState = {
  // Theme
  isDarkMode: false,
  colorScheme: "light",
  
  // App settings
  isFirstLaunch: true,
  hasSeenOnboarding: false,
  
  // UI state
  isLoading: false,
  activeTab: "Home",
  
  // Device info
  screenDimensions: Dimensions.get("window"),
  isTablet: false,
  
  // Notifications
  notificationsEnabled: true,
  pushToken: null,
  
  // App version
  version: "1.0.0",
  buildNumber: "1",
}

const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, isDarkMode: action.payload, colorScheme: action.payload ? "dark" : "light" }
    
    case "SET_FIRST_LAUNCH":
      return { ...state, isFirstLaunch: action.payload }
    
    case "SET_ONBOARDING_SEEN":
      return { ...state, hasSeenOnboarding: action.payload }
    
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload }
    
    case "SET_SCREEN_DIMENSIONS":
      return { 
        ...state, 
        screenDimensions: action.payload,
        isTablet: action.payload.width > 768
      }
    
    case "SET_NOTIFICATIONS":
      return { ...state, notificationsEnabled: action.payload }
    
    case "SET_PUSH_TOKEN":
      return { ...state, pushToken: action.payload }
    
    default:
      return state
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    initializeApp()
    setupDimensionListener()
    setupThemeListener()
  }, [])

  const initializeApp = async () => {
    try {
      // Check if first launch
      const hasLaunched = await AsyncStorage.getItem("hasLaunched")
      if (!hasLaunched) {
        await AsyncStorage.setItem("hasLaunched", "true")
        dispatch({ type: "SET_FIRST_LAUNCH", payload: true })
      } else {
        dispatch({ type: "SET_FIRST_LAUNCH", payload: false })
      }

      // Check onboarding status
      const onboardingSeen = await AsyncStorage.getItem("onboardingSeen")
      dispatch({ type: "SET_ONBOARDING_SEEN", payload: onboardingSeen === "true" })

      // Load theme preference
      const savedTheme = await AsyncStorage.getItem("theme")
      if (savedTheme) {
        dispatch({ type: "SET_THEME", payload: savedTheme === "dark" })
      } else {
        // Use system theme
        const systemTheme = Appearance.getColorScheme()
        dispatch({ type: "SET_THEME", payload: systemTheme === "dark" })
      }

      // Load notification settings
      const notificationsEnabled = await AsyncStorage.getItem("notificationsEnabled")
      dispatch({ type: "SET_NOTIFICATIONS", payload: notificationsEnabled !== "false" })

    } catch (error) {
      console.error("Error initializing app:", error)
    }
  }

  const setupDimensionListener = () => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      dispatch({ type: "SET_SCREEN_DIMENSIONS", payload: window })
    })

    return () => subscription?.remove()
  }

  const setupThemeListener = () => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Only auto-change if user hasn't set a preference
      AsyncStorage.getItem("theme").then((savedTheme) => {
        if (!savedTheme) {
          dispatch({ type: "SET_THEME", payload: colorScheme === "dark" })
        }
      })
    })

    return () => subscription?.remove()
  }

  const toggleTheme = async () => {
    const newTheme = !state.isDarkMode
    dispatch({ type: "SET_THEME", payload: newTheme })
    await AsyncStorage.setItem("theme", newTheme ? "dark" : "light")
  }

  const setOnboardingComplete = async () => {
    dispatch({ type: "SET_ONBOARDING_SEEN", payload: true })
    await AsyncStorage.setItem("onboardingSeen", "true")
  }

  const toggleNotifications = async () => {
    const newValue = !state.notificationsEnabled
    dispatch({ type: "SET_NOTIFICATIONS", payload: newValue })
    await AsyncStorage.setItem("notificationsEnabled", newValue.toString())
  }

  const value = {
    ...state,
    toggleTheme,
    setOnboardingComplete,
    toggleNotifications,
    setLoading: (loading) => dispatch({ type: "SET_LOADING", payload: loading }),
    setActiveTab: (tab) => dispatch({ type: "SET_ACTIVE_TAB", payload: tab }),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
