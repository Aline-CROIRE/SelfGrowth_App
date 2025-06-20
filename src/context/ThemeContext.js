"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { colors } from "../styles/colors"
import { useAuth } from "./AuthContext"

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth()
  const [selectedHobby, setSelectedHobby] = useState("default")

  useEffect(() => {
    if (user && user.hobbies && user.hobbies.length > 0) {
      setSelectedHobby(user.hobbies[0])
    }
  }, [user])

  const getHobbyColor = (hobby = selectedHobby) => {
    return colors.hobbies[hobby] || colors.hobbies.default
  }

  const getHobbyGradient = (hobby = selectedHobby) => {
    const baseColor = getHobbyColor(hobby)
    // Create a lighter version for gradient
    return [baseColor, `${baseColor}80`]
  }

  const value = {
    colors,
    selectedHobby,
   setSelectedHobby,
    getHobbyColor,
    getHobbyGradient,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
