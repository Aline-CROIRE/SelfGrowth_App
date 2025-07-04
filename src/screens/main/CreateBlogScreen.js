"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import * as Haptics from "expo-haptics"
import { globalStyles, responsive } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"
import { useAuth } from "../../context/AuthContext"
import { useData } from "../../context/DataContext"
import { postService } from "../../services/postService"
import CustomInput from "../../components/common/CustomInput"
import CustomButton from "../../components/common/customButton"
import LoadingSpinner from "../../components/common/LoadingSpinner"

const CreateBlogScreen = ({ navigation }) => {
  const { user, token } = useAuth()
  const { loadPosts } = useData()

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    featuredImage: null,
    tags: [],
    status: "PUBLISHED",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentTag, setCurrentTag] = useState("")
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)

  
  const suggestedTags = [
    "Personal Growth",
    "Wellness",
    "Productivity",
    "Mindfulness",
    "Motivation",
    "Lifestyle",
    "Health",
    "Success",
    "Habits",
    "Goals",
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters"
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required"
    } else if (formData.content.length < 50) {
      newErrors.content = "Content must be at least 50 characters"
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "Excerpt is required"
    } else if (formData.excerpt.length < 20) {
      newErrors.excerpt = "Excerpt must be at least 20 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      return
    }

    setIsSubmitting(true)

    try {
      const postData = {
        ...formData,
       tags: formData.tags, 
      }

      const response = await postService.createPost(postData, token)

      if (response.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        Alert.alert("Success! 🎉", "Your blog post has been published successfully!", [
          {
            text: "View Post",
            onPress: () => {
              navigation.navigate("BlogDetail", { post: response.data.post })
            },
          },
          {
            text: "Create Another",
            onPress: () => {
              setFormData({
                title: "",
                content: "",
                excerpt: "",
                featuredImage: null,
                tags: [],
                status: "PUBLISHED",
              })
              setErrors({})
            },
          },
        ])
        await loadPosts()
      } else {
        Alert.alert("Error", response.message || "Failed to create post")
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      updateFormData("featuredImage", result.assets[0].uri)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      updateFormData("tags", [...formData.tags, tag])
      setCurrentTag("")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }

  const removeTag = (tagToRemove) => {
    updateFormData(
      "tags",
      formData.tags.filter((tag) => tag !== tagToRemove),
    )
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  const generateContentWithAI = async () => {
    if (!formData.title.trim()) {
      Alert.alert("Title Required", "Please enter a title first to generate content")
      return
    }

    setIsGeneratingContent(true)

    try {
      const response = await postService.generatePostContent(`Write a blog post about: ${formData.title}`, token)

      if (response.success) {
        updateFormData("content", response.data.content)
        updateFormData("excerpt", response.data.excerpt)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      } else {
        Alert.alert("AI Generation Failed", "Please try again or write manually")
      }
    } catch (error) {
      Alert.alert("Error", "AI content generation is not available right now")
    } finally {
      setIsGeneratingContent(false)
    }
  }

  if (isSubmitting) {
    return <LoadingSpinner message="Publishing your post..." />
  }

  return (
    <KeyboardAvoidingView style={globalStyles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={globalStyles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={colors.gradients.primary}
          style={[globalStyles.px20, globalStyles.py16, { paddingTop: responsive.spacing(60) }]}
        >
          <View style={globalStyles.rowSpaceBetween}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                ...globalStyles.center,
              }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text.white} />
            </TouchableOpacity>

            <Text style={[globalStyles.headlineMedium, { color: colors.text.white }]}>Create Blog Post</Text>

            <TouchableOpacity
              onPress={() => Alert.alert("Save Draft", "Draft functionality coming soon!", [{ text: "OK" }])}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                ...globalStyles.center,
              }}
            >
              <Ionicons name="bookmark-outline" size={24} color={colors.text.white} />
            </TouchableOpacity>
          </View>

      
          <View style={[globalStyles.rowCenter, globalStyles.my16]}>
            <View style={globalStyles.row}>
              {[1, 2, 3, 4].map((step) => (
                <View key={step} style={globalStyles.row}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "rgba(255, 255, 255, 0.6)",
                      marginHorizontal: 4,
                    }}
                  />
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>

        <View style={globalStyles.px20}>
          {/* Title Section */}
          <View style={[globalStyles.card, { marginTop: -20 }]}>
            <View style={[globalStyles.rowSpaceBetween, globalStyles.my8]}>
              <View style={globalStyles.row}>
                <Ionicons name="create-outline" size={24} color={colors.primary.coral} />
                <Text style={[globalStyles.titleLarge, globalStyles.mx8]}>Title & Content</Text>
              </View>

              <TouchableOpacity
                onPress={generateContentWithAI}
                disabled={isGeneratingContent}
                style={{
                  backgroundColor: colors.info.bg,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  ...globalStyles.row,
                }}
              >
                <Ionicons
                  name={isGeneratingContent ? "hourglass-outline" : "sparkles-outline"}
                  size={16}
                  color={colors.info.main}
                />
                <Text style={[globalStyles.labelSmall, { color: colors.info.main, marginLeft: 4 }]}>
                  {isGeneratingContent ? "Generating..." : "AI Help"}
                </Text>
              </TouchableOpacity>
            </View>

            <CustomInput
              label="Post Title"
              value={formData.title}
              onChangeText={(value) => updateFormData("title", value)}
              placeholder="Enter an engaging title..."
              error={errors.title}
              leftIcon={<Ionicons name="text-outline" size={20} color={colors.text.secondary} />}
            />

            <CustomInput
              label="Excerpt"
              value={formData.excerpt}
              onChangeText={(value) => updateFormData("excerpt", value)}
              placeholder="Brief description of your post..."
              error={errors.excerpt}
              multiline
              numberOfLines={2}
              leftIcon={<Ionicons name="document-text-outline" size={20} color={colors.text.secondary} />}
            />

            <CustomInput
              label="Content"
              value={formData.content}
              onChangeText={(value) => updateFormData("content", value)}
              placeholder="Write your blog post content here..."
              error={errors.content}
              multiline
              numberOfLines={8}
              leftIcon={<Ionicons name="newspaper-outline" size={20} color={colors.text.secondary} />}
            />
          </View>

          {/* Featured Image Section */}
          <View style={globalStyles.card}>
            <View style={[globalStyles.rowSpaceBetween, globalStyles.my8]}>
              <View style={globalStyles.row}>
                <Ionicons name="image-outline" size={24} color={colors.primary.coral} />
                <Text style={[globalStyles.titleLarge, globalStyles.mx8]}>Featured Image</Text>
              </View>

              <Text style={[globalStyles.labelSmall, { color: colors.text.secondary }]}>Optional</Text>
            </View>

            {formData.featuredImage ? (
              <View style={{ position: "relative" }}>
                <Image
                  source={{ uri: formData.featuredImage }}
                  style={{
                    width: "100%",
                    height: 200,
                    borderRadius: 12,
                    marginBottom: 12,
                  }}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => updateFormData("featuredImage", null)}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: colors.error.main,
                    ...globalStyles.center,
                  }}
                >
                  <Ionicons name="close" size={18} color={colors.text.white} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleImagePicker}
                style={{
                  borderWidth: 2,
                  borderColor: colors.border.light,
                  borderStyle: "dashed",
                  borderRadius: 12,
                  padding: 40,
                  ...globalStyles.center,
                  backgroundColor: colors.background.level1,
                }}
              >
                <Ionicons name="cloud-upload-outline" size={48} color={colors.text.secondary} />
                <Text style={[globalStyles.titleMedium, globalStyles.my8]}>Add Featured Image</Text>
                <Text style={[globalStyles.bodySmall, { textAlign: "center" }]}>
                  Tap to select an image from your gallery
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Tags Section */}
          <View style={globalStyles.card}>
            <View style={[globalStyles.rowSpaceBetween, globalStyles.my8]}>
              <View style={globalStyles.row}>
                <Ionicons name="pricetag-outline" size={24} color={colors.primary.coral} />
                <Text style={[globalStyles.titleLarge, globalStyles.mx8]}>Tags</Text>
              </View>

              <Text style={[globalStyles.labelSmall, { color: colors.text.secondary }]}>{formData.tags.length}/5</Text>
            </View>

            {/* Current Tags */}
            {formData.tags.length > 0 && (
              <View style={[globalStyles.row, { flexWrap: "wrap", marginBottom: 16 }]}>
                {formData.tags.map((tag, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => removeTag(tag)}
                    style={{
                      backgroundColor: colors.primary.coral,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                      marginRight: 8,
                      marginBottom: 8,
                      ...globalStyles.row,
                    }}
                  >
                    <Text style={[globalStyles.labelSmall, { color: colors.text.white }]}>{tag}</Text>
                    <Ionicons name="close" size={14} color={colors.text.white} style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Add Tag Input */}
            <View style={globalStyles.row}>
              <View style={globalStyles.flex1}>
                <CustomInput
                  value={currentTag}
                  onChangeText={setCurrentTag}
                  placeholder="Add a tag..."
                  onSubmitEditing={() => addTag(currentTag)}
                  returnKeyType="done"
                />
              </View>
              <TouchableOpacity
                onPress={() => addTag(currentTag)}
                disabled={!currentTag.trim() || formData.tags.length >= 5}
                style={{
                  backgroundColor:
                    currentTag.trim() && formData.tags.length < 5 ? colors.primary.coral : colors.neutral.gray300,
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  ...globalStyles.center,
                  marginLeft: 12,
                  marginTop: 8,
                }}
              >
                <Ionicons
                  name="add"
                  size={24}
                  color={currentTag.trim() && formData.tags.length < 5 ? colors.text.white : colors.text.secondary}
                />
              </TouchableOpacity>
            </View>

            {/* Suggested Tags */}
            <Text style={[globalStyles.labelMedium, globalStyles.my12]}>Suggested Tags:</Text>
            <View style={[globalStyles.row, { flexWrap: "wrap" }]}>
              {suggestedTags
                .filter((tag) => !formData.tags.includes(tag))
                .slice(0, 6)
                .map((tag, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => addTag(tag)}
                    disabled={formData.tags.length >= 5}
                    style={{
                      backgroundColor: formData.tags.length >= 5 ? colors.neutral.gray200 : colors.background.level1,
                      borderWidth: 1,
                      borderColor: colors.border.light,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                      marginRight: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={[
                        globalStyles.labelSmall,
                        {
                          color: formData.tags.length >= 5 ? colors.text.disabled : colors.text.secondary,
                        },
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>

          {/* Publish Button */}
          <View style={[globalStyles.px4, globalStyles.py20]}>
            <CustomButton
              title="Publish Post"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={!formData.title.trim() || !formData.content.trim()}
              leftIcon={<Ionicons name="send" size={20} color={colors.text.white} />}
              style={{ marginBottom: 12 }}
            />

            <CustomButton
              title="Save as Draft"
              onPress={() => Alert.alert("Coming Soon", "Draft functionality will be available soon!")}
              variant="secondary"
              leftIcon={<Ionicons name="bookmark-outline" size={20} color={colors.primary.coral} />}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default CreateBlogScreen
