"use client"

// 🎯 GOALS SCREEN - Set and track personal growth goals

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  StatusBar,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import * as Animatable from "react-native-animatable"
import { SafeAreaView } from "react-native-safe-area-context"

import CustomButton from "../../components/common/customButton"
import { useApp } from "../../context/AppContext"
import { COLORS } from "../../styles/colors"
import { TYPOGRAPHY, SPACING, SHADOWS, GLOBAL_STYLES } from "../../styles/globalStyles"

// 🎯 GOAL CATEGORIES - Different types of goals
const GOAL_CATEGORIES = [
  { id: "personal", name: "Personal Growth", icon: "🌱", color: COLORS.hobbies.gardening },
  { id: "health", name: "Health & Fitness", icon: "💪", color: COLORS.hobbies.sports },
  { id: "creative", name: "Creative", icon: "🎨", color: COLORS.hobbies.art },
  { id: "learning", name: "Learning", icon: "📚", color: COLORS.hobbies.reading },
  { id: "career", name: "Career", icon: "💼", color: COLORS.primary.orange },
  { id: "relationships", name: "Relationships", icon: "❤️", color: COLORS.secondary.rose },
]

// 🎯 GOAL TEMPLATES - Pre-made goals for inspiration
const GOAL_TEMPLATES = {
  personal: [
    "Practice daily meditation for 10 minutes",
    "Write in journal every day for a month",
    "Read one self-development book per month",
    "Practice gratitude daily",
  ],
  health: [
    "Exercise 3 times per week",
    "Drink 8 glasses of water daily",
    "Get 8 hours of sleep each night",
    "Take 10,000 steps daily",
  ],
  creative: [
    "Create one piece of art per week",
    "Learn a new creative skill",
    "Complete a creative project",
    "Share my creativity with others",
  ],
  learning: [
    "Read 12 books this year",
    "Learn a new language",
    "Take an online course",
    "Practice a new skill daily",
  ],
  career: [
    "Update my resume and LinkedIn",
    "Network with 5 new people this month",
    "Learn a new professional skill",
    "Apply for dream job",
  ],
  relationships: [
    "Call family members weekly",
    "Make one new friend this month",
    "Practice active listening",
    "Express appreciation daily",
  ],
}

