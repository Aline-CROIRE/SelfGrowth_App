"use client"

// 🌟 DAILY INSPIRATION COMPONENT - Beautiful daily quotes and verses

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import * as Animatable from "react-native-animatable"
import * as Haptics from "expo-haptics"

import { COLORS } from "../../styles/colors"
import { TYPOGRAPHY, SPACING, SHADOWS } from "../../styles/globalStyles"
import { getDailyQuote, getDailyVerse } from "../../utils/dailyContent"

const DailyInspiration = ({ style = {} }) => {
  const [showVerse, setShowVerse] = useState(false)
  const dailyQuote = getDailyQuote()
  const dailyVerse = getDailyVerse()

  const toggleContent = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setShowVerse(!showVerse)
  }

  const content = showVerse ? dailyVerse : dailyQuote

  return (
    <Animatable.View animation="fadeIn" duration={800} style={[styles.container, style]}>
      <TouchableOpacity onPress={toggleContent} activeOpacity={0.9}>
        <LinearGradient
          colors={showVerse ? COLORS.gradients.gentle : COLORS.gradients.dream}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Content Type Header */}
          <View style={styles.header}>
            <Text style={styles.contentType}>{showVerse ? "✝️ Daily Word" : "💭 Daily Quote"}</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>

          {/* Main Content */}
          <Text style={styles.content}>"{content.verse || content.quote}"</Text>

          {/* Author/Reference */}
          <Text style={styles.author}>— {content.reference || content.author}</Text>

          {/* Tap Hint */}
          <View style={styles.footer}>
            <Text style={styles.tapHint}>Tap to see {showVerse ? "quote" : "verse"}</Text>
            <Text style={styles.switchIcon}>{showVerse ? "💭" : "✝️"}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
  },
  gradient: {
    borderRadius: 16,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  contentType: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.neutral.white,
    fontWeight: "600",
  },
  date: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.white + "DD",
  },
  content: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.white,
    fontStyle: "italic",
    marginBottom: SPACING.md,
    lineHeight: 24,
  },
  author: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.neutral.white + "DD",
    textAlign: "right",
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.sm,
  },
  tapHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.white + "99",
  },
  switchIcon: {
    fontSize: 16,
  },
})

export default DailyInspiration
