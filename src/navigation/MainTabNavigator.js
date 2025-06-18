import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "../styles/colors"

// Main Screens
import HomeScreen from "../screens/main/HomeScreen"
import JournalScreen from "../screens/main/JournalScreen"
import CreateJournalScreen from "../screens/main/CreateJournalScreen"
import JournalDetailScreen from "../screens/main/JournalDetailScreen"
import GoalsScreen from "../screens/main/GoalsScreen"
import CreateGoalScreen from "../screens/main/CreateGoalScreen"
import GoalDetailScreen from "../screens/main/GoalDetailScreen"
import BlogScreen from "../screens/main/BlogScreen"
import BlogDetailScreen from "../screens/main/BlogDetailScreen"
import CreateBlogScreen from "../screens/main/CreateBlogScreen"
import ProfileScreen from "../screens/main/ProfileScreen"
import StatisticsScreen from "../screens/main/StatisticsScreen"
import AchievementsScreen from "../screens/main/AchievementsScreen"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

// Journal Stack
const JournalStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="JournalList" component={JournalScreen} />
    <Stack.Screen name="CreateJournal" component={CreateJournalScreen} />
    <Stack.Screen name="JournalDetail" component={JournalDetailScreen} />
  </Stack.Navigator>
)

// Goals Stack
const GoalsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="GoalsList" component={GoalsScreen} />
    <Stack.Screen name="CreateGoal" component={CreateGoalScreen} />
    <Stack.Screen name="GoalDetail" component={GoalDetailScreen} />
  </Stack.Navigator>
)

// Blog Stack
const BlogStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BlogList" component={BlogScreen} />
    <Stack.Screen name="BlogDetail" component={BlogDetailScreen} />
    <Stack.Screen name="CreateBlog" component={CreateBlogScreen} />
  </Stack.Navigator>
)

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen name="Statistics" component={StatisticsScreen} />
    <Stack.Screen name="Achievements" component={AchievementsScreen} />
  </Stack.Navigator>
)

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Journal") {
            iconName = focused ? "book" : "book-outline"
          } else if (route.name === "Goals") {
            iconName = focused ? "flag" : "flag-outline"
          } else if (route.name === "Blog") {
            iconName = focused ? "library" : "library-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: colors.primary.coral,
        tabBarInactiveTintColor: colors.text.light,
        tabBarStyle: {
          backgroundColor: colors.background.card,
          borderTopWidth: 1,
          borderTopColor: colors.background.overlay,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontFamily: "Poppins-Medium",
          fontSize: 12,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Journal" component={JournalStack} />
      <Tab.Screen name="Goals" component={GoalsStack} />
      <Tab.Screen name="Blog" component={BlogStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  )
}

export default MainTabNavigator
