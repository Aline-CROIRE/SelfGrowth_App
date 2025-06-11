"use client"

// 🔐 LOGIN SCREEN - Beautiful, secure authentication with real persistence

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  TouchableOpacity,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import * as Animatable from "react-native-animatable"
import { SafeAreaView } from "react-native-safe-area-context"

import CustomButton from "../../components/common/customButton"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import { useApp } from "../../context/AppContext"
import { COLORS } from "../../styles/colors"
import { TYPOGRAPHY, SPACING, GLOBAL_STYLES } from "../../styles/globalStyles"

const LoginScreen = ({ navigation }) => {
  const { actions } = useApp()

  // 📝 FORM STATE
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // 🎯 FORM VALIDATION
  const validateForm = () => {
    if (!formData.email.trim()) {
      Alert.alert("Missing Email", "Please enter your email address")
      return false
    }
    if (!formData.email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address")
      return false
    }
    if (!formData.password.trim()) {
      Alert.alert("Missing Password", "Please enter your password")
      return false
    }
    if (formData.password.length < 6) {
      Alert.alert("Invalid Password", "Password must be at least 6 characters")
      return false
    }
    return true
  }

  // 🚀 HANDLE LOGIN - Real authentication with user lookup
  const handleLogin = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Authenticate user using our database
      const result = await actions.login(formData.email, formData.password)

      if (result.success) {
        Alert.alert(
          `Welcome Back, ${result.user.name}! 🎉`,
          `Great to see you again! Ready to continue your growth journey?`,
          [{ text: "Let's Go!", style: "default" }],
        )
      } else {
        Alert.alert("Login Failed", result.error || "Please check your credentials and try again.")
      }
    } catch (error) {
      console.error("Login error:", error)
      Alert.alert("Login Failed", "Unable to sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // 🔄 DEMO LOGIN - Enhanced with proper demo user
  const handleDemoLogin = async () => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const result = await actions.loginDemo()

      if (result.success) {
        Alert.alert(
          "Demo Mode Active! 🚀",
          `Welcome ${result.user.name}! You're using a demo account with sample data to explore all features.`,
          [{ text: "Start Exploring!", style: "default" }],
        )
      }
    } catch (error) {
      console.error("Demo login error:", error)
      Alert.alert("Demo Failed", "Unable to start demo mode. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="large" color={COLORS.primary.coral} />
          <Text style={styles.loadingText}>{formData.email ? "Signing you in..." : "Preparing demo..."}</Text>
          <Text style={styles.loadingSubtext}>
            {formData.email ? "Verifying your credentials" : "Loading sample data"}
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary.coral} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardContainer}>
        {/* Beautiful Header */}
        <LinearGradient
          colors={COLORS.gradients.sunrise}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Animatable.View animation="bounceIn" duration={1000}>
            <Text style={styles.logo}>🌱</Text>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={500}>
            <Text style={styles.headerTitle}>Welcome Back</Text>
            <Text style={styles.headerSubtitle}>Continue your growth journey</Text>
          </Animatable.View>
        </LinearGradient>

        {/* Login Form */}
        <Animatable.View animation="fadeInUp" delay={800} style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={COLORS.neutral.mediumGray}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text.toLowerCase().trim() })}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                placeholderTextColor={COLORS.neutral.mediumGray}
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eyeIcon}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() =>
              Alert.alert(
                "Reset Password",
                "Password reset functionality will be available in the next update. For now, you can use any email and password combination to sign in.",
                [{ text: "Got it!", style: "default" }],
              )
            }
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Buttons */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Sign In"
              onPress={handleLogin}
              variant="primary"
              size="large"
              disabled={isLoading}
              style={styles.loginButton}
            />

            <CustomButton
              title="Try Demo Account"
              onPress={handleDemoLogin}
              variant="outline"
              size="medium"
              disabled={isLoading}
              style={styles.demoButton}
            />
          </View>

          {/* Social Login Placeholder */}
          <View style={styles.socialContainer}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() =>
                  Alert.alert("Coming Soon", "Social login will be available in the next update!", [
                    { text: "OK", style: "default" },
                  ])
                }
              >
                <Text style={styles.socialIcon}>📱</Text>
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() =>
                  Alert.alert("Coming Soon", "Social login will be available in the next update!", [
                    { text: "OK", style: "default" },
                  ])
                }
              >
                <Text style={styles.socialIcon}>📘</Text>
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animatable.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text style={styles.footerLink} onPress={() => navigation.navigate("Register")}>
              Sign Up
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
  },
  keyboardContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
  },
  loadingText: {
    ...TYPOGRAPHY.h3,
    marginTop: SPACING.lg,
    textAlign: "center",
  },
  loadingSubtext: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.darkGray,
    marginTop: SPACING.sm,
    textAlign: "center",
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xxl,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    fontSize: 60,
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.neutral.white,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.white + "CC",
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  input: {
    ...GLOBAL_STYLES.input,
    marginBottom: SPACING.md,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: "absolute",
    right: SPACING.md,
    top: SPACING.md,
    padding: SPACING.xs,
  },
  eyeIcon: {
    fontSize: 20,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: SPACING.xl,
  },
  forgotPasswordText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary.coral,
    fontWeight: "600",
  },
  buttonContainer: {
    marginBottom: SPACING.xl,
  },
  loginButton: {
    marginBottom: SPACING.md,
  },
  demoButton: {
    marginBottom: SPACING.lg,
  },
  socialContainer: {
    marginBottom: SPACING.lg,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.neutral.lightGray,
  },
  dividerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.mediumGray,
    paddingHorizontal: SPACING.md,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.neutral.lightGray,
    borderRadius: 12,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
  },
  socialIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  socialText: {
    ...TYPOGRAPHY.button,
    color: COLORS.neutral.darkGray,
  },
  footer: {
    padding: SPACING.lg,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral.lightGray,
  },
  footerText: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.darkGray,
  },
  footerLink: {
    color: COLORS.primary.coral,
    fontWeight: "600",
  },
})

export default LoginScreen
