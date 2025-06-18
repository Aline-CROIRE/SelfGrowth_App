"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { Alert } from "react-native"
import * as Haptics from "expo-haptics"
import { authService } from "../services/authService"

const EmailContext = createContext()

const initialState = {
  emailStatus: {
    verification: {
      sent: false,
      sentAt: null,
      verified: false,
      verifiedAt: null,
      canResend: true,
      resendCooldown: 0,
    },
    passwordReset: {
      sent: false,
      sentAt: null,
      used: false,
      usedAt: null,
      canResend: true,
      resendCooldown: 0,
    },
  },
  isLoading: false,
  error: null,
}

const emailReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false }

    case "CLEAR_ERROR":
      return { ...state, error: null }

    case "EMAIL_SENT":
      return {
        ...state,
        emailStatus: {
          ...state.emailStatus,
          [action.payload.type]: {
            ...state.emailStatus[action.payload.type],
            sent: true,
            sentAt: new Date().toISOString(),
            canResend: false,
            resendCooldown: 60, // 60 seconds cooldown
          },
        },
        isLoading: false,
      }

    case "EMAIL_VERIFIED":
      return {
        ...state,
        emailStatus: {
          ...state.emailStatus,
          verification: {
            ...state.emailStatus.verification,
            verified: true,
            verifiedAt: new Date().toISOString(),
          },
        },
      }

    case "PASSWORD_RESET_USED":
      return {
        ...state,
        emailStatus: {
          ...state.emailStatus,
          passwordReset: {
            ...state.emailStatus.passwordReset,
            used: true,
            usedAt: new Date().toISOString(),
          },
        },
      }

    case "UPDATE_COOLDOWN":
      return {
        ...state,
        emailStatus: {
          ...state.emailStatus,
          [action.payload.type]: {
            ...state.emailStatus[action.payload.type],
            resendCooldown: action.payload.cooldown,
            canResend: action.payload.cooldown === 0,
          },
        },
      }

    case "RESET_EMAIL_STATUS":
      return {
        ...state,
        emailStatus: {
          ...initialState.emailStatus,
          [action.payload.type]: initialState.emailStatus[action.payload.type],
        },
      }

    default:
      return state
  }
}

