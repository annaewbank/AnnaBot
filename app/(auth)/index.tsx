import { useAuth } from '@clerk/clerk-expo';
import { View, Text, Button } from 'react-native';

// Everything inside (auth) is protected by Clerk
// Check occurs in root _layout.tsx useEffect

const Page = () => {
  const { signOut } = useAuth();

  return (
    <View>
      <Button title="Sign out" onPress={() => signOut()} />
    </View>
  );
};

export default Page;
