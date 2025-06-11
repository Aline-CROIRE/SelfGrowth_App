"use client"

// 🎨 HOBBY FEATURES SCREEN - Personalized features based on user hobbies
// This screen provides specific functionality for each hobby the user selected

import { useRef, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions, Linking } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import * as Animatable from "react-native-animatable"
import { SafeAreaView } from "react-native-safe-area-context"

import { useApp } from "../../context/AppContext"
import { COLORS } from "../../styles/colors"
import { TYPOGRAPHY, SPACING, SHADOWS } from "../../styles/globalStyles"

const { width } = Dimensions.get("window")

// 🎯 HOBBY FEATURES DATA - Each hobby gets specific functionality
const HOBBY_FEATURES = {
  art: {
    name: "Art & Drawing",
    icon: "🎨",
    color: COLORS.hobbies.art,
    features: [
      {
        title: "Daily Art Prompt",
        description: "Get inspired with daily drawing challenges",
        action: "artPrompt",
        icon: "💡",
      },
      {
        title: "Color Palette Generator",
        description: "Discover beautiful color combinations",
        action: "colorPalette",
        icon: "🌈",
      },
      {
        title: "Art Tutorials",
        description: "Learn new techniques and skills",
        action: "artTutorials",
        icon: "📚",
      },
      {
        title: "Gallery Tracker",
        description: "Track your artwork progress",
        action: "artGallery",
        icon: "🖼️",
      },
    ],
  },
  reading: {
    name: "Reading",
    icon: "📚",
    color: COLORS.hobbies.reading,
    features: [
      {
        title: "Reading List",
        description: "Manage your to-read books",
        action: "readingList",
        icon: "📖",
      },
      {
        title: "Book Recommendations",
        description: "Discover new books to read",
        action: "bookRecommendations",
        icon: "⭐",
      },
      {
        title: "Reading Progress",
        description: "Track pages and reading time",
        action: "readingProgress",
        icon: "📊",
      },
      {
        title: "Book Quotes",
        description: "Save memorable quotes",
        action: "bookQuotes",
        icon: "💭",
      },
    ],
  },
  music: {
    name: "Music",
    icon: "🎵",
    color: COLORS.hobbies.music,
    features: [
      {
        title: "Music Player",
        description: "Listen to relaxing music",
        action: "musicPlayer",
        icon: "🎧",
      },
      {
        title: "Mood Playlists",
        description: "Music for different moods",
        action: "moodPlaylists",
        icon: "🎶",
      },
      {
        title: "Practice Tracker",
        description: "Track instrument practice",
        action: "practiceTracker",
        icon: "⏱️",
      },
      {
        title: "Music Discovery",
        description: "Find new artists and songs",
        action: "musicDiscovery",
        icon: "🔍",
      },
    ],
  },
  sports: {
    name: "Sports & Fitness",
    icon: "⚽",
    color: COLORS.hobbies.sports,
    features: [
      {
        title: "Workout Tracker",
        description: "Log your exercise sessions",
        action: "workoutTracker",
        icon: "💪",
      },
      {
        title: "Fitness Goals",
        description: "Set and track fitness targets",
        action: "fitnessGoals",
        icon: "🎯",
      },
      {
        title: "Exercise Library",
        description: "Browse workout routines",
        action: "exerciseLibrary",
        icon: "📋",
      },
      {
        title: "Progress Photos",
        description: "Track your transformation",
        action: "progressPhotos",
        icon: "📸",
      },
    ],
  },
  writing: {
    name: "Writing",
    icon: "✍️",
    color: COLORS.hobbies.writing,
    features: [
      {
        title: "Writing Prompts",
        description: "Creative writing inspiration",
        action: "writingPrompts",
        icon: "💡",
      },
      {
        title: "Story Tracker",
        description: "Manage your writing projects",
        action: "storyTracker",
        icon: "📝",
      },
      {
        title: "Word Count Goals",
        description: "Track daily writing progress",
        action: "wordCountGoals",
        icon: "📊",
      },
      {
        title: "Character Builder",
        description: "Develop story characters",
        action: "characterBuilder",
        icon: "👥",
      },
    ],
  },
  cooking: {
    name: "Cooking",
    icon: "👨‍🍳",
    color: COLORS.hobbies.cooking,
    features: [
      {
        title: "Recipe Collection",
        description: "Save and organize recipes",
        action: "recipeCollection",
        icon: "📖",
      },
      {
        title: "Meal Planner",
        description: "Plan your weekly meals",
        action: "mealPlanner",
        icon: "📅",
      },
      {
        title: "Cooking Timer",
        description: "Multiple cooking timers",
        action: "cookingTimer",
        icon: "⏰",
      },
      {
        title: "Ingredient Tracker",
        description: "Manage your pantry",
        action: "ingredientTracker",
        icon: "🥕",
      },
    ],
  },
  photography: {
    name: "Photography",
    icon: "📸",
    color: COLORS.hobbies.photography,
    features: [
      {
        title: "Photo Challenges",
        description: "Daily photography prompts",
        action: "photoChallenges",
        icon: "🎯",
      },
      {
        title: "Portfolio Tracker",
        description: "Organize your best shots",
        action: "portfolioTracker",
        icon: "🖼️",
      },
      {
        title: "Camera Settings",
        description: "Learn optimal settings",
        action: "cameraSettings",
        icon: "⚙️",
      },
      {
        title: "Location Scout",
        description: "Find great photo spots",
        action: "locationScout",
        icon: "📍",
      },
    ],
  },
  gardening: {
    name: "Gardening",
    icon: "🌱",
    color: COLORS.hobbies.gardening,
    features: [
      {
        title: "Plant Care Guide",
        description: "Care tips for your plants",
        action: "plantCareGuide",
        icon: "🌿",
      },
      {
        title: "Garden Planner",
        description: "Plan your garden layout",
        action: "gardenPlanner",
        icon: "🗺️",
      },
      {
        title: "Watering Reminders",
        description: "Never forget to water",
        action: "wateringReminders",
        icon: "💧",
      },
      {
        title: "Growth Tracker",
        description: "Track plant progress",
        action: "growthTracker",
        icon: "📈",
      },
    ],
  },
}

