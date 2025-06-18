import { View, ActivityIndicator } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import * as Animatable from "react-native-animatable"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"

const LoadingSpinner = ({
  message = "Loading...",
  size = "large",
  showMessage = true,
  overlay = false,
  style = {},
}) => {
  const containerStyle = overlay
    ? {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        zIndex: 1000,
      }
    : {}

  return (
    <View style={[globalStyles.container, globalStyles.center, containerStyle, style]}>
      <Animatable.View animation="pulse" iterationCount="infinite" style={[globalStyles.center]}>
        {/* Gradient Background Circle */}
        <LinearGradient
          colors={colors.gradients.primary}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: showMessage ? 20 : 0,
          }}
        >
          <ActivityIndicator size={size} color={colors.text.white} />
        </LinearGradient>

        {showMessage && (
          <Animatable.Text
            animation="fadeIn"
            delay={500}
            style={[
              globalStyles.body,
              {
                color: colors.text.secondary,
                textAlign: "center",
                fontFamily: "Poppins-Medium",
              },
            ]}
          >
            {message}
          </Animatable.Text>
        )}
      </Animatable.View>
    </View>
  )
}

export default LoadingSpinner
