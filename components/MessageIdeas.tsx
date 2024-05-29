import Colors from '@/constants/Colors';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const PredefinedMessages = [
  { title: 'Explain React Native', text: "like I'm five years old" },
  {
    title: 'Tell me a joke',
    text: 'about cheese',
  },
  { title: 'Recommend a dish', text: "to impress a date who's a fussy eater" },
];

type Props = {
  onSelectCard: (message: string) => void;
};

const MessageIdeas = ({ onSelectCard }: Props) => {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          gap: 16,
        }}
      >
        {PredefinedMessages.map((message, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onSelectCard(`${message.title} ${message.text}`)}
            style={styles.card}
          >
            <Text style={{ fontSize: 16, fontWeight: '600' }}>
              {message.title}
            </Text>
            <Text style={{ fontSize: 14, color: Colors.grey }}>
              {message.text}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.input,
    padding: 14,
    borderRadius: 10,
  },
});

export default MessageIdeas;
