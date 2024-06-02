import { Message, Role } from '@/app/utils/Interfaces';
import HeaderDropDown from '@/components/HeaderDropDown';
import MessageInput from '@/components/MessageInput';
import { defaultStyles } from '@/constants/Styles';
import { Redirect, Stack } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  Text,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import ChatMessage from '@/components/ChatMessage';
import { useMMKVString } from 'react-native-mmkv';
import { Storage } from '@/app/utils/Storage';
import OpenAI from 'react-native-openai';
import Colors from '@/constants/Colors';

const dummyMessages = [
  {
    role: Role.Bot,
    content: '',
    imageUrl: 'https://galaxies.dev/img/meerkat_2.jpg',
    prompt:
      'A meerkat astronaut in a futuristic spacesuit, standing upright on a rocky, alien landscape resembling the surface of Mars. The spacesuit is highly detailed with reflective visor and intricate life-support systems. The background shows a distant starry sky and a small Earth visible in the far horizon. The meerkat looks curious and brave, embodying the spirit of exploration.',
  },
];

const Page = () => {
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [working, setWorking] = useState<boolean>(false);

  // MMKV / API Check Start
  const [key, setKey] = useMMKVString('apiKey', Storage);
  const [organization, setOrganization] = useMMKVString('org', Storage);

  if (!key || key === '' || !organization || organization === '') {
    return <Redirect href={'/(auth)/(modal)/settings'} />;
  }
  // MMKV / API Check End

  // OpenAI Start
  const openAI = useMemo(() => new OpenAI({ apiKey: key, organization }), []);

  const getCompletion = async (message: string) => {
    setWorking(true);

    // Add user message to chat
    setMessages([...messages, { content: message, role: Role.User }]);

    const result = await openAI.image.create({
      prompt: message,
    });

    if (result.data && result.data.length > 0) {
      const imageUrl = result.data[0].url;
      setMessages((prev) => [
        ...prev,
        { role: Role.Bot, content: '', imageUrl, prompt: message },
      ]);
    }

    setWorking(false);
  };
  // OpenAI End

  return (
    <View style={defaultStyles.pageContainer}>
      {/* Change header on page instead of on layout */}
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderDropDown
              title="ANNA·E"
              onSelect={() => {}}
              items={[
                {
                  key: 'share',
                  title: 'Share Bot',
                  icon: 'square.and.arrow.up',
                },
                { key: 'details', title: 'See Details', icon: 'info.circle' },
                { key: 'keep', title: 'Keep in Sidebar', icon: 'pin' },
              ]}
            />
          ),
        }}
      />

      <View style={{ flex: 1 }}>
        {messages.length === 0 && (
          <View style={[{ marginTop: 100, alignItems: 'center', gap: 16 }]}>
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/dalle.png')}
                style={styles.image}
              />
            </View>
            <Text style={styles.label}>
              Let me turn your imagination into imagery.
            </Text>
          </View>
        )}
        <FlashList
          data={messages}
          renderItem={({ item }) => <ChatMessage {...item} />}
          estimatedItemSize={400}
          contentContainerStyle={{ paddingTop: 30, paddingBottom: 150 }}
          keyboardDismissMode="on-drag"
          // Whilst loading, show a loading indicator:
          ListFooterComponent={
            <>
              {working && (
                <ChatMessage
                  {...{ role: Role.Bot, content: '', loading: true }}
                />
              )}
            </>
          }
        />
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

const styles = StyleSheet.create({
  logoContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    backgroundColor: '#000',
    overflow: 'hidden',
    borderRadius: 40,
  },
  image: {
    resizeMode: 'cover',
  },
  page: {
    flex: 1,
  },
  label: {
    color: Colors.grey,
    fontSize: 16,
  },
});

export default Page;
