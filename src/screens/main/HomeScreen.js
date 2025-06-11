"use client"

// 🏠 HOME SCREEN - Beautiful dashboard for personal growth

import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import * as Animatable from "react-native-animatable"
import { SafeAreaView } from "react-native-safe-area-context"

import { useApp } from "../../context/AppContext"
import DailyInspiration from "../../components/common/DailyInsparation"
import { COLORS } from "../../styles/colors"
import { TYPOGRAPHY, SPACING, SHADOWS } from "../../styles/globalStyles"

const { width } = Dimensions.get("window")

const HomeScreen = ({ navigation }) => {
  const { state } = useApp()
  const { user, entries, goals, stats } = state

  // Animation refs
  const headerRef = useRef()
  const statsRef = useRef()
  const quickActionsRef = useRef()
  const recentRef = useRef()

  // 🎬 ENTRANCE ANIMATIONS
  useEffect(() => {
    const animateEntrance = () => {
      setTimeout(() => headerRef.current?.fadeInDown(800), 100)
      setTimeout(() => statsRef.current?.fadeInLeft(800), 300)
      setTimeout(() => quickActionsRef.current?.fadeInRight(800), 500)
      setTimeout(() => recentRef.current?.fadeInUp(800), 700)
    }

    animateEntrance()
  }, [])

  // 🎯 GET PERSONALIZED GREETING - Uses actual username
  const getGreeting = () => {
    const hour = new Date().getHours()
    const name = user?.name || "Champion" // Now uses actual username from database

    if (hour < 12) return `Good morning, ${name}! ☀️`
    if (hour < 17) return `Good afternoon, ${name}! 🌤️`
    return `Good evening, ${name}! 🌙`
  }

  // 🎨 RENDER QUICK ACTION - Now with actual functionality
  const renderQuickAction = (title, icon, color, onPress) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient colors={[COLORS.neutral.white, COLORS.neutral.lightGray]} style={styles.quickActionGradient}>
        <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
          <Text style={styles.quickActionIconText}>{icon}</Text>
        </View>
        <Text style={styles.quickActionTitle}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  )

  // 🎨 RENDER STATS CARD
  const renderStatsCard = (title, value, icon, color, onPress) => (
    <TouchableOpacity style={styles.statsCard} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={[color, color + "80"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statsGradient}
      >
        <Text style={styles.statsIcon}>{icon}</Text>
        <Text style={styles.statsValue}>{value}</Text>
        <Text style={styles.statsTitle}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  )

  // 🎨 RENDER RECENT ENTRY
  const renderRecentEntry = (entry) => (
    <TouchableOpacity
      key={entry.id}
      style={styles.recentEntry}
      onPress={() => navigation.navigate("Journal", { entryId: entry.id })}
      activeOpacity={0.8}
    >
      <View style={styles.recentEntryContent}>
        <Text style={styles.recentEntryTitle}>{entry.title}</Text>
        <Text style={styles.recentEntryPreview} numberOfLines={2}>
          {entry.content}
        </Text>
        <Text style={styles.recentEntryDate}>{new Date(entry.createdAt).toLocaleDateString()}</Text>
      </View>
      <View style={[styles.recentEntryMood, { backgroundColor: entry.moodColor || COLORS.primary.coral }]} />
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
            colors={COLORS.gradients.sunrise}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.motivationalText}>"Every day is a new opportunity to grow stronger"</Text>
          </LinearGradient>
        </Animatable.View>

        {/* Daily Inspiration */}
        <Animatable.View animation="fadeIn" delay={900}>
          <DailyInspiration />
        </Animatable.View>

        {/* Stats Overview */}
        <Animatable.View ref={statsRef} style={styles.section}>
          <Text style={styles.sectionTitle}>Your Growth Journey</Text>
          <View style={styles.statsContainer}>
            {renderStatsCard("Journal Entries", stats.totalEntries, "📝", COLORS.hobbies.writing, () =>
              navigation.navigate("Journal"),
            )}
            {renderStatsCard("Current Streak", `${stats.currentStreak} days`, "🔥", COLORS.primary.orange, () =>
              navigation.navigate("Journal"),
            )}
            {renderStatsCard("Goals Completed", stats.goalsCompleted, "🎯", COLORS.status.success, () =>
              navigation.navigate("Goals"),
            )}
            {renderStatsCard("Longest Streak", `${stats.longestStreak} days`, "⭐", COLORS.secondary.gold, () =>
              navigation.navigate("Profile"),
            )}
          </View>
        </Animatable.View>

        {/* Quick Actions */}
        <Animatable.View ref={quickActionsRef} style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            {renderQuickAction("New Entry", "✍️", COLORS.hobbies.writing, () =>
              navigation.navigate("Journal", { action: "new" }),
            )}
            {renderQuickAction("Set Goal", "🎯", COLORS.status.success, () =>
              navigation.navigate("Goals", { action: "new" }),
            )}
            {renderQuickAction("View Progress", "📊", COLORS.primary.orange, () => navigation.navigate("Profile"))}
            {renderQuickAction(
              "Hobby Features",
              "🎨",
              COLORS.secondary.gold,
              () => navigation.navigate("HobbyFeatures"), // We'll create this screen
            )}
          </View>
        </Animatable.View>

        {/* Recent Entries */}
        <Animatable.View ref={recentRef} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Reflections</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Journal")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {entries.length > 0 ? (
            <View style={styles.recentEntriesContainer}>{entries.slice(0, 3).map(renderRecentEntry)}</View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📝</Text>
              <Text style={styles.emptyStateTitle}>Start Your Journey</Text>
              <Text style={styles.emptyStateText}>
                Write your first journal entry and begin your path to personal growth
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => navigation.navigate("Journal", { action: "new" })}
              >
                <LinearGradient colors={COLORS.gradients.sunrise} style={styles.emptyStateButtonGradient}>
                  <Text style={styles.emptyStateButtonText}>Write First Entry</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </Animatable.View>
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
  greeting: {
    ...TYPOGRAPHY.h2,
    color: COLORS.neutral.white,
    marginBottom: SPACING.sm,
  },
  motivationalText: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.white + "CC",
    fontStyle: "italic",
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
  seeAllText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary.coral,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statsCard: {
    width: (width - SPACING.lg * 3) / 2,
    marginBottom: SPACING.md,
  },
  statsGradient: {
    borderRadius: 16,
    padding: SPACING.lg,
    alignItems: "center",
    ...SHADOWS.medium,
  },
  statsIcon: {
    fontSize: 24,
    marginBottom: SPACING.sm,
  },
  statsValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.neutral.white,
    marginBottom: SPACING.xs,
  },
  statsTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.white + "CC",
    textAlign: "center",
  },
  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickAction: {
    width: (width - SPACING.lg * 3) / 2,
    marginBottom: SPACING.md,
  },
  quickActionGradient: {
    borderRadius: 16,
    padding: SPACING.lg,
    alignItems: "center",
    ...SHADOWS.light,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
  },
  quickActionIconText: {
    fontSize: 20,
  },
  quickActionTitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.neutral.black,
    fontWeight: "600",
    textAlign: "center",
  },
  recentEntriesContainer: {
    marginTop: SPACING.sm,
  },
  recentEntry: {
    flexDirection: "row",
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.light,
  },
  recentEntryContent: {
    flex: 1,
  },
  recentEntryTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    marginBottom: SPACING.xs,
  },
  recentEntryPreview: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.neutral.darkGray,
    marginBottom: SPACING.xs,
  },
  recentEntryDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.mediumGray,
  },
  recentEntryMood: {
    width: 4,
    borderRadius: 2,
    marginLeft: SPACING.sm,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyStateTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.sm,
  },
  emptyStateText: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.darkGray,
    textAlign: "center",
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  emptyStateButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  emptyStateButtonGradient: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  emptyStateButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.neutral.white,
  },
})

export default HomeScreen
