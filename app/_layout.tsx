import '@/i18n';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { KeyboardAvoidingView, Platform } from 'react-native';

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inTabsGroup = segments[0] === '(tabs)';

    if (session && !inTabsGroup) {
      router.navigate('/(tabs)/group/list');
    } else if (!session) {
      router.replace('/login');
    }
  }, [session, loading, segments, router]);

  if (!loading) {
    SplashScreen.hideAsync();
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <AuthProvider>
        <ToastProvider>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // tránh đè header
          >
            <InitialLayout />
          </KeyboardAvoidingView>
        </ToastProvider>
      </AuthProvider>
      <StatusBar style="auto" />
    </ApplicationProvider>
  );
}

// https://dribbble.com/shots/23269099-Splitter-Split-Bill-Mobile-App
