"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"
import { useData } from "../../context/DataContext"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import GoalCard from "../../components/goals/GoalCard"
import EmptyState from "../../components/common/EmptyState"
import CustomInput from "../../components/common/CustomInput"

const GoalsScreen = ({ navigation }) => {
  const { goals, isLoading, loadAllData } = useData()
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredGoals, setFilteredGoals] = useState([])
  const [selectedStatus, setSelectedStatus] = useState(null)

  useEffect(() => {
    filterGoals()
  }, [goals, searchQuery, selectedStatus])

  const filterGoals = () => {
    let filtered = [...goals]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (goal) =>
          goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (goal.description && goal.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          goal.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter((goal) => goal.status === selectedStatus)
    }

    setFilteredGoals(filtered)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadAllData()
    setRefreshing(false)
  }

  const handleGoalPress = (goal) => {
    navigation.navigate("GoalDetail", { goal })
  }

  const handleCreateGoal = () => {
    navigation.navigate("CreateGoal")
  }

  const toggleStatusFilter = (status) => {
    if (selectedStatus === status) {
      setSelectedStatus(null)
    } else {
      setSelectedStatus(status)
    }
  }

  const renderStatusFilter = () => {
    const statuses = [
      { id: "ACTIVE", name: "Active", icon: "play-circle", color: colors.primary.coral },
      { id: "COMPLETED", name: "Completed", icon: "checkmark-circle", color: colors.success },
      { id: "PAUSED", name: "Paused", icon: "pause-circle", color: colors.warning },
      { id: "CANCELLED", name: "Cancelled", icon: "close-circle", color: colors.text.light },
    ]

    return (
      <View style={{ marginBottom: 16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {statuses.map((status) => (
            <TouchableOpacity
              key={status.id}
              onPress={() => toggleStatusFilter(status.id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: selectedStatus === status.id ? status.color : colors.background.card,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 8,
                borderWidth: 1,
                borderColor: status.color,
              }}
            >
              <Ionicons
                name={status.icon}
                size={16}
                color={selectedStatus === status.id ? colors.text.white : status.color}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  globalStyles.caption,
                  {
                    color: selectedStatus === status.id ? colors.text.white : status.color,
                    fontFamily: "Poppins-Medium",
                  },
                ]}
              >
                {status.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )
  }

  if (isLoading && !refreshing) {
    return <LoadingSpinner />
  }

  return (
    <View style={globalStyles.container}>
      {/* Header */}
      <LinearGradient colors={colors.gradients.primary} style={{ paddingTop: 60, paddingBottom: 20 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={[globalStyles.title, { color: colors.text.white, marginBottom: 16 }]}>Goals</Text>

          <CustomInput
            placeholder="Search goals..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Ionicons name="search" size={20} color={colors.text.secondary} />}
            style={{ marginBottom: 16 }}
            inputStyle={{ backgroundColor: colors.background.card }}
          />
        </View>
      </LinearGradient>

      {/* Status Filter */}
      {renderStatusFilter()}

      {/* Goals List */}
      {filteredGoals.length > 0 ? (
        <FlatList
          data={filteredGoals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <GoalCard goal={item} onPress={handleGoalPress} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary.coral]} />
          }
        />
      ) : (
        <EmptyState
          icon="flag-outline"
          title="No Goals Found"
          subtitle={
            searchQuery || selectedStatus
              ? "Try adjusting your search or filters"
              : "Start setting goals to track your progress"
          }
          buttonTitle={!searchQuery && !selectedStatus ? "Create Goal" : null}
          onButtonPress={!searchQuery && !selectedStatus ? handleCreateGoal : null}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        onPress={handleCreateGoal}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: colors.primary.coral,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: colors.shadow.dark,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={30} color={colors.text.white} />
      </TouchableOpacity>
    </View>
  )
}

export default GoalsScreen
