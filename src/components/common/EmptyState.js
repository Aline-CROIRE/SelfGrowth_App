import { Text, StyleSheet } from "react-native"
import * as Animatable from "react-native-animatable"
import CustomButton from "./customButton"
import { COLORS } from "../../styles/colors"
import { TYPOGRAPHY, SPACING } from "../../styles/globalStyles"

const EmptyState = ({ icon, title, message, actionLabel, onAction }) => {
  return (
    <Animatable.View animation="fadeIn" duration={800} style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <CustomButton
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          size="medium"
          style={styles.actionButton}
        />
      )}
    </Animatable.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  icon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h2,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  message: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.darkGray,
    textAlign: "center",
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  actionButton: {
    minWidth: 200,
  },
})

export default EmptyState
