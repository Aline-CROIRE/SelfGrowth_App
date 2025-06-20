// src/screens/admin/ContentModerationScreen.js

"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import { globalStyles } from "../../styles/globalStyles"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import EmptyState from "../../components/common/EmptyState"
import moderationService from "../../services/moderationService"

const ContentModerationScreen = ({ navigation }) => {
  const { colors } = useTheme()
  const { token } = useAuth()
  const [content, setContent] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState("pending")

  useEffect(() => {
    loadContent()
  }, [selectedFilter])

  const loadContent = async () => {
    try {
      setIsLoading(true)
      const response = await moderationService.getContentForModeration(token, selectedFilter)
      setContent(response.data.content)
    } catch (error) {
      console.error("Error loading content:", error)
      Alert.alert("Error", "Failed to load content for moderation")
    } finally {
      setIsLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadContent()
    setRefreshing(false)
  }

  const handleContentAction = (contentItem, action) => {
    Alert.alert(
      `${action} Content`,
      `Are you sure you want to ${action.toLowerCase()} this ${contentItem.type}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: action,
          style: action === "Reject" || action === "Remove" ? "destructive" : "default",
          onPress: () => performContentAction(contentItem.id, action),
        },
      ]
    )
  }

  const performContentAction = async (contentId, action) => {
    try {
      await moderationService.performActionOnContent(token, contentId, action)
      Alert.alert("Success", `Content ${action.toLowerCase()}ed successfully`)
      loadContent()
    } catch (error) {
      console.error("Action Error:", error)
      Alert.alert("Error", `Failed to ${action.toLowerCase()} content`)
    }
  }

  const filters = [
    { id: "pending", name: "Pending", icon: "time-outline", color: colors.warning.main },
    { id: "reported", name: "Reported", icon: "flag-outline", color: colors.error.main },
    { id: "approved", name: "Approved", icon: "checkmark-circle-outline", color: colors.success.main },
    { id: "rejected", name: "Rejected", icon: "close-circle-outline", color: colors.neutral.gray600 },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return colors.warning.main
      case "reported": return colors.error.main
      case "approved": return colors.success.main
      case "rejected": return colors.neutral.gray600
      default: return colors.text.secondary
    }
  }

  const getContentTypeIcon = (type) => {
    switch (type) {
      case "post": return "library-outline"
      case "journal": return "book-outline"
      case "goal": return "flag-outline"
      case "comment": return "chatbubble-outline"
      default: return "document-outline"
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <View style={[globalStyles.container, { backgroundColor: colors.background.primary }]}>/*... All existing UI elements from your code here */</View>
  )
}

export default ContentModerationScreen