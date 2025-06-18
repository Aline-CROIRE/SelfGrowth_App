"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"
import { useAuth } from "../../context/AuthContext"
import { useEmail } from "../../context/EmailContext"
import CustomInput from "../../components/common/CustomInput"
import CustomButton from "../../components/common/customButton"
import EmailStatusCard from "../../components/common/EmailStatusCard"

const LoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const { login, isLoading, error, clearError } = useAuth()
  const { sendPasswordResetEmail, sendVerificationEmail, emailStatus } = useEmail()

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    clearError()

    if (!validateForm()) {
      return
    }

    const result = await login(formData.email.trim().toLowerCase(), formData.password)

    if (!result.success) {
      // Check if it's an email verification issue
      if (result.message?.includes("verify") || result.message?.includes("verification")) {
        Alert.alert(
          "Email Not Verified",
          "Please verify your email address before signing in. Would you like us to resend the verification email?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Resend Email",
              onPress: () => handleResendVerification(),
            },
          ],
        )
      } else {
        Alert.alert("Sign In Failed", result.message || "Please check your credentials and try again.")
      }
    }
  }

  const handleDemoLogin = async () => {
    clearError()
    const result = await login("user@example.com", "User123!")

    if (!result.success) {
      Alert.alert("Demo Login Failed", "Please try again or contact support.")
    }
  }

  const handleForgotPassword = async () => {
    if (!formData.email.trim()) {
      Alert.alert("Email Required", "Please enter your email address first.")
      return
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.")
      return
    }

    await sendPasswordResetEmail(formData.email.trim().toLowerCase())
    setShowForgotPassword(true)
  }

  const handleResendVerification = async () => {
    if (!formData.email.trim()) {
      Alert.alert("Email Required", "Please enter your email address first.")
      return
    }

    await sendVerificationEmail(formData.email.trim().toLowerCase())
  }

  const handleResendPasswordReset = async () => {
    await sendPasswordResetEmail(formData.email.trim().toLowerCase())
  }

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  return (
    <LinearGradient colors={colors.gradients.sunset} style={globalStyles.container}>
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ paddingTop: 60, paddingHorizontal: 20, marginBottom: 40 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
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

          <Animatable.View animation="fadeInDown" duration={1000}>
            <Text style={[globalStyles.title, { color: colors.text.white, marginBottom: 8 }]}>Welcome Back!</Text>
            <Text style={[globalStyles.bodySecondary, { color: colors.text.white, opacity: 0.9 }]}>
              Continue your growth journey
            </Text>
          </Animatable.View>
        </View>

        {/* Form */}
        <Animatable.View
          animation="slideInUp"
          duration={1000}
          style={{
            flex: 1,
            backgroundColor: colors.background.primary,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingHorizontal: 20,
            paddingTop: 30,
          }}
        >
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
            label="Password"
            value={formData.password}
            onChangeText={(value) => updateFormData("password", value)}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            error={errors.password}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.text.secondary} />}
            rightIcon={
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.text.secondary}
              />
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          {error && (
            <Animatable.View animation="shake" duration={500}>
              <Text
                style={[globalStyles.bodySecondary, { color: colors.error, textAlign: "center", marginVertical: 10 }]}
              >
                {error}
              </Text>
            </Animatable.View>
          )}

          {/* Email Status Cards */}
          {emailStatus.verification.sent && (
            <EmailStatusCard
              type="verification"
              email={formData.email}
              onResend={handleResendVerification}
              style={{ marginBottom: 16 }}
            />
          )}

          {showForgotPassword && emailStatus.passwordReset.sent && (
            <EmailStatusCard
              type="passwordReset"
              email={formData.email}
              onResend={handleResendPasswordReset}
              style={{ marginBottom: 16 }}
            />
          )}

          <CustomButton
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            style={{ marginTop: 20, marginBottom: 16 }}
          />

          <CustomButton
            title="Try Demo Account"
            onPress={handleDemoLogin}
            variant="outline"
            style={{ marginBottom: 20 }}
          />

          {/* Forgot Password */}
          <TouchableOpacity onPress={handleForgotPassword} style={{ alignSelf: "center", marginBottom: 30 }}>
            <Text style={[globalStyles.bodySecondary, { color: colors.primary.coral }]}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={[globalStyles.row, { justifyContent: "center" }]}>
            <Text style={globalStyles.bodySecondary}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text
                style={[globalStyles.bodySecondary, { color: colors.primary.coral, fontFamily: "Poppins-SemiBold" }]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>
    </LinearGradient>
  )
}

export default LoginScreen
