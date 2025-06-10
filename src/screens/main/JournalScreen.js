"use client"

// 📝 JOURNAL SCREEN - Beautiful writing experience with mood tracking

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
import * as ImagePicker from "expo-image-picker"

import CustomButton from "../../components/common/customButton"
import { useApp } from "../../context/AppContext"
import { COLORS } from "../../styles/colors"
import { TYPOGRAPHY, SPACING, SHADOWS, GLOBAL_STYLES } from "../../styles/globalStyles"

// 🎭 MOOD OPTIONS - Each mood with its personality
const MOODS = [
  { id: "amazing", emoji: "🤩", label: "Amazing", color: COLORS.secondary.gold },
  { id: "happy", emoji: "😊", label: "Happy", color: COLORS.status.success },
  { id: "good", emoji: "🙂", label: "Good", color: COLORS.primary.orange },
  { id: "okay", emoji: "😐", label: "Okay", color: COLORS.neutral.mediumGray },
  { id: "sad", emoji: "😢", label: "Sad", color: COLORS.primary.coral },
  { id: "stressed", emoji: "😰", label: "Stressed", color: COLORS.status.error },
]

// 🎯 HOBBY-SPECIFIC PROMPTS - Personalized writing inspiration
const HOBBY_PROMPTS = {
  art: [
    "What colors represent your emotions today?",
    "Describe a piece of art that inspired you recently",
    "What would you create if you had unlimited supplies?",
    "How does creating art make you feel?",
  ],
  reading: [
    "What book character do you relate to most right now?",
    "What life lesson did you learn from your recent reading?",
    "If you could have dinner with any author, who would it be?",
    "What quote resonated with you today?",
  ],
  music: [
    "What song perfectly describes your mood today?",
    "How does music help you process emotions?",
    "What instrument would you love to master?",
    "Describe a concert or performance that moved you",
  ],
  sports: [
    "How did physical activity affect your mental state today?",
    "What fitness goal are you working towards?",
    "Describe a moment when you felt truly strong",
    "How do you motivate yourself during tough workouts?",
  ],
  writing: [
    "What story is your heart trying to tell?",
    "If you could write a letter to your future self, what would you say?",
    "What words of wisdom would you share with someone struggling?",
    "Describe a moment that changed your perspective",
  ],
  cooking: [
    "What dish brings back your favorite memories?",
    "How does cooking help you express creativity?",
    "What meal would you prepare for someone you love?",
    "Describe the perfect comfort food for today's mood",
  ],
  photography: [
    "What moment did you wish you could capture today?",
    "How do you see beauty in everyday things?",
    "What story would your photos tell about this week?",
    "Describe the perfect lighting for your current mood",
  ],
  gardening: [
    "What does growth mean to you right now?",
    "How does nurturing plants reflect nurturing yourself?",
    "What would you plant in your ideal garden?",
    "How does being in nature affect your wellbeing?",
  ],
}

