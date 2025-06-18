"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { authService } from "../services/authService"
import * as Haptics from "expo-haptics"

const AuthContext = createContext()

const initialState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }

    case "LOGOUT_SUCCESS":
      return {
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      }

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }

    case "CLEAR_ERROR":
      return { ...state, error: null }

    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }

    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for existing session on app start
  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      console.log("Checking auth state...")
      const token = await AsyncStorage.getItem("userToken")
      const userData = await AsyncStorage.getItem("userData")

      console.log("Found token:", !!token)
      console.log("Found userData:", !!userData)

      if (token && userData) {
        const user = JSON.parse(userData)
        console.log("Restoring user session:", user.email)

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token },
        })
      } else {
        console.log("No existing session found")
        dispatch({ type: "SET_LOADING", payload: false })
      }
    } catch (error) {
      console.error("Error checking auth state:", error)
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const login = async (email, password) => {
    try {
      console.log("Starting login process...")
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "CLEAR_ERROR" })

      const response = await authService.login(email, password)
      console.log("Login response received:", response.success)

      if (response.success) {
        // Store token and user data
        await AsyncStorage.setItem("userToken", response.data.accessToken)
        await AsyncStorage.setItem("userData", JSON.stringify(response.data.user))

        console.log("Login successful, user stored:", response.data.user.email)

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: response.data.user,
            token: response.data.accessToken,
          },
        })

        return { success: true }
      } else {
        console.log("Login failed:", response.message)
        dispatch({ type: "SET_ERROR", payload: response.message })
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error("Login error:", error)
      const errorMessage = error.message || "Login failed. Please try again."
      dispatch({ type: "SET_ERROR", payload: errorMessage })
      return { success: false, message: errorMessage }
    }
  }

  const register = async (userData) => {
    try {
      console.log("Starting registration process...")
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "CLEAR_ERROR" })

      const response = await authService.register(userData)
      console.log("Registration response:", response.success)

      if (response.success) {
        dispatch({ type: "SET_LOADING", payload: false })
        return { success: true, message: response.message }
      } else {
        dispatch({ type: "SET_ERROR", payload: response.message })
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error("Registration error:", error)
      const errorMessage = error.message || "Registration failed. Please try again."
      dispatch({ type: "SET_ERROR", payload: errorMessage })
      return { success: false, message: errorMessage }
    }
  }

  const logout = async () => {
    try {
      console.log("Starting logout process...")

      // Show loading state
      dispatch({ type: "SET_LOADING", payload: true })

      // Try to call logout API if token exists
      if (state.token) {
        try {
          console.log("Calling logout API...")
          await authService.logout(state.token)
          console.log("Logout API call successful")
        } catch (error) {
          console.log("Logout API call failed, but continuing:", error.message)
        }
      }

      // Clear all stored data
      console.log("Clearing stored data...")
      const keysToRemove = [
        "userToken",
        "userData",
        "refreshToken",
        "emailVerificationStatus",
        "lastEmailSent",
        "emailCooldown",
      ]

      await AsyncStorage.multiRemove(keysToRemove)
      console.log("AsyncStorage cleared")

      // Update state to logged out
      dispatch({ type: "LOGOUT_SUCCESS" })

      // Provide haptic feedback
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      } catch (hapticError) {
        console.log("Haptic feedback failed:", hapticError)
      }

      console.log("Logout completed successfully")
      return { success: true, message: "Logged out successfully" }
    } catch (error) {
      console.error("Logout error:", error)

      // Even if there's an error, still try to clear local data and log out
      try {
        await AsyncStorage.clear()
        dispatch({ type: "LOGOUT_SUCCESS" })
        console.log("Force logout completed")
        return { success: true, message: "Logged out successfully" }
      } catch (clearError) {
        console.error("Failed to clear storage:", clearError)
        // Still dispatch logout to reset state
        dispatch({ type: "LOGOUT_SUCCESS" })
        return { success: true, message: "Logged out successfully" }
      }
    }
  }

  const updateProfile = async (profileData) => {
    try {
      console.log("Updating profile...")
      const response = await authService.updateProfile(profileData, state.token)

      if (response.success) {
        // Update local storage
        await AsyncStorage.setItem("userData", JSON.stringify(response.data.user))

        dispatch({
          type: "UPDATE_USER",
          payload: response.data.user,
        })

        console.log("Profile updated successfully")
        return { success: true }
      } else {
        console.log("Profile update failed:", response.message)
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error("Profile update error:", error)
      return { success: false, message: error.message }
    }
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
