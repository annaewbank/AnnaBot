import HeaderDropDown from '@/components/HeaderDropDown';
import { defaultStyles } from '@/constants/Styles';
import { useAuth } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { View, Button } from 'react-native';

// Everything inside (auth) is protected by Clerk
// Check occurs in root _layout.tsx useEffect

const Page = () => {
  const { signOut } = useAuth();
  const [botVersion, setBotVersion] = useState('3.5');

  return (
    <View style={defaultStyles.pageContainer}>
      {/* Change header on page instead of on layout */}
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderDropDown
              title="AnnaBot"
              onSelect={(key) => setBotVersion(key)}
              selected={botVersion}
              items={[
                { key: '3.5', title: 'Bot-3.5', icon: 'bolt' },
                { key: '4', title: 'Bot-4', icon: 'sparkles' },
              ]}
            />
          ),
        }}
      />
      <Button title="Sign out" onPress={() => signOut()} />
    </View>
  );
};

export default Page;
