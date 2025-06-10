// 🎨 BEAUTIFUL WARM COLOR PALETTE - No Blues!
// Inspired by sunsets, creativity, and personal growth

export const COLORS = {
  // Primary Gradients - Warm & Inspiring
  primary: {
    coral: "#FF6B6B", // Vibrant coral - energy & passion
    orange: "#FF8E53", // Warm orange - creativity & enthusiasm
    peach: "#FF9A8B", // Soft peach - comfort & warmth
    sunset: "#FFA726", // Golden sunset - achievement & success
  },

  // Secondary Colors - Supporting the journey
  secondary: {
    lavender: "#A8E6CF", // Soft mint - growth & renewal
    cream: "#FFF8E1", // Warm cream - peace & clarity
    rose: "#FFB3BA", // Gentle rose - self-love & care
    gold: "#FFD93D", // Bright gold - celebration & victory
  },

  // Hobby-Specific Colors - Each passion gets its own identity
  hobbies: {
    art: "#FF6B6B", // Coral for drawing/painting
    reading: "#8B4513", // Rich brown for books
    music: "#FF8E53", // Orange for music/sound
    sports: "#32CD32", // Energetic green for fitness
    writing: "#9370DB", // Purple for creativity
    cooking: "#FF4500", // Red-orange for culinary arts
    photography: "#FFD700", // Gold for capturing moments
    gardening: "#228B22", // Forest green for nature
  },

  // Neutral Colors - Clean & Modern
  neutral: {
    white: "#FFFFFF",
    lightGray: "#F5F5F5",
    mediumGray: "#CCCCCC",
    darkGray: "#666666",
    black: "#333333",
  },

  // Status Colors - Feedback & Communication
  status: {
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
    info: "#9C27B0",
  },

  // Gradient Combinations - For stunning backgrounds
  gradients: {
    sunrise: ["#FF6B6B", "#FF8E53"], // Coral to Orange
    sunset: ["#FF8E53", "#FFA726"], // Orange to Golden
    dream: ["#FF9A8B", "#A8E6CF"], // Peach to Mint
    success: ["#FFA726", "#FFD93D"], // Golden to Bright Gold
    gentle: ["#FFB3BA", "#FFF8E1"], // Rose to Cream
  },
}

// 🌟 GRADIENT HELPER FUNCTION
export const createGradient = (colors, direction = "vertical") => {
  return {
    colors: colors,
    start: { x: 0, y: 0 },
    end: direction === "vertical" ? { x: 0, y: 1 } : { x: 1, y: 0 },
  }
}
