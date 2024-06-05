import Colors from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import { BlurView } from 'expo-blur';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { downloadAndSaveImage, shareImage } from '@/app/utils/ImageOptions';

const Page = () => {
  const { url, prompt } = useLocalSearchParams<{
    url: string;
    prompt?: string;
  }>();

  const { bottom } = useSafeAreaInsets();

  const onCopyPrompt = () => {
    console.log('Copied prompt');
  };

  return (
    <View style={styles.container}>
      <ImageZoom
        uri={url}
        minScale={0.5}
        maxScale={5}
        minPanPointers={1}
        doubleTapScale={2}
        isSingleTapEnabled
        isDoubleTapEnabled
        style={styles.image}
        resizeMode="contain"
      />

      {/* Bottom bar: */}
      <BlurView
        intensity={95}
        tint="dark"
        style={[styles.blurView, { paddingBottom: bottom }]}
      >
        <View style={styles.row}>
          <TouchableOpacity style={{ alignItems: 'center' }}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color="white"
            />
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center' }}>
            <Ionicons name="brush-outline" size={24} color="white" />
            <Text style={styles.btnText}>Select</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: 'center' }}
            onPress={() => downloadAndSaveImage(url!)}
          >
            <Octicons name="download" size={24} color="white" />
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: 'center' }}
            onPress={() => shareImage(url!)}
          >
            <Octicons name="share" size={24} color="white" />
            <Text style={styles.btnText}>Share</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  blurView: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  btnText: {
    color: '#fff',
    fontSize: 12,
    paddingTop: 6,
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  promptText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonText: {
    color: Colors.grey,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  closeBtn: {
    backgroundColor: Colors.dark,
    borderRadius: 20,
    height: 26,
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Page;
