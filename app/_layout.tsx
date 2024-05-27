import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const CLERK_PUBLISHABLE_KEY = process.env
  .EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

// Cache the Clerk JWT
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Prevent the splash screen from auto-hiding before assets load
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  // Load custom fonts
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Initialize the Expo router to allow navigation between different pages
  const router = useRouter();

  // Clerk variables to check if the app has loaded and Clerk is ready
  const { isLoaded, isSignedIn } = useAuth();

  // Get the current segments to check if the user is on a specific page
  const segments = useSegments();

  // USE EFFECTS START
  // Throw an error if the fonts fail to load
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Hide the splash screen when the fonts are loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Implement authentication logic
  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    console.log('isSignedIn', isSignedIn);
    console.log('inAuthGroup', inAuthGroup);

    if (isSignedIn && !inAuthGroup) {
      // Bring the user to the auth group
      router.replace('/(auth)/');
    } else if (!isSignedIn && inAuthGroup) {
      // Kick the user out
      router.replace('/');
    }
  });
  // USE EFFECTS END

  // If not loaded, Slot will render the current child route
  if (!loaded || !isLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size={'large'} color="#000" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="login"
        options={{
          presentation: 'modal',
          title: '',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
};

const RootLayoutNav = () => {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <InitialLayout />
      </GestureHandlerRootView>
    </ClerkProvider>
  );
};

export default RootLayoutNav;
