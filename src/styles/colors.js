export const colors = {
  // Primary brand colors - vibrant and modern
  primary: {
    coral: "#FF6B6B",
    coralLight: "#FF8A8A",
    coralDark: "#E55555",
    orange: "#FF8E53",
    orangeLight: "#FFA573",
    orangeDark: "#E67A47",
    peach: "#FFB4A2",
    peachLight: "#FFC4B5",
    peachDark: "#E5A091",
    pink: "#FF9FF3",
    pinkLight: "#FFB3F6",
    pinkDark: "#E58FDB",
  },

  // Neutral colors
  neutral: {
    white: "#FFFFFF",
    gray50: "#FAFAFA",
    gray100: "#F5F5F5",
    gray200: "#EEEEEE",
    gray300: "#E0E0E0",
    gray400: "#BDBDBD",
    gray500: "#9E9E9E",
    gray600: "#757575",
    gray700: "#616161",
    gray800: "#424242",
    gray900: "#212121",
    black: "#000000",
  },

  // Semantic colors
  success: {
    light: "#4CAF50",
    main: "#2E7D32",
    dark: "#1B5E20",
    bg: "#E8F5E8",
  },

  warning: {
    light: "#FF9800",
    main: "#F57C00",
    dark: "#E65100",
    bg: "#FFF3E0",
  },

  error: {
    light: "#F44336",
    main: "#D32F2F",
    dark: "#B71C1C",
    bg: "#FFEBEE",
  },

  info: {
    light: "#2196F3",
    main: "#1976D2",
    dark: "#0D47A1",
    bg: "#E3F2FD",
  },

  // Text colors
  text: {
    primary: "#212121",
    secondary: "#757575",
    disabled: "#BDBDBD",
    hint: "#9E9E9E",
    white: "#FFFFFF",
    inverse: "#FFFFFF",
  },

  // Background colors
  background: {
    default: "#FAFAFA",
    paper: "#FFFFFF",
    level1: "#F5F5F5",
    level2: "#EEEEEE",
    overlay: "rgba(0, 0, 0, 0.5)",
    overlayLight: "rgba(0, 0, 0, 0.1)",
  },

  // Mood colors - more vibrant
  moods: {
    amazing: "#4CAF50",
    good: "#8BC34A",
    okay: "#FF9800",
    bad: "#FF5722",
    terrible: "#F44336",
  },

  // Hobby colors - distinct and vibrant
  hobbies: {
    reading: "#9C27B0",
    writing: "#3F51B5",
    cooking: "#FF9800",
    fitness: "#F44336",
    music: "#E91E63",
    art: "#FF5722",
    travel: "#00BCD4",
    photography: "#795548",
    gaming: "#607D8B",
    gardening: "#4CAF50",
    learning: "#2196F3",
    meditation: "#9C27B0",
  },

  // Gradients
  gradients: {
    primary: ["#FF6B6B", "#FF8E53"],
    secondary: ["#FFB4A2", "#FF9FF3"],
    success: ["#4CAF50", "#8BC34A"],
    warning: ["#FF9800", "#FFC107"],
    error: ["#F44336", "#FF5722"],
    info: ["#2196F3", "#03DAC6"],
    sunset: ["#FF6B6B", "#FF8E53", "#FFB4A2"],
    ocean: ["#00BCD4", "#2196F3"],
    forest: ["#4CAF50", "#8BC34A"],
    royal: ["#9C27B0", "#673AB7"],
  },

  // Shadow colors
  shadow: {
    light: "rgba(0, 0, 0, 0.08)",
    medium: "rgba(0, 0, 0, 0.12)",
    dark: "rgba(0, 0, 0, 0.16)",
    colored: "rgba(255, 107, 107, 0.3)",
  },

  // Border colors
  border: {
    light: "#E0E0E0",
    medium: "#BDBDBD",
    dark: "#9E9E9E",
    focus: "#FF6B6B",
  },
}

// Dark theme colors
export const darkColors = {
  ...colors,

  text: {
    primary: "#FFFFFF",
    secondary: "#BDBDBD",
    disabled: "#757575",
    hint: "#9E9E9E",
    white: "#000000",
    inverse: "#000000",
  },

  background: {
    default: "#121212",
    paper: "#1E1E1E",
    level1: "#2C2C2C",
    level2: "#383838",
    overlay: "rgba(255, 255, 255, 0.1)",
    overlayLight: "rgba(255, 255, 255, 0.05)",
  },

  border: {
    light: "#383838",
    medium: "#4F4F4F",
    dark: "#616161",
    focus: "#FF6B6B",
  },
}
