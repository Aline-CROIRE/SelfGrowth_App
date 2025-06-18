"use client"

import { useState } from "react"
import { View, TextInput, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { globalStyles, responsive } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"

const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  multiline = false,
  numberOfLines = 1,
  error = null,
  style = {},
  inputStyle = {},
  leftIcon = null,
  rightIcon = null,
  onRightIconPress = null,
  editable = true,
  maxLength = null,
  onFocus = null,
  onBlur = null,
  returnKeyType = "default",
  onSubmitEditing = null,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry)

  const handleFocus = (e) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const getInputContainerStyle = () => {
    const baseStyle = {
      backgroundColor: colors.background.paper,
      borderRadius: responsive.spacing(12),
      borderWidth: 1,
      borderColor: colors.border.light,
      shadowColor: colors.shadow.light,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    }

    if (isFocused) {
      baseStyle.borderColor = colors.primary.coral
      baseStyle.borderWidth = 2
      baseStyle.shadowColor = colors.shadow.colored
      baseStyle.shadowOpacity = 0.1
    }

    if (error) {
      baseStyle.borderColor = colors.error.main
      baseStyle.borderWidth = 2
    }

    if (!editable) {
      baseStyle.backgroundColor = colors.background.level1
      baseStyle.opacity = 0.7
    }

    return baseStyle
  }

  const getInputStyle = () => {
    const baseStyle = {
      fontSize: responsive.fontSize(16),
      fontWeight: "400",
      color: colors.text.primary,
      paddingVertical: responsive.spacing(16),
      paddingHorizontal: responsive.spacing(20),
      flex: 1,
    }

    if (multiline) {
      baseStyle.minHeight = responsive.spacing(numberOfLines * 24 + 32)
      baseStyle.textAlignVertical = "top"
    }

    if (leftIcon) {
      baseStyle.paddingLeft = responsive.spacing(56)
    }

    if (rightIcon || secureTextEntry) {
      baseStyle.paddingRight = responsive.spacing(56)
    }

    return [baseStyle, inputStyle]
  }

  return (
    <View style={[globalStyles.inputContainer, style]}>
      {label && <Text style={[globalStyles.inputLabel, { marginBottom: responsive.spacing(8) }]}>{label}</Text>}

      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View
            style={{
              position: "absolute",
              left: responsive.spacing(20),
              top: multiline ? responsive.spacing(20) : "50%",
              transform: multiline ? [] : [{ translateY: -10 }],
              zIndex: 1,
            }}
          >
            {leftIcon}
          </View>
        )}

        <TextInput
          style={getInputStyle()}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.hint}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          maxLength={maxLength}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />

        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity
            style={{
              position: "absolute",
              right: responsive.spacing(20),
              top: multiline ? responsive.spacing(20) : "50%",
              transform: multiline ? [] : [{ translateY: -12 }],
              zIndex: 1,
              padding: 4,
            }}
            onPress={secureTextEntry ? togglePasswordVisibility : onRightIconPress}
          >
            {secureTextEntry ? (
              <Ionicons
                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.text.secondary}
              />
            ) : (
              rightIcon
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text style={[globalStyles.bodySmall, { color: colors.error.main, marginTop: 4, marginLeft: 4 }]}>{error}</Text>
      )}

      {maxLength && (
        <Text style={[globalStyles.labelSmall, { textAlign: "right", marginTop: 4, color: colors.text.hint }]}>
          {value?.length || 0}/{maxLength}
        </Text>
      )}
    </View>
  )
}

export default CustomInput
