"use client"

import { createContext, useContext, useMemo } from "react"
import { useAuth } from "./AuthContext"

const UserRoleContext = createContext()

export const UserRoleProvider = ({ children }) => {
  const { user } = useAuth()

  const rolePermissions = useMemo(() => {
    const role = user?.role || "USER"

    const permissions = {
      // Basic user permissions
      canCreateJournal: true,
      canEditOwnJournal: true,
      canDeleteOwnJournal: true,
      canCreateGoal: true,
      canEditOwnGoal: true,
      canDeleteOwnGoal: true,
      canViewBlog: true,
      canCommentOnBlog: true,
      canLikeBlog: true,
      canUpdateProfile: true,
      canViewStatistics: true,
      canViewAchievements: true,

      // Admin permissions
      canCreateBlog: role === "ADMIN" || role === "SUPER_ADMIN",
      canEditAnyBlog: role === "ADMIN" || role === "SUPER_ADMIN",
      canDeleteAnyBlog: role === "ADMIN" || role === "SUPER_ADMIN",
      canModerateComments: role === "ADMIN" || role === "SUPER_ADMIN",
      canViewUserList: role === "ADMIN" || role === "SUPER_ADMIN",
      canViewAnalytics: role === "ADMIN" || role === "SUPER_ADMIN",

      // Super Admin permissions
      canManageUsers: role === "SUPER_ADMIN",
      canManageAdmins: role === "SUPER_ADMIN",
      canViewSystemStats: role === "SUPER_ADMIN",
      canManageApp: role === "SUPER_ADMIN",
      canAccessAdminPanel: role === "SUPER_ADMIN",
    }

    return permissions
  }, [user?.role])

  const userFeatures = useMemo(() => {
    const role = user?.role || "USER"

    return {
      showCreateBlogButton: rolePermissions.canCreateBlog,
      showAdminPanel: rolePermissions.canAccessAdminPanel,
      showUserManagement: rolePermissions.canManageUsers,
      showAnalytics: rolePermissions.canViewAnalytics,
      showModerationTools: rolePermissions.canModerateComments,

      // Navigation items based on role
      navigationItems: [
        { name: "Home", icon: "home-outline", screen: "Home", visible: true },
        { name: "Journal", icon: "book-outline", screen: "Journal", visible: true },
        { name: "Goals", icon: "flag-outline", screen: "Goals", visible: true },
        { name: "Blog", icon: "library-outline", screen: "Blog", visible: true },
        { name: "Create", icon: "add-circle-outline", screen: "CreateBlog", visible: rolePermissions.canCreateBlog },
        { name: "Admin", icon: "settings-outline", screen: "AdminPanel", visible: rolePermissions.canAccessAdminPanel },
        { name: "Profile", icon: "person-outline", screen: "Profile", visible: true },
      ].filter((item) => item.visible),

      // Profile menu items based on role
      profileMenuItems: [
        {
          section: "Personal",
          items: [
            { id: "edit-profile", title: "Edit Profile", visible: true },
            { id: "achievements", title: "Achievements", visible: true },
            { id: "statistics", title: "Statistics", visible: true },
          ],
        },
        {
          section: "Content",
          items: [
            { id: "my-blogs", title: "My Blog Posts", visible: rolePermissions.canCreateBlog },
            { id: "drafts", title: "Drafts", visible: rolePermissions.canCreateBlog },
            { id: "moderation", title: "Content Moderation", visible: rolePermissions.canModerateComments },
          ],
        },
        {
          section: "Administration",
          items: [
            { id: "user-management", title: "User Management", visible: rolePermissions.canManageUsers },
            { id: "analytics", title: "App Analytics", visible: rolePermissions.canViewAnalytics },
            { id: "system-settings", title: "System Settings", visible: rolePermissions.canManageApp },
          ],
        },
        {
          section: "App Settings",
          items: [
            { id: "theme", title: "Dark Mode", visible: true },
            { id: "notifications", title: "Notifications", visible: true },
            { id: "privacy", title: "Privacy & Security", visible: true },
          ],
        },
      ]
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => item.visible),
        }))
        .filter((section) => section.items.length > 0),
    }
  }, [rolePermissions, user?.role])

  const value = {
    user,
    role: user?.role || "USER",
    permissions: rolePermissions,
    features: userFeatures,
    isAdmin: user?.role === "ADMIN" || user?.role === "SUPER_ADMIN",
    isSuperAdmin: user?.role === "SUPER_ADMIN",
    isRegularUser: user?.role === "USER" || !user?.role,
  }

  return <UserRoleContext.Provider value={value}>{children}</UserRoleContext.Provider>
}

export const useUserRole = () => {
  const context = useContext(UserRoleContext)
  if (!context) {
    throw new Error("useUserRole must be used within a UserRoleProvider")
  }
  return context
}
