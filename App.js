import { StatusBar } from "expo-status-bar"
import { NavigationContainer } from "@react-navigation/native"
import { AuthProvider } from "./src/context/AuthContext"
import { EmailProvider } from "./src/context/EmailContext"
import { ThemeProvider } from "./src/context/ThemeContext"
import { DataProvider } from "./src/context/DataContext"
import { AppProvider } from "./src/context/AppContext"
import { UserRoleProvider } from "./src/context/UserRoleContext" 
import AppNavigator from "./src/navigation/AppNavigator"

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <UserRoleProvider> 
          <ThemeProvider>
            <EmailProvider>
              <DataProvider>
                <NavigationContainer>
                  <AppNavigator />
                  <StatusBar style="auto" />
                </NavigationContainer>
              </DataProvider>
            </EmailProvider>
          </ThemeProvider>
        </UserRoleProvider>
      </AuthProvider>
    </AppProvider>
  )
}
