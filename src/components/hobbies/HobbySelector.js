import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import * as Haptics from "expo-haptics"
import { COLORS } from "../../styles/colors"
import { TYPOGRAPHY, SPACING, SHADOWS } from "../../styles/globalStyles"

// 🎯 HOBBY DATA - Each hobby with its personality
const HOBBIES = [
  {
    id: "art",
    name: "Art & Drawing",
    icon: "🎨",
    color: COLORS.hobbies.art,
    description: "Express creativity through visual art",
  },
  {
    id: "reading",
    name: "Reading",
    icon: "📚",
    color: COLORS.hobbies.reading,
    description: "Explore worlds through books",
  },
  {
    id: "music",
    name: "Music",
    icon: "🎵",
    color: COLORS.hobbies.music,
    description: "Create and enjoy musical experiences",
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    icon: "⚽",
    color: COLORS.hobbies.sports,
    description: "Stay active and healthy",
  },
  {
    id: "writing",
    name: "Writing",
    icon: "✍️",
    color: COLORS.hobbies.writing,
    description: "Share thoughts through words",
  },
  {
    id: "cooking",
    name: "Cooking",
    icon: "👨‍🍳",
    color: COLORS.hobbies.cooking,
    description: "Create delicious experiences",
  },
  {
    id: "photography",
    name: "Photography",
    icon: "📸",
    color: COLORS.hobbies.photography,
    description: "Capture beautiful moments",
  },
  {
    id: "gardening",
    name: "Gardening",
    icon: "🌱",
    color: COLORS.hobbies.gardening,
    description: "Nurture life and growth",
  },
]

const HobbySelector = ({ selectedHobbies = [], onHobbiesChange, maxSelection = 3 }) => {
  // 🎯 Handle hobby selection with haptic feedback
  const handleHobbyPress = (hobby) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

    let newSelection
    if (selectedHobbies.includes(hobby.id)) {
      // Remove if already selected
      newSelection = selectedHobbies.filter((id) => id !== hobby.id)
    } else if (selectedHobbies.length < maxSelection) {
      // Add if under limit
      newSelection = [...selectedHobbies, hobby.id]
    } else {
      // Replace last one if at limit
      newSelection = [...selectedHobbies.slice(0, -1), hobby.id]
    }

    onHobbiesChange && onHobbiesChange(newSelection)
  }

  // 🎨 Render individual hobby card
  const renderHobbyCard = (hobby) => {
    const isSelected = selectedHobbies.includes(hobby.id)

    return (
      <TouchableOpacity
        key={hobby.id}
        onPress={() => handleHobbyPress(hobby)}
        activeOpacity={0.8}
        style={styles.hobbyContainer}
      >
        <LinearGradient
          colors={isSelected ? [hobby.color, hobby.color + "80"] : [COLORS.neutral.white, COLORS.neutral.lightGray]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hobbyCard, isSelected && styles.selectedCard, !isSelected && SHADOWS.light]}
        >
          {/* Selection indicator */}
          {isSelected && (
            <View style={styles.selectionBadge}>
              <Text style={styles.selectionText}>✓</Text>
            </View>
          )}

          {/* Hobby icon */}
          <Text style={styles.hobbyIcon}>{hobby.icon}</Text>

          {/* Hobby name */}
          <Text style={[styles.hobbyName, { color: isSelected ? COLORS.neutral.white : COLORS.neutral.black }]}>
            {hobby.name}
          </Text>

          {/* Hobby description */}
          <Text
            style={[
              styles.hobbyDescription,
              { color: isSelected ? COLORS.neutral.white + "CC" : COLORS.neutral.darkGray },
            ]}
          >
            {hobby.description}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Passions</Text>
        <Text style={styles.subtitle}>Select up to {maxSelection} hobbies that inspire you</Text>
        <Text style={styles.counter}>
          {selectedHobbies.length} / {maxSelection} selected
        </Text>
      </View>

      {/* Hobby Grid */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.grid}>{HOBBIES.map(renderHobbyCard)}</View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary.coral,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  counter: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary.orange,
    fontWeight: "600",
  },
  scrollContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  hobbyContainer: {
    width: "48%",
    marginBottom: SPACING.md,
  },
  hobbyCard: {
    borderRadius: 16,
    padding: SPACING.lg,
    alignItems: "center",
    minHeight: 140,
    justifyContent: "center",
    position: "relative",
  },
  selectedCard: {
    ...SHADOWS.medium,
    transform: [{ scale: 1.02 }],
  },
  selectionBadge: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  selectionText: {
    color: COLORS.status.success,
    fontSize: 14,
    fontWeight: "bold",
  },
  hobbyIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  hobbyName: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    textAlign: "center",
    marginBottom: SPACING.xs,
  },
  hobbyDescription: {
    ...TYPOGRAPHY.caption,
    textAlign: "center",
    fontSize: 11,
  },
})

export default HobbySelector
