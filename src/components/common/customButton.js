import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import * as Haptics from "expo-haptics"
import { COLORS } from "../../styles/colors"
import { TYPOGRAPHY, SPACING, SHADOWS } from "../../styles/globalStyles"

const CustomButton = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  icon = null,
  style = {},
  textStyle = {},
}) => {
  // 🎯 Handle button press with haptic feedback
  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      onPress && onPress()
    }
  }

  // 🎨 Get button styles based on variant
  const getButtonConfig = () => {
    switch (variant) {
      case "primary":
        return {
          gradient: COLORS.gradients.sunrise,
          textColor: COLORS.neutral.white,
          shadow: SHADOWS.medium,
        }
      case "secondary":
        return {
          gradient: COLORS.gradients.gentle,
          textColor: COLORS.neutral.black,
          shadow: SHADOWS.light,
        }
      case "success":
        return {
          gradient: COLORS.gradients.success,
          textColor: COLORS.neutral.white,
          shadow: SHADOWS.medium,
        }
      case "outline":
        return {
          gradient: [COLORS.neutral.white, COLORS.neutral.white],
          textColor: COLORS.primary.coral,
          shadow: SHADOWS.light,
          border: true,
        }
      default:
        return {
          gradient: COLORS.gradients.sunrise,
          textColor: COLORS.neutral.white,
          shadow: SHADOWS.medium,
        }
    }
  }

  // 📏 Get size configuration
  const getSizeConfig = () => {
    switch (size) {
      case "small":
        return {
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.md,
          fontSize: 14,
          minHeight: 36,
        }
      case "large":
        return {
          paddingVertical: SPACING.lg,
          paddingHorizontal: SPACING.xl,
          fontSize: 18,
          minHeight: 56,
        }
      default: // medium
        return {
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.lg,
          fontSize: 16,
          minHeight: 48,
        }
    }
  }

  const buttonConfig = getButtonConfig()
  const sizeConfig = getSizeConfig()

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.container, { opacity: disabled ? 0.6 : 1 }, style]}
    >
      <LinearGradient
        colors={buttonConfig.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.gradient,
          {
            paddingVertical: sizeConfig.paddingVertical,
            paddingHorizontal: sizeConfig.paddingHorizontal,
            minHeight: sizeConfig.minHeight,
          },
          buttonConfig.shadow,
          buttonConfig.border && styles.border,
        ]}
      >
        {icon && (
          <Text style={[styles.icon, { color: buttonConfig.textColor }]}>
            {icon}
          </Text>
        )}
        <Text
          style={[
            styles.text,
            {
              color: buttonConfig.textColor,
              fontSize: sizeConfig.fontSize,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
  },
  gradient: {
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  border: {
    borderWidth: 2,
    borderColor: COLORS.primary.coral,
  },
  text: {
    ...TYPOGRAPHY.button,
    textAlign: "center",
  },
  icon: {
    marginRight: SPACING.sm,
    fontSize: 18,
  },
})

export default CustomButton
