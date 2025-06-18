"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native"
import * as Haptics from "expo-haptics"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"
import { useData } from "../../context/DataContext"
import CustomInput from "../../components/common/CustomInput"
import CustomButton from "../../components/common/customButton"

const CreateGoalScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "MEDIUM",
    targetDate: "",
    progress: 0,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { createGoal } = useData()

  const priorities = [
    { id: "LOW", name: "Low", color: colors.success },
    { id: "MEDIUM", name: "Medium", color: colors.warning },
    { id: "HIGH", name: "High", color: colors.primary.orange },
    { id: "URGENT", name: "Urgent", color: colors.error },
  ]

  const categories = ["Personal", "Career", "Health", "Finance", "Education", "Relationships", "Spiritual", "Hobbies"]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required"
    }

    if (formData.targetDate && isNaN(new Date(formData.targetDate).getTime())) {
      newErrors.targetDate = "Please enter a valid date (YYYY-MM-DD)"
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
      const result = await createGoal(formData)

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationType.Success)

        Alert.alert("Success", "Goal created successfully!", [{ text: "OK", onPress: () => navigation.goBack() }])
      } else {
        Haptics.notificationAsync(Haptics.NotificationType.Error)
        Alert.alert("Error", result.message || "Failed to create goal.")
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationType.Error)
      Alert.alert("Error", "An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.inputContainer}>
        <Text style={globalStyles.label}>Title</Text>
        <CustomInput
          placeholder="Goal Title"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
          error={errors.title}
        />

        <Text style={globalStyles.label}>Description</Text>
        <CustomInput
          placeholder="Goal Description"
          multiline
          numberOfLines={4}
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
        />

        <Text style={globalStyles.label}>Category</Text>
        <View style={globalStyles.categoryContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[globalStyles.categoryButton, formData.category === cat && globalStyles.categoryButtonSelected]}
              onPress={() => setFormData({ ...formData, category: cat })}
            >
              <Text style={[globalStyles.categoryText, formData.category === cat && globalStyles.categoryTextSelected]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.category ? <Text style={globalStyles.errorText}>{errors.category}</Text> : null}

        <Text style={globalStyles.label}>Priority</Text>
        <View style={globalStyles.priorityContainer}>
          {priorities.map((priority) => (
            <TouchableOpacity
              key={priority.id}
              style={[
                globalStyles.priorityButton,
                { backgroundColor: priority.color },
                formData.priority === priority.id && globalStyles.priorityButtonSelected,
              ]}
              onPress={() => setFormData({ ...formData, priority: priority.id })}
            >
              <Text style={globalStyles.priorityText}>{priority.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={globalStyles.label}>Target Date (YYYY-MM-DD)</Text>
        <CustomInput
          placeholder="YYYY-MM-DD"
          value={formData.targetDate}
          onChangeText={(text) => setFormData({ ...formData, targetDate: text })}
          error={errors.targetDate}
        />

        <CustomButton
          title={isSubmitting ? "Creating..." : "Create Goal"}
          onPress={handleSubmit}
          disabled={isSubmitting}
        />
      </View>
    </ScrollView>
  )
}

export default CreateGoalScreen
