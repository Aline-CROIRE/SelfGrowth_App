# 📱 SelfGrow - Personal Growth & Journaling App

![SelfGrow Banner](./assets/banner.png)

## 🌟 Overview

SelfGrow is a comprehensive personal growth application designed to help users track their journey through journaling, goal setting, and self-reflection. Built with React Native and Expo, this app provides a beautiful, intuitive interface for users to document their thoughts, set meaningful goals, and visualize their progress over time.

## ✨ Features

- **🔐 User Authentication**: Secure login and registration system with demo account option
- **📝 Journal Entries**: Create, edit, and organize personal reflections with mood tracking
- **🎯 Goal Setting**: Set, track, and complete goals across different life categories
- **🏆 Achievement System**: Unlock badges and achievements as you progress
- **📊 Growth Analytics**: Track your journaling streak, completed goals, and overall progress
- **🎨 Beautiful UI**: Thoughtfully designed interface with smooth animations and transitions
- **🌙 Personalization**: Tailor the experience based on selected hobbies and interests
- **💾 Offline Storage**: All data is stored locally for privacy and offline access
- **📱 Cross-Platform**: Works seamlessly on iOS and Android devices

## 📸 Screenshots

<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
  <img src="./assets/screenshots/welcome.png" width="200" alt="Welcome Screen" />
  <img src="./assets/screenshots/login.png" width="200" alt="Login Screen" />
  <img src="./assets/screenshots/home.png" width="200" alt="Home Dashboard" />
  <img src="./assets/screenshots/journal.png" width="200" alt="Journal Screen" />
  <img src="./assets/screenshots/goals.png" width="200" alt="Goals Screen" />
  <img src="./assets/screenshots/profile.png" width="200" alt="Profile Screen" />
