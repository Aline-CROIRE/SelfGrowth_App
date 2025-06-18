"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import * as Haptics from "expo-haptics"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"
import { useData } from "../../context/DataContext"
import CustomInput from "../../components/common/CustomInput"
import CustomButton from "../../components/common/customButton"

const CreateJournalScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mood: "OKAY",
    images: [],
    tags: [],
  })
  const [errors, setErrors] = useState({})
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { createJournal } = useData()

  const moods = [
    { id: "AMAZING", name: "Amazing", icon: "happy", color: colors.moods.amazing },
    { id: "GOOD", name: "Good", icon: "happy-outline", color: colors.moods.good },
    { id: "OKAY", name: "Okay", icon: "remove-circle-outline", color: colors.moods.okay },
    { id: "BAD", name: "Bad", icon: "sad-outline", color: colors.moods.bad },
    { id: "TERRIBLE", name: "Terrible", icon: "sad", color: colors.moods.terrible },
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createJournal(formData)

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        navigation.goBack()
      } else {
        Alert.alert("Error", result.message || "Failed to create journal entry")
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

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      updateFormData("tags", [...formData.tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag) => {
    updateFormData(
      "tags",
      formData.tags.filter((t) => t !== tag),
    )
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      updateFormData("images", [...formData.images, result.assets[0].uri])
    }
  }

  const removeImage = (index) => {
    const newImages = [...formData.images]
    newImages.splice(index, 1)
    updateFormData("images", newImages)
  }

  return (
    <View style={globalStyles.safeContainer}>
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={[globalStyles.spaceBetween, { marginBottom: 20 }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.background.overlay,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
          </TouchableOpacity>

          <Text style={globalStyles.title}>New Journal</Text>

          <View style={{ width: 40 }} />
        </View>

        {/* Form */}
        <CustomInput
          label="Title"
          value={formData.title}
          onChangeText={(value) => updateFormData("title", value)}
          placeholder="Give your entry a title"
          error={errors.title}
          maxLength={100}
        />

        {/* Mood Selector */}
        <View style={{ marginVertical: 16 }}>
          <Text style={[globalStyles.bodySecondary, { marginBottom: 8, fontFamily: "Poppins-Medium" }]}>
            How are you feeling?
          </Text>

          <View style={[globalStyles.row, { flexWrap: "wrap" }]}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                onPress={() => updateFormData("mood", mood.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: formData.mood === mood.id ? mood.color : colors.background.card,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  marginRight: 8,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: mood.color,
                }}
              >
                <Ionicons
                  name={mood.icon}
                  size={18}
                  color={formData.mood === mood.id ? colors.text.white : mood.color}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    globalStyles.bodySecondary,
                    {
                      color: formData.mood === mood.id ? colors.text.white : mood.color,
                      fontFamily: "Poppins-Medium",
                    },
                  ]}
                >
                  {mood.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Journal Content */}
        <CustomInput
          label="Journal Entry"
          value={formData.content}
          onChangeText={(value) => updateFormData("content", value)}
          placeholder="Write your thoughts here..."
          multiline
          numberOfLines={10}
          error={errors.content}
        />

        {/* Tags */}
        <View style={{ marginVertical: 16 }}>
          <Text style={[globalStyles.bodySecondary, { marginBottom: 8, fontFamily: "Poppins-Medium" }]}>Tags</Text>

          <View style={[globalStyles.row, { alignItems: "center" }]}>
            <CustomInput
              value={tagInput}
              onChangeText={setTagInput}
              placeholder="Add tags (e.g., reflection, goals)"
              style={{ flex: 1, marginBottom: 0 }}
            />
            <TouchableOpacity
              onPress={handleAddTag}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.primary.coral,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 8,
              }}
            >
              <Ionicons name="add" size={24} color={colors.text.white} />
            </TouchableOpacity>
          </View>

          {formData.tags.length > 0 && (
            <View style={[globalStyles.row, { flexWrap: "wrap", marginTop: 12 }]}>
              {formData.tags.map((tag, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: colors.background.overlay,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text style={[globalStyles.caption, { color: colors.primary.coral, marginRight: 4 }]}>#{tag}</Text>
                  <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                    <Ionicons name="close-circle" size={16} color={colors.text.secondary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Images */}
        <View style={{ marginVertical: 16 }}>
          <View style={[globalStyles.spaceBetween, { marginBottom: 12 }]}>
            <Text style={[globalStyles.bodySecondary, { fontFamily: "Poppins-Medium" }]}>Images</Text>
            <TouchableOpacity onPress={pickImage}>
              <Text style={[globalStyles.bodySecondary, { color: colors.primary.coral }]}>Add Image</Text>
            </TouchableOpacity>
          </View>

          {formData.images.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {formData.images.map((image, index) => (
                <View key={index} style={{ marginRight: 12, position: "relative" }}>
                  <Image
                    source={{ uri: image }}
                    style={{ width: 100, height: 100, borderRadius: 8 }}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => removeImage(index)}
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      backgroundColor: colors.error,
                      borderRadius: 12,
                      width: 24,
                      height: 24,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="close" size={16} color={colors.text.white} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View
              style={{
                height: 100,
                borderWidth: 1,
                borderColor: colors.text.light,
                borderStyle: "dashed",
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="image-outline" size={32} color={colors.text.light} />
              <Text style={[globalStyles.caption, { marginTop: 8 }]}>No images added</Text>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <CustomButton
          title="Save Journal Entry"
          onPress={handleSubmit}
          loading={isSubmitting}
          style={{ marginTop: 20, marginBottom: 40 }}
        />
      </ScrollView>
    </View>
  )
}

export default CreateJournalScreen
