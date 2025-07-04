"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"
import { useData } from "../../context/DataContext"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import JournalCard from "../../components/journal/JournalCard"
import EmptyState from "../../components/common/EmptyState"
import CustomInput from "../../components/common/CustomInput"

const JournalScreen = ({ navigation }) => {
  const { journals, isLoading, loadAllData } = useData()
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredJournals, setFilteredJournals] = useState([])
  const [selectedMood, setSelectedMood] = useState(null)

  useEffect(() => {
    filterJournals()
  }, [journals, searchQuery, selectedMood])

  const filterJournals = () => {
    let filtered = [...journals]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (journal) =>
          journal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          journal.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (journal.tags && journal.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))),
      )
    }

    // Filter by mood
    if (selectedMood) {
      filtered = filtered.filter((journal) => journal.mood && journal.mood.toLowerCase() === selectedMood.toLowerCase())
    }

    setFilteredJournals(filtered)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadAllData()
    setRefreshing(false)
  }

  const handleJournalPress = (journal) => {
    navigation.navigate("JournalDetail", { journal })
  }

  const handleCreateJournal = () => {
    navigation.navigate("CreateJournal")
  }

  const toggleMoodFilter = (mood) => {
    if (selectedMood === mood) {
      setSelectedMood(null)
    } else {
      setSelectedMood(mood)
    }
  }

  const renderMoodFilter = () => {
    const moods = [
      { id: "AMAZING", name: "Amazing", icon: "happy", color: colors.moods.amazing },
      { id: "GOOD", name: "Good", icon: "happy-outline", color: colors.moods.good },
      { id: "OKAY", name: "Okay", icon: "remove-circle-outline", color: colors.moods.okay },
      { id: "BAD", name: "Bad", icon: "sad-outline", color: colors.moods.bad },
      { id: "TERRIBLE", name: "Terrible", icon: "sad", color: colors.moods.terrible },
    ]

    return (
      <View style={{ marginBottom: 16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              onPress={() => toggleMoodFilter(mood.id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: selectedMood === mood.id ? mood.color : colors.background.card,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 8,
                borderWidth: 1,
                borderColor: mood.color,
              }}
            >
              <Ionicons
                name={mood.icon}
                size={16}
                color={selectedMood === mood.id ? colors.text.white : mood.color}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  globalStyles.caption,
                  {
                    color: selectedMood === mood.id ? colors.text.white : mood.color,
                    fontFamily: "Poppins-Medium",
                  },
                ]}
              >
                {mood.name}
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
          <Text style={[globalStyles.title, { color: colors.text.white, marginBottom: 16 }]}>Journal</Text>

          <CustomInput
            placeholder="Search journals..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Ionicons name="search" size={20} color={colors.text.secondary} />}
            style={{ marginBottom: 16 }}
            inputStyle={{ backgroundColor: colors.background.card }}
          />
        </View>
      </LinearGradient>

      {/* Mood Filter */}
      {renderMoodFilter()}

      {/* Journal List */}
      {filteredJournals.length > 0 ? (
        <FlatList
          data={filteredJournals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <JournalCard journal={item} onPress={handleJournalPress} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary.coral]} />
          }
        />
      ) : (
        <EmptyState
          icon="book-outline"
          title="No Journals Found"
          subtitle={
            searchQuery || selectedMood
              ? "Try adjusting your search or filters"
              : "Start documenting your thoughts and experiences"
          }
          buttonTitle={!searchQuery && !selectedMood ? "Create Journal" : null}
          onButtonPress={!searchQuery && !selectedMood ? handleCreateJournal : null}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        onPress={handleCreateJournal}
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

export default JournalScreen
