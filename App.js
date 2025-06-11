import { StatusBar } from "expo-status-bar"
import { View, Text, StyleSheet } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

// Import our beautiful app structure
import { AppProvider, useApp } from "./src/context/AppContext"
import AppNavigator from "./src/navigation/AppNavigator"
import LoadingSpinner from "./src/components/common/LoadingSpinner"
import { COLORS } from "./src/styles/colors"
import { TYPOGRAPHY, SPACING } from "./src/styles/globalStyles"

// 🎬 LOADING SCREEN - Beautiful loading experience
const LoadingScreen = () => {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingLogo}>🌱</Text>
      <Text style={styles.loadingTitle}>SelfGrow</Text>
      <Text style={styles.loadingSubtitle}>Preparing your growth journey...</Text>
      <LoadingSpinner size="large" color={COLORS.primary.coral} />
    </View>
  )
}

// 🎯 APP CONTENT - Handles loading state
const AppContent = () => {
  const { state } = useApp()

  if (state.isLoading) {
    return <LoadingScreen />
  }

  return <AppNavigator />
}

// 🌟 MAIN APP - Entry point with providers
export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="auto" />
        <AppContent />
      </AppProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.neutral.white,
    paddingHorizontal: SPACING.xl,
  },
  loadingLogo: {
    fontSize: 80,
    marginBottom: SPACING.md,
  },
  loadingTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary.coral,
    marginBottom: SPACING.sm,
  },
  loadingSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.darkGray,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
})