const GoalsScreen = ({ navigation, route }) => {
  const { state, actions } = useApp()
  const { goals } = state

  // Animation refs
  const headerRef = useRef()
  const goalsRef = useRef()

  // 🎯 GOAL STATE
  const [isCreating, setIsCreating] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: null,
    targetDate: "",
    priority: "medium",
  })

  // 🎭 UI STATE
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [filter, setFilter] = useState("all") // all, active, completed

  // 🎬 ENTRANCE ANIMATIONS
  useEffect(() => {
    setTimeout(() => headerRef.current?.fadeInDown(800), 100)
    setTimeout(() => goalsRef.current?.fadeInUp(800), 300)
  }, [])

  // 🎯 CHECK FOR NEW GOAL ACTION
  useEffect(() => {
    if (route.params?.action === "new") {
      startNewGoal()
    }
  }, [route.params])

  // ✨ START NEW GOAL
  const startNewGoal = () => {
    setNewGoal({
      title: "",
      description: "",
      category: null,
      targetDate: "",
      priority: "medium",
    })
    setIsCreating(true)
  }

  // 💾 SAVE GOAL
  const saveGoal = () => {
    if (!newGoal.title.trim()) {
      Alert.alert("Missing Title", "Please enter a goal title")
      return
    }

    if (!newGoal.category) {
      Alert.alert("Missing Category", "Please select a category")
      return
    }

    const goalData = {
      ...newGoal,
      title: newGoal.title.trim(),
      description: newGoal.description.trim(),
      progress: 0,
      milestones: [],
    }

    actions.addGoal(goalData)
    setIsCreating(false)
    setNewGoal({ title: "", description: "", category: null, targetDate: "", priority: "medium" })

    Alert.alert("Success", "Your goal has been created! 🎯")
  }

  // ✅ COMPLETE GOAL
  const completeGoal = (goalId) => {
    Alert.alert("Complete Goal", "Mark this goal as completed?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Complete",
        onPress: () => {
          actions.completeGoal(goalId)
          Alert.alert("Congratulations! 🎉", "You've completed your goal!")
        },
      },
    ])
  }

  // 🎨 USE TEMPLATE
  const useTemplate = (template) => {
    setNewGoal({ ...newGoal, title: template })
    setShowTemplates(false)
  }

  // 🎯 FILTER GOALS
  const getFilteredGoals = () => {
    switch (filter) {
      case "active":
        return goals.filter((goal) => !goal.completed)
      case "completed":
        return goals.filter((goal) => goal.completed)
      default:
        return goals
    }
  }

  // 🎨 RENDER CATEGORY SELECTOR
  const renderCategorySelector = () => (
    <View style={styles.categorySelector}>
      <Text style={styles.sectionTitle}>Choose Category</Text>
      <View style={styles.categoriesGrid}>
        {GOAL_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryOption,
              { backgroundColor: category.color + "20" },
              newGoal.category?.id === category.id && styles.selectedCategory,
            ]}
            onPress={() => setNewGoal({ ...newGoal, category })}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[styles.categoryName, { color: category.color }]}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  // 💡 RENDER TEMPLATES MODAL
  const renderTemplatesModal = () => (
    <Modal visible={showTemplates} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Goal Templates</Text>
          <ScrollView style={styles.templatesList}>
            {selectedCategory &&
              GOAL_TEMPLATES[selectedCategory.id]?.map((template, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.templateOption}
                  onPress={() => useTemplate(template)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.templateText}>{template}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
          <CustomButton title="Cancel" onPress={() => setShowTemplates(false)} variant="outline" />
        </View>
      </View>
    </Modal>
  )

  // 📝 RENDER GOAL CREATION
  const renderGoalCreation = () => (
    <View style={styles.creationContainer}>
      <ScrollView style={styles.creationScroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.creationTitle}>Create New Goal</Text>

        {/* Category Selection */}
        {renderCategorySelector()}

        {/* Goal Title */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Goal Title</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="What do you want to achieve?"
            placeholderTextColor={COLORS.neutral.mediumGray}
            value={newGoal.title}
            onChangeText={(text) => setNewGoal({ ...newGoal, title: text })}
            maxLength={100}
          />
          {newGoal.category && (
            <TouchableOpacity
              style={styles.templatesButton}
              onPress={() => {
                setSelectedCategory(newGoal.category)
                setShowTemplates(true)
              }}
            >
              <Text style={styles.templatesButtonText}>💡 Use Template</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Goal Description */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Description (Optional)</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Add more details about your goal..."
            placeholderTextColor={COLORS.neutral.mediumGray}
            value={newGoal.description}
            onChangeText={(text) => setNewGoal({ ...newGoal, description: text })}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Priority Selection */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Priority</Text>
          <View style={styles.prioritySelector}>
            {["low", "medium", "high"].map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.priorityOption,
                  newGoal.priority === priority && styles.selectedPriority,
                  { backgroundColor: getPriorityColor(priority) + "20" },
                ]}
                onPress={() => setNewGoal({ ...newGoal, priority })}
              >
                <Text style={[styles.priorityText, { color: getPriorityColor(priority) }]}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.creationActions}>
        <CustomButton
          title="Cancel"
          onPress={() => setIsCreating(false)}
          variant="outline"
          size="medium"
          style={styles.cancelButton}
        />
        <CustomButton title="Create Goal" onPress={saveGoal} variant="success" size="medium" style={styles.saveButton} />
      </View>
    </View>
  )

  // 🎯 GET PRIORITY COLOR
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return COLORS.status.error
      case "medium":
        return COLORS.primary.orange
      case "low":
        return COLORS.status.success
      default:
        return COLORS.neutral.mediumGray
    }
  }

  // 🎯 RENDER GOAL ITEM
  const renderGoalItem = ({ item }) => (
    <Animatable.View animation="fadeInUp" duration={600}>
      <TouchableOpacity style={styles.goalCard} activeOpacity={0.8}>
        <LinearGradient
          colors={item.completed ? [COLORS.status.success + "20", COLORS.status.success + "10"] : [COLORS.neutral.white, COLORS.neutral.lightGray + "30"]}
          style={styles.goalGradient}
        >
          {/* Goal Header */}
          <View style={styles.goalHeader}>
            <View style={styles.goalInfo}>
              <View style={styles.goalTitleRow}>
                <Text style={[styles.goalTitle, item.completed && styles.completedGoalTitle]}>{item.title}</Text>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
                  <Text style={styles.priorityBadgeText}>{item.priority}</Text>
                </View>
              </View>
              <View style={styles.goalMeta}>
                <Text style={[styles.categoryBadge, { color: item.category.color }]}>
                  {item.category.icon} {item.category.name}
                </Text>
                <Text style={styles.goalDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
            </View>
          </View>

          {/* Goal Description */}
          {item.description && (
            <Text style={[styles.goalDescription, item.completed && styles.completedText]} numberOfLines={2}>
              {item.description}
            </Text>
          )}

          {/* Goal Actions */}
          <View style={styles.goalActions}>
            {!item.completed ? (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: COLORS.status.success + "20" }]}
                onPress={() => completeGoal(item.id)}
              >
                <Text style={[styles.actionButtonText, { color: COLORS.status.success }]}>✓ Complete</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.completedBadge}>
                <Text style={styles.completedBadgeText}>🎉 Completed</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  )

  // 🎯 RENDER GOALS LIST
  const renderGoalsList = () => (
    <View style={styles.goalsContainer}>
      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {["all", "active", "completed"].map((filterType) => (
          <TouchableOpacity
            key={filterType}
            style={[styles.filterTab, filter === filterType && styles.activeFilterTab]}
            onPress={() => setFilter(filterType)}
          >
            <Text style={[styles.filterTabText, filter === filterType && styles.activeFilterTabText]}>
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Goals List */}
      {getFilteredGoals().length > 0 ? (
        <FlatList
          data={getFilteredGoals()}
          renderItem={renderGoalItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.goalsList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🎯</Text>
          <Text style={styles.emptyStateTitle}>
            {filter === "completed" ? "No Completed Goals Yet" : "No Goals Set"}
          </Text>
          <Text style={styles.emptyStateText}>
            {filter === "completed"
              ? "Complete your first goal to see it here"
              : "Set your first goal and start your growth journey"}
          </Text>
        </View>
      )}
    </View>
  )

  if (isCreating) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutral.white} />
        {renderGoalCreation()}
        {renderTemplatesModal()}
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary.coral} />

      {/* Beautiful Header */}
      <Animatable.View ref={headerRef}>
        <LinearGradient colors={COLORS.gradients.success} style={styles.header}>
          <Text style={styles.headerTitle}>Goals</Text>
          <Text style={styles.headerSubtitle}>Set targets and achieve greatness</Text>
        </LinearGradient>
      </Animatable.View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={startNewGoal} activeOpacity={0.8}>
        <LinearGradient colors={COLORS.gradients.sunrise} style={styles.fabGradient}>
          <Text style={styles.fabIcon}>🎯</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Goals List */}
      <Animatable.View ref={goalsRef} style={styles.content}>
        {renderGoalsList()}
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.neutral.white,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.white + "CC",
  },
  content: {
    flex: 1,
    paddingTop: SPACING.lg,
  },
  fab: {
    position: "absolute",
    bottom: 100,
    right: SPACING.lg,
    zIndex: 1000,
    borderRadius: 28,
    ...SHADOWS.heavy,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  fabIcon: {
    fontSize: 24,
  },
  creationContainer: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
  },
  creationScroll: {
    flex: 1,
    padding: SPACING.lg,
  },
  creationTitle: {
    ...TYPOGRAPHY.h2,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  categorySelector: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.md,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryOption: {
    width: "48%",
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCategory: {
    borderColor: COLORS.primary.coral,
    transform: [{ scale: 1.02 }],
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  categoryName: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: "600",
    textAlign: "center",
  },
  inputSection: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    marginBottom: SPACING.sm,
  },
  titleInput: {
    ...GLOBAL_STYLES.input,
    marginBottom: SPACING.sm,
  },
  templatesButton: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.secondary.gold + "20",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  templatesButtonText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.secondary.gold,
    fontWeight: "600",
  },
  descriptionInput: {
    ...GLOBAL_STYLES.input,
    height: 100,
    textAlignVertical: "top",
  },
  prioritySelector: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityOption: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: SPACING.xs,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedPriority: {
    borderColor: COLORS.primary.coral,
  },
  priorityText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: "600",
  },
  creationActions: {
    flexDirection: "row",
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral.lightGray,
  },
  cancelButton: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  saveButton: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 20,
    padding: SPACING.lg,
    margin: SPACING.lg,
    maxHeight: "80%",
    width: "90%",
  },
  modalTitle: {
    ...TYPOGRAPHY.h2,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  templatesList: {
    maxHeight: 300,
    marginBottom: SPACING.lg,
  },
  templateOption: {
    padding: SPACING.md,
    backgroundColor: COLORS.neutral.lightGray,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  templateText: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.black,
  },
  goalsContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  filterTabs: {
    flexDirection: "row",
    backgroundColor: COLORS.neutral.lightGray,
    borderRadius: 12,
    padding: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  filterTab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: "center",
    borderRadius: 8,
  },
  activeFilterTab: {
    backgroundColor: COLORS.neutral.white,
    ...SHADOWS.light,
  },
  filterTabText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.neutral.mediumGray,
    fontWeight: "600",
  },
  activeFilterTabText: {
    color: COLORS.primary.coral,
  },
  goalsList: {
    paddingBottom: 100,
  },
  goalCard: {
    marginBottom: SPACING.md,
    borderRadius: 16,
    overflow: "hidden",
  },
  goalGradient: {
    padding: SPACING.lg,
    ...SHADOWS.light,
  },
  goalHeader: {
    marginBottom: SPACING.sm,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.xs,
  },
  goalTitle: {
    ...TYPOGRAPHY.h3,
    flex: 1,
    marginRight: SPACING.sm,
  },
  completedGoalTitle: {
    textDecorationLine: "line-through",
    color: COLORS.neutral.mediumGray,
  },
  priorityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  priorityBadgeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.white,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  goalMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryBadge: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: "600",
  },
  goalDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.mediumGray,
  },
  goalDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.darkGray,
    marginBottom: SPACING.md,
  },
  completedText: {
    color: COLORS.neutral.mediumGray,
  },
  goalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  actionButtonText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: "600",
  },
  completedBadge: {
    backgroundColor: COLORS.status.success + "20",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  completedBadgeText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.status.success,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xxl,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  emptyStateTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.sm,
  },
  emptyStateText: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.darkGray,
    textAlign: "center",
    paddingHorizontal: SPACING.lg,
  },
})

export default GoalsScreen
