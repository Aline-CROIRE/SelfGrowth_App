"use client"

// 🎯 REGISTER SCREEN - Beautiful onboarding experience

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
      Alert.alert("Error", "Please enter your name")
      return false
    }
    if (!formData.email.trim()) {
      Alert.alert("Error", "Please enter your email")
      return false
    }
    if (!formData.email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email")
      return false
    }
    if (formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (selectedHobbies.length === 0) {
      Alert.alert("Error", "Please select at least one hobby")
      return false
    }
    return true
  }

  // 🚀 HANDLE REGISTRATION
  const handleRegister = async () => {
    if (!validateStep2()) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create user data
      const userData = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        joinedAt: new Date().toISOString(),
        hobbies: selectedHobbies,
      }

      // Save to context
      actions.login(userData)
      actions.setHobbies(selectedHobbies)

      // Navigate to main app
      navigation.replace("Main")
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.")
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
          placeholder="Your Name"
          placeholderTextColor={COLORS.neutral.mediumGray}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor={COLORS.neutral.mediumGray}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={COLORS.neutral.mediumGray}
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={COLORS.neutral.mediumGray}
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          secureTextEntry
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
          title={isLoading ? "Creating Account..." : "Start Growing!"}
          onPress={handleRegister}
          variant="success"
          size="large"
          disabled={isLoading}
          style={styles.registerButton}
        />
      </View>
    </Animatable.View>
  )

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
        </LinearGradient>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: SPACING.lg,
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
