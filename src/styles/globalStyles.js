import { StyleSheet, Dimensions, Platform } from "react-native"
import { colors } from "./colors"

const { width, height } = Dimensions.get("window")

// Responsive breakpoints
const breakpoints = {
  small: 320,
  medium: 375,
  large: 414,
  tablet: 768,
}

// Responsive helper functions
export const responsive = {
  width: (percentage) => (width * percentage) / 100,
  height: (percentage) => (height * percentage) / 100,

  // Font scaling
  fontSize: (size) => {
    if (width < breakpoints.small) return size * 0.85
    if (width > breakpoints.large) return size * 1.1
    return size
  },

  // Spacing scaling
  spacing: (size) => {
    if (width < breakpoints.small) return size * 0.9
    if (width > breakpoints.tablet) return size * 1.2
    return size
  },

  // Check device type
  isSmallDevice: () => width < breakpoints.medium,
  isLargeDevice: () => width > breakpoints.large,
  isTablet: () => width > breakpoints.tablet,
}

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },

  safeContainer: {
    flex: 1,
    backgroundColor: colors.background.default,
    paddingTop: Platform.OS === "ios" ? 44 : 24,
  },

  screenContainer: {
    flex: 1,
    backgroundColor: colors.background.default,
  },

  contentContainer: {
    flexGrow: 1,
    paddingBottom: responsive.spacing(20),
  },

  // Layout helpers
  row: { flexDirection: "row", alignItems: "center" },
  rowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowCenter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  column: { flexDirection: "column" },
  center: { justifyContent: "center", alignItems: "center" },
  centerHorizontal: { alignItems: "center" },
  centerVertical: { justifyContent: "center" },

  // Typography
  displayLarge: {
    fontSize: responsive.fontSize(32),
    fontWeight: "800",
    lineHeight: responsive.fontSize(40),
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontSize: responsive.fontSize(28),
    fontWeight: "700",
    lineHeight: responsive.fontSize(36),
    color: colors.text.primary,
    letterSpacing: -0.25,
  },
  displaySmall: {
    fontSize: responsive.fontSize(24),
    fontWeight: "600",
    lineHeight: responsive.fontSize(32),
    color: colors.text.primary,
  },
  headlineLarge: {
    fontSize: responsive.fontSize(22),
    fontWeight: "600",
    lineHeight: responsive.fontSize(28),
    color: colors.text.primary,
  },
  headlineMedium: {
    fontSize: responsive.fontSize(20),
    fontWeight: "600",
    lineHeight: responsive.fontSize(26),
    color: colors.text.primary,
  },
  headlineSmall: {
    fontSize: responsive.fontSize(18),
    fontWeight: "600",
    lineHeight: responsive.fontSize(24),
    color: colors.text.primary,
  },
  titleLarge: {
    fontSize: responsive.fontSize(16),
    fontWeight: "600",
    lineHeight: responsive.fontSize(22),
    color: colors.text.primary,
  },
  titleMedium: {
    fontSize: responsive.fontSize(14),
    fontWeight: "600",
    lineHeight: responsive.fontSize(20),
    color: colors.text.primary,
  },
  titleSmall: {
    fontSize: responsive.fontSize(12),
    fontWeight: "600",
    lineHeight: responsive.fontSize(18),
    color: colors.text.primary,
  },
  bodyLarge: {
    fontSize: responsive.fontSize(16),
    fontWeight: "400",
    lineHeight: responsive.fontSize(24),
    color: colors.text.primary,
  },
  bodyMedium: {
    fontSize: responsive.fontSize(14),
    fontWeight: "400",
    lineHeight: responsive.fontSize(20),
    color: colors.text.primary,
  },
  bodySmall: {
    fontSize: responsive.fontSize(12),
    fontWeight: "400",
    lineHeight: responsive.fontSize(18),
    color: colors.text.secondary,
  },
  labelLarge: {
    fontSize: responsive.fontSize(14),
    fontWeight: "500",
    lineHeight: responsive.fontSize(20),
    color: colors.text.primary,
  },
  labelMedium: {
    fontSize: responsive.fontSize(12),
    fontWeight: "500",
    lineHeight: responsive.fontSize(16),
    color: colors.text.primary,
  },
  labelSmall: {
    fontSize: responsive.fontSize(10),
    fontWeight: "500",
    lineHeight: responsive.fontSize(14),
    color: colors.text.secondary,
  },

  // Card styles
  card: {
    backgroundColor: colors.background.paper,
    borderRadius: responsive.spacing(16),
    padding: responsive.spacing(20),
    marginVertical: responsive.spacing(8),
    marginHorizontal: responsive.spacing(16),
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardSmall: {
    backgroundColor: colors.background.paper,
    borderRadius: responsive.spacing(12),
    padding: responsive.spacing(16),
    marginVertical: responsive.spacing(6),
    marginHorizontal: responsive.spacing(12),
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardElevated: {
    backgroundColor: colors.background.paper,
    borderRadius: responsive.spacing(20),
    padding: responsive.spacing(24),
    marginVertical: responsive.spacing(12),
    marginHorizontal: responsive.spacing(16),
    shadowColor: colors.shadow.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },

  // Button styles
  buttonPrimary: {
    backgroundColor: colors.primary.coral,
    borderRadius: responsive.spacing(25),
    paddingVertical: responsive.spacing(16),
    paddingHorizontal: responsive.spacing(32),
    shadowColor: colors.shadow.colored,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderRadius: responsive.spacing(25),
    paddingVertical: responsive.spacing(14),
    paddingHorizontal: responsive.spacing(28),
    borderWidth: 2,
    borderColor: colors.primary.coral,
  },
  buttonOutlined: {
    backgroundColor: "transparent",
    borderRadius: responsive.spacing(12),
    paddingVertical: responsive.spacing(12),
    paddingHorizontal: responsive.spacing(24),
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  buttonText: {
    fontSize: responsive.fontSize(16),
    fontWeight: "600",
    color: colors.text.white,
    textAlign: "center",
  },
  buttonTextSecondary: {
    fontSize: responsive.fontSize(16),
    fontWeight: "600",
    color: colors.primary.coral,
    textAlign: "center",
  },

  // Input styles
  inputContainer: { marginVertical: responsive.spacing(8) },
  inputLabel: {
    fontSize: responsive.fontSize(14),
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: responsive.spacing(8),
  },
  input: {
    backgroundColor: colors.background.paper,
    borderRadius: responsive.spacing(12),
    paddingVertical: responsive.spacing(16),
    paddingHorizontal: responsive.spacing(20),
    fontSize: responsive.fontSize(16),
    fontWeight: "400",
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputFocused: {
    borderColor: colors.primary.coral,
    borderWidth: 2,
    shadowColor: colors.shadow.colored,
    shadowOpacity: 0.1,
  },
  inputError: {
    borderColor: colors.error.main,
    borderWidth: 2,
  },
  textArea: {
    backgroundColor: colors.background.paper,
    borderRadius: responsive.spacing(12),
    paddingVertical: responsive.spacing(16),
    paddingHorizontal: responsive.spacing(20),
    fontSize: responsive.fontSize(16),
    fontWeight: "400",
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
    minHeight: responsive.spacing(120),
    textAlignVertical: "top",
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // Spacing utilities (padding & margin helpers)
  p4: { padding: responsive.spacing(4) },
  p8: { padding: responsive.spacing(8) },
  p12: { padding: responsive.spacing(12) },
  p16: { padding: responsive.spacing(16) },
  p20: { padding: responsive.spacing(20) },
  p24: { padding: responsive.spacing(24) },

  px4: { paddingHorizontal: responsive.spacing(4) },
  px8: { paddingHorizontal: responsive.spacing(8) },
  px12: { paddingHorizontal: responsive.spacing(12) },
  px16: { paddingHorizontal: responsive.spacing(16) },
  px20: { paddingHorizontal: responsive.spacing(20) },
  px24: { paddingHorizontal: responsive.spacing(24) },

  py4: { paddingVertical: responsive.spacing(4) },
  py8: { paddingVertical: responsive.spacing(8) },
  py12: { paddingVertical: responsive.spacing(12) },
  py16: { paddingVertical: responsive.spacing(16) },
  py20: { paddingVertical: responsive.spacing(20) },
  py24: { paddingVertical: responsive.spacing(24) },

  m4: { margin: responsive.spacing(4) },
  m8: { margin: responsive.spacing(8) },
  m12: { margin: responsive.spacing(12) },
  m16: { margin: responsive.spacing(16) },
  m20: { margin: responsive.spacing(20) },
  m24: { margin: responsive.spacing(24) },

  mx4: { marginHorizontal: responsive.spacing(4) },
  mx8: { marginHorizontal: responsive.spacing(8) },
  mx12: { marginHorizontal: responsive.spacing(12) },
  mx16: { marginHorizontal: responsive.spacing(16) },
  mx20: { marginHorizontal: responsive.spacing(20) },
  mx24: { marginHorizontal: responsive.spacing(24) },

  my4: { marginVertical: responsive.spacing(4) },
  my8: { marginVertical: responsive.spacing(8) },
  my12: { marginVertical: responsive.spacing(12) },
  my16: { marginVertical: responsive.spacing(16) },
  my20: { marginVertical: responsive.spacing(20) },
  my24: { marginVertical: responsive.spacing(24) },

  // Flex utilities
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  flex3: { flex: 3 },

  // Position utilities
  absolute: { position: "absolute" },
  relative: { position: "relative" },

  // Overflow utilities
  overflowHidden: { overflow: "hidden" },
  overflowVisible: { overflow: "visible" },

  // Opacity utilities
  opacity50: { opacity: 0.5 },
  opacity75: { opacity: 0.75 },
  opacity90: { opacity: 0.9 },
})

// ✅ Screen dimensions (outside StyleSheet)
export const screenWidth = width
export const screenHeight = height

// ✅ Animations (safe to keep as-is)
export const animations = {
  fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
  slideInUp: { from: { opacity: 0, translateY: 50 }, to: { opacity: 1, translateY: 0 } },
  slideInDown: { from: { opacity: 0, translateY: -50 }, to: { opacity: 1, translateY: 0 } },
  slideInLeft: { from: { opacity: 0, translateX: -50 }, to: { opacity: 1, translateX: 0 } },
  slideInRight: { from: { opacity: 0, translateX: 50 }, to: { opacity: 1, translateX: 0 } },
  scaleIn: { from: { opacity: 0, scale: 0.8 }, to: { opacity: 1, scale: 1 } },
  bounce: {
    0: { scale: 1 },
    0.5: { scale: 1.05 },
    1: { scale: 1 },
  },
}
