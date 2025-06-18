import { View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import * as Animatable from "react-native-animatable"
import { Ionicons } from "@expo/vector-icons"
import { globalStyles } from "../styles/globalStyles"
import { colors } from "../styles/colors"

const LoadingScreen = () => {
  return (
    <LinearGradient colors={colors.gradients.primary} style={[globalStyles.container, globalStyles.center]}>
      <Animatable.View animation="pulse" iterationCount="infinite" style={[globalStyles.center]}>
        {/* App Logo/Icon */}
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <Ionicons name="leaf" size={60} color={colors.text.white} />
        </View>

        {/* App Name */}
        <Animatable.Text
          animation="fadeInUp"
          delay={500}
          style={[
            globalStyles.title,
            {
              color: colors.text.white,
              fontSize: 32,
              marginBottom: 8,
              textAlign: "center",
            },
          ]}
        >
          SelfGrow
        </Animatable.Text>

        {/* Tagline */}
        <Animatable.Text
          animation="fadeInUp"
          delay={700}
          style={[
            globalStyles.body,
            {
              color: colors.text.white,
              opacity: 0.9,
              textAlign: "center",
              marginBottom: 40,
            },
          ]}
        >
          Your Personal Growth Companion
        </Animatable.Text>

        {/* Loading Indicator */}
        <Animatable.View
          animation="rotate"
          iterationCount="infinite"
          duration={2000}
          style={{
            width: 40,
            height: 40,
            borderWidth: 3,
            borderColor: "rgba(255, 255, 255, 0.3)",
            borderTopColor: colors.text.white,
            borderRadius: 20,
          }}
        />
      </Animatable.View>
    </LinearGradient>
  )
}

export default LoadingScreen
