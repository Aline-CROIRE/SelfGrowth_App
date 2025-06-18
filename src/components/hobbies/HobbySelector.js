import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import * as Animatable from "react-native-animatable"
import * as Haptics from "expo-haptics"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"

const hobbies = [
  { id: "drawing", name: "Drawing", icon: "brush-outline", color: "#FF6B6B" },
  { id: "reading", name: "Reading", icon: "library-outline", color: "#4ECDC4" },
  { id: "music", name: "Music", icon: "musical-notes-outline", color: "#45B7D1" },
  { id: "sports", name: "Sports", icon: "fitness-outline", color: "#96CEB4" },
  { id: "cooking", name: "Cooking", icon: "restaurant-outline", color: "#FFEAA7" },
  { id: "photography", name: "Photography", icon: "camera-outline", color: "#DDA0DD" },
  { id: "writing", name: "Writing", icon: "create-outline", color: "#98D8C8" },
  { id: "gardening", name: "Gardening", icon: "leaf-outline", color: "#F7DC6F" },
]

const HobbySelector = ({ selectedHobbies = [], onHobbySelect, multiSelect = false, style = {} }) => {
  const handleHobbyPress = (hobby) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch (error) {
      console.log("Haptics not available")
    }

    if (multiSelect) {
      const isSelected = Array.isArray(selectedHobbies) && selectedHobbies.includes(hobby.id)
      if (isSelected) {
        const newSelection = selectedHobbies.filter((id) => id !== hobby.id)
        onHobbySelect(newSelection)
      } else {
        const newSelection = [...(selectedHobbies || []), hobby.id]
        onHobbySelect(newSelection)
      }
    } else {
      onHobbySelect(hobby.id)
    }
  }

  const isSelected = (hobbyId) => {
    if (multiSelect) {
      return Array.isArray(selectedHobbies) && selectedHobbies.includes(hobbyId)
    }
    return selectedHobbies === hobbyId
  }

  return (
    <View style={[{ marginVertical: 16 }, style]}>
      <Text style={[globalStyles.heading, { marginBottom: 16, textAlign: "center", fontSize: 18 }]}>
        Choose Your Interests
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
      >
        {hobbies.map((hobby, index) => (
          <Animatable.View key={hobby.id} animation="fadeInUp" delay={index * 100} duration={600}>
            <TouchableOpacity onPress={() => handleHobbyPress(hobby)} style={{ marginRight: 16 }} activeOpacity={0.8}>
              {isSelected(hobby.id) ? (
                <LinearGradient
                  colors={[hobby.color, colors.primary?.orange || "#FF8A65"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 100,
                    height: 120,
                    borderRadius: 16,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: hobby.color,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <Ionicons name={hobby.icon} size={32} color="white" />
                  <Text
                    style={{
                      color: "white",
                      marginTop: 8,
                      fontWeight: "600",
                      textAlign: "center",
                      fontSize: 12,
                    }}
                  >
                    {hobby.name}
                  </Text>
                  {/* Selection indicator */}
                  <View
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: "white",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="checkmark" size={14} color={hobby.color} />
                  </View>
                </LinearGradient>
              ) : (
                <View
                  style={{
                    width: 100,
                    height: 120,
                    borderRadius: 16,
                    backgroundColor: colors.background?.card || "#FFFFFF",
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 2,
                    borderColor: colors.text?.light || "#E0E0E0",
                    shadowColor: colors.shadow?.light || "#000000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Ionicons name={hobby.icon} size={32} color={hobby.color} />
                  <Text
                    style={{
                      marginTop: 8,
                      textAlign: "center",
                      fontSize: 12,
                      color: colors.text?.primary || "#333333",
                    }}
                  >
                    {hobby.name}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </ScrollView>

      {/* Selection count for multi-select */}
      {multiSelect && (
        <Text
          style={{
            textAlign: "center",
            marginTop: 12,
            fontSize: 14,
            color: colors.text?.secondary || "#666666",
          }}
        >
          {selectedHobbies?.length || 0} selected
        </Text>
      )}
    </View>
  )
}

export default HobbySelector
