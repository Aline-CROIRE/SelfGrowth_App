"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Alert, Share } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import * as Haptics from "expo-haptics"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"
import { useData } from "../../context/DataContext"
import { useTheme } from "../../context/ThemeContext"
import { formatDate, timeAgo } from "../../utils/dateUtils"
import CustomButton from "../../components/common/customButton"

const GoalDetailScreen = ({ route, navigation }) => {
  const { goal } = route.params
  const { updateGoal, deleteGoal } = useData()
  const { getHobbyColor } = useTheme()
  const [currentGoal, setCurrentGoal] = useState(goal)
  const [isUpdating, setIsUpdating] = useState(false)

  const hobbyColor = getHobbyColor()

  const priorityColors = {
    LOW: colors.success,
    MEDIUM: colors.warning,
    HIGH: colors.primary.orange,
    URGENT: colors.error,
  }

  const statusColors = {
    ACTIVE: colors.info,
    COMPLETED: colors.success,
    PAUSED: colors.warning,
    CANCELLED: colors.error,
  }

  const handleUpdateProgress = async (newProgress) => {
    setIsUpdating(true)

    try {
      const result = await updateGoal(currentGoal.id, { progress: newProgress })

      if (result.success) {
        setCurrentGoal((prev) => ({ ...prev, progress: newProgress }))
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      } else {
        Alert.alert("Error", result.message || "Failed to update progress")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update progress")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true)

    try {
      const updateData = { status: newStatus }
      if (newStatus === "COMPLETED") {
        updateData.progress = 100
        updateData.completedAt = new Date().toISOString()
      }

      const result = await updateGoal(currentGoal.id, updateData)

      if (result.success) {
        setCurrentGoal((prev) => ({ ...prev, ...updateData }))
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

        if (newStatus === "COMPLETED") {
          Alert.alert("🎉 Congratulations!", "You've completed your goal! Keep up the great work!")
        }
      } else {
        Alert.alert("Error", result.message || "Failed to update status")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update status")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = () => {
    Alert.alert("Delete Goal", "Are you sure you want to delete this goal? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const result = await deleteGoal(currentGoal.id)
            if (result.success) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
              navigation.goBack()
            } else {
              Alert.alert("Error", result.message || "Failed to delete goal")
            }
          } catch (error) {
            Alert.alert("Error", "Failed to delete goal")
          }
        },
      },
    ])
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my goal: ${currentGoal.title}\n\nProgress: ${currentGoal.progress}%\nStatus: ${currentGoal.status}`,
        title: currentGoal.title,
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const renderProgressBar = () => {
    const progressSteps = [0, 25, 50, 75, 100]

    return (
      <View style={{ marginVertical: 20 }}>
        <View style={[globalStyles.spaceBetween, { marginBottom: 12 }]}>
          <Text style={[globalStyles.bodySecondary, { fontWeight: "600" }]}>Progress</Text>
          <Text style={[globalStyles.bodySecondary, { fontWeight: "600", color: hobbyColor }]}>
            {currentGoal.progress}%
          </Text>
        </View>

        <View
          style={{
            height: 8,
            backgroundColor: colors.background.overlay,
            borderRadius: 4,
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${currentGoal.progress}%`,
              backgroundColor: hobbyColor,
              borderRadius: 4,
            }}
          />
        </View>

        <View style={[globalStyles.row, { justifyContent: "space-between" }]}>
          {progressSteps.map((step) => (
            <TouchableOpacity
              key={step}
              onPress={() => handleUpdateProgress(step)}
              disabled={isUpdating}
              style={{
                width: 50,
                height: 32,
                borderRadius: 16,
                backgroundColor: currentGoal.progress >= step ? hobbyColor : colors.background.overlay,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: currentGoal.progress >= step ? hobbyColor : colors.text.light,
              }}
            >
              <Text
                style={[
                  globalStyles.caption,
                  {
                    color: currentGoal.progress >= step ? colors.text.white : colors.text.secondary,
                    fontWeight: "600",
                  },
                ]}
              >
                {step}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  const renderStatusButtons = () => {
    const statuses = [
      { id: "ACTIVE", name: "Active", icon: "play-circle" },
      { id: "PAUSED", name: "Paused", icon: "pause-circle" },
      { id: "COMPLETED", name: "Completed", icon: "checkmark-circle" },
      { id: "CANCELLED", name: "Cancelled", icon: "close-circle" },
    ]

    return (
      <View style={{ marginVertical: 20 }}>
        <Text style={[globalStyles.bodySecondary, { marginBottom: 12, fontWeight: "600" }]}>Status</Text>

        <View style={[globalStyles.row, { flexWrap: "wrap" }]}>
          {statuses.map((status) => (
            <TouchableOpacity
              key={status.id}
              onPress={() => handleStatusChange(status.id)}
              disabled={isUpdating}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: currentGoal.status === status.id ? statusColors[status.id] : colors.background.card,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 8,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: statusColors[status.id],
                shadowColor: colors.shadow.light,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Ionicons
                name={status.icon}
                size={16}
                color={currentGoal.status === status.id ? colors.text.white : statusColors[status.id]}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  globalStyles.caption,
                  {
                    color: currentGoal.status === status.id ? colors.text.white : statusColors[status.id],
                    fontWeight: "600",
                  },
                ]}
              >
                {status.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  const isOverdue =
    currentGoal.targetDate && new Date(currentGoal.targetDate) < new Date() && currentGoal.status !== "COMPLETED"

  return (
    <View style={globalStyles.safeContainer}>
      <ScrollView style={globalStyles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Header */}
        <LinearGradient
          colors={[priorityColors[currentGoal.priority] + "20", colors.background.primary]}
          style={{ paddingTop: 20, paddingBottom: 30 }}
        >
          <View style={{ paddingHorizontal: 20 }}>
            <View style={[globalStyles.spaceBetween, { marginBottom: 20 }]}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.background.overlay,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
              </TouchableOpacity>

              <View style={globalStyles.row}>
                <TouchableOpacity
                  onPress={handleShare}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.background.overlay,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="share-outline" size={20} color={colors.text.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("EditGoal", { goal: currentGoal })}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.background.overlay,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="create-outline" size={20} color={colors.text.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Goal Header */}
            <View style={[globalStyles.row, { alignItems: "flex-start", marginBottom: 16 }]}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: priorityColors[currentGoal.priority],
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                  shadowColor: priorityColors[currentGoal.priority],
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <Ionicons name="flag" size={28} color={colors.text.white} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[globalStyles.title, { fontSize: 22, marginBottom: 4 }]}>{currentGoal.title}</Text>

                <View style={[globalStyles.row, { alignItems: "center", marginBottom: 8 }]}>
                  <View
                    style={{
                      backgroundColor: statusColors[currentGoal.status] + "20",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      marginRight: 8,
                    }}
                  >
                    <Text
                      style={[globalStyles.caption, { color: statusColors[currentGoal.status], fontWeight: "600" }]}
                    >
                      {currentGoal.status}
                    </Text>
                  </View>

                  <View
                    style={{
                      backgroundColor: priorityColors[currentGoal.priority] + "20",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={[globalStyles.caption, { color: priorityColors[currentGoal.priority], fontWeight: "600" }]}
                    >
                      {currentGoal.priority} PRIORITY
                    </Text>
                  </View>
                </View>

                {currentGoal.category && (
                  <View style={[globalStyles.row, { alignItems: "center" }]}>
                    <Ionicons name="folder-outline" size={14} color={colors.text.secondary} />
                    <Text style={[globalStyles.caption, { marginLeft: 4, color: colors.text.secondary }]}>
                      {currentGoal.category}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Overdue Warning */}
            {isOverdue && (
              <View
                style={{
                  backgroundColor: colors.error + "10",
                  borderWidth: 1,
                  borderColor: colors.error + "30",
                  borderRadius: 12,
                  padding: 12,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons name="warning" size={20} color={colors.error} style={{ marginRight: 8 }} />
                <Text style={[globalStyles.bodySecondary, { color: colors.error, flex: 1 }]}>
                  This goal is overdue. Consider updating the target date or marking it as completed.
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>

        <View style={{ padding: 20 }}>
          {/* Description */}
          {currentGoal.description && (
            <View style={[globalStyles.card, { marginHorizontal: 0, marginBottom: 20 }]}>
              <View style={[globalStyles.row, { marginBottom: 12 }]}>
                <Ionicons name="document-text-outline" size={20} color={hobbyColor} style={{ marginRight: 8 }} />
                <Text style={[globalStyles.bodySecondary, { fontWeight: "600" }]}>Description</Text>
              </View>
              <Text style={[globalStyles.body, { lineHeight: 24 }]}>{currentGoal.description}</Text>
            </View>
          )}

          {/* Progress Section */}
          <View style={[globalStyles.card, { marginHorizontal: 0, marginBottom: 20 }]}>
            <View style={[globalStyles.row, { marginBottom: 16 }]}>
              <Ionicons name="analytics-outline" size={20} color={hobbyColor} style={{ marginRight: 8 }} />
              <Text style={[globalStyles.bodySecondary, { fontWeight: "600" }]}>Progress Tracking</Text>
            </View>

            {renderProgressBar()}
          </View>

          {/* Status Management */}
          <View style={[globalStyles.card, { marginHorizontal: 0, marginBottom: 20 }]}>
            <View style={[globalStyles.row, { marginBottom: 16 }]}>
              <Ionicons name="settings-outline" size={20} color={hobbyColor} style={{ marginRight: 8 }} />
              <Text style={[globalStyles.bodySecondary, { fontWeight: "600" }]}>Status Management</Text>
            </View>

            {renderStatusButtons()}
          </View>

          {/* Goal Details */}
          <View style={[globalStyles.card, { marginHorizontal: 0, marginBottom: 20 }]}>
            <View style={[globalStyles.row, { marginBottom: 16 }]}>
              <Ionicons name="information-circle-outline" size={20} color={hobbyColor} style={{ marginRight: 8 }} />
              <Text style={[globalStyles.bodySecondary, { fontWeight: "600" }]}>Goal Details</Text>
            </View>

            <View style={{ marginBottom: 12 }}>
              <View style={[globalStyles.spaceBetween, { marginBottom: 8 }]}>
                <Text style={[globalStyles.caption, { color: colors.text.secondary }]}>Created</Text>
                <Text style={[globalStyles.caption, { fontWeight: "600" }]}>{formatDate(currentGoal.createdAt)}</Text>
              </View>

              {currentGoal.targetDate && (
                <View style={[globalStyles.spaceBetween, { marginBottom: 8 }]}>
                  <Text style={[globalStyles.caption, { color: colors.text.secondary }]}>Target Date</Text>
                  <Text
                    style={[
                      globalStyles.caption,
                      { fontWeight: "600", color: isOverdue ? colors.error : colors.text.primary },
                    ]}
                  >
                    {formatDate(currentGoal.targetDate)}
                  </Text>
                </View>
              )}

              {currentGoal.completedAt && (
                <View style={[globalStyles.spaceBetween, { marginBottom: 8 }]}>
                  <Text style={[globalStyles.caption, { color: colors.text.secondary }]}>Completed</Text>
                  <Text style={[globalStyles.caption, { fontWeight: "600", color: colors.success }]}>
                    {formatDate(currentGoal.completedAt)}
                  </Text>
                </View>
              )}

              <View style={[globalStyles.spaceBetween]}>
                <Text style={[globalStyles.caption, { color: colors.text.secondary }]}>Last Updated</Text>
                <Text style={[globalStyles.caption, { fontWeight: "600" }]}>{timeAgo(currentGoal.updatedAt)}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ marginTop: 20 }}>
            {currentGoal.status !== "COMPLETED" && (
              <CustomButton
                title="Mark as Completed"
                onPress={() => handleStatusChange("COMPLETED")}
                loading={isUpdating}
                style={{ marginBottom: 12 }}
                leftIcon={<Ionicons name="checkmark-circle" size={20} color={colors.text.white} />}
              />
            )}

            <CustomButton
              title="Edit Goal"
              onPress={() => navigation.navigate("EditGoal", { goal: currentGoal })}
              variant="secondary"
              style={{ marginBottom: 12 }}
              leftIcon={<Ionicons name="create-outline" size={20} color={hobbyColor} />}
            />

            <CustomButton
              title="Delete Goal"
              onPress={handleDelete}
              variant="danger"
              leftIcon={<Ionicons name="trash-outline" size={20} color={colors.text.white} />}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default GoalDetailScreen
