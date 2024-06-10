import { Message, Role } from '@/app/utils/Interfaces';
import HeaderDropDown from '@/components/HeaderDropDown';
import MessageIdeas from '@/components/MessageIdeas';
import MessageInput from '@/components/MessageInput';
import { defaultStyles } from '@/constants/Styles';
import { Redirect, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import ChatMessage from '@/components/ChatMessage';
import { useMMKVString } from 'react-native-mmkv';
import { Storage } from '@/app/utils/Storage';
import OpenAI from 'react-native-openai';
import { useSQLiteContext } from 'expo-sqlite';
import { addChat, addMessage, getMessages } from '@/app/utils/Database';

// Everything inside (auth) is protected by Clerk
// Check occurs in root _layout.tsx useEffect

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  // MMKV / API Check Start
  const [key, setKey] = useMMKVString('apiKey', Storage);
  const [organization, setOrganization] = useMMKVString('org', Storage);
  const [botVersion, setBotVersion] = useMMKVString('botVersion', Storage);

  // Get the database
  const db = useSQLiteContext();

  const { id } = useLocalSearchParams<{ id: string }>();

  // Custom setChatID function enable useEffect  to access updated ChatID state
  const [chatID, _setChatID] = useState<string>(id || '');
  const chatIDRef = useRef(chatID);
  function setChatID(id: string) {
    chatIDRef.current = id;
    _setChatID(id);
  }

  if (!key || key === '' || !organization || organization === '') {
    return <Redirect href={'/(auth)/(modal)/settings'} />;
  }

  // MMKV Storage check:
  // const keys = Storage.getAllKeys();
  // keys.forEach((key) => {
  //   const value =
  //     Storage.getString(key) ||
  //     Storage.getBoolean(key) ||
  //     Storage.getNumber(key);
  //   console.log(`Key: ${key}, Value: ${value}`);
  // });
  // MMKV / API Check End

  // Load chat based on ID
  useEffect(() => {
    if (id) {
      getMessages(db, parseInt(id)).then((result) => {
        setMessages(result);
      });
    }
  }, [id]);

  // OpenAI Start
  const openAI = useMemo(() => new OpenAI({ apiKey: key, organization }), []);

  const getCompletion = async (message: string) => {
    if (messages.length === 0) {
      // Create chat and store in DB
      const result = await addChat(db, message);

      const chatID = result.lastInsertRowId;
      setChatID(chatID.toString());

      addMessage(db, chatID, { content: message, role: Role.User });
    }

    // Add user message to chat
    // Add blank bot message to be filled with streaming result
    setMessages([
      ...messages,
      { content: message, role: Role.User },
      { content: '', role: Role.Bot },
    ]);

    openAI.chat.stream({
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      model: botVersion === '4' ? 'gpt-4' : 'gpt-3.5-turbo',
    });
  };

  useEffect(() => {
    const handleMessage = (payload: any) => {
      // Update messages array with bot response:
      setMessages((messages) => {
        const newMessage = payload.choices[0].delta.content;

        // If there is a new message, update empty bot message (last index)
        if (newMessage) {
          messages[messages.length - 1].content += newMessage;
          return [...messages];
        }

        // If end of stream, save to DB
        if (payload.choices[0]?.finishReason) {
          // console.log('End of stream');
          // console.log('Save bot message to: ', chatIDRef.current);
          addMessage(db, parseInt(chatIDRef.current), {
            content: messages[messages.length - 1].content,
            role: Role.Bot,
          });
        }

        return messages;
      });
    };

    // When a message is received, use handleMessage
    openAI.chat.addListener('onChatMessageReceived', handleMessage);

    // Clean-up
    return () => {
      openAI.chat.removeListener('onChatMessageReceived');
    };
  }, [openAI]);
  // OpenAI End

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

export default ChatPage;
