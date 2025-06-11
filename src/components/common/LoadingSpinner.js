import { View, ActivityIndicator, StyleSheet } from "react-native"
import { COLORS } from "../../styles/colors"
import { SPACING } from "../../styles/globalStyles"

const LoadingSpinner = ({ size = "small", color = COLORS.primary.coral, style = {} }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.md,
  },
})

export default LoadingSpinner
