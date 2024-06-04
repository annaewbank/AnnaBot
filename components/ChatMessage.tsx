import {
  copyImageToClipboard,
  downloadAndSaveImage,
  shareImage,
} from '@/app/utils/ImageOptions';
import { Message, Role } from '@/app/utils/Interfaces';
import Colors from '@/constants/Colors';
import { Link } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import * as ContextMenu from 'zeego/context-menu';

const ChatMessage = ({
  content,
  role,
  imageUrl,
  prompt,
  loading,
}: Message & { loading?: boolean }) => {
  const contextItems = [
    {
      title: 'Copy',
      systemIcon: 'doc.on.doc',
      action: () => {
        copyImageToClipboard(imageUrl!);
      },
    },
    {
      title: 'Save to Photos',
      systemIcon: 'arrow.down.to.line',
      action: () => {
        downloadAndSaveImage(imageUrl!);
      },
    },
    {
      title: 'Share',
      systemIcon: 'square.and.arrow.up',
      action: () => {
        shareImage(imageUrl!);
      },
    },
  ];

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

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      ) : (
        <>
          {content === '' && imageUrl ? (
            <ContextMenu.Root>
              <ContextMenu.Trigger>
                <Link
                  href={`/(auth)/(modal)/${encodeURIComponent(
                    imageUrl
                  )}?prompt=${encodeURIComponent(prompt!)}`}
                  asChild
                >
                  <Pressable>
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.previewImage}
                    />
                  </Pressable>
                </Link>
              </ContextMenu.Trigger>
              <ContextMenu.Content>
                {contextItems.map((item) => (
                  <ContextMenu.Item key={item.title} onSelect={item.action}>
                    <ContextMenu.ItemTitle>{item.title}</ContextMenu.ItemTitle>
                    <ContextMenu.ItemIcon ios={{ name: item.systemIcon }} />
                  </ContextMenu.Item>
                ))}
              </ContextMenu.Content>
            </ContextMenu.Root>
          ) : (
            <Text style={styles.text}>{content}</Text>
          )}
        </>
      )}
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
  loading: {
    marginTop: 5,
    marginLeft: 14,
  },
  previewImage: {
    width: 240,
    height: 240,
    borderRadius: 10,
  },
});

export default ChatMessage;
