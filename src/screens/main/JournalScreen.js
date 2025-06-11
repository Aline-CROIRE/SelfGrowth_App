"use client"

// 📝 JOURNAL SCREEN - Beautiful journaling experience

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import * as Animatable from "react-native-animatable"
import * as ImagePicker from "expo-image-picker"
import * as Haptics from "expo-haptics"
import { SafeAreaView } from "react-native-safe-area-context"

import { useApp } from "../../context/AppContext"
import { COLORS } from "../../styles/colors"
import { TYPOGRAPHY, SPACING, SHADOWS, GLOBAL_STYLES } from "../../styles/globalStyles"
import CustomButton from "../../components/common/customButton"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import EmptyState from "../../components/common/EmptyState"
import { formatDate } from "../../utils/dateHelpers"

// 😊 MOOD DATA - For tracking emotional state
const MOODS = [
  { id: "amazing", emoji: "😁", label: "Amazing", color: COLORS.status.success },
  { id: "good", emoji: "😊", label: "Good", color: COLORS.secondary.gold },
  { id: "okay", emoji: "😐", label: "Okay", color: COLORS.primary.orange },
  { id: "sad", emoji: "😔", label: "Sad", color: COLORS.hobbies.writing },
  { id: "awful", emoji: "😩", label: "Awful", color: COLORS.status.error },
]

// 💡 WRITING PROMPTS - Based on user hobbies
const WRITING_PROMPTS = {
  art: [
    "What art piece inspired you recently and why?",
    "Describe a color that represents your mood today.",
    "If you could create any artwork without limitations, what would it be?",
  ],
  reading: [
    "What book character do you relate to most right now?",
    "How has a recent book changed your perspective?",
    "Describe your ideal reading environment.",
  ],
  music: [
    "What song lyrics speak to you today?",
    "How does music affect your emotional state?",
    "Describe a memory strongly tied to a specific song.",
  ],
  sports: [
    "How did physical activity impact your wellbeing today?",
    "What fitness goal are you working toward?",
    "Describe how movement makes you feel.",
  ],
  writing: [
    "What story are you telling yourself today?",
    "If your day was a chapter in a book, what would the title be?",
    "Write a six-word memoir for your day.",
  ],
  default: [
    "What made you smile today?",
    "What's one thing you learned recently?",
    "Describe something you're looking forward to.",
    "What's something you're grateful for today?",
    "Reflect on a challenge you're currently facing.",
  ],
}

