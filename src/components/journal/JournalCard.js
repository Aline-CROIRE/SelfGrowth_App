import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"
import { formatDate } from "../../utils/dateUtils"

const JournalCard = ({ journal, onPress, style = {} }) => {
  const getMoodColor = (mood) => {
    return colors.moods[mood?.toLowerCase()] || colors.text.secondary
  }

  const getMoodIcon = (mood) => {
    const moodIcons = {
      amazing: "happy",
      good: "happy-outline",
      okay: "remove-circle-outline",
      bad: "sad-outline",
      terrible: "sad",
    }
    return moodIcons[mood?.toLowerCase()] || "help-circle-outline"
  }

  const truncateText = (text, maxLength = 120) => {
    if (!text) return ""
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  return (
    <Animatable.View animation="fadeInUp" duration={600} style={style}>
      <TouchableOpacity
        onPress={() => onPress && onPress(journal)}
        style={[
          globalStyles.card,
          {
            marginHorizontal: 20,
            marginBottom: 16,
          },
        ]}
        activeOpacity={0.8}
      >
        {/* Header */}
        <View style={[globalStyles.spaceBetween, { marginBottom: 12 }]}>
          <Text style={[globalStyles.heading, { fontSize: 18, flex: 1, marginRight: 12 }]} numberOfLines={2}>
            {journal.title}
          </Text>

          {/* Mood Indicator */}
          {journal.mood && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: `${getMoodColor(journal.mood)}20`,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Ionicons
                name={getMoodIcon(journal.mood)}
                size={14}
                color={getMoodColor(journal.mood)}
                style={{ marginRight: 4 }}
              />
              <Text style={[globalStyles.caption, { color: getMoodColor(journal.mood), fontFamily: "Poppins-Medium" }]}>
                {journal.mood.charAt(0).toUpperCase() + journal.mood.slice(1)}
              </Text>
            </View>
          )}
        </View>

        {/* Content Preview */}
        <Text style={[globalStyles.bodySecondary, { lineHeight: 20, marginBottom: 12 }]}>
          {truncateText(journal.content)}
        </Text>

        {/* Images Preview */}
        {journal.images && journal.images.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {journal.images.slice(0, 3).map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    marginRight: 8,
                  }}
                  resizeMode="cover"
                />
              ))}
              {journal.images.length > 3 && (
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    backgroundColor: colors.background.overlay,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={[globalStyles.caption, { color: colors.text.secondary, fontFamily: "Poppins-Medium" }]}>
                    +{journal.images.length - 3}
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}

        {/* Tags */}
        {journal.tags && journal.tags.length > 0 && (
          <View style={[globalStyles.row, { flexWrap: "wrap", marginBottom: 12 }]}>
            {journal.tags.slice(0, 3).map((tag, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: colors.background.overlay,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  marginRight: 6,
                  marginBottom: 4,
                }}
              >
                <Text style={[globalStyles.caption, { color: colors.primary.coral }]}>#{tag}</Text>
              </View>
            ))}
            {journal.tags.length > 3 && (
              <Text style={[globalStyles.caption, { color: colors.text.light, alignSelf: "center" }]}>
                +{journal.tags.length - 3} more
              </Text>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={[globalStyles.spaceBetween]}>
          <View style={[globalStyles.row]}>
            <Ionicons name="time-outline" size={14} color={colors.text.light} />
            <Text style={[globalStyles.caption, { marginLeft: 4, color: colors.text.light }]}>
              {formatDate(journal.createdAt)}
            </Text>
          </View>

          <View style={[globalStyles.row]}>
            {journal.wordCount && (
              <>
                <Ionicons name="document-text-outline" size={14} color={colors.text.light} />
                <Text style={[globalStyles.caption, { marginLeft: 4, marginRight: 12, color: colors.text.light }]}>
                  {journal.wordCount} words
                </Text>
              </>
            )}

            <Ionicons name="chevron-forward" size={16} color={colors.text.light} />
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  )
}

export default JournalCard
