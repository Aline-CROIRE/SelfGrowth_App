"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Alert, Image, StyleSheet, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"
import { useData } from "../../context/DataContext"
import { formatDate } from "../../utils/dateUtils"

const JournalDetailScreen = ({ route, navigation }) => {
  const { journal } = route.params
  const { deleteJournal } = useData()
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleEdit = () => {
    // Navigate to edit screen with journal data
    Alert.alert("Feature Coming Soon", "Journal editing will be available in the next update.")
  }

  const handleDelete = () => {
    Alert.alert("Delete Journal", "Are you sure you want to delete this journal entry? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: confirmDelete },
    ])
  }

  const confirmDelete = async () => {
    setIsDeleting(true)

    try {
      const result = await deleteJournal(journal.id)

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        navigation.goBack()
      } else {
        Alert.alert("Error", result.message || "Failed to delete journal entry")
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <View style={globalStyles.safeContainer}>
      <ScrollView style={globalStyles.container} contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
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
              onPress={handleEdit}
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
              <Ionicons name="create-outline" size={20} color={colors.text.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.background.overlay,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Journal Content */}
        <View>
          <Text style={globalStyles.title}>{journal.title}</Text>

          <View style={[globalStyles.row, { marginVertical: 16 }]}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: `${getMoodColor(journal.mood)}20`,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                marginRight: 12,
              }}
            >
              <Ionicons
                name={getMoodIcon(journal.mood)}
                size={16}
                color={getMoodColor(journal.mood)}
                style={{ marginRight: 6 }}
              />
              <Text style={[globalStyles.caption, { color: getMoodColor(journal.mood) }]}>
                {journal.mood?.charAt(0).toUpperCase() + journal.mood?.slice(1)}
              </Text>
            </View>

            <View style={[globalStyles.row, { alignItems: "center" }]}>
              <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
              <Text style={[globalStyles.caption, { marginLeft: 4, color: colors.text.secondary }]}>
                {formatDate(journal.createdAt)}
              </Text>
            </View>
          </View>

          {/* Images */}
          {journal.images && journal.images.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {journal.images.map((image, index) => (
                <TouchableOpacity key={index} style={{ marginRight: 12 }}>
                  <Image
                    source={{ uri: image }}
                    style={{ width: 200, height: 150, borderRadius: 8 }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Content */}
          <Text style={[globalStyles.body, { lineHeight: 24, marginBottom: 24 }]}>{journal.content}</Text>

          {/* Tags */}
          {journal.tags && journal.tags.length > 0 && (
            <View style={[globalStyles.row, { flexWrap: "wrap", marginBottom: 24 }]}>
              {journal.tags.map((tag, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: colors.background.overlay,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text style={[globalStyles.caption, { color: colors.primary.coral }]}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Stats */}
          <View
            style={{
              backgroundColor: colors.background.overlay,
              borderRadius: 16,
              padding: 16,
              marginBottom: 40,
            }}
          >
            <View style={[globalStyles.row, { justifyContent: "space-around" }]}>
              <View style={[globalStyles.center]}>
                <Text style={[globalStyles.heading, { marginBottom: 4 }]}>{journal.wordCount || 0}</Text>
                <Text style={globalStyles.caption}>Words</Text>
              </View>

              <View style={[globalStyles.center]}>
                <Text style={[globalStyles.heading, { marginBottom: 4 }]}>
                  {journal.images ? journal.images.length : 0}
                </Text>
                <Text style={globalStyles.caption}>Images</Text>
              </View>

              <View style={[globalStyles.center]}>
                <Text style={[globalStyles.heading, { marginBottom: 4 }]}>
                  {journal.tags ? journal.tags.length : 0}
                </Text>
                <Text style={globalStyles.caption}>Tags</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {isDeleting && (
        <View
          style={{
            ...StyleSheet.absoluteFill,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={colors.primary.coral} />
        </View>
      )}
    </View>
  )
}

export default JournalDetailScreen
