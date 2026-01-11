# Spot-It Workers

**Spot-It Workers** is a mobile application built with React Native and Expo, designed to facilitate task management and execution for field workers. It allows users to view assigned tasks, navigate to locations, document work with photos, and manage their profiles.

## 🚀 Features

*   **Authentication**: Secure login flow for workers.
*   **Task Management**:
    *   View list of available and assigned tasks.
    *   Detailed task views with requirements.
    *   Onboarding for new tasks.
*   **Work Execution**:
    *   Start and track work progress.
    *   **Camera Integration**: Capture evidence of work completion.
    *   **Location Services**: Verify location during task execution.
    *   **Maps**: Visualise task locations.
*   **Profile Management**: View and manage worker profile details.
*   **Real-time Notifications**: Integrated with Firebase Cloud Messaging (FCM) for updates.
*   **Multi-language Support**: Built-in localization support.
*   **Offline/Mock Mode**: Development support with mock data.

## 🛠 Tech Stack

*   **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
*   **Navigation**: [React Navigation](https://reactnavigation.org/) (Stack & Bottom Tabs)
*   **State Management**: React Context API
*   **Networking**: [Axios](https://axios-http.com/)
*   **Firebase**: @react-native-firebase/app, @react-native-firebase/messaging
*   **UI/UX**:
    *   lottie-react-native (Animations)
    *   react-native-vector-icons
    *   react-native-safe-area-context
*   **Device Features**:
    *   expo-camera
    *   expo-location
    *   react-native-maps

## 📂 Project Structure

```
spotit-mobile-app-worker/
├── assets/          # Images, fonts, and other static assets
├── components/      # Reusable UI components
├── constants/       # App-wide constants (colors, layouts, etc.)
├── i18n/            # Localization files and configuration
├── navigation/      # Navigation navigators and setup
├── screens/         # Application screens (Login, Home, TaskDetail, etc.)
├── services/        # API services and business logic
├── styles/          # Global styles and themes
├── utils/           # Utility functions and helpers (MockContext, etc.)
├── App.js           # Main application entry point
├── app.json         # Expo configuration
└── package.json     # Dependencies and scripts
```

## ⚡ Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (LTS recommended)
*   [Expo Go](https://expo.dev/client) app on your mobile device (or Android Studio/Xcode for emulators).

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd spotit-mobile-app-worker
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run start
    # or
    npx expo start
    ```

### Running the App

*   **Android**: Press `a` in the terminal or run `npm run android`
*   **iOS**: Press `i` in the terminal or run `npm run ios` (Requires macOS)
*   **Web**: Press `w` in the terminal or run `npm run web`

## 📱 Scripts

*   `npm start`: Starts the Expo development server.
*   `npm run android`: Opens the app on a connected Android device or emulator.
*   `npm run ios`: Opens the app in an iOS simulator.
*   `npm run web`: Opens the app in a web browser.

## 🤝 Contributing

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
