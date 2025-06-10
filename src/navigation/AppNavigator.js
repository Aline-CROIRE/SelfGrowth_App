import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import {Text} from "react-native"
// Import Screens
import WelcomeScreen from "../screens/auth/WelcomeScreen"
import LoginScreen from "../screens/auth/LoginScreen"
import RegisterScreen from "../screens/auth/RegisterScreen"
import HomeScreen from "../screens/main/HomeScreen"
import JournalScreen from "../screens/main/JournalScreen"
import GoalsScreen from "../screens/main/GoalScreen"
import ProfileScreen from "../screens/main/ProfileScreen"

// Import Context
import { useApp } from "../context/AppContext"
import { COLORS } from "../styles/colors"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

// 🏠 MAIN TAB NAVIGATOR - Beautiful bottom navigation
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.neutral.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.neutral.lightGray,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarActiveTintColor: COLORS.primary.coral,
        tabBarInactiveTintColor: COLORS.neutral.mediumGray,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>📝</Text>,
        }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>🎯</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  )
}

// 🔐 AUTH STACK NAVIGATOR - Authentication flow
const AuthStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          }
        },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  )
}

// 🌟 MAIN APP NAVIGATOR - Routes everything beautifully
const AppNavigator = () => {
  const { state } = useApp()

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {state.isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStackNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
