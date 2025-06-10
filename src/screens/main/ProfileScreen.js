"use client"

// 👤 PROFILE SCREEN - User profile with statistics and settings

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  StatusBar,
  Dimensions,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import * as Animatable from "react-native-animatable"
import { SafeAreaView } from "react-native-safe-area-context"

import CustomButton from "../../components/common/customButton"
import { useApp } from "../../context/AppContext"
import { COLORS } from "../../styles/colors"
import { TYPOGRAPHY, SPACING, SHADOWS } from "../../styles/globalStyles"

const { width } = Dimensions.get("window")

const ProfileScreen = ({ navigation }) => {
  const { state, actions } = useApp()
  const { user, entries, goals, stats, selectedHobbies } = state

  // 🎭 UI STATE
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)

  // Animation refs
  const headerRef = useRef()
  const statsRef = useRef()
  const hobbiesRef = useRef()
  const settingsRef = useRef()

  // 🎬 ENTRANCE ANIMATIONS
  useEffect(() => {
    setTimeout(() => headerRef.current?.fadeInDown(800), 100)
    setTimeout(() => statsRef.current?.fadeInLeft(800), 300)
    setTimeout(() => hobbiesRef.current?.fadeInRight(800), 500)
    setTimeout(() => settingsRef.current?.fadeInUp(800), 700)
  }, [])

  // 🚪 HANDLE LOGOUT
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          actions.logout()
          navigation.replace("Auth")
        },
      },
    ])
  }

  // 📊 CALCULATE ADDITIONAL STATS
  const getAdditionalStats = () => {
    const totalWords = entries.reduce((total, entry) => total + (entry.content?.split(" ").length || 0), 0)
    const averageWordsPerEntry = entries.length > 0 ? Math.round(totalWords / entries.length) : 0
    const completedGoals = goals.filter((goal) => goal.completed).length
    const activeGoals = goals.filter((goal) => !goal.completed).length

    return {
      totalWords,
      averageWordsPerEntry,
      completedGoals,
      activeGoals,
      joinedDaysAgo: user?.joinedAt ? Math.floor((Date.now() - new Date(user.joinedAt).getTime()) / (1000 * 60 * 60 * 24)) : 0,
    }
  }

  const additionalStats = getAdditionalStats()

  // 🎨 RENDER STAT CARD
  const renderStatCard = (title, value, icon, color, subtitle = "") => (
    <View style={[styles.statCard, { backgroundColor: color + "10" }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  )

  // 🎨 RENDER HOBBY BADGE
  const renderHobbyBadge = (hobbyId) => {
    const hobbyNames = {
      art: "Art & Drawing",
      reading: "Reading",
      music: "Music",
      sports: "Sports & Fitness",
      writing: "Writing",
      cooking: "Cooking",
      photography: "Photography",
      gardening: "Gardening",
    }

    const hobbyIcons = {
      art: "🎨",
      reading: "📚",
      music: "🎵",
      sports: "⚽",
      writing: "✍️",
      cooking: "👨‍🍳",
      photography: "📸",
      gardening: "🌱",
    }

    return (
      <View
        key={hobbyId}
        style={[styles.hobbyBadge, { backgroundColor: COLORS.hobbies[hobbyId] + "20" }]}
      >
        <Text style={styles.hobbyIcon}>{hobbyIcons[hobbyId]}</Text>
        <Text style={[styles.hobbyName, { color: COLORS.hobbies[hobbyId] }]}>
          {hobbyNames[hobbyId]}
        </Text>
      </View>
    )
  }

  // 🎨 RENDER SETTING ITEM
  const renderSettingItem = (title, subtitle, rightComponent, onPress = null) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightComponent}
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary.coral} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Beautiful Header */}
        <Animatable.View ref={headerRef}>
          <LinearGradient
            colors={COLORS.gradients.dream}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.profileInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || "U"}</Text>
              </View>
              <Text style={styles.userName}>{user?.name || "User"}</Text>
              <Text style={styles.userEmail}>{user?.email || "user@example.com"}</Text>
              <Text style={styles.joinedDate}>
                Member for {additionalStats.joinedDaysAgo} days
              </Text>
            </View>
          </LinearGradient>
        </Animatable.View>

        {/* Statistics Overview */}
        <Animatable.View ref={statsRef} style={styles.section}>
          <Text style={styles.sectionTitle}>Your Growth Statistics</Text>
          <View style={styles.statsGrid}>
            {renderStatCard("Journal Entries", stats.totalEntries, "📝", COLORS.hobbies.writing)}
            {renderStatCard("Current Streak", `${stats.currentStreak} days`, "🔥", COLORS.primary.orange)}
            {renderStatCard("Goals Completed", additionalStats.completedGoals, "🎯", COLORS.status.success)}
            {renderStatCard("Total Words", additionalStats.totalWords.toLocaleString(), "📊", COLORS.primary.coral)}
            {renderStatCard("Longest Streak", `${stats.longestStreak} days`, "⭐", COLORS.secondary.gold)}
            {renderStatCard("Active Goals", additionalStats.activeGoals, "🎪", COLORS.hobbies.sports)}
          </View>
        </Animatable.View>

        {/* Hobbies Section */}
        <Animatable.View ref={hobbiesRef} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Passions</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.hobbiesContainer}>
            {selectedHobbies.map(renderHobbyBadge)}
          </View>
        </Animatable.View>

        {/* Achievements Section */}
        <Animatable.View ref={settingsRef} style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <View style={styles.achievementsContainer}>
            {stats.totalEntries >= 1 && (
              <View style={styles.achievement}>
                <Text style={styles.achievementIcon}>🎉</Text>
                <Text style={styles.achievementText}>First Journal Entry</Text>
              </View>
            )}
            {stats.totalEntries >= 10 && (
              <View style={styles.achievement}>
                <Text style={styles.achievementIcon}>📚</Text>
                <Text style={styles.achievementText}>10 Entries Milestone</Text>
              </View>
            )}
            {stats.currentStreak >= 7 && (
              <View style={styles.achievement}>
                <Text style={styles.achievementIcon}>🔥</Text>
                <Text style={styles.achievementText}>Week Streak</Text>
              </View>
            )}
            {additionalStats.completedGoals >= 1 && (
              <View style={styles.achievement}>
                <Text style={styles.achievementIcon}>🎯</Text>
                <Text style={styles.achievementText}>Goal Achiever</Text>
              </View>
            )}
            {stats.totalEntries === 0 && additionalStats.completedGoals === 0 && (
              <Text style={styles.noAchievements}>
                Start journaling and setting goals to unlock achievements! 🌟
              </Text>
            )}
          </View>
        </Animatable.View>

        {/* Settings Section */}
        <Animatable.View ref={settingsRef} style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsContainer}>
            {renderSettingItem(
              "Notifications",
              "Get reminders to journal daily",
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: COLORS.neutral.lightGray, true: COLORS.primary.coral }}
                thumbColor={notificationsEnabled ? COLORS.neutral.white : COLORS.neutral.mediumGray}
              />
            )}

            {renderSettingItem(
              "Dark Mode",
              "Switch to dark theme",
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: COLORS.neutral.lightGray, true: COLORS.primary.coral }}
                thumbColor={darkModeEnabled ? COLORS.neutral.white : COLORS.neutral.mediumGray}
              />
            )}

            {renderSettingItem(
              "Export Data",
              "Download your journal entries",
              <Text style={styles.settingArrow}>→</Text>,
              () => Alert.alert("Export Data", "This feature will be available soon!")
            )}

            {renderSettingItem(
              "Privacy Policy",
              "Read our privacy policy",
              <Text style={styles.settingArrow}>→</Text>,
              () => Alert.alert("Privacy Policy", "This feature will be available soon!")
            )}

            {renderSettingItem(
              "Help & Support",
              "Get help or contact support",
              <Text style={styles.settingArrow}>→</Text>,
              () => Alert.alert("Help & Support", "This feature will be available soon!")
            )}
          </View>
        </Animatable.View>

        {/* Logout Section */}
        <View style={styles.section}>
          <CustomButton
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            size="large"
            style={styles.logoutButton}
            textStyle={{ color: COLORS.status.error }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: SPACING.lg,
  },
  profileInfo: {
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.neutral.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  avatarText: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary.coral,
  },
  userName: {
    ...TYPOGRAPHY.h2,
    color: COLORS.neutral.white,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.white + "CC",
    marginBottom: SPACING.xs,
  },
  joinedDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.white + "AA",
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.neutral.black,
  },
  editText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary.coral,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: (width - SPACING.lg * 3) / 2,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: SPACING.md,
    ...SHADOWS.light,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: SPACING.sm,
  },
  statValue: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs,
  },
  statTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.darkGray,
    textAlign: "center",
  },
  statSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.mediumGray,
    textAlign: "center",
    fontSize: 10,
  },
  hobbiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  hobbyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  hobbyIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  hobbyName: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: "600",
  },
  achievementsContainer: {
    backgroundColor: COLORS.neutral.lightGray,
    borderRadius: 12,
    padding: SPACING.md,
  },
  achievement: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
  },
  achievementIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  achievementText: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.black,
    fontWeight: "600",
  },
  noAchievements: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.mediumGray,
    textAlign: "center",
    fontStyle: "italic",
  },
  settingsContainer: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    ...SHADOWS.light,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral.lightGray,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.black,
    fontWeight: "600",
  },
  settingSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.mediumGray,
    marginTop: SPACING.xs,
  },
  settingArrow: {
    ...TYPOGRAPHY.h3,
    color: COLORS.neutral.mediumGray,
  },
  logoutButton: {
    borderColor: COLORS.status.error,
  },
})

export default ProfileScreen
