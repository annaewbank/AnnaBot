import { Message, Role } from '@/app/utils/Interfaces';
import { View, Text, StyleSheet, Image } from 'react-native';

const ChatMessage = ({ content, role, imageUrl, prompt }: Message) => {
  return (
    <View style={styles.row}>
      {role === Role.Bot ? (
        <View style={[styles.logoContainer, { backgroundColor: '#000' }]}>
          <Image
            source={require('@/assets/images/logo-white.png')}
            style={styles.logo}
          />
        </View>
      ) : (
        <Image
          source={{
            uri: 'https://global.discourse-cdn.com/business6/uploads/zoomdeveloper/original/3X/b/3/b383df5a391544eba871146584fe42a3c0d08489.png',
          }}
          style={styles.avatar}
        />
      )}
      <Text style={styles.text}>{content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    gap: 14,
    marginVertical: 12,
  },
  logoContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    margin: 6,
    width: 16,
    height: 16,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  text: {
    padding: 4,
    fontSize: 16,
    flexWrap: 'wrap',
    flex: 1,
  },
});

export default ChatMessage;
