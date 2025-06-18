import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"
import CustomButton from "./customButton"

const EmptyState = ({
  icon = "document-outline",
  title = "No Data Found",
  subtitle = "There's nothing here yet",
  buttonTitle = null,
  onButtonPress = null,
  style = {},
}) => {
  return (
    <View style={[globalStyles.container, globalStyles.center, { paddingHorizontal: 40 }, style]}>
      <Animatable.View animation="fadeInUp" duration={800} style={[globalStyles.center]}>
        {/* Icon */}
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colors.background.overlay,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Ionicons name={icon} size={48} color={colors.text.light} />
        </View>

        {/* Title */}
        <Text
          style={[
            globalStyles.heading,
            {
              textAlign: "center",
              marginBottom: 8,
              color: colors.text.primary,
            },
          ]}
        >
          {title}
        </Text>

        {/* Subtitle */}
        <Text
          style={[
            globalStyles.bodySecondary,
            {
              textAlign: "center",
              marginBottom: buttonTitle ? 32 : 0,
              lineHeight: 22,
            },
          ]}
        >
          {subtitle}
        </Text>

        {/* Action Button */}
        {buttonTitle && onButtonPress && (
          <CustomButton title={buttonTitle} onPress={onButtonPress} style={{ minWidth: 200 }} />
        )}
      </Animatable.View>
    </View>
  )
}

export default EmptyState
