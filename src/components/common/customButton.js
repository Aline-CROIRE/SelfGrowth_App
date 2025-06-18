"use client"

import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import * as Haptics from "expo-haptics"
import { globalStyles, responsive } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"

const CustomButton = ({
  title,
  onPress,
  variant = "primary", // primary, secondary, outlined, text
  size = "medium", // small, medium, large
  disabled = false,
  loading = false,
  leftIcon = null,
  rightIcon = null,
  style = {},
  textStyle = {},
  gradientColors = null,
  fullWidth = true,
}) => {
  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      onPress()
    }
  }

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: responsive.spacing(25),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.shadow.medium,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    }

    // Size variations
    switch (size) {
      case "small":
        baseStyle.paddingVertical = responsive.spacing(12)
        baseStyle.paddingHorizontal = responsive.spacing(24)
        break
      case "large":
        baseStyle.paddingVertical = responsive.spacing(20)
        baseStyle.paddingHorizontal = responsive.spacing(40)
        break
      default: // medium
        baseStyle.paddingVertical = responsive.spacing(16)
        baseStyle.paddingHorizontal = responsive.spacing(32)
        break
    }

    // Variant styles
    switch (variant) {
      case "secondary":
        baseStyle.backgroundColor = colors.background.paper
        baseStyle.borderWidth = 2
        baseStyle.borderColor = colors.primary.coral
        break
      case "outlined":
        baseStyle.backgroundColor = "transparent"
        baseStyle.borderWidth = 1
        baseStyle.borderColor = colors.border.medium
        baseStyle.shadowOpacity = 0
        baseStyle.elevation = 0
        break
      case "text":
        baseStyle.backgroundColor = "transparent"
        baseStyle.shadowOpacity = 0
        baseStyle.elevation = 0
        baseStyle.paddingVertical = responsive.spacing(8)
        baseStyle.paddingHorizontal = responsive.spacing(16)
        break
      default: // primary
        // Will use gradient
        break
    }

    if (disabled) {
      baseStyle.opacity = 0.6
    }

    if (!fullWidth) {
      baseStyle.alignSelf = "flex-start"
    }

    return [baseStyle, style]
  }

  const getTextStyle = () => {
    const baseTextStyle = {
      fontSize: responsive.fontSize(16),
      fontWeight: "600",
      textAlign: "center",
    }

    // Size variations
    switch (size) {
      case "small":
        baseTextStyle.fontSize = responsive.fontSize(14)
        break
      case "large":
        baseTextStyle.fontSize = responsive.fontSize(18)
        break
    }

    // Variant text colors
    switch (variant) {
      case "secondary":
        baseTextStyle.color = colors.primary.coral
        break
      case "outlined":
        baseTextStyle.color = colors.text.primary
        break
      case "text":
        baseTextStyle.color = colors.primary.coral
        break
      default: // primary
        baseTextStyle.color = colors.text.white
        break
    }

    return [baseTextStyle, textStyle]
  }

  const renderContent = () => (
    <View style={[globalStyles.row, { opacity: loading ? 0.7 : 1 }]}>
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? colors.text.white : colors.primary.coral} size="small" />
      ) : (
        <>
          {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
          {rightIcon && <View style={{ marginLeft: 8 }}>{rightIcon}</View>}
        </>
      )}
    </View>
  )

  if (variant === "primary" && !disabled) {
    const gradientColorsToUse = gradientColors || colors.gradients.primary

    return (
      <TouchableOpacity onPress={handlePress} disabled={disabled || loading} activeOpacity={0.8}>
        <LinearGradient
          colors={gradientColorsToUse}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={getButtonStyle()}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity style={getButtonStyle()} onPress={handlePress} disabled={disabled || loading} activeOpacity={0.8}>
      {renderContent()}
    </TouchableOpacity>
  )
}

export default CustomButton
