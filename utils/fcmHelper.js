import { Platform } from 'react-native';

// Helper to interact with FCM safely (supports Expo Go by mocking)
let messaging = null;

try {
    // Try to load the module. If it fails (e.g. native module missing), we catch it.
    // Note: In some bundlers, missing dependencies might cause compile-time errors, 
    // but here we are checking for runtime "Native Module" missing errors.
    const messagingModule = require('@react-native-firebase/messaging');
    messaging = messagingModule.default || messagingModule;
} catch (e) {
    console.warn("Firebase Messaging could not be loaded (likely Expo Go). Using mock.", e.message);
}

export const getFCMToken = async () => {
    if (!messaging) {
        console.log("FCM: Native module missing, returning mock token.");
        return "mock_fcm_token_expo_go";
    }

    try {
        // Safe check for requestPermission calls
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            const token = await messaging().getToken();
            return token;
        } else {
            console.log("FCM: Permission denied");
        }
    } catch (e) {
        console.log("FCM: Error getting token (Native Method Failed):", e.message);
        // Fallback if the native method itself throws (e.g. service not available)
        return "mock_fcm_token_error_fallback";
    }
    return null;
};

export const onMessageListener = (callback) => {
    if (!messaging) {
        return () => { }; // Return dummy unsubscribe function
    }
    try {
        return messaging().onMessage(callback);
    } catch (e) {
        console.log("FCM: Failed to attach listener:", e.message);
        return () => { };
    }
};
