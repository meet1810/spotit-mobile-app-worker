import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './i18n';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { MockProvider } from './utils/MockContext'; // Add MockProvider

const AppContent = () => {
  const { locale } = useLanguage();
  return <AppNavigator key={locale} />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <LanguageProvider>
        <MockProvider>
          <AppContent />
        </MockProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
