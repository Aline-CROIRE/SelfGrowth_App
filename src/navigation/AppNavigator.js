"use client"
import { createStackNavigator } from "@react-navigation/stack"
import { useAuth } from "../context/AuthContext"
import { useUserRole } from "../context/UserRoleContext"

// Auth Screens
import WelcomeScreen from "../screens/auth/WelcomeScreen"
import LoginScreen from "../screens/auth/LoginScreen"
import RegisterScreen from "../screens/auth/RegisterScreen"
import SuspendedScreen from "../screens/auth/SuspendedScreen"

// Main App Navigator
import MainTabNavigator from "./MainTabNavigator"

// Admin Screens
import UserManagementScreen from "../screens/admin/UserManagementScreen"
import CreateUserScreen from "../screens/admin/CreateUserScreen"
import EditUserScreen from "../screens/admin/EditUserScreen"
import AppAnalyticsScreen from "../screens/admin/AppAnalyticsScreen"
import SystemSettingsScreen from "../screens/admin/SystemSettingScreen"
import ContentModerationScreen from "../screens/admin/ContentModeratorScreen"

// Loading Screen
import LoadingScreen from "../screens/LoadingScreen"

const Stack = createStackNavigator()

const AppNavigator = () => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const { isAdmin, isSuperAdmin } = useUserRole()

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        // User is authenticated - show main app with admin screens if applicable
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />

          {/* Admin Screens - Available to ADMIN and SUPER_ADMIN */}
          {(isAdmin || isSuperAdmin) && (
            <>
              <Stack.Screen name="AppAnalytics" component={AppAnalyticsScreen} />
              <Stack.Screen name="ContentModeration" component={ContentModerationScreen} />
            </>
          )}

          {/* Super Admin Only Screens */}
          {isSuperAdmin && (
            <>
              <Stack.Screen name="UserManagement" component={UserManagementScreen} />
              <Stack.Screen name="CreateUser" component={CreateUserScreen} />
              <Stack.Screen name="EditUser" component={EditUserScreen} />
              <Stack.Screen name="SystemSettings" component={SystemSettingsScreen} />
            </>
          )}
        </>
      ) : (
        // User is not authenticated - show auth screens
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Suspended" component={SuspendedScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}

export default AppNavigator