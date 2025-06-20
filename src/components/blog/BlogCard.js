import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"
import { globalStyles } from "../../styles/globalStyles"
import { useTheme } from "../../context/ThemeContext" // Assuming you use theme colors
import { formatDate } from "../../utils/dateUtils"

const BlogCard = ({ post, onPress, style = {} }) => {
  const { colors } = useTheme(); // Get colors from theme context

  const truncateHtml = (html, maxLength = 100) => {
    if (!html) return ""
    const textOnly = html.replace(/<[^>]*>/g, "")
    return textOnly.length > maxLength ? `${textOnly.substring(0, maxLength)}...` : textOnly
  }

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "SUPER_ADMIN": return "Super Admin"
      case "ADMIN": return "Admin"
      default: return "Member"
    }
  }

  return (
    <Animatable.View animation="fadeInUp" duration={600} style={style}>
      <TouchableOpacity
        onPress={() => onPress && onPress(post)}
        style={[globalStyles.card, { marginHorizontal: 20, marginBottom: 20, padding: 0, overflow: 'hidden' }]}
        activeOpacity={0.8}
      >
        {/* Featured Image */}
        {post.featuredImage && (
          <Image
            source={{ uri: post.featuredImage }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <View style={styles.contentContainer}>
          {/* Tags Section - Placed at the top for better design */}
          {post.tags && post.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {/* ✅ FIX IS HERE: We now access `postTag.tag.name` */}
              {post.tags.slice(0, 3).map((postTag) => (
                <View
                  key={postTag.tagId} // Use a unique ID for the key
                  style={[styles.tag, { backgroundColor: colors.background.level1 }]}
                >
                  <Text style={[styles.tagText, { color: colors.primary.coral }]}>
                    {postTag.tag.name}
                  </Text>
                </View>
              ))}
            </View>
          )}
          
          {/* Title */}
          <Text style={[globalStyles.titleLarge, { color: colors.text.primary, marginVertical: 8 }]} numberOfLines={2}>
            {post.title}
          </Text>

          {/* Content Preview */}
          <Text style={[globalStyles.body, { color: colors.text.secondary, lineHeight: 22, marginBottom: 16 }]}>
            {truncateHtml(post.excerpt || post.content)}
          </Text>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={globalStyles.row}>
              <Image 
                source={{ uri: post.author?.avatar }} 
                style={styles.avatar} 
              />
              <View>
                <Text style={[globalStyles.labelLarge, { color: colors.text.primary }]}>
                  {post.author?.firstName || "User"} {post.author?.lastName || ""}
                </Text>
                <Text style={[globalStyles.labelSmall, { color: colors.text.secondary }]}>
                  {getRoleDisplayName(post.author?.role)}
                </Text>
              </View>
            </View>
            <Text style={[globalStyles.labelMedium, { color: colors.text.secondary }]}>
              {formatDate(post.publishedAt || post.createdAt)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 200,
  },
  contentContainer: {
    padding: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#E5E7EB', // Use a theme color if available
    paddingTop: 12,
    marginTop: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#F3F4F6', // Use a theme color if available
  }
});

export default BlogCard;