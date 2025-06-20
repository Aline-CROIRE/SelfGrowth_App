"use client"

import { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import { userService } from "../../services/userService"
import { globalStyles } from "../../styles/globalStyles"

const SuspendedScreen = ({ route }) => {
  const { colors } = useTheme()
  const { logout } = useAuth()
  const { suspensionReason, userEmail } = route.params || {}
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [messageSent, setMessageSent] = useState(false)

  const handleContactAdmin = async () => {
    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message to send to the admin")
      return
    }

    try {
      setLoading(true)
      await userService.contactAdmin(message, userEmail)
      setMessageSent(true)
      Alert.alert("Success", "Your message has been sent to the admin. They will review your case shortly.")
      setMessage("")
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to send message to admin")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <KeyboardAvoidingView
      style={[globalStyles.container, { backgroundColor: colors.background.primary }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }}>
        {/* Suspension Icon */}
        <View style={[globalStyles.center, { marginBottom: 30 }]}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: colors.error + "20",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Ionicons name="ban" size={50} color={colors.error} />
          </View>
          <Text style={[globalStyles.title, { color: colors.error, textAlign: "center", marginBottom: 10 }]}>
            Account Suspended
          </Text>
          <Text style={[globalStyles.body, { color: colors.text.secondary, textAlign: "center", lineHeight: 24 }]}>
            Your account has been temporarily suspended. You cannot access the app until this issue is resolved.
          </Text>
        </View>

        {/* Suspension Reason */}
        {suspensionReason && (
          <View style={[globalStyles.card, { backgroundColor: colors.background.card, marginBottom: 20 }]}>
            <Text style={[globalStyles.heading, { color: colors.text.primary, marginBottom: 12 }]}>
              Reason for Suspension
            </Text>
            <Text style={[globalStyles.body, { color: colors.text.secondary, lineHeight: 22 }]}>
              {suspensionReason}
            </Text>
          </View>
        )}

        {/* Contact Admin */}
        <View style={[globalStyles.card, { backgroundColor: colors.background.card, marginBottom: 20 }]}>
          <Text style={[globalStyles.heading, { color: colors.text.primary, marginBottom: 12 }]}>
            Contact Administrator
          </Text>
          <Text style={[globalStyles.body, { color: colors.text.secondary, marginBottom: 16, lineHeight: 22 }]}>
            If you believe this suspension is a mistake or would like to appeal, please send a message to the
            administrator explaining your situation.
          </Text>

          <TextInput
            placeholder="Enter your message to the admin..."
            placeholderTextColor={colors.text.secondary}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            style={[
              globalStyles.textArea,
              {
                backgroundColor: colors.background.primary,
                color: colors.text.primary,
                borderColor: colors.border.light,
                marginBottom: 16,
              },
            ]}
            editable={!messageSent}
          />

          <TouchableOpacity
            onPress={handleContactAdmin}
            disabled={loading || messageSent}
            style={[
              globalStyles.button,
              {
                backgroundColor: loading || messageSent ? colors.text.secondary : colors.primary.main,
                marginBottom: 12,
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={[globalStyles.buttonText, { color: "#FFFFFF" }]}>
                {messageSent ? "Message Sent" : "Send Message"}
              </Text>
            )}
          </TouchableOpacity>

          {messageSent && (
            <View
              style={{
                backgroundColor: colors.success + "20",
                padding: 12,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons name="checkmark-circle" size={20} color={colors.success} style={{ marginRight: 8 }} />
              <Text style={[globalStyles.caption, { color: colors.success, flex: 1 }]}>
                Your message has been sent successfully. The admin will review your case and respond accordingly.
              </Text>
            </View>
          )}
        </View>

        {/* Support Information */}
        <View style={[globalStyles.card, { backgroundColor: colors.background.card, marginBottom: 20 }]}>
          <Text style={[globalStyles.heading, { color: colors.text.primary, marginBottom: 12 }]}>
            Additional Support
          </Text>
          <Text style={[globalStyles.body, { color: colors.text.secondary, marginBottom: 12, lineHeight: 22 }]}>
            For urgent matters or if you need immediate assistance, you can also contact our support team directly:
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <Ionicons name="mail" size={16} color={colors.text.secondary} style={{ marginRight: 8 }} />
            <Text style={[globalStyles.caption, { color: colors.text.secondary }]}>support@selfgrow.com</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="time" size={16} color={colors.text.secondary} style={{ marginRight: 8 }} />
            <Text style={[globalStyles.caption, { color: colors.text.secondary }]}>Response time: 24-48 hours</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[
            globalStyles.button,
            {
              backgroundColor: colors.text.secondary,
              marginTop: 20,
            },
          ]}
        >
          <Text style={[globalStyles.buttonText, { color: "#FFFFFF" }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default SuspendedScreen
