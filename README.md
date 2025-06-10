# 📱 SelfGrow - Personal Growth & Journaling App

A comprehensive personal growth mobile application built with React Native and Expo, demonstrating advanced mobile development concepts including authentication, data persistence, journaling, goal tracking, and achievement systems.

## 🚀 Features Implemented

1. **Native Components & Styling**
   - Custom styled components with beautiful gradient designs
   - Responsive layouts optimized for mobile devices
   - Consistent warm color palette (coral, orange, peach themes)
   - Smooth animations with React Native Animatable
   - Professional typography and spacing system

2. **Navigation System**
   - Tab-based navigation between main sections (Home, Journal, Goals, Profile)
   - Stack navigation for authentication flow
   - Conditional rendering based on authentication state
   - Smooth screen transitions and proper navigation flow
   - Protected routes requiring authentication
   - Navigation between 7+ screens (Welcome, Login, Register, Home, Journal, Goals, Profile)

3. **Forms & User Input**
   - Registration and login forms with comprehensive validation
   - Journal entry creation with mood tracking and image attachments
   - Goal creation with categories, priorities, and target dates
   - Hobby selection during onboarding
   - Input validation and error handling with user-friendly messages
   - Rich text input for journal entries

4. **Authentication Flow**
   - Secure user registration and login functionality
   - Session management with AsyncStorage and token-based authentication
   - Protected screens and routes with automatic session restoration
   - Secure logout with data preservation
   - Demo account functionality for testing
   - Session expiration after 30 days of inactivity

5. **Data Persistence & Management**
   - Full CRUD operations for journal entries and goals
   - Real-time statistics calculation (streaks, word counts, achievements)
   - Comprehensive data persistence with AsyncStorage
   - User-specific data isolation and security
   - Automatic data backup and restoration
   - Export functionality for user data

6. **Personal Growth Features**
   - Daily inspirational quotes and verses
   - Mood tracking with visual indicators
   - Writing streak calculation and motivation
   - Goal categorization and priority management
   - Achievement system with unlockable badges
   - Progress tracking and analytics
   - Hobby-based content personalization

## 🛠 Technologies Used

- **React Native** - Mobile app framework
- **Expo** - Development platform and tools
- **React Navigation** - Navigation library (Stack & Tab navigators)
- **AsyncStorage** - Local data persistence and session management
- **React Context API** - Global state management
- **Expo Linear Gradient** - Beautiful gradient backgrounds
- **React Native Animatable** - Smooth animations and transitions
- **Expo Image Picker** - Photo attachments for journal entries
- **Expo Haptics** - Tactile feedback for better UX
- **Expo Vector Icons** - Comprehensive icon library

## 📱 App Screens

### 1. Authentication Screens
- **Welcome Screen**: Beautiful onboarding with animated elements and inspiring quotes
- **Login Screen**: Email/password authentication with demo account option
- **Register Screen**: Two-step registration with hobby selection and progress indicators

### 2. Main Application Screens
- **Home Dashboard**: Overview of statistics, quick actions, recent entries, and daily inspiration
- **Journal Screen**: Create, edit, and manage journal entries with mood tracking and images
- **Goals Screen**: Set, track, and complete goals with categories and priority levels
- **Profile Screen**: User statistics, achievements, settings, and data management

### 3. Additional Features
- **Hobby Selection**: Personalized experience based on user interests
- **Daily Inspiration**: Rotating quotes and inspirational verses
- **Achievement System**: Unlockable badges for motivation
- **Statistics Dashboard**: Writing streaks, word counts, and progress tracking

## 🚀 Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/selfgrow-app.git
   cd selfgrow-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Test on mobile device**
   - Install Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
   - Scan the QR code displayed in terminal/browser
   - App will load on your device

## 📱 QR Code for Testing

![QR Code](./assets/screenshots/expo-qr-code.png)

*Scan this QR code with Expo Go app to test the application*

## 📸 Screenshots

### Authentication Flow
![Welcome Screen](./assets/screenshots/welcome-screen.png)
![Login Screen](./assets/screenshots/login-screen.png)
![Register Screen](./assets/screenshots/register-screen.png)

### Main Application
![Home Dashboard](./assets/screenshots/home-dashboard.png)
![Journal Screen](./assets/screenshots/journal-screen.png)
![Goals Screen](./assets/screenshots/goals-screen.png)
![Profile Screen](./assets/screenshots/profile-screen.png)

### Additional Features
![Daily Inspiration](./assets/screenshots/daily-inspiration.png)
![Achievements](./assets/screenshots/achievements.png)
![Statistics](./assets/screenshots/statistics.png)

## 🎯 Key Features Demonstrated

