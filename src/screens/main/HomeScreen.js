"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"
import { useAuth } from "../../context/AuthContext"
import { useData } from "../../context/DataContext"
import { useTheme } from "../../context/ThemeContext"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import JournalCard from "../../components/journal/JournalCard"
import GoalCard from "../../components/goals/GoalCard"

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth()
  const { journals, goals, statistics, isLoading, loadAllData } = useData()
  const { getHobbyColor } = useTheme()
  const [refreshing, setRefreshing] = useState(false)
  const [dailyQuote, setDailyQuote] = useState("")

  const hobbyColor = getHobbyColor()

  useEffect(() => {
    // Set a daily inspirational quote
    const quotes = [
      "The only way to do great work is to love what you do.",
      "Believe you can and you're halfway there.",
      "It does not matter how slowly you go as long as you do not stop.",
      "The future belongs to those who believe in the beauty of their dreams.",
      "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      "The best way to predict the future is to create it.",
      "Your time is limited, don't waste it living someone else's life.",
      "The journey of a thousand miles begins with one step.",
    ]

    // Use the current date to select a quote (so it changes daily)
    const today = new Date()
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)
    setDailyQuote(quotes[dayOfYear % quotes.length])
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await loadAllData()
    setRefreshing(false)
  }

  if (isLoading && !refreshing) {
    return <LoadingSpinner />
  }

  const recentJournals = journals.slice(0, 2)
  const activeGoals = goals.filter((goal) => goal.status === "ACTIVE").slice(0, 2)

  return (
    <View style={globalStyles.container}>
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary.coral]} />
        }
      >
        {/* Header */}
        <LinearGradient colors={colors.gradients.primary} style={{ paddingTop: 60, paddingBottom: 30 }}>
          <View style={{ paddingHorizontal: 20 }}>
            <Animatable.View animation="fadeIn" duration={1000}>
              <Text style={[globalStyles.body, { color: colors.text.white, opacity: 0.9 }]}>Welcome back,</Text>
              <Text style={[globalStyles.title, { color: colors.text.white, marginBottom: 16 }]}>
                {user?.firstName || user?.username}
              </Text>

              {/* Stats Overview */}
              <View style={[globalStyles.row, { marginBottom: 20 }]}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: 16,
                    padding: 16,
                    marginRight: 8,
                  }}
                >
                  <Text style={[globalStyles.caption, { color: colors.text.white, opacity: 0.9 }]}>Journal Streak</Text>
                  <View style={[globalStyles.row, { alignItems: "baseline" }]}>
                    <Text
                      style={[
                        globalStyles.title,
                        { color: colors.text.white, fontSize: 24, marginRight: 4, marginBottom: 0 },
                      ]}
                    >
                      {statistics.currentStreak || 0}
                    </Text>
                    <Text style={[globalStyles.caption, { color: colors.text.white }]}>days</Text>
                  </View>
                </View>

                <View
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: 16,
                    padding: 16,
                    marginLeft: 8,
                  }}
                >
                  <Text style={[globalStyles.caption, { color: colors.text.white, opacity: 0.9 }]}>
                    Goals Completed
                  </Text>
                  <View style={[globalStyles.row, { alignItems: "baseline" }]}>
                    <Text
                      style={[
                        globalStyles.title,
                        { color: colors.text.white, fontSize: 24, marginRight: 4, marginBottom: 0 },
                      ]}
                    >
                      {statistics.completedGoals || 0}
                    </Text>
                    <Text style={[globalStyles.caption, { color: colors.text.white }]}>
                      /{statistics.totalGoals || 0}
                    </Text>
                  </View>
                </View>
              </View>
            </Animatable.View>
          </View>
        </LinearGradient>

        {/* Daily Inspiration */}
        <Animatable.View animation="fadeInUp" duration={800} delay={300}>
          <View style={[globalStyles.card, { marginTop: -20 }]}>
            <View style={[globalStyles.row, { marginBottom: 8 }]}>
              <Ionicons name="sunny" size={20} color={hobbyColor} style={{ marginRight: 8 }} />
              <Text style={[globalStyles.heading, { fontSize: 16 }]}>Daily Inspiration</Text>
            </View>
            <Text style={[globalStyles.body, { fontStyle: "italic" }]}>"{dailyQuote}"</Text>
          </View>
        </Animatable.View>

        {/* Recent Journals */}
        <View style={{ marginTop: 16, paddingHorizontal: 20 }}>
          <View style={[globalStyles.spaceBetween, { marginBottom: 12 }]}>
            <Text style={globalStyles.heading}>Recent Journals</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Journal")}>
              <Text style={[globalStyles.bodySecondary, { color: colors.primary.coral }]}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentJournals.length > 0 ? (
            recentJournals.map((journal) => (
              <JournalCard
                key={journal.id}
                journal={journal}
                onPress={() => navigation.navigate("Journal", { screen: "JournalDetail", params: { journal } })}
                style={{ marginHorizontal: 0 }}
              />
            ))
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate("Journal", { screen: "CreateJournal" })}
              style={[
                globalStyles.card,
                {
                  marginHorizontal: 0,
                  borderStyle: "dashed",
                  borderWidth: 1,
                  borderColor: colors.text.light,
                  backgroundColor: colors.background.overlay,
                },
              ]}
            >
              <View style={[globalStyles.center, { padding: 20 }]}>
                <Ionicons name="add-circle-outline" size={32} color={colors.primary.coral} />
                <Text style={[globalStyles.bodySecondary, { marginTop: 8, textAlign: "center" }]}>
                  Write your first journal entry
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Active Goals */}
        <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
          <View style={[globalStyles.spaceBetween, { marginBottom: 12 }]}>
            <Text style={globalStyles.heading}>Active Goals</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Goals")}>
              <Text style={[globalStyles.bodySecondary, { color: colors.primary.coral }]}>See All</Text>
            </TouchableOpacity>
          </View>

          {activeGoals.length > 0 ? (
            activeGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onPress={() => navigation.navigate("Goals", { screen: "GoalDetail", params: { goal } })}
                style={{ marginHorizontal: 0 }}
              />
            ))
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate("Goals", { screen: "CreateGoal" })}
              style={[
                globalStyles.card,
                {
                  marginHorizontal: 0,
                  borderStyle: "dashed",
                  borderWidth: 1,
                  borderColor: colors.text.light,
                  backgroundColor: colors.background.overlay,
                },
              ]}
            >
              <View style={[globalStyles.center, { padding: 20 }]}>
                <Ionicons name="flag-outline" size={32} color={colors.primary.coral} />
                <Text style={[globalStyles.bodySecondary, { marginTop: 8, textAlign: "center" }]}>
                  Set your first goal
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Actions */}
        <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
          <Text style={[globalStyles.heading, { marginBottom: 12 }]}>Quick Actions</Text>

          <View style={[globalStyles.row, { flexWrap: "wrap" }]}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Journal", { screen: "CreateJournal" })}
              style={{
                width: "48%",
                backgroundColor: colors.background.card,
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
                marginRight: "4%",
                shadowColor: colors.shadow.light,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View style={[globalStyles.center]}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: `${colors.primary.coral}20`,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name="create-outline" size={24} color={colors.primary.coral} />
                </View>
                <Text style={[globalStyles.bodySecondary, { textAlign: "center" }]}>New Journal</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Goals", { screen: "CreateGoal" })}
              style={{
                width: "48%",
                backgroundColor: colors.background.card,
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
                shadowColor: colors.shadow.light,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View style={[globalStyles.center]}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: `${hobbyColor}20`,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name="flag-outline" size={24} color={hobbyColor} />
                </View>
                <Text style={[globalStyles.bodySecondary, { textAlign: "center" }]}>New Goal</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Statistics")}
              style={{
                width: "48%",
                backgroundColor: colors.background.card,
                borderRadius: 16,
                padding: 16,
                marginRight: "4%",
                shadowColor: colors.shadow.light,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View style={[globalStyles.center]}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: `${colors.warning}20`,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name="stats-chart-outline" size={24} color={colors.warning} />
                </View>
                <Text style={[globalStyles.bodySecondary, { textAlign: "center" }]}>Statistics</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Achievements")}
              style={{
                width: "48%",
                backgroundColor: colors.background.card,
                borderRadius: 16,
                padding: 16,
                shadowColor: colors.shadow.light,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View style={[globalStyles.center]}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: `${colors.success}20`,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name="trophy-outline" size={24} color={colors.success} />
                </View>
                <Text style={[globalStyles.bodySecondary, { textAlign: "center" }]}>Achievements</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default HomeScreen
