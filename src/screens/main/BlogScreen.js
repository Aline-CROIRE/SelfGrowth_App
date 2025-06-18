"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"
import { useData } from "../../context/DataContext"
import { useAuth } from "../../context/AuthContext"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import BlogCard from "../../components/blog/BlogCard"
import EmptyState from "../../components/common/EmptyState"
import CustomInput from "../../components/common/CustomInput"

const BlogScreen = ({ navigation }) => {
  const { posts, isLoading, loadPosts } = useData()
  const { user } = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPosts, setFilteredPosts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    loadPosts()
  }, [])

  useEffect(() => {
    filterPosts()
  }, [posts, searchQuery, selectedCategory])

  const filterPosts = () => {
    let filtered = [...posts]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (post.tags &&
            post.tags.some((tag) =>
              (typeof tag === "string" ? tag : tag.tag?.name || "").toLowerCase().includes(searchQuery.toLowerCase()),
            )),
      )
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (post) =>
          post.tags &&
          post.tags.some(
            (tag) =>
              (typeof tag === "string" ? tag : tag.tag?.name || "").toLowerCase() === selectedCategory.toLowerCase(),
          ),
      )
    }

    setFilteredPosts(filtered)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadPosts()
    setRefreshing(false)
  }

  const handlePostPress = (post) => {
    navigation.navigate("BlogDetail", { post })
  }

  const handleCreatePost = () => {
    navigation.navigate("CreateBlog")
  }

  const toggleCategoryFilter = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null)
    } else {
      setSelectedCategory(category)
    }
  }

  const renderCategoryFilter = () => {
    const categories = [
      { id: "personal-growth", name: "Personal Growth", icon: "trending-up", color: colors.primary.coral },
      { id: "wellness", name: "Wellness", icon: "heart", color: colors.success },
      { id: "productivity", name: "Productivity", icon: "checkmark-circle", color: colors.warning },
      { id: "mindfulness", name: "Mindfulness", icon: "leaf", color: colors.hobbies.gardening },
      { id: "motivation", name: "Motivation", icon: "flash", color: colors.primary.orange },
      { id: "lifestyle", name: "Lifestyle", icon: "home", color: colors.hobbies.cooking },
    ]

    return (
      <View style={{ marginBottom: 16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => toggleCategoryFilter(category.id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: selectedCategory === category.id ? category.color : colors.background.card,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 8,
                borderWidth: 1,
                borderColor: category.color,
                shadowColor: colors.shadow.light,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Ionicons
                name={category.icon}
                size={16}
                color={selectedCategory === category.id ? colors.text.white : category.color}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  globalStyles.caption,
                  {
                    color: selectedCategory === category.id ? colors.text.white : category.color,
                    fontFamily: "Poppins-Medium",
                  },
                ]}
              >
                {category.name}
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
          <View style={[globalStyles.spaceBetween, { marginBottom: 16 }]}>
            <Text style={[globalStyles.title, { color: colors.text.white }]}>Community Blog</Text>

            {user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
              <TouchableOpacity
                onPress={handleCreatePost}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons name="add" size={16} color={colors.text.white} style={{ marginRight: 4 }} />
                <Text style={[globalStyles.caption, { color: colors.text.white, fontFamily: "Poppins-Medium" }]}>
                  Write
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <CustomInput
            placeholder="Search articles..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Ionicons name="search" size={20} color={colors.text.secondary} />}
            style={{ marginBottom: 0 }}
            inputStyle={{ backgroundColor: colors.background.card }}
          />
        </View>
      </LinearGradient>

      {/* Category Filter */}
      {renderCategoryFilter()}

      {/* Featured Post */}
      {filteredPosts.length > 0 && !searchQuery && !selectedCategory && (
        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <View style={[globalStyles.spaceBetween, { marginBottom: 12 }]}>
            <Text style={globalStyles.heading}>Featured Article</Text>
            <Ionicons name="star" size={20} color={colors.warning} />
          </View>
          <BlogCard
            post={filteredPosts[0]}
            onPress={handlePostPress}
            style={{
              marginHorizontal: 0,
              borderWidth: 2,
              borderColor: colors.warning + "30",
            }}
          />
        </View>
      )}

      {/* Posts List */}
      {filteredPosts.length > 0 ? (
        <FlatList
          data={searchQuery || selectedCategory ? filteredPosts : filteredPosts.slice(1)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BlogCard post={item} onPress={handlePostPress} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary.coral]} />
          }
          ListHeaderComponent={() =>
            !searchQuery && !selectedCategory && filteredPosts.length > 1 ? (
              <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
                <Text style={globalStyles.heading}>Latest Articles</Text>
              </View>
            ) : null
          }
        />
      ) : (
        <EmptyState
          icon="newspaper-outline"
          title="No Articles Found"
          subtitle={
            searchQuery || selectedCategory
              ? "Try adjusting your search or filters"
              : "Be the first to share your growth journey"
          }
          buttonTitle={
            !searchQuery && !selectedCategory && user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN")
              ? "Write Article"
              : null
          }
          onButtonPress={!searchQuery && !selectedCategory ? handleCreatePost : null}
        />
      )}

      {/* FAB for admins */}
      {user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
        <TouchableOpacity
          onPress={handleCreatePost}
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
          <Ionicons name="create" size={28} color={colors.text.white} />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default BlogScreen
