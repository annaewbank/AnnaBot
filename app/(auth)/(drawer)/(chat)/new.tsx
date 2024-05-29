import HeaderDropDown from '@/components/HeaderDropDown';
import MessageInput from '@/components/MessageInput';
import { defaultStyles } from '@/constants/Styles';
import { useAuth } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Button,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

// Everything inside (auth) is protected by Clerk
// Check occurs in root _layout.tsx useEffect

const Page = () => {
  const { signOut } = useAuth();
  const [botVersion, setBotVersion] = useState('3.5');

  const getCompletion = async (message: string) => {
    console.log('Getting completion for: ', message);
  };

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
      <View style={{ flex: 1 }}>
        <Text>DUMMY CONTENT</Text>
        <Button title="Sign out" onPress={() => signOut()} />
        {/* <ScrollView>
          {Array.from({ length: 100 }).map((_, index) => (
            <Text key={index}>{index}</Text>
          ))}
        </ScrollView> */}
      </View>

      <KeyboardAvoidingView
        keyboardVerticalOffset={70}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // styling needed for blur to work correctly
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}
      >
        <MessageInput onShouldSend={getCompletion} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default Page;
