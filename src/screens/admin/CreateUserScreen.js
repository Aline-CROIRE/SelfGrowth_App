"use client"

import React, { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import { userService } from "../../services/userService" // Make sure this is correctly imported
import { globalStyles } from "../../styles/globalStyles"

// --- Reusable Components (can be moved to separate files) ---

const FormInput = ({ label, value, onChangeText, error, ...props }) => {
  const { colors } = useTheme()
  const errorColor = colors.error.main
  const defaultBorderColor = colors.border.light
  
  return (
    <View style={styles.inputContainer}>
      <Text style={[globalStyles.labelMedium, { color: colors.text.secondary, marginBottom: 8 }]}>{label}</Text>
      <View style={[styles.inputWrapper, { backgroundColor: colors.background.primary, borderColor: error ? errorColor : defaultBorderColor }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={colors.text.secondary}
          style={[styles.input, { color: colors.text.primary }]}
          {...props}
        />
      </View>
      {error && <Text style={[globalStyles.caption, { color: errorColor, marginTop: 4 }]}>{error}</Text>}
    </View>
  )
}

const FormRadioGroup = ({ label, options, selectedValue, onSelect }) => {
  const { colors } = useTheme()
  return (
    <View style={styles.inputContainer}>
      <Text style={[globalStyles.labelMedium, { color: colors.text.secondary, marginBottom: 8 }]}>{label}</Text>
      <View style={styles.radioGroupContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => onSelect(option.value)}
            style={[
              styles.radioButton,
              {
                backgroundColor: selectedValue === option.value ? colors.primary.coral : colors.background.card,
                borderColor: selectedValue === option.value ? colors.primary.coral : colors.border.light,
              },
            ]}
          >
            <Text style={[globalStyles.labelMedium, { color: selectedValue === option.value ? colors.text.white : colors.text.primary }]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const CreateUserScreen = ({ navigation }) => {
  const { colors } = useTheme()
  const { token } = useAuth()

  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    role: "USER", // Default role
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required."
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required."
    if (!formData.username.trim()) newErrors.username = "Username is required."
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(formData.username)) newErrors.username = "Username must be 3-30 chars (letters, numbers, _)."
    if (!formData.email.trim()) newErrors.email = "Email is required."
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) newErrors.email = "Please enter a valid email address."
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateUser = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please correct the errors before submitting.")
      return
    }
    
    setIsSaving(true)
    try {
      const userData = {
        email: formData.email.trim().toLowerCase(),
        username: formData.username.trim().toLowerCase(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        role: formData.role,
      }
      
      await userService.createUser(userData, token)
      
      Alert.alert(
        "Success", 
        "User created successfully! An email with a temporary password and setup instructions has been sent to them.", 
        [{ text: "OK", onPress: () => navigation.goBack() }]
      )
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to create user.")
    } finally {
      setIsSaving(false)
    }
  }

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const FormSection = ({ title, children }) => (
    <View style={[globalStyles.card, { backgroundColor: colors.background.card, marginBottom: 20, padding: 20 }]}>
      <Text style={[globalStyles.titleMedium, { color: colors.text.primary, marginBottom: 16 }]}>{title}</Text>
      {children}
    </View>
  )

  return (
    <KeyboardAvoidingView
      style={[globalStyles.container, { backgroundColor: colors.background.primary }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -100}
    >
      <LinearGradient colors={colors.gradients.primary} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text.white} />
          </TouchableOpacity>
          <Text style={[globalStyles.title, { color: colors.text.white }]}>Create New User</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <FormSection title="User Information">
          <FormInput label="First Name" value={formData.firstName} onChangeText={(val) => updateFormData("firstName", val)} error={errors.firstName} placeholder="User's first name" />
          <FormInput label="Last Name" value={formData.lastName} onChangeText={(val) => updateFormData("lastName", val)} error={errors.lastName} placeholder="User's last name" />
          <FormInput label="Username" value={formData.username} onChangeText={(val) => updateFormData("username", val)} error={errors.username} placeholder="Create a unique username" autoCapitalize="none" />
          <FormInput label="Email Address" value={formData.email} onChangeText={(val) => updateFormData("email", val)} error={errors.email} placeholder="User's email address" keyboardType="email-address" autoCapitalize="none" />
        </FormSection>

        <FormSection title="Assign Role">
          <FormRadioGroup
            label="Role"
            options={[
              { label: "User", value: "USER" },
              { label: "Admin", value: "ADMIN" },
              { label: "Super Admin", value: "SUPER_ADMIN" },
            ]}
            selectedValue={formData.role}
            onSelect={(val) => updateFormData("role", val)}
          />
           <Text style={[globalStyles.caption, { color: colors.text.secondary, marginTop: 4 }]}>
              The user will receive an email with a temporary password and account setup instructions.
            </Text>
        </FormSection>

        <TouchableOpacity onPress={handleCreateUser} disabled={isSaving} style={[styles.saveButton, { backgroundColor: isSaving ? colors.neutral.gray400 : colors.primary.coral, opacity: isSaving ? 0.7 : 1 }]}>
          {isSaving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveButtonText}>Create User & Send Invite</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerButton: {
    padding: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  radioGroupContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radioButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
    marginBottom: 10,
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
})

export default CreateUserScreen