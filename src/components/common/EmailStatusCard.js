"use client"

import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"
import { useEmail } from "../../context/EmailContext"
import CustomButton from "./customButton"

const EmailStatusCard = ({ type, email, onResend, style }) => {
  const { emailStatus, isLoading } = useEmail()
  const status = emailStatus[type]

  if (!status.sent) return null

  const getStatusInfo = () => {
    switch (type) {
      case "verification":
        return {
          title: status.verified ? "✅ Email Verified" : "📧 Verification Email Sent",
          subtitle: status.verified
            ? `Verified on ${new Date(status.verifiedAt).toLocaleDateString()}`
            : `Sent to ${email} • ${new Date(status.sentAt).toLocaleTimeString()}`,
          color: status.verified ? colors.success.main : colors.info.main,
          bgColor: status.verified ? colors.success.bg : colors.info.bg,
          icon: status.verified ? "checkmark-circle" : "mail",
          action: status.verified ? null : "Check Email",
        }
      case "passwordReset":
        return {
          title: status.used ? "🔐 Password Reset Complete" : "🔐 Reset Email Sent",
          subtitle: status.used
            ? `Password updated on ${new Date(status.usedAt).toLocaleDateString()}`
            : `Sent to ${email} • ${new Date(status.sentAt).toLocaleTimeString()}`,
          color: status.used ? colors.success.main : colors.warning.main,
          bgColor: status.used ? colors.success.bg : colors.warning.bg,
          icon: status.used ? "checkmark-circle" : "key",
          action: status.used ? null : "Check Email",
        }
      default:
        return {}
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <View style={[globalStyles.card, { backgroundColor: statusInfo.bgColor }, style]}>
      <View style={[globalStyles.row, globalStyles.mb12]}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: statusInfo.color + "20",
            ...globalStyles.center,
            marginRight: 12,
          }}
        >
          <Ionicons name={statusInfo.icon} size={20} color={statusInfo.color} />
        </View>

        <View style={globalStyles.flex1}>
          <Text style={[globalStyles.titleMedium, { color: statusInfo.color, marginBottom: 2 }]}>
            {statusInfo.title}
          </Text>
          <Text style={[globalStyles.bodySmall, { color: colors.text.secondary }]}>{statusInfo.subtitle}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={globalStyles.rowSpaceBetween}>
        {statusInfo.action && (
          <TouchableOpacity
            onPress={() => {
              // Open email app or show instructions
              console.log("Opening email app...")
            }}
            style={[
              globalStyles.row,
              {
                backgroundColor: statusInfo.color + "15",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                flex: 1,
                marginRight: 8,
              },
            ]}
          >
            <Ionicons name="mail-open-outline" size={16} color={statusInfo.color} style={{ marginRight: 6 }} />
            <Text style={[globalStyles.labelMedium, { color: statusInfo.color }]}>{statusInfo.action}</Text>
          </TouchableOpacity>
        )}

        {/* Resend Button */}
        {!status.verified && !status.used && (
          <CustomButton
            title={status.canResend ? "Resend" : `Resend in ${status.resendCooldown}s`}
            onPress={onResend}
            disabled={!status.canResend || isLoading}
            loading={isLoading}
            variant="outline"
            size="small"
            style={{ minWidth: 80 }}
          />
        )}
      </View>

      {/* Instructions */}
      {!status.verified && !status.used && (
        <View style={[globalStyles.mt12, { padding: 12, backgroundColor: colors.background.level1, borderRadius: 8 }]}>
          <Text style={[globalStyles.bodySmall, { color: colors.text.secondary, textAlign: "center" }]}>
            {type === "verification"
              ? "Click the verification link in your email to activate your account"
              : "Click the reset link in your email to create a new password"}
          </Text>
        </View>
      )}
    </View>
  )
}

export default EmailStatusCard
