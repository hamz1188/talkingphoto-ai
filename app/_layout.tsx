import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { storage, StorageKeys } from '@/lib/storage';
import { analytics, AnalyticsEvents } from '@/lib/analytics';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { Paywall } from '@/components/Paywall';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [isReady, setIsReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Initialize analytics and check onboarding state
  useEffect(() => {
    const init = async () => {
      // Initialize analytics
      await analytics.init();

      // Check if onboarding has been completed
      const onboardingCompleted = await storage.get<boolean>(
        StorageKeys.ONBOARDING_COMPLETED
      );
      setShowOnboarding(!onboardingCompleted);
      setIsReady(true);
    };

    init();
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && isReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isReady]);

  if (!loaded || !isReady) {
    return null;
  }

  return <RootLayoutNav showOnboarding={showOnboarding} />;
}

function RootLayoutNav({ showOnboarding }: { showOnboarding: boolean }) {
  const colorScheme = useColorScheme();

  // Handle initial navigation based on onboarding state
  useEffect(() => {
    if (showOnboarding) {
      // Small delay to ensure navigation is ready
      const timeout = setTimeout(() => {
        router.replace('/onboarding');
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [showOnboarding]);

  return (
    <SubscriptionProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="onboarding"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
        </Stack>
        <PaywallWrapper />
      </ThemeProvider>
    </SubscriptionProvider>
  );
}

// Separate component to use the subscription context
function PaywallWrapper() {
  const { isPaywallVisible, hidePaywall } =
    require('@/contexts/SubscriptionContext').useSubscriptionContext();

  return (
    <Paywall
      visible={isPaywallVisible}
      onClose={hidePaywall}
    />
  );
}
