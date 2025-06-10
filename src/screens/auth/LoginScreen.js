"use client"

// 🔐 LOGIN SCREEN - Beautiful, secure authentication

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
      Alert.alert("Error", "Please enter your email")
      return false
    }
    if (!formData.email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email")
      return false
    }
    if (!formData.password.trim()) {
      Alert.alert("Error", "Please enter your password")
      return false
    }
    return true
  }

  // 🚀 HANDLE LOGIN
  const handleLogin = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, accept any email/password combination
      // In real app, this would validate against your backend

      const userData = {
        id: Date.now().toString(),
        name: formData.email.split("@")[0], // Use email prefix as name
        email: formData.email,
        joinedAt: new Date().toISOString(),
        hobbies: ["reading", "writing"], // Default hobbies for demo
      }

      // Save to context
      actions.login(userData)
      actions.setHobbies(["reading", "writing"])

      // Navigate to main app
      navigation.replace("Main")
    } catch (error) {
      Alert.alert("Error", "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // 🔄 DEMO LOGIN - Quick login for testing
  const handleDemoLogin = async () => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const demoUser = {
        id: "demo-user",
        name: "Demo User",
        email: "demo@selfgrow.app",
        joinedAt: new Date().toISOString(),
        hobbies: ["art", "reading", "music"],
      }

      actions.login(demoUser)
      actions.setHobbies(["art", "reading", "music"])
      navigation.replace("Main")
    } catch (error) {
      Alert.alert("Error", "Demo login failed")
    } finally {
      setIsLoading(false)
    }
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
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                placeholderTextColor={COLORS.neutral.mediumGray}
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eyeIcon}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Buttons */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title={isLoading ? "Signing In..." : "Sign In"}
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
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>📱</Text>
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
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
