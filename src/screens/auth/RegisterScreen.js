"use client"

// 🎯 REGISTER SCREEN - Beautiful onboarding with real data persistence

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import * as Animatable from "react-native-animatable"
import { SafeAreaView } from "react-native-safe-area-context"

import CustomButton from "../../components/common/customButton"
import HobbySelector from "../../components/hobbies/HobbySelector"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import { useApp } from "../../context/AppContext"
import { COLORS } from "../../styles/colors"
import { TYPOGRAPHY, SPACING, GLOBAL_STYLES } from "../../styles/globalStyles"

const RegisterScreen = ({ navigation }) => {
  const { actions } = useApp()

  // 📝 FORM STATE
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [selectedHobbies, setSelectedHobbies] = useState([])
  const [currentStep, setCurrentStep] = useState(1) // 1: Basic Info, 2: Hobbies
  const [isLoading, setIsLoading] = useState(false)

  // 🎯 FORM VALIDATION
  const validateStep1 = () => {
    if (!formData.name.trim()) {
      Alert.alert("Missing Name", "Please enter your full name")
      return false
    }
    if (formData.name.trim().length < 2) {
      Alert.alert("Invalid Name", "Name must be at least 2 characters long")
      return false
    }
    if (!formData.email.trim()) {
      Alert.alert("Missing Email", "Please enter your email address")
      return false
    }
    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      Alert.alert("Invalid Email", "Please enter a valid email address")
      return false
    }
    if (formData.password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters long")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match. Please try again.")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (selectedHobbies.length === 0) {
      Alert.alert("Select Hobbies", "Please select at least one hobby to personalize your experience")
      return false
    }
    return true
  }

  // 🚀 HANDLE REGISTRATION - Real account creation
  const handleRegister = async () => {
    if (!validateStep2()) return

    setIsLoading(true)

    try {
      // Simulate realistic API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Register user with our database
      const result = await actions.register({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password, // In real app, this would be hashed
        hobbies: selectedHobbies,
        preferences: {
          notifications: true,
          theme: "default",
          language: "en",
        },
      })

      if (result.success) {
        Alert.alert(
          "Welcome to SelfGrow! 🎉",
          `Congratulations ${result.user.name}! Your account has been created successfully. Let's start your growth journey!`,
          [{ text: "Let's Begin!", style: "default" }],
        )
      } else {
        Alert.alert("Registration Failed", result.error || "Unable to create account. Please try again.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      Alert.alert("Registration Failed", "Unable to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // 🎨 RENDER STEP 1 - Basic Information
  const renderStep1 = () => (
    <Animatable.View animation="fadeInRight" duration={600} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Tell us about yourself</Text>
      <Text style={styles.stepSubtitle}>Let's create your personal growth profile</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor={COLORS.neutral.mediumGray}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          autoCapitalize="words"
          autoComplete="name"
          maxLength={50}
        />

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor={COLORS.neutral.mediumGray}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text.toLowerCase().trim() })}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          maxLength={100}
        />

        <TextInput
          style={styles.input}
          placeholder="Password (min. 6 characters)"
          placeholderTextColor={COLORS.neutral.mediumGray}
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
          autoComplete="password-new"
          maxLength={50}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={COLORS.neutral.mediumGray}
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          secureTextEntry
          autoComplete="password-new"
          maxLength={50}
        />
      </View>

      <CustomButton
        title="Next: Choose Your Passions"
        onPress={() => {
          if (validateStep1()) {
            setCurrentStep(2)
          }
        }}
        variant="primary"
        size="large"
        style={styles.nextButton}
      />
    </Animatable.View>
  )

  // 🎨 RENDER STEP 2 - Hobby Selection
  const renderStep2 = () => (
    <Animatable.View animation="fadeInLeft" duration={600} style={styles.stepContainer}>
      <HobbySelector selectedHobbies={selectedHobbies} onHobbiesChange={setSelectedHobbies} maxSelection={3} />

      <View style={styles.step2Buttons}>
        <CustomButton
          title="Back"
          onPress={() => setCurrentStep(1)}
          variant="outline"
          size="medium"
          style={styles.backButton}
        />

        <CustomButton
          title="Create My Account"
          onPress={handleRegister}
          variant="success"
          size="large"
          disabled={isLoading}
          style={styles.registerButton}
        />
      </View>
    </Animatable.View>
  )

  // 🎨 RENDER LOADING STATE
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="large" color={COLORS.primary.coral} />
          <Text style={styles.loadingText}>Creating Your Account...</Text>
          <Text style={styles.loadingSubtext}>Setting up your personal growth space</Text>
          <View style={styles.loadingSteps}>
            <Text style={styles.loadingStep}>✅ Validating information</Text>
            <Text style={styles.loadingStep}>✅ Creating secure profile</Text>
            <Text style={styles.loadingStep}>⏳ Personalizing experience</Text>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutral.white} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardContainer}>
        {/* Header */}
        <LinearGradient
          colors={COLORS.gradients.gentle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Join SelfGrow</Text>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, currentStep >= 1 && styles.progressDotActive]} />
            <View style={[styles.progressLine, currentStep >= 2 && styles.progressLineActive]} />
            <View style={[styles.progressDot, currentStep >= 2 && styles.progressDotActive]} />
          </View>

          <Text style={styles.progressText}>
            Step {currentStep} of 2: {currentStep === 1 ? "Basic Information" : "Choose Your Interests"}
          </Text>
        </LinearGradient>

        {/* Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {currentStep === 1 ? renderStep1() : renderStep2()}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text style={styles.footerLink} onPress={() => navigation.navigate("Login")}>
              Sign In
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
  loadingSteps: {
    marginTop: SPACING.xl,
    alignItems: "flex-start",
  },
  loadingStep: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.neutral.darkGray,
    marginBottom: SPACING.sm,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    alignItems: "center",
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.neutral.black,
    marginBottom: SPACING.lg,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.neutral.lightGray,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary.coral,
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.neutral.lightGray,
    marginHorizontal: SPACING.sm,
  },
  progressLineActive: {
    backgroundColor: COLORS.primary.coral,
  },
  progressText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.darkGray,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  stepContainer: {
    padding: SPACING.lg,
    flex: 1,
  },
  stepTitle: {
    ...TYPOGRAPHY.h2,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  stepSubtitle: {
    ...TYPOGRAPHY.body,
    textAlign: "center",
    color: COLORS.neutral.darkGray,
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    marginBottom: SPACING.xl,
  },
  input: {
    ...GLOBAL_STYLES.input,
    marginBottom: SPACING.md,
  },
  nextButton: {
    marginTop: SPACING.md,
  },
  step2Buttons: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  backButton: {
    marginBottom: SPACING.md,
  },
  registerButton: {
    marginBottom: SPACING.md,
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

export default RegisterScreen
