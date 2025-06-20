"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import CustomInput from "../../components/common/CustomInput"
import CustomButton from "../../components/common/customButton"
import HobbySelector from "../../components/hobbies/HobbySelector"

const RegisterScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    hobbies: [],
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register, isLoading, error, clearError } = useAuth()
  const { setSelectedHobby } = useTheme()

  const validateStep1 = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, number, and special character"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.hobbies || formData.hobbies.length === 0) {
      newErrors.hobbies = "Please select at least one hobby"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    clearError()
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
    } else {
      navigation.goBack()
    }
  }

  const handleRegister = async () => {
    clearError()

    if (!validateStep2()) {
      return
    }

    // Set primary hobby for theming
    if (formData.hobbies.length > 0) {
      setSelectedHobby(formData.hobbies[0])
    }

    const registrationData = {
      email: formData.email.trim().toLowerCase(),
      username: formData.username.trim().toLowerCase(),
      password: formData.password,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
    }

    const result = await register(registrationData)

    if (result.success) {
      // Show success notification and redirect to login
      Alert.alert(
        "Registration Successful",
        `A verification email has been sent to ${formData.email}. Please check your inbox to activate your account.`,
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ],
        { cancelable: false }
      )
    } else {
      Alert.alert("Registration Failed", result.message || "Please try again.")
    }
  }

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const renderStep1 = () => (
    <Animatable.View animation="fadeInRight" duration={500}>
      <Text style={[globalStyles.heading, { textAlign: "center", marginBottom: 20 }]}>Create Your Account</Text>

      <CustomInput
        label="Email Address"
        value={formData.email}
        onChangeText={(value) => updateFormData("email", value)}
        placeholder="Enter your email"
        keyboardType="email-address"
        error={errors.email}
        leftIcon={<Ionicons name="mail-outline" size={20} color={colors.text.secondary} />}
      />

      <CustomInput
        label="Username"
        value={formData.username}
        onChangeText={(value) => updateFormData("username", value)}
        placeholder="Choose a username"
        error={errors.username}
        leftIcon={<Ionicons name="person-outline" size={20} color={colors.text.secondary} />}
      />

      <CustomInput
        label="Password"
        value={formData.password}
        onChangeText={(value) => updateFormData("password", value)}
        placeholder="Create a strong password"
        secureTextEntry={!showPassword}
        error={errors.password}
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.text.secondary} />}
        rightIcon={
          <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={colors.text.secondary} />
        }
        onRightIconPress={() => setShowPassword(!showPassword)}
      />

      <CustomInput
        label="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(value) => updateFormData("confirmPassword", value)}
        placeholder="Confirm your password"
        secureTextEntry={!showConfirmPassword}
        error={errors.confirmPassword}
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.text.secondary} />}
        rightIcon={
          <Ionicons
            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={colors.text.secondary}
          />
        }
        onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      <CustomButton title="Next" onPress={handleNext} style={{ marginTop: 20 }} />
    </Animatable.View>
  )

  const renderStep2 = () => (
    <Animatable.View animation="fadeInLeft" duration={500}>
      <Text style={[globalStyles.heading, { textAlign: "center", marginBottom: 20 }]}>Tell Us About Yourself</Text>

      <CustomInput
        label="First Name"
        value={formData.firstName}
        onChangeText={(value) => updateFormData("firstName", value)}
        placeholder="Enter your first name"
        error={errors.firstName}
        leftIcon={<Ionicons name="person-outline" size={20} color={colors.text.secondary} />}
      />

      <CustomInput
        label="Last Name"
        value={formData.lastName}
        onChangeText={(value) => updateFormData("lastName", value)}
        placeholder="Enter your last name"
        error={errors.lastName}
        leftIcon={<Ionicons name="person-outline" size={20} color={colors.text.secondary} />}
      />

      <HobbySelector
        selectedHobbies={formData.hobbies || []}
        onHobbySelect={(hobbies) => updateFormData("hobbies", hobbies)}
        multiSelect={true}
        style={{ marginVertical: 20 }}
      />

      {errors.hobbies && (
        <Text style={[globalStyles.caption, { color: colors.error, textAlign: "center", marginTop: 8 }]}>
          {errors.hobbies}
        </Text>
      )}

      {error && (
        <Animatable.View animation="shake" duration={500}>
          <Text style={[globalStyles.bodySecondary, { color: colors.error, textAlign: "center", marginVertical: 10 }]}>
            {error}
          </Text>
        </Animatable.View>
      )}

      <CustomButton title="Create Account" onPress={handleRegister} loading={isLoading} style={{ marginTop: 20 }} />
    </Animatable.View>
  )

  return (
    <LinearGradient colors={colors.gradients.sunset} style={globalStyles.container}>
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ paddingTop: 60, paddingHorizontal: 20, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={handleBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text.white} />
          </TouchableOpacity>

          {/* Progress Indicator */}
          <View style={[globalStyles.row, { marginBottom: 20 }]}>
            <View
              style={{
                flex: 1,
                height: 4,
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                borderRadius: 2,
                marginRight: 8,
              }}
            >
              <View
                style={{
                  height: "100%",
                  backgroundColor: colors.text.white,
                  borderRadius: 2,
                  width: currentStep >= 1 ? "100%" : "0%",
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                height: 4,
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                borderRadius: 2,
                marginLeft: 8,
              }}
            >
              <View
                style={{
                  height: "100%",
                  backgroundColor: colors.text.white,
                  borderRadius: 2,
                  width: currentStep >= 2 ? "100%" : "0%",
                }}
              />
            </View>
          </View>

          <Animatable.View animation="fadeInDown" duration={1000}>
            <Text style={[globalStyles.title, { color: colors.text.white, marginBottom: 8 }]}>Join SelfGrow</Text>
            <Text style={[globalStyles.bodySecondary, { color: colors.text.white, opacity: 0.9 }]}>
              {`Step ${currentStep} of 2`}
            </Text>
          </Animatable.View>
        </View>

        {/* Form */}
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background.primary,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingHorizontal: 20,
            paddingTop: 30,
            paddingBottom: 30,
          }}
        >
          {currentStep === 1 ? renderStep1() : renderStep2()}

          {/* Sign In Link */}
          <View style={[globalStyles.row, { justifyContent: "center", marginTop: 30 }]}>
            <Text style={globalStyles.bodySecondary}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text
                style={[globalStyles.bodySecondary, { color: colors.primary.coral, fontFamily: "Poppins-SemiBold" }]}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

export default RegisterScreen