const HobbyFeaturesScreen = ({ navigation }) => {
  const { state } = useApp()
  const { selectedHobbies, user } = state

  // Animation refs
  const headerRef = useRef()
  const featuresRef = useRef()

  // 🎬 ENTRANCE ANIMATIONS
  useEffect(() => {
    setTimeout(() => headerRef.current?.fadeInDown(800), 100)
    setTimeout(() => featuresRef.current?.fadeInUp(800), 300)
  }, [])

  // 🎯 HANDLE FEATURE ACTION - This is where the magic happens!
  const handleFeatureAction = (hobbyId, action) => {
    console.log(`🎯 Executing ${action} for ${hobbyId}`)

    switch (action) {
      // 🎨 ART FEATURES
      case "artPrompt":
        const artPrompts = [
          "Draw your mood as a landscape",
          "Sketch something you can see right now",
          "Create a character based on your favorite color",
          "Draw your dream house",
          "Illustrate a memory from childhood",
        ]
        const randomPrompt = artPrompts[Math.floor(Math.random() * artPrompts.length)]
        Alert.alert("🎨 Daily Art Prompt", randomPrompt, [{ text: "Start Drawing!", style: "default" }])
        break

      case "colorPalette":
        const palettes = [
          "Sunset: #FF6B6B, #FF8E53, #FFA726",
          "Ocean: #4FC3F7, #29B6F6, #039BE5",
          "Forest: #66BB6A, #43A047, #2E7D32",
          "Autumn: #FF8A65, #FF7043, #F4511E",
        ]
        const randomPalette = palettes[Math.floor(Math.random() * palettes.length)]
        Alert.alert("🌈 Color Palette", randomPalette, [{ text: "Use This Palette", style: "default" }])
        break

      // 📚 READING FEATURES
      case "readingList":
        Alert.alert(
          "📖 Reading List",
          "Feature coming soon! You'll be able to:\n• Add books to read\n• Track reading progress\n• Set reading goals\n• Rate finished books",
          [{ text: "Got it!", style: "default" }],
        )
        break

      case "bookRecommendations":
        const recommendations = [
          "Atomic Habits by James Clear",
          "The 7 Habits of Highly Effective People by Stephen Covey",
          "Mindset by Carol Dweck",
          "The Power of Now by Eckhart Tolle",
        ]
        const randomBook = recommendations[Math.floor(Math.random() * recommendations.length)]
        Alert.alert("⭐ Book Recommendation", `We recommend: "${randomBook}"`, [
          { text: "Add to List", style: "default" },
        ])
        break

      // ��� MUSIC FEATURES
      case "musicPlayer":
        Alert.alert("🎧 Music Player", "Choose your mood for music:", [
          { text: "Relaxing", onPress: () => openMusicLink("relaxing") },
          { text: "Energetic", onPress: () => openMusicLink("energetic") },
          { text: "Focus", onPress: () => openMusicLink("focus") },
          { text: "Cancel", style: "cancel" },
        ])
        break

      case "moodPlaylists":
        Alert.alert("🎶 Mood Playlists", "Select a playlist for your current mood:", [
          { text: "Happy & Upbeat", onPress: () => openMusicLink("happy") },
          { text: "Calm & Peaceful", onPress: () => openMusicLink("calm") },
          { text: "Motivational", onPress: () => openMusicLink("motivation") },
          { text: "Cancel", style: "cancel" },
        ])
        break

      // 💪 FITNESS FEATURES
      case "workoutTracker":
        Alert.alert("💪 Workout Tracker", "Track your workout:", [
          { text: "Start Cardio", onPress: () => startWorkout("cardio") },
          { text: "Start Strength", onPress: () => startWorkout("strength") },
          { text: "Start Yoga", onPress: () => startWorkout("yoga") },
          { text: "Cancel", style: "cancel" },
        ])
        break

      case "fitnessGoals":
        Alert.alert("🎯 Fitness Goals", "Set a new fitness goal:", [
          { text: "Weight Loss", onPress: () => setFitnessGoal("weight-loss") },
          { text: "Muscle Gain", onPress: () => setFitnessGoal("muscle-gain") },
          { text: "Endurance", onPress: () => setFitnessGoal("endurance") },
          { text: "Cancel", style: "cancel" },
        ])
        break

      // ✍️ WRITING FEATURES
      case "writingPrompts":
        const writingPrompts = [
          "Write about a character who discovers a hidden door in their house",
          "Describe a world where colors have sounds",
          "Tell the story of the last person on Earth",
          "Write about a conversation between you and your future self",
        ]
        const randomWritingPrompt = writingPrompts[Math.floor(Math.random() * writingPrompts.length)]
        Alert.alert("💡 Writing Prompt", randomWritingPrompt, [
          {
            text: "Start Writing!",
            onPress: () => navigation.navigate("Journal", { action: "new", prompt: randomWritingPrompt }),
          },
        ])
        break

      // 🍳 COOKING FEATURES
      case "recipeCollection":
        Alert.alert("📖 Recipe Collection", "Choose a recipe category:", [
          { text: "Quick Meals", onPress: () => showRecipes("quick") },
          { text: "Healthy Options", onPress: () => showRecipes("healthy") },
          { text: "Comfort Food", onPress: () => showRecipes("comfort") },
          { text: "Cancel", style: "cancel" },
        ])
        break

      // 📸 PHOTOGRAPHY FEATURES
      case "photoChallenges":
        const photoPrompts = [
          "Capture golden hour lighting",
          "Take a macro shot of something small",
          "Photograph shadows and silhouettes",
          "Find interesting textures and patterns",
        ]
        const randomPhotoPrompt = photoPrompts[Math.floor(Math.random() * photoPrompts.length)]
        Alert.alert("🎯 Photo Challenge", randomPhotoPrompt, [{ text: "Take Photo!", style: "default" }])
        break

      // 🌱 GARDENING FEATURES
      case "plantCareGuide":
        Alert.alert("🌿 Plant Care Guide", "Select your plant type:", [
          { text: "Succulents", onPress: () => showPlantCare("succulents") },
          { text: "Herbs", onPress: () => showPlantCare("herbs") },
          { text: "Flowers", onPress: () => showPlantCare("flowers") },
          { text: "Cancel", style: "cancel" },
        ])
        break

      default:
        Alert.alert(
          "🚧 Coming Soon!",
          `The ${action} feature is being developed and will be available in the next update!`,
          [{ text: "Got it!", style: "default" }],
        )
    }
  }

  // 🎵 HELPER FUNCTIONS for music features
  const openMusicLink = (mood) => {
    const musicLinks = {
      relaxing: "https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0", // Chill playlist
      energetic: "https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP", // Beast Mode
      focus: "https://open.spotify.com/playlist/37i9dQZF1DX8NTLI2TtZa6", // Deep Focus
      happy: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd", // Happy Hits
      calm: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO", // Peaceful Piano
      motivation: "https://open.spotify.com/playlist/37i9dQZF1DXdxcBWuJkbcy", // Motivation Mix
    }

    Linking.openURL(musicLinks[mood] || musicLinks.relaxing).catch(() => {
      Alert.alert("Music Player", `Playing ${mood} music... 🎵`, [{ text: "Enjoy!", style: "default" }])
    })
  }

  // 💪 FITNESS helper functions
  const startWorkout = (type) => {
    Alert.alert(
      "💪 Workout Started!",
      `${type.charAt(0).toUpperCase() + type.slice(1)} workout in progress. Good luck!`,
      [{ text: "Let's Go!", style: "default" }],
    )
  }

  const setFitnessGoal = (goal) => {
    Alert.alert(
      "🎯 Goal Set!",
      `${goal.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())} goal added to your fitness tracker!`,
      [{ text: "Start Working!", style: "default" }],
    )
  }

  // 🍳 RECIPE helper functions
  const showRecipes = (category) => {
    const recipes = {
      quick: ["5-Minute Pasta", "Quick Stir Fry", "Instant Oatmeal Bowl"],
      healthy: ["Quinoa Salad", "Grilled Chicken", "Veggie Smoothie"],
      comfort: ["Mac and Cheese", "Chicken Soup", "Chocolate Cake"],
    }

    const categoryRecipes = recipes[category] || []
    Alert.alert(`📖 ${category.charAt(0).toUpperCase() + category.slice(1)} Recipes`, categoryRecipes.join("\n• "), [
      { text: "Choose Recipe", style: "default" },
    ])
  }

  // 🌱 PLANT CARE helper functions
  const showPlantCare = (plantType) => {
    const careGuides = {
      succulents: "💧 Water: Once a week\n☀️ Light: Bright, indirect\n🌡️ Temp: 60-80°F",
      herbs: "💧 Water: Keep soil moist\n☀️ Light: 6+ hours direct sun\n✂️ Harvest: Regular trimming",
      flowers: "💧 Water: Daily in summer\n☀️ Light: Morning sun\n🌱 Fertilize: Monthly",
    }

    Alert.alert(`🌿 ${plantType.charAt(0).toUpperCase() + plantType.slice(1)} Care`, careGuides[plantType], [
      { text: "Got it!", style: "default" },
    ])
  }

  // 🎨 RENDER HOBBY SECTION
  const renderHobbySection = (hobbyId) => {
    const hobby = HOBBY_FEATURES[hobbyId]
    if (!hobby) return null

    return (
      <View key={hobbyId} style={styles.hobbySection}>
        <LinearGradient
          colors={[hobby.color, hobby.color + "80"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hobbySectionHeader}
        >
          <Text style={styles.hobbyIcon}>{hobby.icon}</Text>
          <Text style={styles.hobbyName}>{hobby.name}</Text>
        </LinearGradient>

        <View style={styles.featuresGrid}>
          {hobby.features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={styles.featureCard}
              onPress={() => handleFeatureAction(hobbyId, feature.action)}
              activeOpacity={0.8}
            >
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animatable.View ref={headerRef} style={styles.header}>
        <LinearGradient
          colors={COLORS.gradients.dream}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Hobby Features</Text>
          <Text style={styles.headerSubtitle}>
            Personalized tools for your interests: {selectedHobbies.length} hobbies
          </Text>
        </LinearGradient>
      </Animatable.View>

      {/* Content */}
      <Animatable.View ref={featuresRef} style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {selectedHobbies.length > 0 ? (
            selectedHobbies.map(renderHobbySection)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🎨</Text>
              <Text style={styles.emptyStateTitle}>No Hobbies Selected</Text>
              <Text style={styles.emptyStateText}>
                Go to your profile to select hobbies and unlock personalized features!
              </Text>
              <TouchableOpacity style={styles.emptyStateButton} onPress={() => navigation.navigate("Profile")}>
                <LinearGradient colors={COLORS.gradients.sunrise} style={styles.emptyStateButtonGradient}>
                  <Text style={styles.emptyStateButtonText}>Select Hobbies</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </Animatable.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
  },
  header: {
    width: "100%",
  },
  headerGradient: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: SPACING.sm,
  },
  backButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.neutral.white,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.neutral.white,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.white + "CC",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  hobbySection: {
    marginBottom: SPACING.xl,
  },
  hobbySectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  hobbyIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  hobbyName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.neutral.white,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: SPACING.lg,
    justifyContent: "space-between",
  },
  featureCard: {
    width: (width - SPACING.lg * 3) / 2,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: "center",
    ...SHADOWS.light,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  featureTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 14,
    textAlign: "center",
    marginBottom: SPACING.xs,
  },
  featureDescription: {
    ...TYPOGRAPHY.caption,
    textAlign: "center",
    color: COLORS.neutral.darkGray,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  emptyStateTitle: {
    ...TYPOGRAPHY.h2,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  emptyStateText: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.darkGray,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  emptyStateButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  emptyStateButtonGradient: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  emptyStateButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.neutral.white,
  },
})

export default HobbyFeaturesScreen
