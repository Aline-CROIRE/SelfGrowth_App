"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, Alert, Image, Share } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { WebView } from "react-native-webview"
import * as Haptics from "expo-haptics"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"
import { useData } from "../../context/DataContext"
import { useAuth } from "../../context/AuthContext"
import { formatDate, timeAgo } from "../../utils/dateUtils"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import CustomInput from "../../components/common/CustomInput"
import CustomButton from "../../components/common/customButton"

const BlogDetailScreen = ({ route, navigation }) => {
  const { post } = route.params
  const { user } = useAuth()
  const { likePost, addComment, loadPostComments } = useData()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadComments()
    checkIfLiked()
  }, [])

  const loadComments = async () => {
    try {
      const result = await loadPostComments(post.id)
      if (result.success) {
        setComments(result.data || [])
      }
    } catch (error) {
      console.error("Error loading comments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkIfLiked = () => {
    // Check if current user has liked this post
    if (post.likes && user) {
      setIsLiked(post.likes.some((like) => like.userId === user.id))
    }
  }

  const handleLike = async () => {
    if (!user) {
      Alert.alert("Login Required", "Please login to like posts")
      return
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

      const result = await likePost(post.id)
      if (result.success) {
        setIsLiked(!isLiked)
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update like")
    }
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this article: ${post.title}`,
        title: post.title,
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const handleAddComment = async () => {
    if (!user) {
      Alert.alert("Login Required", "Please login to comment")
      return
    }

    if (!newComment.trim()) {
      return
    }

    setIsSubmittingComment(true)

    try {
      const result = await addComment(post.id, { content: newComment.trim() })
      if (result.success) {
        setComments((prev) => [result.data, ...prev])
        setNewComment("")
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      } else {
        Alert.alert("Error", result.message || "Failed to add comment")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add comment")
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const renderHTML = (htmlContent) => {
    const htmlWithStyles = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 16px;
              line-height: 1.6;
              color: #2C3E50;
              margin: 0;
              padding: 16px;
              background-color: transparent;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #2C3E50;
              margin-top: 24px;
              margin-bottom: 12px;
            }
            p {
              margin-bottom: 16px;
            }
            img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              margin: 16px 0;
            }
            blockquote {
              border-left: 4px solid #FF6B6B;
              padding-left: 16px;
              margin: 16px 0;
              font-style: italic;
              background-color: rgba(255, 107, 107, 0.1);
              padding: 16px;
              border-radius: 8px;
            }
            ul, ol {
              padding-left: 20px;
              margin-bottom: 16px;
            }
            li {
              margin-bottom: 8px;
            }
            a {
              color: #FF6B6B;
              text-decoration: none;
            }
            code {
              background-color: #f8f9fa;
              padding: 2px 6px;
              border-radius: 4px;
              font-family: 'Courier New', monospace;
            }
            pre {
              background-color: #f8f9fa;
              padding: 16px;
              border-radius: 8px;
              overflow-x: auto;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `

    return (
      <WebView
        source={{ html: htmlWithStyles }}
        style={{ flex: 1, backgroundColor: "transparent" }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        onMessage={() => {}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={false}
        mixedContentMode="compatibility"
      />
    )
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <View style={globalStyles.safeContainer}>
      <ScrollView style={globalStyles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Header */}
        <View style={[globalStyles.spaceBetween, { padding: 20, paddingBottom: 0 }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.background.overlay,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
          </TouchableOpacity>

          <View style={globalStyles.row}>
            <TouchableOpacity
              onPress={handleShare}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.background.overlay,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name="share-outline" size={20} color={colors.text.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLike}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: isLiked ? colors.error : colors.background.overlay,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={20}
                color={isLiked ? colors.text.white : colors.error}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Article Content */}
        <View style={{ padding: 20 }}>
          {/* Featured Image */}
          {post.featuredImage && (
            <Image
              source={{ uri: post.featuredImage }}
              style={{
                width: "100%",
                height: 200,
                borderRadius: 12,
                marginBottom: 20,
              }}
              resizeMode="cover"
            />
          )}

          {/* Title */}
          <Text style={[globalStyles.title, { fontSize: 24, marginBottom: 16 }]}>{post.title}</Text>

          {/* Author and Meta */}
          <View style={[globalStyles.row, { marginBottom: 20 }]}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.primary.coral,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
              }}
            >
              <Text style={[globalStyles.body, { color: colors.text.white, fontFamily: "Poppins-SemiBold" }]}>
                {post.author?.firstName?.charAt(0) || post.author?.username?.charAt(0) || "A"}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[globalStyles.body, { fontFamily: "Poppins-Medium" }]}>
                {post.author?.firstName && post.author?.lastName
                  ? `${post.author.firstName} ${post.author.lastName}`
                  : post.author?.username || "Anonymous"}
              </Text>
              <View style={[globalStyles.row, { alignItems: "center" }]}>
                <Ionicons name="time-outline" size={14} color={colors.text.secondary} />
                <Text style={[globalStyles.caption, { marginLeft: 4, color: colors.text.secondary }]}>
                  {formatDate(post.publishedAt || post.createdAt)}
                </Text>
                <Text style={[globalStyles.caption, { marginHorizontal: 8, color: colors.text.light }]}>•</Text>
                <Ionicons name="eye-outline" size={14} color={colors.text.secondary} />
                <Text style={[globalStyles.caption, { marginLeft: 4, color: colors.text.secondary }]}>
                  {post.viewCount || 0} views
                </Text>
              </View>
            </View>
          </View>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <View style={[globalStyles.row, { flexWrap: "wrap", marginBottom: 20 }]}>
              {post.tags.map((tagObj, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: tagObj.tag?.color ? `${tagObj.tag.color}20` : colors.background.overlay,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text style={[globalStyles.caption, { color: tagObj.tag?.color || colors.primary.coral }]}>
                    #{tagObj.tag?.name || tagObj}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <View
              style={{
                backgroundColor: colors.background.overlay,
                padding: 16,
                borderRadius: 12,
                marginBottom: 20,
                borderLeftWidth: 4,
                borderLeftColor: colors.primary.coral,
              }}
            >
              <Text style={[globalStyles.body, { fontStyle: "italic" }]}>{post.excerpt}</Text>
            </View>
          )}
        </View>

        {/* Article Content */}
        <View style={{ minHeight: 300, marginHorizontal: 20 }}>{renderHTML(post.content)}</View>

        {/* Engagement Stats */}
        <View
          style={{
            backgroundColor: colors.background.overlay,
            borderRadius: 16,
            padding: 16,
            margin: 20,
          }}
        >
          <View style={[globalStyles.row, { justifyContent: "space-around" }]}>
            <TouchableOpacity onPress={handleLike} style={[globalStyles.center]}>
              <View style={[globalStyles.row, { alignItems: "center", marginBottom: 4 }]}>
                <Ionicons name={isLiked ? "heart" : "heart-outline"} size={20} color={colors.error} />
                <Text style={[globalStyles.heading, { marginLeft: 6, marginBottom: 0 }]}>{likeCount}</Text>
              </View>
              <Text style={globalStyles.caption}>Likes</Text>
            </TouchableOpacity>

            <View style={[globalStyles.center]}>
              <View style={[globalStyles.row, { alignItems: "center", marginBottom: 4 }]}>
                <Ionicons name="chatbubble-outline" size={20} color={colors.primary.coral} />
                <Text style={[globalStyles.heading, { marginLeft: 6, marginBottom: 0 }]}>{comments.length}</Text>
              </View>
              <Text style={globalStyles.caption}>Comments</Text>
            </View>

            <TouchableOpacity onPress={handleShare} style={[globalStyles.center]}>
              <View style={[globalStyles.row, { alignItems: "center", marginBottom: 4 }]}>
                <Ionicons name="share-outline" size={20} color={colors.success} />
                <Text style={[globalStyles.heading, { marginLeft: 6, marginBottom: 0 }]}>{post.shareCount || 0}</Text>
              </View>
              <Text style={globalStyles.caption}>Shares</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments Section */}
        <View style={{ padding: 20 }}>
          <Text style={[globalStyles.heading, { marginBottom: 16 }]}>Comments ({comments.length})</Text>

          {/* Add Comment */}
          {user && (
            <View style={{ marginBottom: 20 }}>
              <CustomInput
                placeholder="Share your thoughts..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
                numberOfLines={3}
                style={{ marginBottom: 12 }}
              />
              <CustomButton
                title="Post Comment"
                onPress={handleAddComment}
                loading={isSubmittingComment}
                size="small"
                disabled={!newComment.trim()}
              />
            </View>
          )}

          {/* Comments List */}
          {comments.map((comment, index) => (
            <View
              key={comment.id || index}
              style={{
                backgroundColor: colors.background.card,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                shadowColor: colors.shadow.light,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View style={[globalStyles.row, { marginBottom: 8 }]}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: colors.primary.coral,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <Text style={[globalStyles.caption, { color: colors.text.white, fontFamily: "Poppins-SemiBold" }]}>
                    {comment.author?.firstName?.charAt(0) || comment.author?.username?.charAt(0) || "A"}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[globalStyles.bodySecondary, { fontFamily: "Poppins-Medium" }]}>
                    {comment.author?.firstName && comment.author?.lastName
                      ? `${comment.author.firstName} ${comment.author.lastName}`
                      : comment.author?.username || "Anonymous"}
                  </Text>
                  <Text style={[globalStyles.caption, { color: colors.text.light }]}>{timeAgo(comment.createdAt)}</Text>
                </View>
              </View>

              <Text style={[globalStyles.body, { lineHeight: 22 }]}>{comment.content}</Text>
            </View>
          ))}

          {comments.length === 0 && (
            <View style={[globalStyles.center, { padding: 40 }]}>
              <Ionicons name="chatbubble-outline" size={48} color={colors.text.light} />
              <Text style={[globalStyles.bodySecondary, { marginTop: 12, textAlign: "center" }]}>
                No comments yet. Be the first to share your thoughts!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default BlogDetailScreen
