import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"
import * as Progress from "react-native-progress"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"
import { formatDate } from "../../utils/dateUtils"

const GoalCard = ({ goal, onPress, style = {} }) => {
  const getStatusColor = (status) => {
    const statusColors = {
      ACTIVE: colors.primary.coral,
      COMPLETED: colors.success,
      PAUSED: colors.warning,
      CANCELLED: colors.text.light,
    }
    return statusColors[status] || colors.text.secondary
  }

  const getStatusIcon = (status) => {
    const statusIcons = {
      ACTIVE: "play-circle",
      COMPLETED: "checkmark-circle",
      PAUSED: "pause-circle",
      CANCELLED: "close-circle",
    }
    return statusIcons[status] || "help-circle"
  }

  const getPriorityColor = (priority) => {
    const priorityColors = {
      LOW: colors.success,
      MEDIUM: colors.warning,
      HIGH: colors.primary.orange,
      URGENT: colors.error,
    }
    return priorityColors[priority] || colors.text.secondary
  }

  const isOverdue = () => {
    if (!goal.targetDate) return false
    return new Date(goal.targetDate) < new Date() && goal.status !== "COMPLETED"
  }

  const getDaysRemaining = () => {
    if (!goal.targetDate) return null
    const today = new Date()
    const target = new Date(goal.targetDate)
    const diffTime = target - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const truncateText = (text, maxLength = 100) => {
    if (!text) return ""
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  return (
    <Animatable.View animation="fadeInUp" duration={600} style={style}>
      <TouchableOpacity
        onPress={() => onPress && onPress(goal)}
        style={[
          globalStyles.card,
          {
            marginHorizontal: 20,
            marginBottom: 16,
            borderLeftWidth: 4,
            borderLeftColor: getStatusColor(goal.status),
          },
        ]}
        activeOpacity={0.8}
      >
        {/* Header */}
        <View style={[globalStyles.spaceBetween, { marginBottom: 12 }]}>
          <Text style={[globalStyles.heading, { fontSize: 18, flex: 1, marginRight: 12 }]} numberOfLines={2}>
            {goal.title}
          </Text>

          {/* Status Indicator */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: `${getStatusColor(goal.status)}20`,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <Ionicons
              name={getStatusIcon(goal.status)}
              size={14}
              color={getStatusColor(goal.status)}
              style={{ marginRight: 4 }}
            />
            <Text style={[globalStyles.caption, { color: getStatusColor(goal.status), fontFamily: "Poppins-Medium" }]}>
              {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Description */}
        {goal.description && (
          <Text style={[globalStyles.bodySecondary, { lineHeight: 20, marginBottom: 12 }]}>
            {truncateText(goal.description)}
          </Text>
        )}

        {/* Progress Bar */}
        <View style={{ marginBottom: 12 }}>
          <View style={[globalStyles.spaceBetween, { marginBottom: 6 }]}>
            <Text style={[globalStyles.caption, { color: colors.text.secondary }]}>Progress</Text>
            <Text style={[globalStyles.caption, { color: colors.text.secondary, fontFamily: "Poppins-Medium" }]}>
              {goal.progress || 0}%
            </Text>
          </View>

          <Progress.Bar
            progress={(goal.progress || 0) / 100}
            width={null}
            height={6}
            color={getStatusColor(goal.status)}
            unfilledColor={colors.background.overlay}
            borderWidth={0}
            borderRadius={3}
          />
        </View>

        {/* Category and Priority */}
        <View style={[globalStyles.row, { marginBottom: 12, flexWrap: "wrap" }]}>
          {/* Category */}
          <View
            style={{
              backgroundColor: colors.background.overlay,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              marginRight: 8,
              marginBottom: 4,
            }}
          >
            <Text style={[globalStyles.caption, { color: colors.text.secondary }]}>{goal.category}</Text>
          </View>

          {/* Priority */}
          <View
            style={{
              backgroundColor: `${getPriorityColor(goal.priority)}20`,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              marginBottom: 4,
            }}
          >
            <Text
              style={[globalStyles.caption, { color: getPriorityColor(goal.priority), fontFamily: "Poppins-Medium" }]}
            >
              {goal.priority} Priority
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={[globalStyles.spaceBetween]}>
          <View style={[globalStyles.row]}>
            {goal.targetDate && (
              <>
                <Ionicons
                  name={isOverdue() ? "warning" : "calendar-outline"}
                  size={14}
                  color={isOverdue() ? colors.error : colors.text.light}
                />
                <Text
                  style={[
                    globalStyles.caption,
                    {
                      marginLeft: 4,
                      color: isOverdue() ? colors.error : colors.text.light,
                      fontFamily: isOverdue() ? "Poppins-Medium" : "Poppins-Regular",
                    },
                  ]}
                >
                  {isOverdue() ? "Overdue" : `${getDaysRemaining()} days left`}
                </Text>
              </>
            )}
          </View>

          <View style={[globalStyles.row]}>
            <Text style={[globalStyles.caption, { marginRight: 8, color: colors.text.light }]}>
              {formatDate(goal.createdAt)}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.text.light} />
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  )
}

export default GoalCard
