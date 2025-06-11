// 🌅 DAILY CONTENT UTILITIES - Get inspiring content based on the day

import { DAILY_QUOTES, INSPIRATIONAL_VERSES } from "../data/quotes"

// Get a quote based on the day of the year
export const getDailyQuote = () => {
  const today = new Date()
  const dayOfYear = getDayOfYear(today)
  const index = dayOfYear % DAILY_QUOTES.length
  return DAILY_QUOTES[index]
}

// Get an inspirational verse based on the day of the year
export const getDailyVerse = () => {
  const today = new Date()
  const dayOfYear = getDayOfYear(today)
  const index = dayOfYear % INSPIRATIONAL_VERSES.length
  return INSPIRATIONAL_VERSES[index]
}

// Helper function to get the day of the year (0-365)
const getDayOfYear = (date) => {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date - start
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

// Get a random quote (for variety)
export const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * DAILY_QUOTES.length)
  return DAILY_QUOTES[randomIndex]
}

// Get a random verse (for variety)
export const getRandomVerse = () => {
  const randomIndex = Math.floor(Math.random() * INSPIRATIONAL_VERSES.length)
  return INSPIRATIONAL_VERSES[randomIndex]
}

// Get content based on user preference
export const getDailyContent = (preferenceType = "both") => {
  const quote = getDailyQuote()
  const verse = getDailyVerse()

  switch (preferenceType) {
    case "quotes":
      return { type: "quote", content: quote }
    case "verses":
      return { type: "verse", content: verse }
    case "both":
    default:
      // Alternate between quotes and verses based on day
      const dayOfYear = getDayOfYear(new Date())
      const isEvenDay = dayOfYear % 2 === 0
      return isEvenDay ? { type: "quote", content: quote } : { type: "verse", content: verse }
  }
}
