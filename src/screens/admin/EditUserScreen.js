"use client"

import React, { useState, useEffect } from "react"
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
import LoadingSpinner from "../../components/common/LoadingSpinner"

// Reusable Input Component for this screen
const FormInput = ({ label, value, onChangeText, error, ...props }) => {
  const { colors } = useTheme()
  const errorColor = colors.error.main
  const defaultBorderColor = colors.border.light
  
  return (
    <View style={styles.inputContainer}>
      <Text style={[globalStyles.labelMedium, { color: colors.text.secondary, marginBottom: 8 }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.text.secondary}
        style={[
          styles.input,
          {
            backgroundColor: colors.background.primary,
            color: colors.text.primary,
            borderColor: error ? errorColor : defaultBorderColor,
          },
        ]}
        {...props}
      />
      {error && <Text style={[globalStyles.caption, { color: errorColor, marginTop: 4 }]}>{error}</Text>}
    </View>
  )
}

// Reusable Radio Group Component
const FormRadioGroup = ({ label, options, selectedValue, onSelect }) => {
  const { colors } = useTheme()
  return (
    <View style={styles.inputContainer}>
      <Text style={[globalStyles.labelMedium, { color: colors.text.secondary, marginBottom: 8 }]}>{label}</Text>
      <View style={styles.radioGroupContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => onSelect(option)}
            style={[
              styles.radioButton,
              {
                backgroundColor: selectedValue === option ? colors.primary.coral : colors.background.card,
                borderColor: selectedValue === option ? colors.primary.coral : colors.border.light,
              },
            ]}
          >
            <Text style={[globalStyles.labelMedium, { color: selectedValue === option ? colors.text.white : colors.text.primary }]}>
              {option.replace("_", " ")}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const EditUserScreen = ({ navigation, route }) => {
  const { colors } = useTheme()
  const { token } = useAuth()
  const { userId } = route.params || {} // Get userId from navigation params

  const [userToEdit, setUserToEdit] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    role: "USER",
    status: "ACTIVE",
  })
  const [errors, setErrors] = useState({})
  
  useEffect(() => {
    if (!userId) {
      Alert.alert("Error", "No user ID provided.", [{ text: "OK", onPress: () => navigation.goBack() }])
      return
    }

    const fetchUser = async () => {
      try {
        setIsLoading(true)
        // You'll need a getUserById method in your userService
        const response = await userService.getUserById(userId, token) 
        if (response.success) {
          const fetchedUser = response.data.user
          setUserToEdit(fetchedUser)
          setFormData({
            firstName: fetchedUser.firstName || "",
            lastName: fetchedUser.lastName || "",
            username: fetchedUser.username || "",
            email: fetchedUser.email || "",
            role: fetchedUser.role || "USER",
            status: fetchedUser.status || "ACTIVE",
          })
        } else {
          throw new Error(response.message)
        }
      } catch (error) {
        Alert.alert("Error", error.message || "Failed to load user data.", [{ text: "OK", onPress: () => navigation.goBack() }])
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [userId, token])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.username.trim()) newErrors.username = "Username is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUpdateUser = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please check the form for errors.")
      return
    }
    
    setIsSaving(true)
    try {
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        status: formData.status,
      }

      await userService.updateUser(userId, userData, token)
      Alert.alert("Success", "User updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update user")
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
    <View style={[globalStyles.card, { backgroundColor: colors.background.card, marginBottom: 20 }]}>
      <Text style={[globalStyles.titleMedium, { color: colors.text.primary, marginBottom: 16 }]}>{title}</Text>
      {children}
    </View>
  )

  if (isLoading) {
    return <LoadingSpinner />
  }

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
          <Text style={[globalStyles.title, { color: colors.text.white }]}>Edit User</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <FormSection title="Personal Information">
          <FormInput label="First Name" value={formData.firstName} onChangeText={(val) => updateFormData("firstName", val)} error={errors.firstName} placeholder="Enter first name" />
          <FormInput label="Last Name" value={formData.lastName} onChangeText={(val) => updateFormData("lastName", val)} error={errors.lastName} placeholder="Enter last name" />
          <FormInput label="Username" value={formData.username} onChangeText={(val) => updateFormData("username", val)} error={errors.username} placeholder="Enter username" autoCapitalize="none" />
          <FormInput label="Email" value={formData.email} onChangeText={(val) => updateFormData("email", val)} error={errors.email} placeholder="Enter email" keyboardType="email-address" autoCapitalize="none" />
        </FormSection>

        <FormSection title="Role & Status">
          <FormRadioGroup label="Role" options={["USER", "ADMIN", "SUPER_ADMIN"]} selectedValue={formData.role} onSelect={(val) => updateFormData("role", val)} />
          <FormRadioGroup label="Status" options={["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING_VERIFICATION"]} selectedValue={formData.status} onSelect={(val) => updateFormData("status", val)} />
        </FormSection>

        {userToEdit && (
          <FormSection title="Account Information">
            <View style={styles.infoRow}>
              <Text style={[globalStyles.body, { color: colors.text.secondary }]}>Created:</Text>
              <Text style={[globalStyles.body, { color: colors.text.primary }]}>{new Date(userToEdit.createdAt).toLocaleDateString()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[globalStyles.body, { color: colors.text.secondary }]}>Last Login:</Text>
              <Text style={[globalStyles.body, { color: colors.text.primary }]}>{userToEdit.lastLoginAt ? new Date(userToEdit.lastLoginAt).toLocaleDateString() : "Never"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[globalStyles.body, { color: colors.text.secondary }]}>Email Verified:</Text>
              <Text style={[globalStyles.body, { color: userToEdit.emailVerified ? colors.success.main : colors.error.main }]}>{userToEdit.emailVerified ? "Yes" : "No"}</Text>
            </View>
          </FormSection>
        )}

        <TouchableOpacity onPress={handleUpdateUser} disabled={isSaving} style={[styles.saveButton, { backgroundColor: isSaving ? colors.neutral.gray400 : colors.primary.coral, opacity: isSaving ? 0.7 : 1 }]}>
          {isSaving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveButtonText}>Update User</Text>}
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
  input: {
    borderWidth: 1,
    borderRadius: 8,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
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

export default EditUserScreen