"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import * as Haptics from "expo-haptics"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import CustomInput from "../../components/common/CustomInput"
import CustomButton from "../../components/common/customButton"
import HobbySelector from "../../components/hobbies/HobbySelector"

const EditProfileScreen = ({ navigation }) => {
  const { user, updateProfile } = useAuth()
  const { getHobbyColor } = useTheme()
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    bio: user?.bio || "",
    primaryHobby: user?.primaryHobby || "",
    profilePicture: user?.profilePicture || null,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hobbyColor = getHobbyColor()

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
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
      const result = await updateProfile(formData)

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        Alert.alert("Success", "Profile updated successfully!", [{ text: "OK", onPress: () => navigation.goBack() }])
      } else {
        Alert.alert("Error", result.message || "Failed to update profile")
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
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      updateFormData("profilePicture", result.assets[0].uri)
    }
  }

  return (
    <View style={globalStyles.safeContainer}>
      <ScrollView style={globalStyles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Header */}
        <View style={[globalStyles.spaceBetween, { padding: 20, paddingBottom: 0 }]}>
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

          <Text style={globalStyles.title}>Edit Profile</Text>

          <View style={{ width: 40 }} />
        </View>

        <View style={{ padding: 20 }}>
          {/* Profile Picture */}
          <View style={[globalStyles.center, { marginBottom: 30 }]}>
            <TouchableOpacity onPress={handleImagePicker} style={{ position: "relative" }}>
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: colors.background.overlay,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 3,
                  borderColor: hobbyColor,
                  shadowColor: colors.shadow.medium,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                {formData.profilePicture ? (
                  <Image
                    source={{ uri: formData.profilePicture }}
                    style={{ width: 114, height: 114, borderRadius: 57 }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={[globalStyles.title, { color: hobbyColor, fontSize: 48 }]}>
                    {formData.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}
                  </Text>
                )}
              </View>

              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: hobbyColor,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 3,
                  borderColor: colors.background.primary,
                  shadowColor: colors.shadow.medium,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Ionicons name="camera" size={18} color={colors.text.white} />
              </View>
            </TouchableOpacity>

            <Text style={[globalStyles.caption, { marginTop: 12, color: colors.text.secondary }]}>
              Tap to change profile picture
            </Text>
          </View>

          {/* Form Fields */}
          <CustomInput
            label="First Name"
            value={formData.firstName}
            onChangeText={(value) => updateFormData("firstName", value)}
            placeholder="Enter your first name"
            error={errors.firstName}
            leftIcon={<Ionicons name="person-outline" size={20} color={colors.text.secondary} />}
          />

          <CustomInput
            label="Last Name"
            value={formData.lastName}
            onChangeText={(value) => updateFormData("lastName", value)}
            placeholder="Enter your last name"
            error={errors.lastName}
            leftIcon={<Ionicons name="person-outline" size={20} color={colors.text.secondary} />}
          />

          <CustomInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => updateFormData("email", value)}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            leftIcon={<Ionicons name="mail-outline" size={20} color={colors.text.secondary} />}
          />

          <CustomInput
            label="Bio"
            value={formData.bio}
            onChangeText={(value) => updateFormData("bio", value)}
            placeholder="Tell us about yourself..."
            multiline
            numberOfLines={4}
            leftIcon={<Ionicons name="document-text-outline" size={20} color={colors.text.secondary} />}
          />

          {/* Hobby Selector */}
          <View style={{ marginVertical: 16 }}>
            <Text style={[globalStyles.bodySecondary, { marginBottom: 12, fontWeight: "600" }]}>Primary Interest</Text>
            <HobbySelector
              selectedHobby={formData.primaryHobby}
              onHobbySelect={(hobby) => updateFormData("primaryHobby", hobby)}
            />
          </View>

          {/* Account Info */}
          <View
            style={[
              globalStyles.card,
              {
                marginHorizontal: 0,
                marginVertical: 20,
                backgroundColor: colors.background.overlay,
                borderWidth: 1,
                borderColor: colors.text.light + "30",
              },
            ]}
          >
            <View style={[globalStyles.row, { marginBottom: 12 }]}>
              <Ionicons name="information-circle-outline" size={20} color={colors.info} style={{ marginRight: 8 }} />
              <Text style={[globalStyles.bodySecondary, { fontWeight: "600", color: colors.info }]}>
                Account Information
              </Text>
            </View>

            <View style={[globalStyles.spaceBetween, { marginBottom: 8 }]}>
              <Text style={[globalStyles.caption, { color: colors.text.secondary }]}>Member since</Text>
              <Text style={[globalStyles.caption, { fontWeight: "600" }]}>
                {new Date(user?.createdAt).toLocaleDateString()}
              </Text>
            </View>

            <View style={[globalStyles.spaceBetween, { marginBottom: 8 }]}>
              <Text style={[globalStyles.caption, { color: colors.text.secondary }]}>Account type</Text>
              <Text style={[globalStyles.caption, { fontWeight: "600", color: hobbyColor }]}>
                {user?.role === "SUPER_ADMIN" ? "Super Admin" : user?.role === "ADMIN" ? "Admin" : "Member"}
              </Text>
            </View>

            <View style={[globalStyles.spaceBetween]}>
              <Text style={[globalStyles.caption, { color: colors.text.secondary }]}>Email verified</Text>
              <View style={[globalStyles.row, { alignItems: "center" }]}>
                <Ionicons
                  name={user?.emailVerified ? "checkmark-circle" : "close-circle"}
                  size={14}
                  color={user?.emailVerified ? colors.success : colors.error}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    globalStyles.caption,
                    { fontWeight: "600", color: user?.emailVerified ? colors.success : colors.error },
                  ]}
                >
                  {user?.emailVerified ? "Verified" : "Not verified"}
                </Text>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <CustomButton
            title="Save Changes"
            onPress={handleSubmit}
            loading={isSubmitting}
            style={{ marginTop: 20 }}
            leftIcon={<Ionicons name="save-outline" size={20} color={colors.text.white} />}
          />

          {/* Danger Zone */}
          <View
            style={[
              globalStyles.card,
              {
                marginHorizontal: 0,
                marginTop: 30,
                backgroundColor: colors.error + "05",
                borderWidth: 1,
                borderColor: colors.error + "30",
              },
            ]}
          >
            <View style={[globalStyles.row, { marginBottom: 12 }]}>
              <Ionicons name="warning-outline" size={20} color={colors.error} style={{ marginRight: 8 }} />
              <Text style={[globalStyles.bodySecondary, { fontWeight: "600", color: colors.error }]}>Danger Zone</Text>
            </View>

            <Text style={[globalStyles.caption, { color: colors.text.secondary, marginBottom: 16, lineHeight: 18 }]}>
              These actions are permanent and cannot be undone. Please proceed with caution.
            </Text>

            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Delete Account",
                  "This action cannot be undone. All your data will be permanently deleted.",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => Alert.alert("Feature Coming Soon", "Account deletion will be available soon."),
                    },
                  ],
                )
              }
              style={{
                backgroundColor: colors.error + "10",
                borderWidth: 1,
                borderColor: colors.error + "30",
                borderRadius: 8,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="trash-outline" size={16} color={colors.error} style={{ marginRight: 8 }} />
              <Text style={[globalStyles.bodySecondary, { color: colors.error, fontWeight: "600" }]}>
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default EditProfileScreen
