"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import * as Animatable from "react-native-animatable"
import { SafeAreaView } from "react-native-safe-area-context"

const { width } = Dimensions.get("window")

const WelcomeScreen = ({ navigation }) => {
  const scrollY = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  const inspirationalQuotes = [
    "Every day is a new beginning. Take a deep breath, smile, and start again.",
    "The journey of a thousand miles begins with one step.",
    "Growth begins at the end of your comfort zone.",
    "Your only limit is your mind.",
    "Dream it. Believe it. Build it.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The future belongs to those who believe in the beauty of their dreams.",
  ]

  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start()

    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const features = [
    { icon: "📝", title: "Journal" },
    { icon: "🎯", title: "Goals" },
    { icon: "🏆", title: "Achieve" },
    { icon: "📚", title: "Learn" },
  ]

  const benefits = [
    "🌱 Personal Growth Tracking",
    "📊 Progress Analytics",
    "🎨 Customizable Experience",
    "🔒 Private & Secure",
    "💡 AI-Powered Insights",
    "🌟 Achievement System",
  ]

  return (
  <LinearGradient
  colors={["#fad0c4", "#fad0c4", "#ff9a9e"]}
  start={{ x: 0.5, y: 0 }}
  end={{ x: 0.5, y: 1 }}
  style={styles.gradient}
>

      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={16}
        >
          <Animated.View
            style={[
              styles.heroContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Animatable.View animation="bounceIn" duration={1500} style={styles.center}>
              <View style={styles.iconCircle}>
                <Text style={{ fontSize: 70 }}>🌱</Text>
              </View>
              <Text style={styles.title}>SelfGrow</Text>
              <Text style={styles.subtitle}>Your Personal Growth & Independence Journey</Text>
            </Animatable.View>

            <Animatable.View
              key={currentQuote}
              animation="fadeInUp"
              duration={1000}
              style={styles.quoteContainer}
            >
              <Text style={styles.quoteText}>"{inspirationalQuotes[currentQuote]}"</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" delay={500} duration={1000} style={styles.featureGrid}>
              {features.map((feature, index) => (
                <Animatable.View
                  key={index}
                  animation="fadeInUp"
                  delay={600 + index * 100}
                  style={styles.featureItem}
                >
                  <View style={styles.featureIcon}>
                    <Text style={{ fontSize: 28 }}>{feature.icon}</Text>
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                </Animatable.View>
              ))}
            </Animatable.View>
          </Animated.View>

          <Animatable.View animation="slideInUp" delay={1000} duration={1000} style={styles.section}>
            <Text style={styles.sectionTitle}>Why Choose SelfGrow?</Text>
            <View style={styles.benefitWrapper}>
              {benefits.map((benefit, index) => (
                <Animatable.View
                  key={index}
                  animation="fadeInLeft"
                  delay={1200 + index * 100}
                  style={styles.benefitItem}
                >
                  <Text style={styles.benefitText}>{benefit}</Text>
                </Animatable.View>
              ))}
            </View>
          </Animatable.View>

          <Animatable.View animation="slideInUp" delay={1500} duration={1000} style={styles.ctaSection}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.primaryBtnText}>Start Your Journey</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.secondaryBtnText}>I Already Have an Account</Text>
            </TouchableOpacity>

            <View style={styles.trustContainer}>
              <Text style={styles.trustText}>🔒 Your data is secure and private</Text>
              <Text style={[styles.trustText, { marginTop: 4 }]}>
                ✨ Join thousands on their growth journey
              </Text>
            </View>
          </Animatable.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 44 : 24,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    flexGrow: 1,
  },
  heroContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  center: {
    alignItems: "center",
  },
  iconCircle: {
    backgroundColor: "#ffffff90",
    padding: 20,
    borderRadius: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 5,
  },
  quoteContainer: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#fff",
    textAlign: "center",
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  featureItem: {
    width: "48%",
    backgroundColor: "#ffffff40",
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  featureIcon: {
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  benefitWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  benefitItem: {
    width: "48%",
    backgroundColor: "#ffffff30",
    marginVertical: 6,
    padding: 12,
    borderRadius: 10,
  },
  benefitText: {
    color: "#fff",
    fontSize: 14,
  },
  ctaSection: {
    marginTop: 30,
    alignItems: "center",
  },
  primaryBtn: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 12,
  },
  primaryBtnText: {
    color: "#e91e63",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryBtn: {
    borderColor: "#fff",
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  secondaryBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  trustContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  trustText: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
  },
})

export default WelcomeScreen
