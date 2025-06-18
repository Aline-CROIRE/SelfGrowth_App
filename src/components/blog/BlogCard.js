import { View, Text, TouchableOpacity, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../styles/colors"
import { formatDate } from "../../utils/dateUtils"

const BlogCard = ({ post, onPress, style = {} }) => {
  const truncateHtml = (html, maxLength = 150) => {
    if (!html) return ""
    // Remove HTML tags for preview
    const textOnly = html.replace(/<[^>]*>/g, "")
    return textOnly.length > maxLength ? `${textOnly.substring(0, maxLength)}...` : textOnly
  }

  const getAuthorRole = (role) => {
    const roleColors = {
      SUPER_ADMIN: colors.error,
      ADMIN: colors.warning,
      USER: colors.text.secondary,
    }
    return roleColors[role] || colors.text.secondary
  }

  return (
    <Animatable.View animation="fadeInUp" duration={600} style={style}>
      <TouchableOpacity
        onPress={() => onPress && onPress(post)}
        style={[
          globalStyles.card,
          {
            marginHorizontal: 20,
            marginBottom: 16,
          },
        ]}
        activeOpacity={0.8}
      >
        {/* Featured Image */}
        {post.featuredImage && (
          <Image
            source={{ uri: post.featuredImage }}
            style={{
              width: "100%",
              height: 180,
              borderRadius: 12,
              marginBottom: 12,
            }}
            resizeMode="cover"
          />
        )}

        {/* Header */}
        <View style={{ marginBottom: 12 }}>
          <Text style={[globalStyles.heading, { fontSize: 18, marginBottom: 8 }]} numberOfLines={2}>
            {post.title}
          </Text>

          {/* Author Info */}
          <View style={[globalStyles.row, { marginBottom: 8 }]}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.background.overlay,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 8,
              }}
            >
              <Text style={[globalStyles.caption, { color: colors.text.secondary, fontFamily: "Poppins-Medium" }]}>
                {post.author?.firstName?.charAt(0) || post.author?.username?.charAt(0) || "A"}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[globalStyles.caption, { fontFamily: "Poppins-Medium", color: colors.text.primary }]}>
                {post.author?.firstName || post.author?.username || "Anonymous"}
              </Text>
              <Text style={[globalStyles.caption, { color: getAuthorRole(post.author?.role) }]}>
                {post.author?.role?.replace("_", " ") || "User"}
              </Text>
            </View>

            {/* Published Status */}
            <View
              style={{
                backgroundColor: post.published ? `${colors.success}20` : `${colors.warning}20`,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text
                style={[
                  globalStyles.caption,
                  {
                    color: post.published ? colors.success : colors.warning,
                    fontFamily: "Poppins-Medium",
                  },
                ]}
              >
                {post.published ? "Published" : "Draft"}
              </Text>
            </View>
          </View>
        </View>

        {/* Content Preview */}
        <Text style={[globalStyles.bodySecondary, { lineHeight: 20, marginBottom: 12 }]}>
          {truncateHtml(post.content)}
        </Text>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <View style={[globalStyles.row, { flexWrap: "wrap", marginBottom: 12 }]}>
            {post.tags.slice(0, 3).map((tag, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: colors.background.overlay,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  marginRight: 6,
                  marginBottom: 4,
                }}
              >
                <Text style={[globalStyles.caption, { color: colors.primary.coral }]}>#{tag}</Text>
              </View>
            ))}
            {post.tags.length > 3 && (
              <Text style={[globalStyles.caption, { color: colors.text.light, alignSelf: "center" }]}>
                +{post.tags.length - 3} more
              </Text>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={[globalStyles.spaceBetween]}>
          <View style={[globalStyles.row]}>
            <Ionicons name="time-outline" size={14} color={colors.text.light} />
            <Text style={[globalStyles.caption, { marginLeft: 4, color: colors.text.light }]}>
              {formatDate(post.createdAt)}
            </Text>
          </View>

          <View style={[globalStyles.row]}>
            {/* Likes */}
            <View style={[globalStyles.row, { marginRight: 12 }]}>
              <Ionicons name="heart-outline" size={14} color={colors.text.light} />
              <Text style={[globalStyles.caption, { marginLeft: 4, color: colors.text.light }]}>
                {post.likes?.length || 0}
              </Text>
            </View>

            {/* Comments */}
            <View style={[globalStyles.row, { marginRight: 12 }]}>
              <Ionicons name="chatbubble-outline" size={14} color={colors.text.light} />
              <Text style={[globalStyles.caption, { marginLeft: 4, color: colors.text.light }]}>
                {post.comments?.length || 0}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={16} color={colors.text.light} />
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  )
}

export default BlogCard
