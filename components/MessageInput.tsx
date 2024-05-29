import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

// Create animated component
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

// Define prop types:
export type MessageInputProps = {
  onShouldSend: (message: string) => void;
};

const MessageInput = ({ onShouldSend }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const { bottom } = useSafeAreaInsets();

  // Buttons animation start
  const expanded = useSharedValue(0);

  const expandItems = () => {
    expanded.value = withTiming(1, { duration: 400 });
  };

  const collapseItems = () => {
    expanded.value = withTiming(0, { duration: 400 });
  };

  const expandBtnsStyle = useAnimatedStyle(() => {
    // Interpolate maps the values from input range to the output range
    // If btns are expanded (expanded.value = 1), + btn opacity is 0
    // If btns are collapsed (expanded.value = 0), + btn opacity is 1
    // Extrapolation.CLAMP prevents values from going below 0 or above 1
    const opacityInterpolation = interpolate(
      expanded.value,
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP
    );
    const widthInterpolation = interpolate(
      expanded.value,
      [0, 1],
      [30, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity: opacityInterpolation,
      width: widthInterpolation,
    };
  });

  const expandedBtnsStyle = useAnimatedStyle(() => {
    const widthInterpolation = interpolate(
      expanded.value,
      [0, 1],
      [0, 100],
      Extrapolation.CLAMP
    );
    return {
      width: widthInterpolation,
      opacity: expanded.value,
    };
  });
  // Buttons animation end

  // Collapse buttons as well as reset state
  const onChangeText = (text: string) => {
    collapseItems();
    setMessage(text);
  };

  const onSend = () => {
    onShouldSend(message);
    setMessage('');
  };

  return (
    <BlurView
      intensity={90}
      tint="extraLight"
      style={{ paddingBottom: bottom, paddingTop: 10 }}
    >
      <View style={styles.row}>
        {/* Expand button */}
        <AnimatedTouchableOpacity
          onPress={expandItems}
          style={[styles.roundBtn, expandBtnsStyle]}
        >
          <Ionicons name="add" size={24} color={Colors.grey} />
        </AnimatedTouchableOpacity>

        {/* Camera, library and document buttons - non-functional  */}
        <Animated.View style={[styles.btnView, expandedBtnsStyle]}>
          <TouchableOpacity onPress={() => ImagePicker.launchCameraAsync()}>
            <Ionicons name="camera-outline" size={24} color={Colors.grey} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => ImagePicker.launchImageLibraryAsync()}
          >
            <Ionicons name="image-outline" size={24} color={Colors.grey} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => DocumentPicker.getDocumentAsync()}>
            <Ionicons name="folder-outline" size={24} color={Colors.grey} />
          </TouchableOpacity>
        </Animated.View>

        {/* Message input */}
        <TextInput
          placeholder="Ask me a question..."
          value={message}
          onChangeText={onChangeText}
          onFocus={collapseItems}
          style={styles.messageInput}
          autoFocus
          multiline
        />

        {/* Headphones or send button */}
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
  btnView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

export default MessageInput;
