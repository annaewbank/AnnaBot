import Colors from '@/constants/Colors';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import { BlurView } from 'expo-blur';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { downloadAndSaveImage, shareImage } from '@/app/utils/ImageOptions';
import DropDownMenu from '@/components/DropDownMenu';
import Toast from 'react-native-root-toast';
import { RootSiblingParent } from 'react-native-root-siblings';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import * as Clipboard from 'expo-clipboard';
import { useCallback, useMemo, useRef } from 'react';

const Page = () => {
  const { url, prompt } = useLocalSearchParams<{
    url: string;
    prompt?: string;
  }>();

  const { bottom } = useSafeAreaInsets();

  // Bottom sheet modal config:
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%'], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const onCopyPrompt = () => {
    // Copy prompt to clipboard:
    Clipboard.setStringAsync(prompt!);

    // Show toast notification:
    Toast.show('Prompt copied to clipboard', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  };

  return (
    <RootSiblingParent>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <Stack.Screen
            options={{
              headerRight: () => (
                <DropDownMenu
                  items={[
                    { key: 1, title: 'View prompt', icon: 'info.circle' },
                    {
                      key: 2,
                      title: 'Learn more',
                      icon: 'questionmark.circle',
                    },
                  ]}
                  onSelect={handlePresentModalPress}
                />
              ),
            }}
          />

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

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
        >
          <Text>TEST</Text>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </RootSiblingParent>
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
