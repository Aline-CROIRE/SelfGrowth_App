import { StatusBar } from "expo-status-bar"

// Import our beautiful app structure
import { AppProvider } from "./src/context/AppContext"
import AppNavigator from "./src/navigation/AppNavigator"

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AppProvider>
  )
}