</div>

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/selfgrow-app.git
   cd selfgrow-app
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm start
   # or
   yarn start
   \`\`\`

4. Open the app:
   - Scan the QR code with the Expo Go app on your phone
   - Press 'a' to open on Android emulator
   - Press 'i' to open on iOS simulator

### Expo QR Code

When you run `npm start`, Expo will generate a QR code in your terminal. Scan this code with the Expo Go app (available on [iOS App Store](https://apps.apple.com/app/expo-go/id982107779) and [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)) to open the app on your physical device.

You can also create a permanent QR code by publishing your app to Expo:

\`\`\`bash
expo publish
\`\`\`

This will give you a persistent URL and QR code that you can share with others.

## 📂 Project Structure

\`\`\`
selfgrow-app/
├── assets/                  # Images, fonts, and other static assets
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Shared components (buttons, inputs, etc.)
│   │   └── hobbies/         # Hobby-specific components
│   ├── context/             # React Context for state management
│   ├── navigation/          # Navigation configuration
│   ├── screens/             # App screens
│   │   ├── auth/            # Authentication screens
│   │   └── main/            # Main app screens
│   ├── styles/              # Global styles and theme
│   └── utils/               # Helper functions and utilities
├── App.js                   # App entry point
└── package.json             # Project dependencies
\`\`\`

## 💾 Data Storage & Retrieval

SelfGrow uses AsyncStorage for local data persistence. Here's how data is managed:

### Storage Implementation

The app uses a centralized approach to data management through the AppContext:

\`\`\`javascript
// In src/context/AppContext.js

// Save data to storage
const saveToStorage = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to storage:", error);
  }
};

// Load data from storage
const loadFromStorage = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading from storage:", error);
    return null;
  }
};
\`\`\`

### Auto-Save Functionality

The app automatically saves data whenever it changes using React's useEffect hook:

\`\`\`javascript
// Auto-save user data when it changes
useEffect(() => {
  if (state.user) {
    saveToStorage("user", state.user);
  }
}, [state.user]);

// Auto-save journal entries when they change
useEffect(() => {
  saveToStorage("entries", state.entries);
}, [state.entries]);

// Auto-save goals when they change
useEffect(() => {
  saveToStorage("goals", state.goals);
}, [state.goals]);
\`\`\`

### Data Loading on App Start

When the app starts, it loads all saved data from AsyncStorage:

\`\`\`javascript
useEffect(() => {
  const initializeApp = async () => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });

    try {
      // Load user data
      const userData = await loadFromStorage("user");
      const hobbiesData = await loadFromStorage("hobbies");
      const entriesData = await loadFromStorage("entries");
      const goalsData = await loadFromStorage("goals");

      if (userData || hobbiesData || entriesData || goalsData) {
        dispatch({
          type: ActionTypes.LOAD_DATA,
          payload: {
            user: userData,
            isAuthenticated: !!userData,
            selectedHobbies: hobbiesData || [],
            entries: entriesData || [],
            goals: goalsData || [],
          },
        });
      }
    } catch (error) {
      console.error("Error initializing app:", error);
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  initializeApp();
}, []);
\`\`\`

## 📜 Daily Quotes & Inspirational Content

### Adding Daily Quotes

To implement daily quotes and inspirational content, add the following files:

1. First, create a data file for quotes:

\`\`\`javascript
// src/data/quotes.js
export const DAILY_QUOTES = [
  {
    quote: "The journey of a thousand miles begins with a single step.",
    author: "Lao Tzu"
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    quote: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius"
  },
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    quote: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis"
  },
  // Add more quotes as needed
];

export const INSPIRATIONAL_VERSES = [
  {
    verse: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    reference: "Jeremiah 29:11"
  },
  {
    verse: "I can do all things through Christ who strengthens me.",
    reference: "Philippians 4:13"
  },
  {
    verse: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    reference: "Joshua 1:9"
  },
  {
    verse: "Trust in the Lord with all your heart and lean not on your own understanding.",
    reference: "Proverbs 3:5"
  },
  {
    verse: "The Lord is my shepherd, I lack nothing.",
    reference: "Psalm 23:1"
  },
  // Add more verses as needed
];
\`\`\`

2. Create a utility function to get the daily content:

\`\`\`javascript
// src/utils/dailyContent.js
import { DAILY_QUOTES, INSPIRATIONAL_VERSES } from '../data/quotes';

// Get a quote based on the day of the year
export const getDailyQuote = () => {
  const today = new Date();
  const dayOfYear = getDayOfYear(today);
  const index = dayOfYear % DAILY_QUOTES.length;
  return DAILY_QUOTES[index];
};

// Get an inspirational verse based on the day of the year
export const getDailyVerse = () => {
  const today = new Date();
  const dayOfYear = getDayOfYear(today);
  const index = dayOfYear % INSPIRATIONAL_VERSES.length;
  return INSPIRATIONAL_VERSES[index];
};

// Helper function to get the day of the year (0-365)
const getDayOfYear = (date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};
\`\`\`

3. Create a component to display the daily content:

\`\`\`javascript
// src/components/common/DailyInspiration.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../styles/colors';
import { TYPOGRAPHY, SPACING, SHADOWS } from '../../styles/globalStyles';
import { getDailyQuote, getDailyVerse } from '../../utils/dailyContent';

const DailyInspiration = () => {
  const [showVerse, setShowVerse] = useState(false);
  const dailyQuote = getDailyQuote();
  const dailyVerse = getDailyVerse();
  
  const toggleContent = () => {
    setShowVerse(!showVerse);
  };
  
  const content = showVerse ? dailyVerse : dailyQuote;
  
  return (
    <TouchableOpacity onPress={toggleContent} activeOpacity={0.9}>
      <LinearGradient
        colors={showVerse ? COLORS.gradients.gentle : COLORS.gradients.dream}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <Text style={styles.contentType}>
          {showVerse ? '✝️ Daily Word' : '💭 Daily Quote'}
        </Text>
        <Text style={styles.content}>"{content.verse || content.quote}"</Text>
        <Text style={styles.author}>
          — {content.reference || content.author}
        </Text>
        <Text style={styles.tapHint}>Tap to see {showVerse ? 'quote' : 'verse'}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    ...SHADOWS.medium,
  },
  contentType: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.white,
    marginBottom: SPACING.sm,
    fontWeight: '600',
  },
  content: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.white,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
    lineHeight: 24,
  },
  author: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.neutral.white + 'DD',
    textAlign: 'right',
    marginBottom: SPACING.xs,
  },
  tapHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.white + '99',
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
});

export default DailyInspiration;
\`\`\`

4. Add the component to your HomeScreen:

\`\`\`javascript
// In src/screens/main/HomeScreen.js
import DailyInspiration from '../../components/common/DailyInspiration';

// Add this inside your ScrollView, perhaps after the header
<Animatable.View animation="fadeIn" delay={900}>
  <DailyInspiration />
</Animatable.View>
\`\`\`

## 🔧 Troubleshooting

### Common Issues

1. **App crashes on startup**
   - Make sure you have installed all dependencies: `npm install`
   - Check if AsyncStorage is properly linked: `npx expo install @react-native-async-storage/async-storage`

2. **Data not saving**
   - Verify that AsyncStorage is working by checking the console logs
   - Make sure you're not exceeding AsyncStorage size limits (typically 6MB)
   - Try clearing AsyncStorage: `AsyncStorage.clear()`

3. **UI rendering issues**
   - Ensure you have the latest version of Expo SDK
   - Check for conflicting style properties
   - Verify that all required fonts are loaded

4. **Navigation problems**
   - Make sure all screens are properly registered in the navigator
   - Check for typos in screen names
   - Verify that the navigation container is properly set up

### Debugging Tips

- Use `console.log()` statements to track data flow
- Enable the React Native Debugger for more advanced debugging
- Check the Expo logs for any warnings or errors
- Use the React DevTools to inspect component hierarchies

## 📱 Building for Production

To create a standalone app for distribution:

1. Configure app.json with your app details:
   \`\`\`json
   {
     "expo": {
       "name": "SelfGrow",
       "slug": "selfgrow",
       "version": "1.0.0",
       "orientation": "portrait",
       "icon": "./assets/icon.png",
       "splash": {
         "image": "./assets/splash.png",
         "resizeMode": "contain",
         "backgroundColor": "#FF6B6B"
       },
       "updates": {
         "fallbackToCacheTimeout": 0
       },
       "assetBundlePatterns": ["**/*"],
       "ios": {
         "supportsTablet": true,
         "bundleIdentifier": "com.yourcompany.selfgrow"
       },
       "android": {
         "adaptiveIcon": {
           "foregroundImage": "./assets/adaptive-icon.png",
           "backgroundColor": "#FF6B6B"
         },
         "package": "com.yourcompany.selfgrow"
       },
       "web": {
         "favicon": "./assets/favicon.png"
       }
     }
   }
   \`\`\`

2. Build for Android:
   \`\`\`bash
   expo build:android
   \`\`\`

3. Build for iOS:
   \`\`\`bash
   expo build:ios
   \`\`\`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)
- [React Native Animatable](https://github.com/oblador/react-native-animatable)

## 📞 Contact

Your Name - [your.email@example.com](mailto:your.email@example.com)

Project Link: [https://github.com/yourusername/selfgrow-app](https://github.com/yourusername/selfgrow-app)

