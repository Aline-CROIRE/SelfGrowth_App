// 🗄️ USER DATABASE SYSTEM - Manages multiple users and their data
// This file handles user storage, authentication, and data isolation

import AsyncStorage from "@react-native-async-storage/async-storage"

// 🔑 STORAGE KEYS - Organized user data storage
const STORAGE_KEYS = {
  USERS_DATABASE: "@selfgrow_users_database", // All registered users
  CURRENT_USER: "@selfgrow_current_user", // Currently logged in user
  USER_DATA_PREFIX: "@selfgrow_user_data_", // Prefix for user-specific data
}

// 👥 USER DATABASE CLASS - Handles all user operations
export class UserDatabase {
  // 💾 Save data to storage safely
  static async saveToStorage(key, data) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data))
      console.log(`✅ Saved ${key} successfully`)
    } catch (error) {
      console.error(`❌ Error saving ${key}:`, error)
      throw error
    }
  }

  // 📱 Load data from storage safely
  static async loadFromStorage(key) {
    try {
      const data = await AsyncStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error(`❌ Error loading ${key}:`, error)
      return null
    }
  }

  // 👤 Get all registered users
  static async getAllUsers() {
    const users = await this.loadFromStorage(STORAGE_KEYS.USERS_DATABASE)
    return users || []
  }

  // 🔍 Find user by email
  static async findUserByEmail(email) {
    const users = await this.getAllUsers()
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase())
  }

  // ➕ Register new user
  static async registerUser(userData) {
    const users = await this.getAllUsers()

    // Check if user already exists
    const existingUser = users.find((user) => user.email.toLowerCase() === userData.email.toLowerCase())
    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Create new user with unique ID
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...userData,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    }

    // Add to users database
    users.push(newUser)
    await this.saveToStorage(STORAGE_KEYS.USERS_DATABASE, users)

    console.log(`✅ User registered: ${newUser.name} (${newUser.email})`)
    return newUser
  }

  // 🔐 Authenticate user login
  static async authenticateUser(email, password) {
    const user = await this.findUserByEmail(email)

    if (!user) {
      throw new Error("No account found with this email address")
    }

    // In a real app, you'd hash and compare passwords
    // For demo purposes, we'll accept any password for existing users
    console.log(`✅ User authenticated: ${user.name} (${user.email})`)

    // Update last login
    await this.updateUserLastLogin(user.id)

    return user
  }

  // 🕒 Update user's last login time
  static async updateUserLastLogin(userId) {
    const users = await this.getAllUsers()
    const userIndex = users.findIndex((user) => user.id === userId)

    if (userIndex !== -1) {
      users[userIndex].lastLogin = new Date().toISOString()
      await this.saveToStorage(STORAGE_KEYS.USERS_DATABASE, users)
    }
  }

  // 💾 Save user-specific data (entries, goals, etc.)
  static async saveUserData(userId, dataType, data) {
    const key = `${STORAGE_KEYS.USER_DATA_PREFIX}${userId}_${dataType}`
    await this.saveToStorage(key, data)
  }

  // 📱 Load user-specific data
  static async loadUserData(userId, dataType) {
    const key = `${STORAGE_KEYS.USER_DATA_PREFIX}${userId}_${dataType}`
    return await this.loadFromStorage(key)
  }

  // 🗑️ Clear all data for a user (for logout)
  static async clearUserSession() {
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
    console.log("✅ User session cleared")
  }

  // 👤 Set current logged-in user
  static async setCurrentUser(user) {
    await this.saveToStorage(STORAGE_KEYS.CURRENT_USER, user)
  }

  // 👤 Get current logged-in user
  static async getCurrentUser() {
    return await this.loadFromStorage(STORAGE_KEYS.CURRENT_USER)
  }

  // 📊 Get user statistics
  static async getUserStats(userId) {
    const entries = (await this.loadUserData(userId, "entries")) || []
    const goals = (await this.loadUserData(userId, "goals")) || []

    return {
      totalEntries: entries.length,
      totalGoals: goals.length,
      completedGoals: goals.filter((goal) => goal.completed).length,
      totalWords: entries.reduce((sum, entry) => sum + (entry.content?.split(" ").length || 0), 0),
    }
  }
}

// 🎯 DEMO DATA GENERATOR - Creates sample data for demo users
export const createDemoData = () => {
  return {
    entries: [
      {
        id: "demo_entry_1",
        title: "My Growth Journey Begins",
        content:
          "Today I started using SelfGrow to track my personal development. I'm excited to see how this journey unfolds and what I'll learn about myself along the way.",
        mood: "good",
        moodColor: "#FFD93D",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        images: [],
      },
      {
        id: "demo_entry_2",
        title: "Reflection on Goals",
        content:
          "I've been thinking about what I want to achieve this year. Setting clear, actionable goals feels like the right step forward.",
        mood: "amazing",
        moodColor: "#4CAF50",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        images: [],
      },
    ],
    goals: [
      {
        id: "demo_goal_1",
        title: "Read 12 Books This Year",
        description: "Expand my knowledge by reading one book per month",
        category: "personal",
        categoryColor: "#FF6B6B",
        priority: "medium",
        priorityColor: "#FF8E53",
        targetDate: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(),
        completed: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  }
}
