import { defaultStyles } from '@/constants/Styles';
import { useAuth } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import { View, Button } from 'react-native';

// Everything inside (auth) is protected by Clerk
// Check occurs in root _layout.tsx useEffect

const Page = () => {
  const { signOut } = useAuth();

  return (
    <View style={defaultStyles.pageContainer}>
      {/* Change header on page instead of on layout */}
      <Stack.Screen options={{ title: 'Chat' }} />
      <Button title="Sign out" onPress={() => signOut()} />
    </View>
  );
};

export default Page;