export const EmailProvider = ({ children }) => {
  const [state, dispatch] = useReducer(emailReducer, initialState)

  // Cooldown timer effect
  useEffect(() => {
    const intervals = []

    // Check verification cooldown
    if (state.emailStatus.verification.resendCooldown > 0) {
      const interval = setInterval(() => {
        dispatch({
          type: "UPDATE_COOLDOWN",
          payload: {
            type: "verification",
            cooldown: Math.max(0, state.emailStatus.verification.resendCooldown - 1),
          },
        })
      }, 1000)
      intervals.push(interval)
    }

    // Check password reset cooldown
    if (state.emailStatus.passwordReset.resendCooldown > 0) {
      const interval = setInterval(() => {
        dispatch({
          type: "UPDATE_COOLDOWN",
          payload: {
            type: "passwordReset",
            cooldown: Math.max(0, state.emailStatus.passwordReset.resendCooldown - 1),
          },
        })
      }, 1000)
      intervals.push(interval)
    }

    return () => intervals.forEach(clearInterval)
  }, [state.emailStatus.verification.resendCooldown, state.emailStatus.passwordReset.resendCooldown])

  const sendVerificationEmail = async (email) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "CLEAR_ERROR" })

      const response = await authService.resendVerificationEmail(email)

      if (response.success) {
        dispatch({ type: "EMAIL_SENT", payload: { type: "verification" } })

        // Show success feedback
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        Alert.alert(
          "📧 Verification Email Sent!",
          `We've sent a verification link to ${email}. Please check your inbox and spam folder.\n\nThe link will expire in 24 hours.`,
          [
            {
              text: "Open Email App",
              onPress: () => {
                // You can add deep linking to email apps here
                console.log("Opening email app...")
              },
            },
            { text: "OK" },
          ],
        )

        return { success: true }
      } else {
        dispatch({ type: "SET_ERROR", payload: response.message })
        return { success: false, message: response.message }
      }
    } catch (error) {
      const errorMessage = error.message || "Failed to send verification email"
      dispatch({ type: "SET_ERROR", payload: errorMessage })
      return { success: false, message: errorMessage }
    }
  }

  const sendPasswordResetEmail = async (email) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "CLEAR_ERROR" })

      const response = await authService.forgotPassword(email)

      if (response.success) {
        dispatch({ type: "EMAIL_SENT", payload: { type: "passwordReset" } })

        // Show success feedback
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        Alert.alert(
          "🔐 Password Reset Email Sent!",
          `We've sent a password reset link to ${email}. Please check your inbox and spam folder.\n\nThe link will expire in 1 hour for security.`,
          [
            {
              text: "Open Email App",
              onPress: () => {
                console.log("Opening email app...")
              },
            },
            { text: "OK" },
          ],
        )

        return { success: true }
      } else {
        dispatch({ type: "SET_ERROR", payload: response.message })
        return { success: false, message: response.message }
      }
    } catch (error) {
      const errorMessage = error.message || "Failed to send password reset email"
      dispatch({ type: "SET_ERROR", payload: errorMessage })
      return { success: false, message: errorMessage }
    }
  }

  const verifyEmail = async (token) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "CLEAR_ERROR" })

      const response = await authService.verifyEmail(token)

      if (response.success) {
        dispatch({ type: "EMAIL_VERIFIED" })

        // Show success feedback
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        Alert.alert(
          "✅ Email Verified Successfully!",
          "Your email has been verified! You can now access all features of SelfGrow.",
          [{ text: "Continue", style: "default" }],
        )

        return { success: true }
      } else {
        dispatch({ type: "SET_ERROR", payload: response.message })
        Alert.alert(
          "❌ Verification Failed",
          response.message || "The verification link is invalid or has expired. Please request a new one.",
          [{ text: "OK" }],
        )
        return { success: false, message: response.message }
      }
    } catch (error) {
      const errorMessage = error.message || "Email verification failed"
      dispatch({ type: "SET_ERROR", payload: errorMessage })
      Alert.alert("❌ Verification Error", errorMessage, [{ text: "OK" }])
      return { success: false, message: errorMessage }
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "CLEAR_ERROR" })

      const response = await authService.resetPassword(token, newPassword)

      if (response.success) {
        dispatch({ type: "PASSWORD_RESET_USED" })

        // Show success feedback
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        Alert.alert(
          "🎉 Password Reset Successful!",
          "Your password has been updated successfully. You can now sign in with your new password.",
          [{ text: "Sign In Now", style: "default" }],
        )

        return { success: true }
      } else {
        dispatch({ type: "SET_ERROR", payload: response.message })
        Alert.alert(
          "❌ Password Reset Failed",
          response.message || "The reset link is invalid or has expired. Please request a new one.",
          [{ text: "OK" }],
        )
        return { success: false, message: response.message }
      }
    } catch (error) {
      const errorMessage = error.message || "Password reset failed"
      dispatch({ type: "SET_ERROR", payload: errorMessage })
      Alert.alert("❌ Reset Error", errorMessage, [{ text: "OK" }])
      return { success: false, message: errorMessage }
    }
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  const resetEmailStatus = (type) => {
    dispatch({ type: "RESET_EMAIL_STATUS", payload: { type } })
  }

  const value = {
    ...state,
    sendVerificationEmail,
    sendPasswordResetEmail,
    verifyEmail,
    resetPassword,
    clearError,
    resetEmailStatus,
  }

  return <EmailContext.Provider value={value}>{children}</EmailContext.Provider>
}

export const useEmail = () => {
  const context = useContext(EmailContext)
  if (!context) {
    throw new Error("useEmail must be used within an EmailProvider")
  }
  return context
}
