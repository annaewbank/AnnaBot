import { Message, Role } from '@/app/utils/Interfaces';
import HeaderDropDown from '@/components/HeaderDropDown';
import MessageIdeas from '@/components/MessageIdeas';
import MessageInput from '@/components/MessageInput';
import { defaultStyles } from '@/constants/Styles';
import { Stack } from 'expo-router';
import { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import ChatMessage from '@/components/ChatMessage';

// Everything inside (auth) is protected by Clerk
// Check occurs in root _layout.tsx useEffect

const DUMMY_MESSAGES: Message[] = [
  {
    content: 'Hello, how can I help you today?',
    role: Role.Bot,
  },
  {
    content:
      'I need help with my React Native app. Please can you explain how stack navigation works?',
    role: Role.User,
  },
];

const Page = () => {
  const [botVersion, setBotVersion] = useState('3.5');
  const [messages, setMessages] = useState<Message[]>(DUMMY_MESSAGES);

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
        {messages.length === 0 && (
          <View style={[styles.logoContainer, { marginTop: 100 }]}>
            <Image
              source={require('@/assets/images/logo-white.png')}
              style={styles.logo}
            />
          </View>
        )}
        <FlashList
          data={messages}
          renderItem={({ item }) => <ChatMessage {...item} />}
          estimatedItemSize={400}
          contentContainerStyle={{ paddingTop: 30, paddingBottom: 150 }}
          keyboardDismissMode="on-drag"
        />
      </View>

      <KeyboardAvoidingView
        keyboardVerticalOffset={70}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // styling needed for blur to work correctly
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}
      >
        {messages.length === 0 && <MessageIdeas onSelectCard={getCompletion} />}
        <MessageInput onShouldSend={getCompletion} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#000',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  logo: {
    height: 30,
    width: 30,
    resizeMode: 'cover',
  },
});

export default Page;
