"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"
import { useData } from "../../context/DataContext"
import { useTheme } from "../../context/ThemeContext"

const AchievementsScreen = ({ navigation }) => {
  const { statistics, loadStatistics } = useData()
  const { getHobbyColor } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState("all")

  const hobbyColor = getHobbyColor()

  useEffect(() => {
    loadStatistics()
  }, [])

  const achievements = [
    {
      id: "first-journal",
      title: "First Steps",
      description: "Write your first journal entry",
      icon: "create-outline",
      color: colors.primary.coral,
      category: "journal",
      unlocked: statistics.totalJournals > 0,
      progress: Math.min(statistics.totalJournals, 1),
      maxProgress: 1,
    },
    {
      id: "journal-streak-7",
      title: "Week Warrior",
      description: "Maintain a 7-day journal streak",
      icon: "flame-outline",
      color: colors.warning,
      category: "journal",
      unlocked: statistics.currentStreak >= 7,
      progress: Math.min(statistics.currentStreak, 7),
      maxProgress: 7,
    },
    {
      id: "journal-streak-30",
      title: "Monthly Master",
      description: "Maintain a 30-day journal streak",
      icon: "flame",
      color: colors.error,
      category: "journal",
      unlocked: statistics.currentStreak >= 30,
      progress: Math.min(statistics.currentStreak, 30),
      maxProgress: 30,
    },
    {
      id: "first-goal",
      title: "Goal Getter",
      description: "Create your first goal",
      icon: "flag-outline",
      color: colors.success,
      category: "goals",
      unlocked: statistics.totalGoals > 0,
      progress: Math.min(statistics.totalGoals, 1),
      maxProgress: 1,
    },
    {
      id: "complete-goal",
      title: "Achievement Unlocked",
      description: "Complete your first goal",
      icon: "checkmark-circle",
      color: colors.success,
      category: "goals",
      unlocked: statistics.completedGoals > 0,
      progress: Math.min(statistics.completedGoals, 1),
      maxProgress: 1,
    },
    {
      id: "goal-master",
      title: "Goal Master",
      description: "Complete 10 goals",
      icon: "trophy",
      color: colors.warning,
      category: "goals",
      unlocked: statistics.completedGoals >= 10,
      progress: Math.min(statistics.completedGoals, 10),
      maxProgress: 10,
    },
    {
      id: "word-count-1000",
      title: "Wordsmith",
      description: "Write 1,000 words in total",
      icon: "library-outline",
      color: colors.hobbies.writing,
      category: "writing",
      unlocked: statistics.totalWords >= 1000,
      progress: Math.min(statistics.totalWords, 1000),
      maxProgress: 1000,
    },
    {
      id: "word-count-10000",
      title: "Author",
      description: "Write 10,000 words in total",
      icon: "library",
      color: colors.hobbies.writing,
      category: "writing",
      unlocked: statistics.totalWords >= 10000,
      progress: Math.min(statistics.totalWords, 10000),
      maxProgress: 10000,
    },
    {
      id: "early-bird",
      title: "Early Bird",
      description: "Journal before 8 AM",
      icon: "sunny-outline",
      color: colors.warning,
      category: "habits",
      unlocked: statistics.earlyMorningJournals > 0,
      progress: Math.min(statistics.earlyMorningJournals, 1),
      maxProgress: 1,
    },
    {
      id: "night-owl",
      title: "Night Owl",
      description: "Journal after 10 PM",
      icon: "moon-outline",
      color: colors.hobbies.reading,
      category: "habits",
      unlocked: statistics.lateNightJournals > 0,
      progress: Math.min(statistics.lateNightJournals, 1),
      maxProgress: 1,
    },
    {
      id: "mood-tracker",
      title: "Mood Master",
      description: "Track 5 different moods",
      icon: "happy-outline",
      color: colors.primary.peach,
      category: "wellness",
      unlocked: statistics.uniqueMoods >= 5,
      progress: Math.min(statistics.uniqueMoods, 5),
      maxProgress: 5,
    },
    {
      id: "consistency",
      title: "Consistency King",
      description: "Journal for 100 days total",
      icon: "calendar",
      color: colors.primary.coral,
      category: "habits",
      unlocked: statistics.totalJournalDays >= 100,
      progress: Math.min(statistics.totalJournalDays, 100),
      maxProgress: 100,
    },
  ]

  const categories = [
    { id: "all", name: "All", icon: "apps", color: colors.text.primary },
    { id: "journal", name: "Journal", icon: "book", color: colors.primary.coral },
    { id: "goals", name: "Goals", icon: "flag", color: colors.success },
    { id: "writing", name: "Writing", icon: "create", color: colors.hobbies.writing },
    { id: "habits", name: "Habits", icon: "repeat", color: colors.warning },
    { id: "wellness", name: "Wellness", icon: "heart", color: colors.primary.peach },
  ]

  const filteredAchievements =
    selectedCategory === "all"
      ? achievements
      : achievements.filter((achievement) => achievement.category === selectedCategory)

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalCount = achievements.length

  const renderAchievement = (achievement, index) => {
    const progressPercentage = (achievement.progress / achievement.maxProgress) * 100

    return (
      <Animatable.View key={achievement.id} animation="fadeInUp" duration={600} delay={index * 100}>
        <View
          style={[
            globalStyles.card,
            {
              opacity: achievement.unlocked ? 1 : 0.6,
              borderWidth: achievement.unlocked ? 2 : 1,
              borderColor: achievement.unlocked ? achievement.color + "40" : colors.text.light + "20",
              backgroundColor: achievement.unlocked ? achievement.color + "05" : colors.background.card,
            },
          ]}
        >
          <View style={[globalStyles.row, { alignItems: "flex-start" }]}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: achievement.unlocked ? achievement.color : colors.text.light,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 16,
                shadowColor: achievement.unlocked ? achievement.color : colors.shadow.light,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Ionicons
                name={achievement.unlocked ? achievement.icon : achievement.icon}
                size={28}
                color={colors.text.white}
              />
            </View>

            <View style={{ flex: 1 }}>
              <View style={[globalStyles.spaceBetween, { marginBottom: 4 }]}>
                <Text
                  style={[
                    globalStyles.heading,
                    {
                      color: achievement.unlocked ? colors.text.primary : colors.text.secondary,
                      fontFamily: achievement.unlocked ? "Poppins-SemiBold" : "Poppins-Medium",
                    },
                  ]}
                >
                  {achievement.title}
                </Text>
                {achievement.unlocked && <Ionicons name="checkmark-circle" size={20} color={achievement.color} />}
              </View>

              <Text
                style={[
                  globalStyles.bodySecondary,
                  {
                    color: achievement.unlocked ? colors.text.secondary : colors.text.light,
                    marginBottom: 12,
                  },
                ]}
              >
                {achievement.description}
              </Text>

              {/* Progress Bar */}
              <View style={{ marginBottom: 8 }}>
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
                      width: `${progressPercentage}%`,
                      backgroundColor: achievement.unlocked ? achievement.color : colors.text.light,
                      borderRadius: 3,
                    }}
                  />
                </View>
                <Text style={[globalStyles.caption, { marginTop: 4, textAlign: "right" }]}>
                  {achievement.progress}/{achievement.maxProgress}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Animatable.View>
    )
  }

  return (
    <View style={globalStyles.safeContainer}>
      <ScrollView style={globalStyles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Header */}
        <LinearGradient colors={colors.gradients.achievement} style={{ paddingTop: 20, paddingBottom: 30 }}>
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

              <View style={[globalStyles.center]}>
                <Text style={[globalStyles.title, { color: colors.text.white, textAlign: "center" }]}>
                  Achievements
                </Text>
              </View>

              <View style={{ width: 40 }} />
            </View>

            {/* Progress Overview */}
            <View
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: 16,
                padding: 20,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: colors.text.white,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Text style={[globalStyles.title, { color: colors.warning, fontSize: 32, marginBottom: 0 }]}>
                  {unlockedCount}
                </Text>
              </View>

              <Text style={[globalStyles.body, { color: colors.text.white, fontFamily: "Poppins-Medium" }]}>
                {unlockedCount} of {totalCount} Unlocked
              </Text>

              <View
                style={{
                  width: "100%",
                  height: 8,
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  borderRadius: 4,
                  marginTop: 12,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${(unlockedCount / totalCount) * 100}%`,
                    backgroundColor: colors.text.white,
                    borderRadius: 4,
                  }}
                />
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Category Filter */}
        <View style={{ marginVertical: 20 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: selectedCategory === category.id ? category.color : colors.background.card,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  marginRight: 12,
                  borderWidth: 1,
                  borderColor: category.color,
                  shadowColor: colors.shadow.light,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Ionicons
                  name={category.icon}
                  size={18}
                  color={selectedCategory === category.id ? colors.text.white : category.color}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    globalStyles.bodySecondary,
                    {
                      color: selectedCategory === category.id ? colors.text.white : category.color,
                      fontFamily: "Poppins-Medium",
                    },
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Achievements List */}
        <View style={{ paddingHorizontal: 20 }}>
          {filteredAchievements.map((achievement, index) => renderAchievement(achievement, index))}
        </View>

        {/* Motivational Message */}
        <View
          style={[
            globalStyles.card,
            { margin: 20, backgroundColor: hobbyColor + "10", borderColor: hobbyColor + "30", borderWidth: 1 },
          ]}
        >
          <View style={[globalStyles.center, { padding: 10 }]}>
            <Ionicons name="star" size={32} color={hobbyColor} style={{ marginBottom: 12 }} />
            <Text style={[globalStyles.heading, { textAlign: "center", marginBottom: 8, color: hobbyColor }]}>
              Keep Growing!
            </Text>
            <Text style={[globalStyles.bodySecondary, { textAlign: "center", lineHeight: 22 }]}>
              Every small step counts towards your personal growth journey. Continue journaling and setting goals to
              unlock more achievements!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default AchievementsScreen
