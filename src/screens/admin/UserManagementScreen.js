"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import { userService } from "../../services/userService"
import { globalStyles } from "../../styles/globalStyles"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import EmptyState from "../../components/common/EmptyState"

// Custom hook for debouncing search input
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}

const UserManagementScreen = ({ navigation }) => {
  const { colors } = useTheme()
  const { token } = useAuth()
  
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({})
  
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [isRefreshing, setRefreshing] = useState(false)
  
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  
  const [selectedRole, setSelectedRole] = useState("all")
  // You might want to add this back if you have a status filter
  // const [selectedStatus, setSelectedStatus] = useState("all")

  const [suspendModal, setSuspendModal] = useState({ visible: false, user: null })
  const [suspendReason, setSuspendReason] = useState("")

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const params = {
        search: debouncedSearchQuery,
        role: selectedRole !== "all" ? selectedRole : undefined,
        // status: selectedStatus !== "all" ? selectedStatus : undefined,
      }
      
      const [usersResponse, statsResponse] = await Promise.all([
        userService.getAllUsers(token, params),
        userService.getUserStats(token), // This should be getStatistics to match your service
      ])

      if (usersResponse.success) {
        setUsers(usersResponse.data.users || [])
      }

      // ✅ FIX: Unpack the 'overview' object from the stats response
      if (statsResponse.success && statsResponse.data.overview) {
        setStats(statsResponse.data.overview || {})
      } else {
        // Fallback in case the overview object doesn't exist
        setStats({})
      }

    } catch (error) {
      Alert.alert("Error", error.message || "Failed to load data")
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }, [token, debouncedSearchQuery, selectedRole]) // Removed selectedStatus if not used

  useEffect(() => {
    setIsLoading(true)
    fetchData()
  }, [fetchData])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchData()
  }, [fetchData])

  const handleAction = async (actionFn, successMessage) => {
    setIsActionLoading(true)
    try {
      const result = await actionFn();
      if (result.success) {
        Alert.alert("Success", successMessage);
        await fetchData();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      Alert.alert("Error", error.message || "An unexpected error occurred.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSuspendUser = (user) => {
    // Correctly call the combined function from the service
    handleAction(() => userService.setUserDisabledStatus(user.id, true, token), "User suspended successfully.");
  };

  const handleActivateUser = (user) => {
    // Correctly call the combined function from the service
    handleAction(() => userService.setUserDisabledStatus(user.id, false, token), "User activated successfully.");
  };

  const handleDeleteUser = (user) => {
    Alert.alert("Delete User", `Are you sure you want to permanently delete ${user.username}? This action is irreversible.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => handleAction(() => userService.deleteUser(user.id, token), "User deleted successfully.") },
    ]);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "SUPER_ADMIN": return colors.error.main
      case "ADMIN": return colors.warning.main
      case "USER": return colors.success.main
      default: return colors.text.secondary
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE": return colors.success.main
      case "INACTIVE": return colors.warning.main
      case "SUSPENDED": return colors.error.main
      case "PENDING_VERIFICATION": return colors.text.secondary
      default: return colors.text.secondary
    }
  }
  
  const StatCard = ({ label, value, color }) => (
    <View style={[styles.statCard, { backgroundColor: colors.background.card }]}>
      <Text style={[globalStyles.bodySmall, { color: colors.text.secondary }]}>{label}</Text>
      <Text style={[globalStyles.titleLarge, { color: color, marginTop: 4 }]}>{value || 0}</Text>
    </View>
  )

  const FilterChip = ({ label, value, selectedValue, onSelect }) => (
    <TouchableOpacity
      onPress={() => onSelect(value)}
      style={[ styles.filterChip, { backgroundColor: selectedValue === value ? colors.primary.coral : colors.background.card, borderColor: selectedValue === value ? colors.primary.coral : colors.border.light }]}
    >
      <Text style={[globalStyles.labelMedium, { color: selectedValue === value ? colors.text.white : colors.text.primary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  )

  if (isLoading && users.length === 0) return <LoadingSpinner />

  return (
    <View style={[globalStyles.container, { backgroundColor: colors.background.primary }]}>
      <LinearGradient colors={colors.gradients.primary} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text.white} />
          </TouchableOpacity>
          <Text style={[globalStyles.title, { color: colors.text.white }]}>User Management</Text>
          <TouchableOpacity onPress={() => navigation.navigate("CreateUser")} style={styles.headerButton}>
            <Ionicons name="add" size={24} color={colors.text.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <View style={[styles.searchInputWrapper, { backgroundColor: colors.background.card }]}>
            <Ionicons name="search" size={20} color={colors.text.secondary} style={{ marginRight: 12 }} />
            <TextInput
              placeholder="Search by name, username, or email..."
              placeholderTextColor={colors.text.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[globalStyles.body, { flex: 1, color: colors.text.primary }]}
            />
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[colors.primary.coral]} />}
      >
        <View style={{ paddingVertical: 16 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            <StatCard label="Total Users" value={stats.totalUsers} color={colors.primary.coral} />
            <StatCard label="Active" value={stats.activeUsers} color={colors.success.main} />
            <StatCard label="Suspended" value={stats.suspendedUsers || (stats.byStatus?.find(s => s.status === 'SUSPENDED')?._count) || 0} color={colors.error.main} />
            <StatCard label="Admins" value={stats.adminUsers || (stats.byRole?.find(r => r.role === 'ADMIN' || r.role === 'SUPER_ADMIN')?._count) || 0} color={colors.warning.main} />
          </ScrollView>
        </View>

        <View style={{ paddingBottom: 16 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            <FilterChip label="All Roles" value="all" selectedValue={selectedRole} onSelect={setSelectedRole} />
            <FilterChip label="User" value="USER" selectedValue={selectedRole} onSelect={setSelectedRole} />
            <FilterChip label="Admin" value="ADMIN" selectedValue={selectedRole} onSelect={setSelectedRole} />
            <FilterChip label="Super Admin" value="SUPER_ADMIN" selectedValue={selectedRole} onSelect={setSelectedRole} />
          </ScrollView>
        </View>

        <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          {isLoading && users.length > 0 ? <ActivityIndicator style={{ marginVertical: 20 }} color={colors.primary.coral} /> : null}
          {!isLoading && users.length > 0 ? (
            users.map((user) => (
              <View key={user.id} style={[globalStyles.card, { backgroundColor: colors.background.card, marginBottom: 16 }]}>
                <View style={styles.userCardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[globalStyles.titleMedium, { color: colors.text.primary }]}>{user.firstName} {user.lastName}</Text>
                    <Text style={[globalStyles.bodySmall, { color: colors.text.secondary, marginTop: 2 }]}>@{user.username}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <View style={[styles.badge, { backgroundColor: getRoleColor(user.role) + '20', marginBottom: 6 }]}>
                      <Text style={[styles.badgeText, { color: getRoleColor(user.role) }]}>{user.role.replace('_', ' ')}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: getStatusColor(user.status) + '20' }]}>
                      <Text style={[styles.badgeText, { color: getStatusColor(user.status) }]}>{user.status.replace('_', ' ')}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.userInfoRow}>
                  <Ionicons name="mail-outline" size={14} color={colors.text.secondary} />
                  <Text style={[styles.userInfoText, { color: colors.text.secondary }]}>{user.email}</Text>
                </View>

                <View style={styles.userInfoRow}>
                  <Ionicons name="calendar-outline" size={14} color={colors.text.secondary} />
                  <Text style={[styles.userInfoText, { color: colors.text.secondary }]}>Joined: {new Date(user.createdAt).toLocaleDateString()}</Text>
                </View>
                
                <View style={styles.actionButtonContainer}>
                  <TouchableOpacity onPress={() => navigation.navigate("EditUser", { userId: user.id })} style={[styles.actionButton, { backgroundColor: colors.info.main + '20' }]}>
                    <Text style={[styles.actionButtonText, { color: colors.info.main }]}>Edit</Text>
                  </TouchableOpacity>
                  {user.status === "ACTIVE" ? (
                    <TouchableOpacity onPress={() => handleSuspendUser(user)} style={[styles.actionButton, { backgroundColor: colors.warning.main + '20' }]}>
                      <Text style={[styles.actionButtonText, { color: colors.warning.main }]}>Suspend</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => handleActivateUser(user)} style={[styles.actionButton, { backgroundColor: colors.success.main + '20' }]}>
                      <Text style={[styles.actionButtonText, { color: colors.success.main }]}>Activate</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => handleDeleteUser(user)} style={[styles.actionButton, { backgroundColor: colors.error.main + '20' }]}>
                    <Text style={[styles.actionButtonText, { color: colors.error.main }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            !isLoading && <EmptyState icon="people-outline" title="No Users Found" subtitle="No users match your current filters." />
          )}
        </View>
      </ScrollView>

      {/* Suspend Modal is not needed anymore with the new handleAction logic, but keeping the JSX if you want a modal confirmation */}
    </View>
  )
}

const styles = StyleSheet.create({
  header: { paddingTop: 50, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 20 },
  headerButton: { padding: 8 },
  searchContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  searchInputWrapper: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center" },
  statCard: { padding: 16, borderRadius: 12, width: 130, marginRight: 12, alignItems: 'center' },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1 },
  userCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontFamily: 'Poppins-SemiBold', fontSize: 10 },
  userInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  userInfoText: { marginLeft: 8, fontFamily: 'Poppins-Regular', fontSize: 12 },
  actionButtonContainer: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderColor: '#E5E7EB', paddingTop: 16, marginTop: 8 },
  actionButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginLeft: 8 },
  actionButtonText: { fontFamily: 'Poppins-SemiBold', fontSize: 12 },
})

export default UserManagementScreen