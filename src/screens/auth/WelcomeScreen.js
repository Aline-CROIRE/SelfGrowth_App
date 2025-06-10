"use client"

// 🌟 WELCOME SCREEN - First impression that inspires users

import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Dimensions, StatusBar } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import * as Animatable from "react-native-animatable"
import { SafeAreaView } from "react-native-safe-area-context"

import CustomButton from "../../components/common/customButton"
import { COLORS } from "../../styles/colors"
import { TYPOGRAPHY, SPACING } from "../../styles/globalStyles"

const { width, height } = Dimensions.get("window")

const WelcomeScreen = ({ navigation }) => {
  const logoRef = useRef()
  const titleRef = useRef()
  const subtitleRef = useRef()
  const buttonsRef = useRef()

  // 🎬 BEAUTIFUL ENTRANCE ANIMATION
  useEffect(() => {
    const animateEntrance = async () => {
      // Stagger animations for smooth entrance
      setTimeout(() => logoRef.current?.fadeInDown(800), 200)
      setTimeout(() => titleRef.current?.fadeInUp(800), 600)
      setTimeout(() => subtitleRef.current?.fadeInUp(800), 1000)
      setTimeout(() => buttonsRef.current?.fadeInUp(800), 1400)
    }

    animateEntrance()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary.coral} />

      {/* Beautiful Gradient Background */}
      <LinearGradient
        colors={COLORS.gradients.sunrise}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Decorative Elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />

        <View style={styles.content}>
          {/* App Logo/Icon */}
          <Animatable.View ref={logoRef} style={styles.logoContainer}>
            <Text style={styles.logo}>🌱</Text>
          </Animatable.View>

          {/* Welcome Text */}
          <Animatable.View ref={titleRef} style={styles.textContainer}>
            <Text style={styles.title}>Welcome to SelfGrow</Text>
          </Animatable.View>

          <Animatable.View ref={subtitleRef} style={styles.textContainer}>
            <Text style={styles.subtitle}>
              Your personal journey to independence, growth, and achieving your dreams starts here.
            </Text>
          </Animatable.View>

          {/* Action Buttons */}
          <Animatable.View ref={buttonsRef} style={styles.buttonContainer}>
            <CustomButton
              title="Start Your Journey"
              onPress={() => navigation.navigate("Register")}
              variant="secondary"
              size="large"
              style={styles.primaryButton}
            />

            <CustomButton
              title="I Already Have an Account"
              onPress={() => navigation.navigate("Login")}
              variant="outline"
              size="medium"
              style={styles.secondaryButton}
            />
          </Animatable.View>

          {/* Inspiring Quote */}
          <Animatable.View animation="pulse" iterationCount="infinite" duration={3000} style={styles.quoteContainer}>
            <Text style={styles.quote}>"The journey of a thousand miles begins with a single step"</Text>
          </Animatable.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: "relative",
  },
  decorativeCircle1: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.neutral.white + "20",
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.neutral.white + "10",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: SPACING.xl,
  },
  logo: {
    fontSize: 80,
    textAlign: "center",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h1,
    fontSize: 36,
    color: COLORS.neutral.white,
    textAlign: "center",
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    fontSize: 18,
    color: COLORS.neutral.white,
    textAlign: "center",
    lineHeight: 26,
    opacity: 0.9,
    paddingHorizontal: SPACING.md,
  },
  buttonContainer: {
    width: "100%",
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  primaryButton: {
    marginBottom: SPACING.md,
  },
  secondaryButton: {
    marginBottom: SPACING.lg,
  },
  quoteContainer: {
    position: "absolute",
    bottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  quote: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.white,
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.8,
  },
})

export default WelcomeScreen
