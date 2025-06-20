"use client"

import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import { globalStyles } from "../../styles/globalStyles"
import LoadingSpinner from "../../components/common/LoadingSpinner"

const { width } = Dimensions.get("window")

const AppAnalyticsScreen = ({ navigation }) => {
  const { colors } = useTheme()
  const { token } = useAuth()

  const [analytics, setAnalytics] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  useEffect(() => {
    loadAnalytics()
  }, [selectedPeriod])

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      // TODO: Replace with real API call, e.g. analyticsService.getAppAnalytics(token, selectedPeriod)
      setAnalytics({
        totalUsers: 1250,
        activeUsers: 890,
        newUsers: 45,
        totalPosts: 3420,
        totalJournals: 8950,
        totalGoals: 2340,
        userGrowth: 12.5,
        engagement: 78.3,
        retention: 65.2,
        dailyActiveUsers: [120, 135, 142, 158, 165, 172, 180],
        topCategories: [
          { name: "Personal Growth", count: 1250, percentage: 35 },
          { name: "Health & Fitness", count: 890, percentage: 25 },
          { name: "Career", count: 712, percentage: 20 },
          { name: "Relationships", count: 534, percentage: 15 },
          { name: "Hobbies", count: 178, percentage: 5 },
        ],
        userActivity: {
          journals: 65,
          goals: 45,
          posts: 30,
          comments: 25,
        },
      })
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadAnalytics()
    setRefreshing(false)
  }

  const periods = [
    { id: "week", name: "Week" },
    { id: "month", name: "Month" },
    { id: "quarter", name: "Quarter" },
    { id: "year", name: "Year" },
  ]

  const statCards = [
    {
      title: "Total Users",
      value: analytics.totalUsers?.toLocaleString() || "0",
      subtitle: `+${analytics.userGrowth || 0}% this ${selectedPeriod}`,
      icon: "people",
      color: colors.primary.coral,
      trend: "up",
    },
    {
      title: "Active Users",
      value: analytics.activeUsers?.toLocaleString() || "0",
      subtitle: `${analytics.retention || 0}% retention rate`,
      icon: "pulse",
      color: colors.success.main,
      trend: "up",
    },
    {
      title: "Total Content",
      value:
        (
          (analytics.totalPosts || 0) +
          (analytics.totalJournals || 0) +
          (analytics.totalGoals || 0)
        ).toLocaleString() || "0",
      subtitle: "Posts, journals & goals",
      icon: "library",
      color: colors.info.main,
      trend: "up",
    },
    {
      title: "Engagement",
      value: `${analytics.engagement || 0}%`,
      subtitle: "User engagement rate",
      icon: "heart",
      color: colors.warning.main,
      trend: "up",
    },
  ]

  if (isLoading) return <LoadingSpinner />

  return (
    <View style={[globalStyles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary.coral]} />
        }
      >
        {/* Header */}
        <LinearGradient colors={colors.gradients.primary} style={{ paddingTop: 60, paddingBottom: 30 }}>
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

              <Text style={[globalStyles.title, { color: colors.text.white }]}>App Analytics</Text>

              <TouchableOpacity
                onPress={() => {
                  /* TODO: Add export functionality */
                }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="download-outline" size={20} color={colors.text.white} />
              </TouchableOpacity>
            </View>

            {/* Period Selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {periods.map((period) => (
                <TouchableOpacity
                  key={period.id}
                  onPress={() => setSelectedPeriod(period.id)}
                  style={{
                    backgroundColor:
                      selectedPeriod === period.id ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.1)",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 12,
                  }}
                >
                  <Text style={[globalStyles.caption, { color: colors.text.white, fontFamily: "Poppins-Medium" }]}>
                    {period.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <View style={[globalStyles.row, { flexWrap: "wrap" }]}>
            {statCards.map((stat, index) => (
              <Animatable.View
                key={stat.title}
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
                      backgroundColor: colors.background.card,
                      borderLeftWidth: 4,
                      borderLeftColor: stat.color,
                    },
                  ]}
                >
                  <View style={[globalStyles.spaceBetween, { marginBottom: 12 }]}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: stat.color + "20",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons name={stat.icon} size={20} color={stat.color} />
                    </View>

                    <Ionicons
                      name={stat.trend === "up" ? "trending-up" : "trending-down"}
                      size={16}
                      color={stat.trend === "up" ? colors.success.main : colors.error.main}
                    />
                  </View>

                  <Text style={[globalStyles.title, { fontSize: 24, color: colors.text.primary, marginBottom: 4 }]}>
                    {stat.value}
                  </Text>

                  <Text style={[globalStyles.heading, { fontSize: 14, marginBottom: 4, color: colors.text.primary }]}>
                    {stat.title}
                  </Text>

                  <Text style={[globalStyles.caption, { color: colors.text.secondary }]}>{stat.subtitle}</Text>
                </View>
              </Animatable.View>
            ))}
          </View>
        </View>

        {/* Daily Active Users Chart */}
        <Animatable.View animation="fadeInUp" duration={600} delay={400}>
          <View style={[globalStyles.card, { margin: 20, backgroundColor: colors.background.card }]}>
            <View style={[globalStyles.spaceBetween, { marginBottom: 16 }]}>
              <Text style={[globalStyles.heading, { color: colors.text.primary }]}>Daily Active Users</Text>
              <Ionicons name="bar-chart-outline" size={20} color={colors.primary.coral} />
            </View>

            <View
              style={[
                globalStyles.row,
                { justifyContent: "space-between", alignItems: "flex-end", height: 120 },
              ]}
            >
              {analytics.dailyActiveUsers?.map((count, index) => {
                const maxCount = Math.max(...analytics.dailyActiveUsers)
                const barHeight = (count / maxCount) * 80
                const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

                return (
                  <View key={index} style={[globalStyles.center, { flex: 1 }]}>
                    <View
                      style={{
                        width: 20,
                        height: Math.max(barHeight, 4),
                        backgroundColor: colors.primary.coral,
                        borderRadius: 10,
                        marginBottom: 8,
                      }}
                    />
                    <Text style={[globalStyles.caption, { color: colors.text.secondary }]}>{days[index]}</Text>
                    <Text style={[globalStyles.caption, { color: colors.text.light, fontSize: 10 }]}>{count}</Text>
                  </View>
                )
              })}
            </View>
          </View>
        </Animatable.View>

        {/* Top Categories */}
        <Animatable.View animation="fadeInUp" duration={600} delay={500}>
          <View style={[globalStyles.card, { margin: 20, backgroundColor: colors.background.card }]}>
            <View style={[globalStyles.spaceBetween, { marginBottom: 16 }]}>
              <Text style={[globalStyles.heading, { color: colors.text.primary }]}>Popular Categories</Text>
              <Ionicons name="pie-chart-outline" size={20} color={colors.primary.coral} />
            </View>

            {analytics.topCategories?.map((category) => (
              <View key={category.name} style={{ marginBottom: 12 }}>
                <View style={[globalStyles.spaceBetween, { marginBottom: 4 }]}>
                  <Text style={[globalStyles.bodySecondary, { color: colors.text.primary }]}>
                    {category.name}
                  </Text>
                  <Text style={[globalStyles.caption, { color: colors.text.secondary }]}>
                    {category.count} ({category.percentage}%)
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
                      width: `${category.percentage}%`,
                      backgroundColor: colors.primary.coral,
                      borderRadius: 3,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </Animatable.View>

        {/* User Activity Breakdown */}
        <Animatable.View animation="fadeInUp" duration={600} delay={600}>
          <View style={[globalStyles.card, { margin: 20, backgroundColor: colors.background.card }]}>
            <View style={[globalStyles.spaceBetween, { marginBottom: 16 }]}>
              <Text style={[globalStyles.heading, { color: colors.text.primary }]}>User Activity</Text>
              <Ionicons name="activity-outline" size={20} color={colors.primary.coral} />
            </View>

            <View style={[globalStyles.row, { flexWrap: "wrap" }]}>
              {Object.entries(analytics.userActivity || {}).map(([activity, percentage]) => (
                <View key={activity} style={{ width: "50%", marginBottom: 16 }}>
                  <View style={[globalStyles.center]}>
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: colors.primary.coral + "20",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <Text style={[globalStyles.heading, { color: colors.primary.coral }]}>
                        {percentage}%
                      </Text>
                    </View>
                    <Text
                      style={[globalStyles.caption, { color: colors.text.secondary, textAlign: "center" }]}
                    >
                      {activity.charAt(0).toUpperCase() + activity.slice(1)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Animatable.View>
      </ScrollView>
    </View>
  )
}

export default AppAnalyticsScreen
