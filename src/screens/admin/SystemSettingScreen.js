"use client"

import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  TextInput,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import { globalStyles } from "../../styles/globalStyles"
import LoadingSpinner from "../../components/common/LoadingSpinner"

const API_BASE_URL = "https://your-api-domain.com/api"  // <-- Replace with your real API base URL

const SystemSettingsScreen = ({ navigation }) => {
  const { colors } = useTheme()
  const { user } = useAuth()

  const [token, setToken] = useState(null)
  const [settings, setSettings] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Load token from AsyncStorage on mount
  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token")
        setToken(storedToken)
      } catch (error) {
        console.error("Error getting token:", error)
      }
    }
    getToken()
  }, [])

  // Load settings after token is loaded
  useEffect(() => {
    if (token) {
      loadSettings()
    }
  }, [token])

  // Fetch settings from API
  const loadSettings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("Error loading settings:", error)
      Alert.alert("Error", "Failed to load system settings")
    } finally {
      setIsLoading(false)
    }
  }

  // Save updated settings to API
  const saveSettings = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      Alert.alert("Success", "System settings updated successfully")
    } catch (error) {
      console.error("Error saving settings:", error)
      Alert.alert("Error", "Failed to save system settings")
    } finally {
      setIsSaving(false)
    }
  }

  // ... (same helper functions as before: updateSetting, renderSettingSection, renderToggleSetting, renderTextSetting)

  const updateSetting = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }

  const renderSettingSection = (title, icon, children) => (
    <View style={[globalStyles.card, { backgroundColor: colors.background.card, marginBottom: 16 }]}>
      <View style={[globalStyles.row, { marginBottom: 16 }]}>
        <Ionicons name={icon} size={20} color={colors.primary.coral} style={{ marginRight: 8 }} />
        <Text style={[globalStyles.heading, { color: colors.text.primary }]}>{title}</Text>
      </View>
      {children}
    </View>
  )

  const renderToggleSetting = (category, key, label, description) => (
    <View style={[globalStyles.spaceBetween, { marginBottom: 16 }]}>
      <View style={{ flex: 1, marginRight: 16 }}>
        <Text style={[globalStyles.bodySecondary, { color: colors.text.primary }]}>{label}</Text>
        {description && (
          <Text style={[globalStyles.caption, { color: colors.text.secondary, marginTop: 2 }]}>
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={!!settings[category]?.[key]}
        onValueChange={(value) => updateSetting(category, key, value)}
        trackColor={{ false: "#E5E7EB", true: colors.primary.coral + "50" }}
        thumbColor={settings[category]?.[key] ? colors.primary.coral : "#9CA3AF"}
      />
    </View>
  )

  const renderTextSetting = (
    category,
    key,
    label,
    placeholder,
    keyboardType = "default"
  ) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={[globalStyles.bodySecondary, { color: colors.text.primary, marginBottom: 8 }]}>
        {label}
      </Text>
      <TextInput
        value={settings[category]?.[key]?.toString() || ""}
        onChangeText={(value) =>
          updateSetting(
            category,
            key,
            keyboardType === "numeric" ? parseInt(value, 10) || 0 : value
          )
        }
        placeholder={placeholder}
        placeholderTextColor={colors.text.secondary}
        keyboardType={keyboardType}
        style={[
          globalStyles.body,
          {
            backgroundColor: colors.background.overlay,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: colors.border.light,
            color: colors.text.primary,
          },
        ]}
      />
    </View>
  )

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <View style={[globalStyles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header */}
      <LinearGradient colors={colors.gradients.primary} style={{ paddingTop: 60, paddingBottom: 20 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={[globalStyles.spaceBetween, { marginBottom: 20 }]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="arrow-back" size={20} color={colors.text.white} />
            </TouchableOpacity>

            <Text style={[globalStyles.title, { color: colors.text.white }]}>System Settings</Text>

            <TouchableOpacity
              onPress={saveSettings}
              disabled={isSaving}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                opacity: isSaving ? 0.6 : 1,
              }}
            >
              <Text
                style={[globalStyles.caption, { color: colors.text.white, fontFamily: "Poppins-Medium" }]}
              >
                {isSaving ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* Maintenance Settings */}
        {renderSettingSection(
          "Maintenance",
          "construct-outline",
          <>
            {renderToggleSetting(
              "maintenance",
              "enabled",
              "Maintenance Mode",
              "Enable to put the app in maintenance mode"
            )}
            {renderTextSetting("maintenance", "message", "Maintenance Message", "Enter maintenance message")}
          </>
        )}

        {/* Registration Settings */}
        {renderSettingSection(
          "Registration",
          "person-add-outline",
          <>
            {renderToggleSetting("registration", "enabled", "Allow Registration", "Allow new users to register")}
            {renderToggleSetting(
              "registration",
              "requireEmailVerification",
              "Email Verification",
              "Require email verification for new accounts"
            )}
            {renderTextSetting(
              "registration",
              "allowedDomains",
              "Allowed Email Domains",
              "Comma-separated list (leave empty for all)"
            )}
          </>
        )}

        {/* Content Settings */}
        {renderSettingSection(
          "Content",
          "document-text-outline",
          <>
            {renderToggleSetting("content", "moderationEnabled", "Content Moderation", "Enable content moderation")}
            {renderToggleSetting("content", "autoApprove", "Auto-approve Content", "Automatically approve user content")}
            {renderTextSetting("content", "maxPostLength", "Max Post Length", "Maximum characters per post", "numeric")}
            {renderTextSetting("content", "maxImageSize", "Max Image Size (MB)", "Maximum image upload size", "numeric")}
          </>
        )}

        {/* Notification Settings */}
        {renderSettingSection(
          "Notifications",
          "notifications-outline",
          <>
            {renderToggleSetting("notifications", "emailEnabled", "Email Notifications", "Enable email notifications")}
            {renderToggleSetting("notifications", "pushEnabled", "Push Notifications", "Enable push notifications")}
            {renderToggleSetting("notifications", "dailyDigest", "Daily Digest", "Send daily digest emails")}
          </>
        )}

        {/* Security Settings */}
        {renderSettingSection(
          "Security",
          "shield-checkmark-outline",
          <>
            {renderTextSetting("security", "passwordMinLength", "Min Password Length", "Minimum password length", "numeric")}
            {renderToggleSetting("security", "requireSpecialChars", "Require Special Characters", "Require special characters in passwords")}
            {renderTextSetting("security", "sessionTimeout", "Session Timeout (hours)", "Session timeout in hours", "numeric")}
            {renderTextSetting("security", "maxLoginAttempts", "Max Login Attempts", "Maximum failed login attempts", "numeric")}
          </>
        )}

        {/* Features Settings */}
        {renderSettingSection(
          "Features",
          "options-outline",
          <>
            {renderToggleSetting("features", "journalEnabled", "Journal Feature", "Enable journal functionality")}
            {renderToggleSetting("features", "goalsEnabled", "Goals Feature", "Enable goals functionality")}
            {renderToggleSetting("features", "blogEnabled", "Blog Feature", "Enable blog functionality")}
            {renderToggleSetting("features", "achievementsEnabled", "Achievements", "Enable achievements system")}
          </>
        )}

        {/* Save Button */}
        <TouchableOpacity
          onPress={saveSettings}
          disabled={isSaving}
          style={[
            globalStyles.card,
            {
              backgroundColor: colors.primary.coral,
              opacity: isSaving ? 0.6 : 1,
              marginTop: 20,
            },
          ]}
        >
          <View style={[globalStyles.center, { padding: 12 }]}>
            <Text style={[globalStyles.heading, { color: colors.text.white }]}>
              {isSaving ? "Saving Settings..." : "Save All Settings"}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default SystemSettingsScreen
