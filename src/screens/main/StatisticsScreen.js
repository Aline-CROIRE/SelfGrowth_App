"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"
import { useData } from "../../context/DataContext"
import { useTheme } from "../../context/ThemeContext"

const { width } = Dimensions.get("window")

const StatisticsScreen = ({ navigation }) => {
  const { statistics, loadStatistics } = useData()
  const { getHobbyColor } = useTheme()
  const [selectedPeriod, setSelectedPeriod] = useState("all")

  const hobbyColor = getHobbyColor()

  useEffect(() => {
    loadStatistics()
  }, [])

  const periods = [
    { id: "week", name: "Week", icon: "calendar-outline" },
    { id: "month", name: "Month", icon: "calendar" },
    { id: "year", name: "Year", icon: "calendar-sharp" },
    { id: "all", name: "All Time", icon: "infinite" },
  ]

  const statCards = [
    {
      id: "journals",
      title: "Journal Entries",
      value: statistics.totalJournals || 0,
      subtitle: `${statistics.currentStreak || 0} day streak`,
      icon: "book",
      color: colors.primary.coral,
      trend: "+12%",
      trendUp: true,
    },
    {
      id: "goals",
      title: "Goals Completed",
      value: statistics.completedGoals || 0,
      subtitle: `${statistics.totalGoals || 0} total goals`,
      icon: "flag",
      color: colors.success,
      trend: "+8%",
      trendUp: true,
    },
    {
      id: "words",
      title: "Words Written",
      value: statistics.totalWords || 0,
      subtitle: `${Math.round((statistics.totalWords || 0) / (statistics.totalJournals || 1))} avg per entry`,
      icon: "create",
      color: colors.hobbies.writing,
      trend: "+25%",
      trendUp: true,
    },
    {
      id: "achievements",
      title: "Achievements",
      value: statistics.unlockedAchievements || 0,
      subtitle: `${statistics.totalAchievements || 12} available`,
      icon: "trophy",
      color: colors.warning,
      trend: "+3",
      trendUp: true,
    },
  ]

  const moodStats = [
    { mood: "Amazing", count: statistics.moodCounts?.amazing || 0, color: colors.moods.amazing, icon: "happy" },
    { mood: "Good", count: statistics.moodCounts?.good || 0, color: colors.moods.good, icon: "happy-outline" },
    { mood: "Okay", count: statistics.moodCounts?.okay || 0, color: colors.moods.okay, icon: "remove-circle-outline" },
    { mood: "Bad", count: statistics.moodCounts?.bad || 0, color: colors.moods.bad, icon: "sad-outline" },
    { mood: "Terrible", count: statistics.moodCounts?.terrible || 0, color: colors.moods.terrible, icon: "sad" },
  ]

  const totalMoods = moodStats.reduce((sum, mood) => sum + mood.count, 0)

  const weeklyActivity = [
    { day: "Mon", count: statistics.weeklyActivity?.monday || 0 },
    { day: "Tue", count: statistics.weeklyActivity?.tuesday || 0 },
    { day: "Wed", count: statistics.weeklyActivity?.wednesday || 0 },
    { day: "Thu", count: statistics.weeklyActivity?.thursday || 0 },
    { day: "Fri", count: statistics.weeklyActivity?.friday || 0 },
    { day: "Sat", count: statistics.weeklyActivity?.saturday || 0 },
    { day: "Sun", count: statistics.weeklyActivity?.sunday || 0 },
  ]

  const maxActivity = Math.max(...weeklyActivity.map((day) => day.count), 1)

  const renderStatCard = (stat, index) => (
    <Animatable.View
      key={stat.id}
      animation="fadeInUp"
      duration={600}
      delay={index * 100}
      style={{
        width: (width - 60) / 2,
        marginRight: index % 2 === 0 ? 20 : 0,
        marginBottom: 20,
      }}
    >
      <View
        style={[
          globalStyles.card,
          {
            marginHorizontal: 0,
            backgroundColor: stat.color + "10",
            borderWidth: 1,
            borderColor: stat.color + "30",
          },
        ]}
      >
        <View style={[globalStyles.spaceBetween, { marginBottom: 12 }]}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: stat.color,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name={stat.icon} size={20} color={colors.text.white} />
          </View>

          <View style={[globalStyles.row, { alignItems: "center" }]}>
            <Ionicons
              name={stat.trendUp ? "trending-up" : "trending-down"}
              size={14}
              color={stat.trendUp ? colors.success : colors.error}
              style={{ marginRight: 4 }}
            />
            <Text style={[globalStyles.caption, { color: stat.trendUp ? colors.success : colors.error }]}>
              {stat.trend}
            </Text>
          </View>
        </View>

        <Text style={[globalStyles.title, { fontSize: 24, color: stat.color, marginBottom: 4 }]}>
          {stat.value.toLocaleString()}
        </Text>

        <Text style={[globalStyles.heading, { fontSize: 14, marginBottom: 4 }]}>{stat.title}</Text>

        <Text style={[globalStyles.caption, { color: colors.text.secondary }]}>{stat.subtitle}</Text>
      </View>
    </Animatable.View>
  )

  const renderMoodChart = () => (
    <Animatable.View animation="fadeInUp" duration={600} delay={400}>
      <View style={[globalStyles.card, { marginBottom: 20 }]}>
        <View style={[globalStyles.spaceBetween, { marginBottom: 16 }]}>
          <Text style={globalStyles.heading}>Mood Distribution</Text>
          <Ionicons name="happy-outline" size={20} color={hobbyColor} />
        </View>

        {moodStats.map((mood, index) => {
          const percentage = totalMoods > 0 ? (mood.count / totalMoods) * 100 : 0
          return (
            <View key={mood.mood} style={{ marginBottom: 12 }}>
              <View style={[globalStyles.spaceBetween, { marginBottom: 4 }]}>
                <View style={[globalStyles.row, { alignItems: "center" }]}>
                  <Ionicons name={mood.icon} size={16} color={mood.color} style={{ marginRight: 8 }} />
                  <Text style={[globalStyles.bodySecondary, { fontFamily: "Poppins-Medium" }]}>{mood.mood}</Text>
                </View>
                <Text style={[globalStyles.caption, { color: colors.text.secondary }]}>
                  {mood.count} ({percentage.toFixed(0)}%)
                </Text>
              </View>

              <View
                style={{
                  height: 6,
                  backgroundColor: colors.background.overlay,
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${percentage}%`,
                    backgroundColor: mood.color,
                    borderRadius: 3,
                  }}
                />
              </View>
            </View>
          )
        })}
      </View>
    </Animatable.View>
  )

  const renderWeeklyActivity = () => (
    <Animatable.View animation="fadeInUp" duration={600} delay={500}>
      <View style={[globalStyles.card, { marginBottom: 20 }]}>
        <View style={[globalStyles.spaceBetween, { marginBottom: 16 }]}>
          <Text style={globalStyles.heading}>Weekly Activity</Text>
          <Ionicons name="bar-chart-outline" size={20} color={hobbyColor} />
        </View>

        <View style={[globalStyles.row, { justifyContent: "space-between", alignItems: "flex-end", height: 120 }]}>
          {weeklyActivity.map((day, index) => {
            const barHeight = (day.count / maxActivity) * 80
            return (
              <View key={day.day} style={[globalStyles.center, { flex: 1 }]}>
                <View
                  style={{
                    width: 20,
                    height: Math.max(barHeight, 4),
                    backgroundColor: day.count > 0 ? hobbyColor : colors.background.overlay,
                    borderRadius: 10,
                    marginBottom: 8,
                  }}
                />
                <Text style={[globalStyles.caption, { color: colors.text.secondary }]}>{day.day}</Text>
                <Text style={[globalStyles.caption, { color: colors.text.light, fontSize: 10 }]}>{day.count}</Text>
              </View>
            )
          })}
        </View>
      </View>
    </Animatable.View>
  )

  const renderInsights = () => {
    const insights = []

    if (statistics.currentStreak >= 7) {
      insights.push({
        icon: "flame",
        color: colors.warning,
        title: "Great Streak!",
        description: `You're on a ${statistics.currentStreak}-day journal streak. Keep it up!`,
      })
    }

    if (statistics.completedGoals > 0) {
      const completionRate = ((statistics.completedGoals / statistics.totalGoals) * 100).toFixed(0)
      insights.push({
        icon: "trophy",
        color: colors.success,
        title: "Goal Achiever",
        description: `You've completed ${completionRate}% of your goals. Excellent progress!`,
      })
    }

    const avgWordsPerEntry = Math.round((statistics.totalWords || 0) / (statistics.totalJournals || 1))
    if (avgWordsPerEntry > 100) {
      insights.push({
        icon: "create",
        color: colors.hobbies.writing,
        title: "Detailed Writer",
        description: `Your entries average ${avgWordsPerEntry} words. You're a thoughtful writer!`,
      })
    }

    if (insights.length === 0) {
      insights.push({
        icon: "star",
        color: hobbyColor,
        title: "Getting Started",
        description: "Keep journaling and setting goals to unlock personalized insights!",
      })
    }

    return (
      <Animatable.View animation="fadeInUp" duration={600} delay={600}>
        <View style={[globalStyles.card, { marginBottom: 20 }]}>
          <View style={[globalStyles.spaceBetween, { marginBottom: 16 }]}>
            <Text style={globalStyles.heading}>Personal Insights</Text>
            <Ionicons name="bulb-outline" size={20} color={hobbyColor} />
          </View>

          {insights.map((insight, index) => (
            <View key={index} style={[globalStyles.row, { marginBottom: index < insights.length - 1 ? 16 : 0 }]}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: insight.color + "20",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name={insight.icon} size={20} color={insight.color} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[globalStyles.bodySecondary, { fontFamily: "Poppins-Medium", marginBottom: 2 }]}>
                  {insight.title}
                </Text>
                <Text style={[globalStyles.caption, { color: colors.text.secondary, lineHeight: 18 }]}>
                  {insight.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Animatable.View>
    )
  }

  return (
    <View style={globalStyles.safeContainer}>
      <ScrollView style={globalStyles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Header */}
        <LinearGradient colors={colors.gradients.primary} style={{ paddingTop: 20, paddingBottom: 30 }}>
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

              <Text style={[globalStyles.title, { color: colors.text.white }]}>Statistics</Text>

              <View style={{ width: 40 }} />
            </View>

            {/* Period Selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {periods.map((period) => (
                <TouchableOpacity
                  key={period.id}
                  onPress={() => setSelectedPeriod(period.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor:
                      selectedPeriod === period.id ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.1)",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 12,
                    borderWidth: 1,
                    borderColor: selectedPeriod === period.id ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Ionicons name={period.icon} size={16} color={colors.text.white} style={{ marginRight: 6 }} />
                  <Text style={[globalStyles.caption, { color: colors.text.white, fontFamily: "Poppins-Medium" }]}>
                    {period.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </LinearGradient>

        {/* Main Stats */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <View style={[globalStyles.row, { flexWrap: "wrap" }]}>
            {statCards.map((stat, index) => renderStatCard(stat, index))}
          </View>
        </View>

        {/* Charts and Insights */}
        <View style={{ paddingHorizontal: 20 }}>
          {renderMoodChart()}
          {renderWeeklyActivity()}
          {renderInsights()}
        </View>

        {/* Summary Card */}
        <View
          style={[
            globalStyles.card,
            { margin: 20, backgroundColor: hobbyColor + "10", borderColor: hobbyColor + "30", borderWidth: 1 },
          ]}
        >
          <View style={[globalStyles.center, { padding: 10 }]}>
            <Ionicons name="analytics" size={32} color={hobbyColor} style={{ marginBottom: 12 }} />
            <Text style={[globalStyles.heading, { textAlign: "center", marginBottom: 8, color: hobbyColor }]}>
              Your Growth Journey
            </Text>
            <Text style={[globalStyles.bodySecondary, { textAlign: "center", lineHeight: 22 }]}>
              You've written {statistics.totalJournals || 0} journal entries and completed{" "}
              {statistics.completedGoals || 0} goals. Keep up the amazing work on your personal growth journey!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default StatisticsScreen
