import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { BACDataProvider } from '@/contexts/BACDataContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BACDataProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="results" />
          </Stack>
        </BACDataProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}