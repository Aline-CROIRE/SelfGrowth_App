// src/navigation/AppNavigator.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../context/AuthContext";

// Screen Imports
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import LoadingScreen from "../screens/LoadingScreen";
import MainTabNavigator from "./MainTabNavigator"; // Your main app navigator with tabs

const Stack = createStackNavigator();

/**
 * Navigator for authentication-related screens.
 * Users see this when they are not logged in.
 */
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

/**
 * The main root navigator for the entire application.
 * It decides whether to show the authentication flow or the main app.
 */
const AppNavigator = () => {
  // Use a clear name like 'user' or 'isAuthenticated' from your context.
  // I'll assume 'isAuthenticated' as you used it.
  const { isAuthenticated, isLoading } = useAuth();

  // Show a loading screen while the auth state is being determined.
  // This prevents a screen flicker on app startup.
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        // User is authenticated: Show the main app (likely your tab navigator)
        <Stack.Screen name="MainApp" component={MainTabNavigator} />
      ) : (
        // User is not authenticated: Show the authentication flow
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;