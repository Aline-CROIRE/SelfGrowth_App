export const formatDate = (dateString) => {
  if (!dateString) return ""

  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) {
    return "Yesterday"
  } else if (diffDays <= 7) {
    return `${diffDays} days ago`
  } else if (diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`
  } else {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
}

export const formatDateTime = (dateString) => {
  if (!dateString) return ""

  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const formatTime = (dateString) => {
  if (!dateString) return ""

  const date = new Date(dateString)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const isToday = (dateString) => {
  if (!dateString) return false

  const date = new Date(dateString)
  const today = new Date()

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export const isThisWeek = (dateString) => {
  if (!dateString) return false

  const date = new Date(dateString)
  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  return date >= weekAgo && date <= today
}

export const getDaysUntil = (dateString) => {
  if (!dateString) return null

  const targetDate = new Date(dateString)
  const today = new Date()
  const diffTime = targetDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}
