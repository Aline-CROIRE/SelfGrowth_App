// 🎨 GLOBAL DESIGN SYSTEM - Beautiful, Consistent, Professional

import { StyleSheet, Dimensions } from "react-native"
import { COLORS } from "./colors"

const { width, height } = Dimensions.get("window")

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}

export const TYPOGRAPHY = {
  // Headers - Bold & Inspiring
  h1: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.neutral.black,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.neutral.black,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.neutral.black,
    lineHeight: 28,
  },

  // Body Text - Clear & Readable
  body: {
    fontSize: 16,
    fontWeight: "400",
    color: COLORS.neutral.darkGray,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400",
    color: COLORS.neutral.darkGray,
    lineHeight: 20,
  },

  // Special Text - Emphasis & Style
  caption: {
    fontSize: 12,
    fontWeight: "400",
    color: COLORS.neutral.mediumGray,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
  },
}

export const SHADOWS = {
  light: {
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  heavy: {
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
}

export const GLOBAL_STYLES = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },

  // Card Styles - Beautiful containers
  card: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: SPACING.lg,
    margin: SPACING.sm,
    ...SHADOWS.medium,
  },
  cardSmall: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: SPACING.md,
    margin: SPACING.xs,
    ...SHADOWS.light,
  },

  // Input Styles - Clean & Modern
  input: {
    backgroundColor: COLORS.neutral.lightGray,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.neutral.black,
    marginVertical: SPACING.sm,
  },

  // Button Base Styles
  buttonBase: {
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },

  // Layout Helpers
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
})

// 📱 RESPONSIVE HELPERS
export const SCREEN = {
  width,
  height,
  isSmall: width < 350,
  isMedium: width >= 350 && width < 414,
  isLarge: width >= 414,
}
