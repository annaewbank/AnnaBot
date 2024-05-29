import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

// Create animated component
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

// Define prop types:
export type MessageInputProps = {
  onShouldSendMessage: (message: string) => void;
};

const MessageInput = ({ onShouldSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const { bottom } = useSafeAreaInsets();

  const onSend = () => {
    onShouldSendMessage(message);
    setMessage('');
  };

  // Animation
  const expanded = useSharedValue(0);
  const expandItems = () => {};
  const collapseItems = () => {};

  return (
    <BlurView
      intensity={70}
      tint="extraLight"
      style={{ paddingBottom: bottom, paddingTop: 10 }}
    >
      <View style={styles.row}>
        <AnimatedTouchableOpacity onPress={expandItems} style={styles.roundBtn}>
          <Ionicons name="add" size={24} color={Colors.grey} />
        </AnimatedTouchableOpacity>

        <TextInput
          placeholder="Ask me a question..."
          value={message}
          onChangeText={setMessage}
          onFocus={collapseItems}
          style={styles.messageInput}
          autoFocus
          multiline
        />

        {message.length > 0 ? (
          <TouchableOpacity onPress={onSend}>
            <Ionicons
              name="arrow-up-circle-outline"
              size={24}
              color={Colors.grey}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <FontAwesome5 name="headphones-alt" size={24} color={Colors.grey} />
          </TouchableOpacity>
        )}
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  roundBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageInput: {
    flex: 1,
    marginHorizontal: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    padding: 10,
    borderColor: Colors.grey,
    backgroundColor: Colors.light,
  },
});

export default MessageInput;