const JournalScreen = ({ navigation, route }) => {
  const { state, actions } = useApp()
  const { entries, selectedHobbies } = state

  // 📝 ENTRY STATE
  const [isWriting, setIsWriting] = useState(false)
  const [currentEntry, setCurrentEntry] = useState({
    title: "",
    content: "",
    mood: null,
    hobbyTags: [],
    images: [],
  })

  // 🎭 UI STATE
  const [showMoodSelector, setShowMoodSelector] = useState(false)
  const [showPrompts, setShowPrompts] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState("")

  // Animation refs
  const headerRef = useRef()
  const entriesRef = useRef()

  // 🎬 ENTRANCE ANIMATIONS
  useEffect(() => {
    setTimeout(() => headerRef.current?.fadeInDown(800), 100)
    setTimeout(() => entriesRef.current?.fadeInUp(800), 300)
  }, [])

  // 🎯 CHECK FOR NEW ENTRY ACTION
  useEffect(() => {
    if (route.params?.action === "new") {
      startNewEntry()
    }
  }, [route.params])

  // ✍️ START NEW ENTRY
  const startNewEntry = () => {
    setCurrentEntry({
      title: "",
      content: "",
      mood: null,
      hobbyTags: [],
      images: [],
    })
    setIsWriting(true)
  }

  // 💾 SAVE ENTRY
  const saveEntry = () => {
    if (!currentEntry.title.trim() && !currentEntry.content.trim()) {
      Alert.alert("Empty Entry", "Please write something before saving")
      return
    }

    const entryData = {
      ...currentEntry,
      title: currentEntry.title.trim() || "Untitled Entry",
      moodColor: currentEntry.mood?.color || COLORS.neutral.mediumGray,
      hobbyTags: currentEntry.hobbyTags,
    }

    actions.addEntry(entryData)
    setIsWriting(false)
    setCurrentEntry({ title: "", content: "", mood: null, hobbyTags: [], images: [] })

    Alert.alert("Success", "Your entry has been saved! 🎉")
  }

  // 🎭 SELECT MOOD
  const selectMood = (mood) => {
    setCurrentEntry({ ...currentEntry, mood })
    setShowMoodSelector(false)
  }

  // 🎯 GET HOBBY PROMPTS
  const getHobbyPrompts = () => {
    let prompts = []
    selectedHobbies.forEach((hobby) => {
      if (HOBBY_PROMPTS[hobby]) {
        prompts = [...prompts, ...HOBBY_PROMPTS[hobby]]
      }
    })
    return prompts.length > 0 ? prompts : ["What's on your mind today?", "How are you feeling right now?"]
  }

  // 🎨 USE PROMPT
  const usePrompt = (prompt) => {
    setCurrentEntry({ ...currentEntry, content: currentEntry.content + prompt + "\n\n" })
    setShowPrompts(false)
  }

  // 📸 ADD IMAGE
  const addImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera roll permissions to add images")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setCurrentEntry({
        ...currentEntry,
        images: [...currentEntry.images, result.assets[0].uri],
      })
    }
  }

  // 🎨 RENDER MOOD SELECTOR
  const renderMoodSelector = () => (
    <Modal visible={showMoodSelector} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>How are you feeling?</Text>
          <View style={styles.moodGrid}>
            {MOODS.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[styles.moodOption, { backgroundColor: mood.color + "20" }]}
                onPress={() => selectMood(mood)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <CustomButton title="Cancel" onPress={() => setShowMoodSelector(false)} variant="outline" />
        </View>
      </View>
    </Modal>
  )

  // 💡 RENDER PROMPTS MODAL
  const renderPromptsModal = () => (
    <Modal visible={showPrompts} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Writing Inspiration</Text>
          <ScrollView style={styles.promptsList}>
            {getHobbyPrompts().map((prompt, index) => (
              <TouchableOpacity
                key={index}
                style={styles.promptOption}
                onPress={() => usePrompt(prompt)}
              >
                <Text style={styles.promptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <CustomButton title="Cancel" onPress={() => setShowPrompts(false)} variant="outline" />
        </View>
      </View>
    </Modal>
  )

  // 📝 RENDER WRITING INTERFACE
  const renderWritingInterface = () => (
    <View style={styles.writingContainer}>
      <ScrollView style={styles.writingScroll} keyboardShouldPersistTaps="handled">
        {/* Entry Title */}
        <TextInput
          style={styles.titleInput}
          placeholder="Give your entry a title..."
          placeholderTextColor={COLORS.neutral.mediumGray}
          value={currentEntry.title}
          onChangeText={(text) => setCurrentEntry({ ...currentEntry, title: text })}
          maxLength={100}
        />

        {/* Mood & Tools Bar */}
        <View style={styles.toolsBar}>
          <TouchableOpacity style={styles.toolButton} onPress={() => setShowMoodSelector(true)}>
            <Text style={styles.toolIcon}>{currentEntry.mood?.emoji || "😊"}</Text>
            <Text style={styles.toolText}>Mood</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolButton} onPress={() => setShowPrompts(true)}>
            <Text style={styles.toolIcon}>💡</Text>
            <Text style={styles.toolText}>Prompts</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolButton} onPress={addImage}>
            <Text style={styles.toolIcon}>📸</Text>
            <Text style={styles.toolText}>Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Content Input */}
        <TextInput
          style={styles.contentInput}
          placeholder="Start writing your thoughts..."
          placeholderTextColor={COLORS.neutral.mediumGray}
          value={currentEntry.content}
          onChangeText={(text) => setCurrentEntry({ ...currentEntry, content: text })}
          multiline
          textAlignVertical="top"
        />

        {/* Images Preview */}
        {currentEntry.images.length > 0 && (
          <View style={styles.imagesPreview}>
            {currentEntry.images.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Text style={styles.imagePlaceholder}>📷 Image {index + 1}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.writingActions}>
        <CustomButton
          title="Cancel"
          onPress={() => setIsWriting(false)}
          variant="outline"
          size="medium"
          style={styles.cancelButton}
        />
        <CustomButton title="Save Entry" onPress={saveEntry} variant="success" size="medium" style={styles.saveButton} />
      </View>
    </View>
  )

  // 📖 RENDER ENTRY ITEM
  const renderEntryItem = ({ item }) => (
    <Animatable.View animation="fadeInUp" duration={600}>
      <TouchableOpacity style={styles.entryCard} activeOpacity={0.8}>
        <LinearGradient
          colors={[COLORS.neutral.white, COLORS.neutral.lightGray + "50"]}
          style={styles.entryGradient}
        >
          <View style={styles.entryHeader}>
            <Text style={styles.entryTitle}>{item.title}</Text>
            <View style={styles.entryMeta}>
              <Text style={styles.entryMood}>{item.mood?.emoji || "😊"}</Text>
              <Text style={styles.entryDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
          </View>
          <Text style={styles.entryPreview} numberOfLines={3}>
            {item.content}
          </Text>
          {item.hobbyTags.length > 0 && (
            <View style={styles.hobbyTags}>
              {item.hobbyTags.slice(0, 3).map((tag, index) => (
                <View key={index} style={[styles.hobbyTag, { backgroundColor: COLORS.hobbies[tag] + "20" }]}>
                  <Text style={[styles.hobbyTagText, { color: COLORS.hobbies[tag] }]}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  )

  // 📖 RENDER ENTRIES LIST
  const renderEntriesList = () => (
    <View style={styles.entriesContainer}>
      <View style={styles.entriesHeader}>
        <Text style={styles.entriesTitle}>Your Journal</Text>
        <Text style={styles.entriesCount}>{entries.length} entries</Text>
      </View>

      {entries.length > 0 ? (
        <FlatList
          data={entries}
          renderItem={renderEntryItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.entriesList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📝</Text>
          <Text style={styles.emptyStateTitle}>Your Journal Awaits</Text>
          <Text style={styles.emptyStateText}>Start documenting your growth journey with your first entry</Text>
        </View>
      )}
    </View>
  )

  if (isWriting) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutral.white} />
        {renderWritingInterface()}
        {renderMoodSelector()}
        {renderPromptsModal()}
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary.coral} />

      {/* Beautiful Header */}
      <Animatable.View ref={headerRef}>
        <LinearGradient colors={COLORS.gradients.sunrise} style={styles.header}>
          <Text style={styles.headerTitle}>Journal</Text>
          <Text style={styles.headerSubtitle}>Capture your thoughts and growth</Text>
        </LinearGradient>
      </Animatable.View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={startNewEntry} activeOpacity={0.8}>
        <LinearGradient colors={COLORS.gradients.success} style={styles.fabGradient}>
          <Text style={styles.fabIcon}>✍️</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Entries List */}
      <Animatable.View ref={entriesRef} style={styles.content}>
        {renderEntriesList()}
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
  writingContainer: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
  },
  writingScroll: {
    flex: 1,
    padding: SPACING.lg,
  },
  titleInput: {
    ...TYPOGRAPHY.h2,
    color: COLORS.neutral.black,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.neutral.lightGray,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.lg,
  },
  toolsBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: SPACING.md,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.neutral.lightGray,
    borderRadius: 12,
  },
  toolButton: {
    alignItems: "center",
    padding: SPACING.sm,
  },
  toolIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  toolText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.darkGray,
  },
  contentInput: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.black,
    minHeight: 300,
    textAlignVertical: "top",
    lineHeight: 24,
  },
  imagesPreview: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: SPACING.lg,
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.neutral.lightGray,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  imagePlaceholder: {
    fontSize: 12,
    color: COLORS.neutral.mediumGray,
  },
  writingActions: {
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
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
  },
  moodOption: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  moodLabel: {
    ...TYPOGRAPHY.caption,
    fontWeight: "600",
  },
  promptsList: {
    maxHeight: 300,
    marginBottom: SPACING.lg,
  },
  promptOption: {
    padding: SPACING.md,
    backgroundColor: COLORS.neutral.lightGray,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  promptText: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.black,
  },
  entriesContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  entriesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  entriesTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.neutral.black,
  },
  entriesCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.mediumGray,
  },
  entriesList: {
    paddingBottom: 100,
  },
  entryCard: {
    marginBottom: SPACING.md,
    borderRadius: 16,
    overflow: "hidden",
  },
  entryGradient: {
    padding: SPACING.lg,
    ...SHADOWS.light,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.sm,
  },
  entryTitle: {
    ...TYPOGRAPHY.h3,
    flex: 1,
    marginRight: SPACING.sm,
  },
  entryMeta: {
    alignItems: "flex-end",
  },
  entryMood: {
    fontSize: 20,
    marginBottom: SPACING.xs,
  },
  entryDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.mediumGray,
  },
  entryPreview: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.darkGray,
    marginBottom: SPACING.sm,
  },
  hobbyTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  hobbyTag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  hobbyTagText: {
    ...TYPOGRAPHY.caption,
    fontWeight: "600",
    textTransform: "capitalize",
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

export default JournalScreen