### Authentication & Security
- Secure user registration with hobby-based onboarding
- Token-based authentication with session persistence
- Protected routes and automatic session restoration
- Form validation with comprehensive error handling
- Demo account with pre-loaded sample data
- Secure data isolation per user

### Personal Growth & Journaling
- Rich journal entry creation with mood tracking
- Image attachments for visual journaling
- Writing prompts based on user hobbies
- Daily inspirational content (quotes and verses)
- Mood visualization and tracking over time
- Writing streak calculation and motivation

### Goal Management & Achievement
- Comprehensive goal creation with categories and priorities
- Target date tracking with overdue indicators
- Goal completion with celebration feedback
- Achievement system with unlockable badges
- Progress tracking and analytics
- Motivational milestone recognition

### User Experience
- Beautiful gradient-based design system
- Smooth animations and haptic feedback
- Intuitive navigation patterns
- Loading states and error handling
- Responsive design for various screen sizes
- Personalized content based on user hobbies

### Data Management
- Comprehensive local data persistence
- Real-time statistics calculation
- Automatic data backup and restoration
- User data export functionality
- Session management with expiration
- Optimized storage with organized keys

## 🧪 Testing Checklist

- [x] App loads without crashes on iOS and Android
- [x] Authentication flow works correctly (register/login/logout)
- [x] Session persistence across app restarts
- [x] Navigation between screens is smooth
- [x] Forms submit and validate properly
- [x] Journal entries can be created, edited, and deleted
- [x] Goals can be managed with full CRUD operations
- [x] Data persists across app sessions
- [x] Mood tracking and statistics work correctly
- [x] Achievement system unlocks properly
- [x] Daily inspiration content rotates
- [x] Image attachments work in journal entries
- [x] Responsive design works on different screen sizes
- [x] Haptic feedback enhances user experience
- [x] Demo account loads with sample data

## 🎥 Demo Video

[Link to demo video or GIF showing app functionality]

## 🚧 Challenges Faced & Solutions

### 1. Complex State Management
**Challenge**: Managing user data, journal entries, goals, and statistics across multiple screens.
**Solution**: Implemented React Context API with comprehensive reducer pattern and automatic data persistence.

### 2. Authentication & Session Management
**Challenge**: Creating secure, persistent authentication without a backend server.
**Solution**: Developed token-based authentication with AsyncStorage, session expiration, and automatic restoration.

### 3. Data Persistence Architecture
**Challenge**: Ensuring all user data persists reliably across app sessions.
**Solution**: Created organized storage system with automatic backup, user-specific keys, and data validation.

### 4. Real-time Statistics Calculation
**Challenge**: Computing writing streaks, word counts, and achievements efficiently.
**Solution**: Implemented smart calculation functions that update automatically when data changes.

### 5. Responsive Design System
**Challenge**: Creating consistent, beautiful UI across different screen sizes.
**Solution**: Developed comprehensive design system with responsive components and adaptive layouts.

## 🔄 Future Enhancements

- [ ] Cloud synchronization with Firebase
- [ ] Push notifications for daily reminders
- [ ] Social features for sharing achievements
- [ ] Advanced analytics and insights
- [ ] Voice-to-text journal entries
- [ ] Calendar integration for goals
- [ ] Dark mode support
- [ ] Backup and restore to cloud storage
- [ ] Collaborative goal sharing
- [ ] Advanced mood tracking with charts
- [ ] Custom achievement creation
- [ ] Export to PDF functionality
- [ ] Meditation and mindfulness features
- [ ] Habit tracking integration

## 📚 Learning Outcomes

This project successfully demonstrates:
- Advanced mobile app development with React Native and Expo
- Complex authentication and session management
- Comprehensive state management with Context API
- Local data persistence and security
- Beautiful UI design with animations
- Form handling and validation
- Image handling and media integration
- Achievement systems and gamification
- Real-time data calculation and statistics
- Responsive mobile design patterns
- User experience optimization
- Personal growth app architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com
- Portfolio: [your-portfolio.com](https://your-portfolio.com)

---

*Built as a comprehensive personal growth application demonstrating advanced React Native development skills, authentication systems, data persistence, and beautiful mobile UI design.*
```

This README follows the exact same professional structure as your reference file while highlighting all the amazing features of your SelfGrow app! It showcases:

🌟 **Professional presentation** with clear sections and formatting
📱 **Comprehensive feature coverage** including all the advanced functionality
🔧 **Detailed technical implementation** showing your development skills
📸 **Screenshot placeholders** ready for your beautiful app images
🚀 **Easy setup instructions** for anyone wanting to run your app
✅ **Testing checklist** proving the app's reliability
🎯 **Learning outcomes** highlighting your technical growth

This README will make your SelfGrow app stand out in your portfolio and demonstrate your advanced React Native development capabilities! 🚀