const JournalScreen = ({ navigation, route }) => {
  const { state, actions } = useApp()
  const { entries, selectedHobbies } = state

  // 📝 COMPONENT STATE
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [entryTitle, setEntryTitle] = useState("")
  const [entryText, setEntryText] = useState("")
  const [selectedMood, setSelectedMood] = useState(null)
  const [entryImages, setEntryImages] = useState([])
  const [currentEntry, setCurrentEntry] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showPrompts, setShowPrompts] = useState(false)
  const [prompts, setPrompts] = useState([])

  // Animation refs
  const headerRef = useRef()
  const formRef = useRef()
  const listRef = useRef()

  // 🎬 INITIALIZE SCREEN
  useEffect(() => {
    // Check if we should create a new entry
    if (route.params?.action === "new") {
      handleNewEntry()
    }

    // Check if we should edit a specific entry
    if (route.params?.entryId) {
      const entry = entries.find((e) => e.id === route.params.entryId)
      if (entry) {
        handleEditEntry(entry)
      }
    }

    // Generate writing prompts based on user hobbies
    generatePrompts()
  }, [route.params])

  // 💡 GENERATE WRITING PROMPTS
  const generatePrompts = () => {
    let allPrompts = [...WRITING_PROMPTS.default]

    // Add hobby-specific prompts
    if (selectedHobbies && selectedHobbies.length > 0) {
      selectedHobbies.forEach((hobby) => {
        if (WRITING_PROMPTS[hobby]) {
          allPrompts = [...allPrompts, ...WRITING_PROMPTS[hobby]]
        }
      })
    }

    // Shuffle and take 5 prompts
    const shuffled = allPrompts.sort(() => 0.5 - Math.random())
    setPrompts(shuffled.slice(0, 5))
  }

  // 🎯 HANDLE NEW ENTRY
  const handleNewEntry = () => {
    setIsCreating(true)
    setIsEditing(false)
    setEntryTitle("")
    setEntryText("")
    setSelectedMood(MOODS[2]) // Default to "Okay"
    setEntryImages([])
    setCurrentEntry(null)
    setShowPrompts(true)

    // Animate the form in
    setTimeout(() => {
      formRef.current?.fadeInUp(500)
    }, 100)
  }

  // 🎯 HANDLE EDIT ENTRY
  const handleEditEntry = (entry) => {
    setIsCreating(false)
    setIsEditing(true)
    setEntryTitle(entry.title)
    setEntryText(entry.content)
    setSelectedMood(MOODS.find((m) => m.id === entry.mood) || MOODS[2])
    setEntryImages(entry.images || [])
    setCurrentEntry(entry)
    setShowPrompts(false)

    // Animate the form in
    setTimeout(() => {
      formRef.current?.fadeInUp(500)
    }, 100)
  }

  // 🎯 HANDLE SAVE ENTRY
  const handleSaveEntry = () => {
    if (!entryTitle.trim()) {
      Alert.alert("Missing Title", "Please add a title for your journal entry.")
      return
    }

    if (!entryText.trim()) {
      Alert.alert("Empty Entry", "Please write something in your journal entry.")
      return
    }

    setIsLoading(true)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

    // Prepare entry data
    const entryData = {
      title: entryTitle.trim(),
      content: entryText.trim(),
      mood: selectedMood?.id || "okay",
      moodColor: selectedMood?.color || COLORS.primary.orange,
      images: entryImages,
    }

    setTimeout(() => {
      if (isEditing && currentEntry) {
        // Update existing entry
        actions.updateEntry({
          id: currentEntry.id,
          ...entryData,
        })
      } else {
        // Create new entry
        actions.addEntry(entryData)
      }

      // Reset form and state
      setIsLoading(false)
      setIsCreating(false)
      setIsEditing(false)
      setEntryTitle("")
      setEntryText("")
      setSelectedMood(MOODS[2])
      setEntryImages([])
      setCurrentEntry(null)
      setShowPrompts(false)

      // Hide keyboard
      Keyboard.dismiss()
    }, 1000)
  }

  // 🎯 HANDLE CANCEL
  const handleCancel = () => {
    if (entryTitle.trim() || entryText.trim()) {
      Alert.alert("Discard Changes?", "Are you sure you want to discard your changes?", [
        { text: "Keep Editing", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            setIsCreating(false)
            setIsEditing(false)
            setEntryTitle("")
            setEntryText("")
            setSelectedMood(MOODS[2])
            setEntryImages([])
            setCurrentEntry(null)
            setShowPrompts(false)
            Keyboard.dismiss()
          },
        },
      ])
    } else {
      setIsCreating(false)
      setIsEditing(false)
      setShowPrompts(false)
      Keyboard.dismiss()
    }
  }

  // 🎯 HANDLE DELETE ENTRY
  const handleDeleteEntry = (entry) => {
    Alert.alert("Delete Entry", "Are you sure you want to delete this journal entry? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
          actions.deleteEntry(entry.id)
        },
      },
    ])
  }

  // 📸 HANDLE IMAGE PICKER
  const handleAddImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to grant access to your photo library to add images.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setEntryImages([...entryImages, result.assets[0].uri])
    }
  }

  // 🎯 HANDLE REMOVE IMAGE
  const handleRemoveImage = (index) => {
    const newImages = [...entryImages]
    newImages.splice(index, 1)
    setEntryImages(newImages)
  }

  // 🎯 HANDLE USE PROMPT
  const handleUsePrompt = (prompt) => {
    setEntryText((current) => (current ? `${current}\n\n${prompt}:\n` : `${prompt}:\n`))
    setShowPrompts(false)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  // 🔍 FILTER ENTRIES
  const getFilteredEntries = () => {
    if (!searchQuery.trim()) return entries

    const query = searchQuery.toLowerCase()
    return entries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query) ||
        MOODS.find((m) => m.id === entry.mood)
          ?.label.toLowerCase()
          .includes(query),
    )
  }

  // 🎨 RENDER MOOD SELECTOR
  const renderMoodSelector = () => (
    <View style={styles.moodContainer}>
      <Text style={styles.moodLabel}>How are you feeling?</Text>
      <View style={styles.moodOptions}>
        {MOODS.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            style={[styles.moodOption, selectedMood?.id === mood.id && styles.moodOptionSelected]}
            onPress={() => {
              setSelectedMood(mood)
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }}
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={[styles.moodText, selectedMood?.id === mood.id && { color: mood.color, fontWeight: "600" }]}>
              {mood.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  // 🎨 RENDER IMAGE GALLERY
  const renderImageGallery = () => (
    <View style={styles.imageGalleryContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageGallery}>
        {entryImages.map((uri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.entryImage} />
            <TouchableOpacity style={styles.removeImageButton} onPress={() => handleRemoveImage(index)}>
              <Text style={styles.removeImageText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
          <Text style={styles.addImageIcon}>+</Text>
          <Text style={styles.addImageText}>Add Photo</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )

  // 🎨 RENDER WRITING PROMPTS
  const renderWritingPrompts = () => (
    <Animatable.View animation="fadeIn" style={styles.promptsContainer}>
      <View style={styles.promptsHeader}>
        <Text style={styles.promptsTitle}>Writing Prompts</Text>
        <TouchableOpacity onPress={() => setShowPrompts(false)}>
          <Text style={styles.promptsClose}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.promptsList}>
        {prompts.map((prompt, index) => (
          <TouchableOpacity key={index} style={styles.promptItem} onPress={() => handleUsePrompt(prompt)}>
            <Text style={styles.promptText}>{prompt}</Text>
            <Text style={styles.promptUse}>Use</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.refreshPromptsButton} onPress={generatePrompts}>
        <Text style={styles.refreshPromptsText}>🔄 Refresh Prompts</Text>
      </TouchableOpacity>
    </Animatable.View>
  )

  // 🎨 RENDER ENTRY FORM
  const renderEntryForm = () => (
    <Animatable.View ref={formRef} style={styles.formContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardContainer}>
        <ScrollView style={styles.formScrollView} keyboardShouldPersistTaps="handled">
          {/* Title Input */}
          <TextInput
            style={styles.titleInput}
            placeholder="Entry Title"
            placeholderTextColor={COLORS.neutral.mediumGray}
            value={entryTitle}
            onChangeText={setEntryTitle}
            maxLength={50}
          />

          {/* Mood Selector */}
          {renderMoodSelector()}

          {/* Content Input */}
          <TextInput
            style={styles.contentInput}
            placeholder="What's on your mind today?"
            placeholderTextColor={COLORS.neutral.mediumGray}
            value={entryText}
            onChangeText={setEntryText}
            multiline
            textAlignVertical="top"
          />

          {/* Image Gallery */}
          {renderImageGallery()}

          {/* Action Buttons */}
          <View style={styles.formActions}>
            {!isLoading ? (
              <>
                <CustomButton
                  title="Cancel"
                  onPress={handleCancel}
                  variant="outline"
                  size="medium"
                  style={styles.cancelButton}
                />
                <CustomButton
                  title={isEditing ? "Save Changes" : "Save Entry"}
                  onPress={handleSaveEntry}
                  variant={isEditing ? "success" : "primary"}
                  size="medium"
                  style={styles.saveButton}
                />
              </>
            ) : (
              <LoadingSpinner size="large" color={COLORS.primary.coral} />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Writing Prompts */}
      {showPrompts && renderWritingPrompts()}

      {/* Prompt Button */}
      {!showPrompts && (
        <TouchableOpacity style={styles.promptButton} onPress={() => setShowPrompts(true)}>
          <LinearGradient colors={COLORS.gradients.dream} style={styles.promptButtonGradient}>
            <Text style={styles.promptButtonText}>💡 Need inspiration?</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </Animatable.View>
  )

  // 🎨 RENDER ENTRY ITEM
  const renderEntryItem = ({ item }) => {
    const mood = MOODS.find((m) => m.id === item.mood) || MOODS[2]
    const date = formatDate(new Date(item.createdAt))

    return (
      <Animatable.View animation="fadeIn" duration={500} style={styles.entryItem}>
        <TouchableOpacity style={styles.entryCard} onPress={() => handleEditEntry(item)} activeOpacity={0.8}>
          {/* Entry Header */}
          <View style={styles.entryHeader}>
            <View style={styles.entryMeta}>
              <Text style={styles.entryDate}>{date}</Text>
              <View style={styles.entryMoodContainer}>
                <Text style={styles.entryMoodEmoji}>{mood.emoji}</Text>
                <Text style={[styles.entryMoodText, { color: mood.color }]}>{mood.label}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.entryDeleteButton}
              onPress={() => handleDeleteEntry(item)}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Text style={styles.entryDeleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>

          {/* Entry Content */}
          <Text style={styles.entryTitle}>{item.title}</Text>
          <Text style={styles.entryContent} numberOfLines={3}>
            {item.content}
          </Text>

          {/* Entry Images */}
          {item.images && item.images.length > 0 && (
            <View style={styles.entryImagesPreview}>
              {item.images.slice(0, 3).map((uri, index) => (
                <Image key={index} source={{ uri }} style={styles.entryImageThumbnail} />
              ))}
              {item.images.length > 3 && (
                <View style={styles.moreImagesIndicator}>
                  <Text style={styles.moreImagesText}>+{item.images.length - 3}</Text>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
      </Animatable.View>
    )
  }

  // 🎨 RENDER ENTRIES LIST
  const renderEntriesList = () => {
    const filteredEntries = getFilteredEntries()

    if (filteredEntries.length === 0) {
      return (
        <EmptyState
          icon="📝"
          title="No Journal Entries Yet"
          message={
            searchQuery
              ? "No entries match your search. Try different keywords."
              : "Start documenting your thoughts and experiences."
          }
          actionLabel={searchQuery ? "Clear Search" : "Write First Entry"}
          onAction={searchQuery ? () => setSearchQuery("") : handleNewEntry}
        />
      )
    }

    return (
      <Animatable.View ref={listRef} style={styles.entriesListContainer}>
        <FlatList
          data={filteredEntries}
          renderItem={renderEntryItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.entriesList}
        />
      </Animatable.View>
    )
  }

  // 🎨 RENDER MAIN SCREEN
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animatable.View ref={headerRef} animation="fadeInDown" duration={500} style={styles.header}>
        <LinearGradient
          colors={COLORS.gradients.sunrise}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>Journal</Text>

          {/* Search Bar */}
          {!isCreating && !isEditing && (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search entries..."
                placeholderTextColor={COLORS.neutral.white + "99"}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity style={styles.searchClear} onPress={() => setSearchQuery("")}>
                  <Text style={styles.searchClearText}>✕</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.searchIcon}>🔍</Text>
              )}
            </View>
          )}
        </LinearGradient>
      </Animatable.View>

      {/* Content */}
      <View style={styles.content}>{isCreating || isEditing ? renderEntryForm() : renderEntriesList()}</View>

      {/* Floating Action Button */}
      {!isCreating && !isEditing && (
        <TouchableOpacity style={styles.fab} onPress={handleNewEntry} activeOpacity={0.8}>
          <LinearGradient colors={COLORS.gradients.sunrise} style={styles.fabGradient}>
            <Text style={styles.fabIcon}>+</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
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
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.neutral.white,
    marginBottom: SPACING.md,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.neutral.white + "33",
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: COLORS.neutral.white,
    ...TYPOGRAPHY.body,
  },
  searchIcon: {
    fontSize: 16,
    color: COLORS.neutral.white + "99",
  },
  searchClear: {
    padding: SPACING.xs,
  },
  searchClearText: {
    fontSize: 16,
    color: COLORS.neutral.white,
  },
  content: {
    flex: 1,
  },
  entriesListContainer: {
    flex: 1,
  },
  entriesList: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  entryItem: {
    marginBottom: SPACING.md,
  },
  entryCard: {
    ...GLOBAL_STYLES.card,
    borderRadius: 12,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.sm,
  },
  entryMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  entryDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.mediumGray,
    marginRight: SPACING.md,
  },
  entryMoodContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  entryMoodEmoji: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  entryMoodText: {
    ...TYPOGRAPHY.caption,
    fontWeight: "600",
  },
  entryDeleteButton: {
    padding: SPACING.xs,
  },
  entryDeleteText: {
    fontSize: 16,
  },
  entryTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.sm,
  },
  entryContent: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.darkGray,
  },
  entryImagesPreview: {
    flexDirection: "row",
    marginTop: SPACING.md,
  },
  entryImageThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: SPACING.sm,
  },
  moreImagesIndicator: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.neutral.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },
  moreImagesText: {
    ...TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.neutral.darkGray,
  },
  fab: {
    position: "absolute",
    bottom: SPACING.xl,
    right: SPACING.lg,
    ...SHADOWS.heavy,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  fabIcon: {
    fontSize: 32,
    color: COLORS.neutral.white,
    fontWeight: "bold",
  },
  formContainer: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  formScrollView: {
    flex: 1,
    padding: SPACING.lg,
  },
  titleInput: {
    ...GLOBAL_STYLES.input,
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.lg,
  },
  moodContainer: {
    marginBottom: SPACING.lg,
  },
  moodLabel: {
    ...TYPOGRAPHY.body,
    fontWeight: "600",
    marginBottom: SPACING.sm,
  },
  moodOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  moodOption: {
    alignItems: "center",
    padding: SPACING.sm,
    borderRadius: 12,
    backgroundColor: COLORS.neutral.lightGray,
    width: "18%",
  },
  moodOptionSelected: {
    backgroundColor: COLORS.neutral.white,
    ...SHADOWS.light,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  moodText: {
    ...TYPOGRAPHY.caption,
    textAlign: "center",
  },
  contentInput: {
    ...GLOBAL_STYLES.input,
    ...TYPOGRAPHY.body,
    height: 200,
    textAlignVertical: "top",
    marginBottom: SPACING.lg,
  },
  imageGalleryContainer: {
    marginBottom: SPACING.lg,
  },
  imageGallery: {
    paddingBottom: SPACING.sm,
  },
  imageContainer: {
    marginRight: SPACING.sm,
    position: "relative",
  },
  entryImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: COLORS.status.error,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.light,
  },
  removeImageText: {
    color: COLORS.neutral.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.neutral.lightGray,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.neutral.mediumGray,
    borderStyle: "dashed",
  },
  addImageIcon: {
    fontSize: 24,
    color: COLORS.neutral.darkGray,
    marginBottom: SPACING.xs,
  },
  addImageText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.darkGray,
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.xl,
  },
  cancelButton: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  saveButton: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  promptButton: {
    position: "absolute",
    bottom: SPACING.xl,
    left: SPACING.lg,
    right: SPACING.lg,
    ...SHADOWS.medium,
    borderRadius: 12,
    overflow: "hidden",
  },
  promptButtonGradient: {
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  promptButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.neutral.white,
  },
  promptsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.neutral.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SPACING.lg,
    ...SHADOWS.heavy,
    maxHeight: "60%",
  },
  promptsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  promptsTitle: {
    ...TYPOGRAPHY.h3,
  },
  promptsClose: {
    fontSize: 20,
    color: COLORS.neutral.darkGray,
  },
  promptsList: {
    maxHeight: 300,
  },
  promptItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral.lightGray,
  },
  promptText: {
    ...TYPOGRAPHY.body,
    flex: 1,
    paddingRight: SPACING.md,
  },
  promptUse: {
    ...TYPOGRAPHY.button,
    color: COLORS.primary.coral,
  },
  refreshPromptsButton: {
    alignItems: "center",
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  refreshPromptsText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary.coral,
    fontWeight: "600",
  },
})

export default JournalScreen
