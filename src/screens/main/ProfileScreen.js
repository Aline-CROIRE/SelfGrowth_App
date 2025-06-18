"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, Alert, Image, RefreshControl, Share } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import * as Haptics from "expo-haptics"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"
import { useAuth } from "../../context/AuthContext"
import { useData } from "../../context/DataContext"
import { useTheme } from "../../context/ThemeContext"
import { useApp } from "../../context/AppContext"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import { useUserRole } from "../../context/UserRoleContext"

const ProfileScreen = ({ navigation }) => {
  const { user, logout, updateProfile, isLoading: authLoading } = useAuth()
  const { statistics, loadStatistics } = useData()
  const { getHobbyColor } = useTheme()
  const { toggleTheme, isDarkMode } = useApp()
  const { permissions, features, role, isAdmin, isSuperAdmin } = useUserRole()

  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const hobbyColor = getHobbyColor()

  useEffect(() => {
    loadStatistics()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await loadStatistics()
    setRefreshing(false)
  }

  const handleLogout = () => {
    console.log("Logout button pressed")

    Alert.alert("Sign Out", "Are you sure you want to sign out of your account?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => console.log("Logout cancelled"),
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          console.log("User confirmed logout")
          setIsLoggingOut(true)

          try {
            // Haptic feedback
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          } catch (hapticError) {
            console.log("Haptic feedback failed:", hapticError)
          }

          try {
            console.log("Calling logout function...")
            const result = await logout()
            console.log("Logout result:", result)

            if (result.success) {
              console.log("Logout successful - user should be redirected")
              // The AuthContext will handle the navigation automatically
              // by changing isAuthenticated to false
            } else {
              console.log("Logout failed:", result.message)
              Alert.alert("Error", result.message || "Failed to sign out. Please try again.")
            }
          } catch (error) {
            console.error("Logout error in ProfileScreen:", error)
            Alert.alert("Error", "An error occurred while signing out. Please try again.")
          } finally {
            setIsLoggingOut(false)
          }
        },
      },
    ])
  }

  const handleEditProfile = () => {
    navigation.navigate("EditProfile")
  }

  const handleViewAchievements = () => {
    navigation.navigate("Achievements")
  }

  const handleViewStatistics = () => {
    navigation.navigate("Statistics")
  }

  const handleChangeProfilePicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setIsLoading(true)
      try {
        const updateResult = await updateProfile({ profilePicture: result.assets[0].uri })
        if (updateResult.success) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        } else {
          Alert.alert("Error", "Failed to update profile picture")
        }
      } catch (error) {
        Alert.alert("Error", "Failed to update profile picture")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: `Check out my SelfGrow profile! I've completed ${statistics.completedGoals || 0} goals and have a ${statistics.currentStreak || 0}-day journal streak! 🌱`,
        title: "My SelfGrow Journey",
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  // Create menu sections based on user role
  const menuSections = features.profileMenuItems.map((section) => ({
    title: section.section,
    items: section.items.map((item) => {
      switch (item.id) {
        case "edit-profile":
          return {
            id: "edit-profile",
            title: "Edit Profile",
            subtitle: "Update your personal information",
            icon: "person-outline",
            color: colors.primary.coral,
            onPress: handleEditProfile,
          }
        case "achievements":
          return {
            id: "achievements",
            title: "Achievements",
            subtitle: `${statistics.unlockedAchievements || 0} badges earned`,
            icon: "trophy-outline",
            color: colors.warning.main,
            onPress: handleViewAchievements,
            badge: statistics.unlockedAchievements > 0 ? statistics.unlockedAchievements.toString() : null,
          }
        case "statistics":
          return {
            id: "statistics",
            title: "Statistics",
            subtitle: "View your progress analytics",
            icon: "analytics-outline",
            color: colors.success.main,
            onPress: handleViewStatistics,
          }
        case "my-blogs":
          return {
            id: "my-blogs",
            title: "My Blog Posts",
            subtitle: "Manage your published content",
            icon: "library-outline",
            color: colors.primary.orange,
            onPress: () => navigation.navigate("MyBlogs"),
          }
        case "drafts":
          return {
            id: "drafts",
            title: "Drafts",
            subtitle: "Continue writing your posts",
            icon: "document-text-outline",
            color: colors.info.main,
            onPress: () => navigation.navigate("Drafts"),
          }
        case "moderation":
          return {
            id: "moderation",
            title: "Content Moderation",
            subtitle: "Review and moderate content",
            icon: "shield-checkmark-outline",
            color: colors.warning.main,
            onPress: () => navigation.navigate("Moderation"),
          }
        case "user-management":
          return {
            id: "user-management",
            title: "User Management",
            subtitle: "Manage app users",
            icon: "people-outline",
            color: colors.primary.coral,
            onPress: () => navigation.navigate("UserManagement"),
          }
        case "analytics":
          return {
            id: "analytics",
            title: "App Analytics",
            subtitle: "View app usage statistics",
            icon: "bar-chart-outline",
            color: colors.success.main,
            onPress: () => navigation.navigate("Analytics"),
          }
        case "system-settings":
          return {
            id: "system-settings",
            title: "System Settings",
            subtitle: "Configure app settings",
            icon: "cog-outline",
            color: colors.neutral.gray600,
            onPress: () => navigation.navigate("SystemSettings"),
          }
        case "theme":
          return {
            id: "theme",
            title: "Dark Mode",
            subtitle: isDarkMode ? "Switch to light mode" : "Switch to dark mode",
            icon: isDarkMode ? "sunny-outline" : "moon-outline",
            color: colors.info.main,
            onPress: toggleTheme,
            isToggle: true,
            toggleValue: isDarkMode,
          }
        case "notifications":
          return {
            id: "notifications",
            title: "Notifications",
            subtitle: "Manage your notification preferences",
            icon: "notifications-outline",
            color: colors.primary.orange,
            onPress: () => navigation.navigate("NotificationSettings"),
          }
        case "privacy":
          return {
            id: "privacy",
            title: "Privacy & Security",
            subtitle: "Manage your privacy settings",
            icon: "shield-checkmark-outline",
            color: colors.success.main,
            onPress: () => navigation.navigate("PrivacySettings"),
          }
        default:
          return item
      }
    }),
  }))

  const getRoleDisplayName = (userRole) => {
    switch (userRole) {
      case "SUPER_ADMIN":
        return "Super Administrator"
      case "ADMIN":
        return "Administrator"
      case "USER":
      default:
        return "Member"
    }
  }

  const getRoleColor = (userRole) => {
    switch (userRole) {
      case "SUPER_ADMIN":
        return colors.error.main
      case "ADMIN":
        return colors.warning.main
      case "USER":
      default:
        return colors.success.main
    }
  }

  // Show loading spinner if auth is loading or we're logging out
  if (authLoading || isLoading) {
    return <LoadingSpinner />
  }

  return (
    <View style={globalStyles.container}>
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={globalStyles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary.coral]} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Profile Info */}
        <LinearGradient
          colors={colors.gradients.primary}
          style={[globalStyles.px20, { paddingTop: 60, paddingBottom: 40 }]}
        >
          <View style={[globalStyles.rowSpaceBetween, globalStyles.my16]}>
            <TouchableOpacity
              onPress={handleShareProfile}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                ...globalStyles.center,
              }}
            >
              <Ionicons name="share-outline" size={24} color={colors.text.white} />
            </TouchableOpacity>

            <Text style={[globalStyles.headlineMedium, { color: colors.text.white }]}>Profile</Text>

            <TouchableOpacity
              onPress={() => Alert.alert("Settings", "More settings coming soon!")}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                ...globalStyles.center,
              }}
            >
              <Ionicons name="settings-outline" size={24} color={colors.text.white} />
            </TouchableOpacity>
          </View>

          {/* Profile Picture and Info */}
          <View style={[globalStyles.centerHorizontal, globalStyles.my20]}>
            <TouchableOpacity onPress={handleChangeProfilePicture} style={{ position: "relative" }}>
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: colors.background.paper,
                  ...globalStyles.center,
                  borderWidth: 4,
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  shadowColor: colors.shadow.dark,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 12,
                }}
              >
                {user?.profilePicture ? (
                  <Image
                    source={{ uri: user.profilePicture }}
                    style={{ width: 112, height: 112, borderRadius: 56 }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={[globalStyles.displayMedium, { color: colors.primary.coral }]}>
                    {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}
                  </Text>
                )}
              </View>

              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: colors.background.paper,
                  ...globalStyles.center,
                  borderWidth: 3,
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  shadowColor: colors.shadow.medium,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              >
                <Ionicons name="camera" size={18} color={colors.primary.coral} />
              </View>
            </TouchableOpacity>

            {/* User Info */}
            <Text style={[globalStyles.displaySmall, { color: colors.text.white, marginTop: 16 }]}>
              {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || "User"}
            </Text>

            <Text style={[globalStyles.bodyMedium, { color: colors.text.white, opacity: 0.9, marginTop: 4 }]}>
              {user?.email}
            </Text>

            {/* Role Badge */}
            <View
              style={{
                backgroundColor: getRoleColor(role) + "30",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginTop: 12,
                borderWidth: 1,
                borderColor: getRoleColor(role) + "50",
              }}
            >
              <Text style={[globalStyles.labelMedium, { color: colors.text.white }]}>{getRoleDisplayName(role)}</Text>
            </View>

            {user?.primaryHobby && (
              <View
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  marginTop: 8,
                }}
              >
                <Text style={[globalStyles.labelMedium, { color: colors.text.white }]}>
                  {user.primaryHobby.charAt(0).toUpperCase() + user.primaryHobby.slice(1)} Enthusiast
                </Text>
              </View>
            )}

            {/* Quick Stats */}
            <View style={[globalStyles.rowSpaceBetween, { width: "100%", marginTop: 24 }]}>
              <TouchableOpacity
                onPress={handleViewStatistics}
                style={[globalStyles.centerHorizontal, globalStyles.flex1]}
              >
                <Text style={[globalStyles.displaySmall, { color: colors.text.white, marginBottom: 4 }]}>
                  {statistics.currentStreak || 0}
                </Text>
                <Text style={[globalStyles.labelMedium, { color: colors.text.white, opacity: 0.9 }]}>Day Streak</Text>
              </TouchableOpacity>

              <View style={{ width: 1, height: 40, backgroundColor: "rgba(255, 255, 255, 0.3)" }} />

              <TouchableOpacity
                onPress={() => navigation.navigate("Journal")}
                style={[globalStyles.centerHorizontal, globalStyles.flex1]}
              >
                <Text style={[globalStyles.displaySmall, { color: colors.text.white, marginBottom: 4 }]}>
                  {statistics.totalJournals || 0}
                </Text>
                <Text style={[globalStyles.labelMedium, { color: colors.text.white, opacity: 0.9 }]}>Journals</Text>
              </TouchableOpacity>

              <View style={{ width: 1, height: 40, backgroundColor: "rgba(255, 255, 255, 0.3)" }} />

              <TouchableOpacity
                onPress={() => navigation.navigate("Goals")}
                style={[globalStyles.centerHorizontal, globalStyles.flex1]}
              >
                <Text style={[globalStyles.displaySmall, { color: colors.text.white, marginBottom: 4 }]}>
                  {statistics.completedGoals || 0}
                </Text>
                <Text style={[globalStyles.labelMedium, { color: colors.text.white, opacity: 0.9 }]}>Goals</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Menu Sections */}
        <View style={globalStyles.px20}>
          {menuSections.map((section, sectionIndex) => (
            <View key={section.title} style={globalStyles.my16}>
              <Text style={[globalStyles.titleLarge, globalStyles.mx4, globalStyles.my12]}>{section.title}</Text>

              <View style={globalStyles.cardSmall}>
                {section.items.map((item, index) => (
                  <View key={item.id}>
                    <TouchableOpacity
                      onPress={item.onPress}
                      style={[
                        globalStyles.rowSpaceBetween,
                        globalStyles.py16,
                        index < section.items.length - 1 && {
                          borderBottomWidth: 1,
                          borderBottomColor: colors.border.light,
                        },
                      ]}
                    >
                      <View style={globalStyles.row}>
                        <View
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: `${item.color}15`,
                            ...globalStyles.center,
                            marginRight: 16,
                          }}
                        >
                          <Ionicons name={item.icon} size={24} color={item.color} />
                        </View>

                        <View style={globalStyles.flex1}>
                          <View style={globalStyles.rowSpaceBetween}>
                            <Text style={[globalStyles.titleMedium, { marginBottom: 2 }]}>{item.title}</Text>
                            {item.badge && (
                              <View
                                style={{
                                  backgroundColor: item.color,
                                  borderRadius: 10,
                                  paddingHorizontal: 8,
                                  paddingVertical: 2,
                                  minWidth: 20,
                                  ...globalStyles.center,
                                }}
                              >
                                <Text style={[globalStyles.labelSmall, { color: colors.text.white }]}>
                                  {item.badge}
                                </Text>
                              </View>
                            )}
                          </View>
                          <Text style={[globalStyles.bodySmall, { color: colors.text.secondary }]}>
                            {item.subtitle}
                          </Text>
                        </View>
                      </View>

                      <View style={globalStyles.row}>
                        {item.isToggle && (
                          <View
                            style={{
                              width: 44,
                              height: 24,
                              borderRadius: 12,
                              backgroundColor: item.toggleValue ? item.color : colors.neutral.gray300,
                              ...globalStyles.center,
                              marginRight: 8,
                            }}
                          >
                            <View
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 10,
                                backgroundColor: colors.text.white,
                                transform: [{ translateX: item.toggleValue ? 10 : -10 }],
                              }}
                            />
                          </View>
                        )}
                        <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {/* Account Info Card */}
          <View style={[globalStyles.card, { backgroundColor: colors.background.level1 }]}>
            <View style={[globalStyles.row, globalStyles.my8]}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={colors.info.main}
                style={{ marginRight: 8 }}
              />
              <Text style={[globalStyles.titleMedium, { color: colors.info.main }]}>Account Information</Text>
            </View>

            <View style={[globalStyles.rowSpaceBetween, globalStyles.my8]}>
              <Text style={[globalStyles.bodySmall, { color: colors.text.secondary }]}>Member since</Text>
              <Text style={[globalStyles.labelMedium]}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
              </Text>
            </View>

            <View style={[globalStyles.rowSpaceBetween, globalStyles.my8]}>
              <Text style={[globalStyles.bodySmall, { color: colors.text.secondary }]}>Account type</Text>
              <View style={globalStyles.row}>
                <View
                  style={{
                    backgroundColor: getRoleColor(role) + "20",
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 12,
                    marginRight: 4,
                  }}
                >
                  <Text style={[globalStyles.labelSmall, { color: getRoleColor(role) }]}>
                    {getRoleDisplayName(role)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[globalStyles.rowSpaceBetween, globalStyles.my8]}>
              <Text style={[globalStyles.bodySmall, { color: colors.text.secondary }]}>Email verified</Text>
              <View style={globalStyles.row}>
                <Ionicons
                  name={user?.emailVerified ? "checkmark-circle" : "close-circle"}
                  size={16}
                  color={user?.emailVerified ? colors.success.main : colors.error.main}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    globalStyles.labelMedium,
                    { color: user?.emailVerified ? colors.success.main : colors.error.main },
                  ]}
                >
                  {user?.emailVerified ? "Verified" : "Not verified"}
                </Text>
              </View>
            </View>

            {/* Show additional info for admins */}
            {isAdmin && (
              <View style={[globalStyles.rowSpaceBetween, globalStyles.my8]}>
                <Text style={[globalStyles.bodySmall, { color: colors.text.secondary }]}>Admin privileges</Text>
                <View style={globalStyles.row}>
                  <Ionicons name="shield-checkmark" size={16} color={colors.warning.main} style={{ marginRight: 4 }} />
                  <Text style={[globalStyles.labelMedium, { color: colors.warning.main }]}>
                    {isSuperAdmin ? "Full Access" : "Content Management"}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Logout Button */}
          <View
            style={[
              globalStyles.card,
              {
                backgroundColor: colors.error.bg,
                borderWidth: 1,
                borderColor: colors.error.light + "30",
                opacity: isLoggingOut ? 0.6 : 1,
              },
            ]}
          >
            <TouchableOpacity
              onPress={handleLogout}
              style={[globalStyles.rowSpaceBetween, globalStyles.py8]}
              disabled={isLoggingOut}
            >
              <View style={globalStyles.row}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: colors.error.light + "20",
                    ...globalStyles.center,
                    marginRight: 16,
                  }}
                >
                  {isLoggingOut ? (
                    <LoadingSpinner size="small" color={colors.error.main} />
                  ) : (
                    <Ionicons name="log-out-outline" size={24} color={colors.error.main} />
                  )}
                </View>

                <View>
                  <Text style={[globalStyles.titleMedium, { color: colors.error.main, marginBottom: 2 }]}>
                    {isLoggingOut ? "Signing Out..." : "Sign Out"}
                  </Text>
                  <Text style={[globalStyles.bodySmall, { color: colors.error.main, opacity: 0.7 }]}>
                    {isLoggingOut ? "Please wait..." : "Sign out of your account"}
                  </Text>
                </View>
              </View>

              {!isLoggingOut && <Ionicons name="chevron-forward" size={20} color={colors.error.main} />}
            </TouchableOpacity>
          </View>

          {/* App Version */}
          <View style={[globalStyles.centerHorizontal, globalStyles.py24]}>
            <Text style={[globalStyles.bodySmall, { color: colors.text.secondary }]}>
            
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default ProfileScreen
