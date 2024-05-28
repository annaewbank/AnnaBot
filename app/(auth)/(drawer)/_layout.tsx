import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Text,
} from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { Link, useNavigation } from 'expo-router';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { DrawerActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { TextInput } from 'react-native-gesture-handler';

// This file defines the drawer content

// Function to enable to addition of custom drawer items
// New drawer items: search bar and user/settings
export const CustomDrawerContent = (props: any) => {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, marginTop: top }}>
      {/* Add search bar */}
      <View style={{ backgroundColor: '#fff', paddingBottom: 16 }}>
        <View style={styles.searchSection}>
          <Ionicons
            name="search"
            size={20}
            color={Colors.greyLight}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search"
            underlineColorAndroid={'transparent'}
            style={styles.input}
          />
        </View>
      </View>

      {/* Reshow original drawer content (AnnaBot, DALL·E, Explore GPTs) */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Add user/settings */}
      <View style={{ padding: 16, paddingBottom: bottom }}>
        <Link href={'/(auth)/(modal)/settings'} asChild>
          <TouchableOpacity style={styles.footer}>
            <Image
              source={{
                uri: 'https://global.discourse-cdn.com/business6/uploads/zoomdeveloper/original/3X/b/3/b383df5a391544eba871146584fe42a3c0d08489.png',
              }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>User Name</Text>
            <Ionicons
              name="ellipsis-horizontal"
              size={24}
              color={Colors.greyLight}
            />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const Layout = () => {
  // Hook to open the drawer using a custom icon
  const navigation = useNavigation();

  // Hook to calculate window dimensions
  // Used for drawer width
  const dimensions = useWindowDimensions();

  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer)}
            style={{ marginLeft: 16 }}
          >
            <FontAwesome6 name="grip-lines" size={20} color={Colors.grey} />
          </TouchableOpacity>
        ),
        headerShadowVisible: false,
        drawerActiveBackgroundColor: Colors.selected,
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        overlayColor: 'rgba(0, 0, 0, 0.2)',
        drawerItemStyle: { borderRadius: 12 },
        drawerLabelStyle: { marginLeft: -20 },
        drawerStyle: { width: dimensions.width * 0.85 },
      }}
    >
      <Drawer.Screen
        name="(chat)/new"
        getId={() => Math.random().toString()}
        options={{
          title: 'AnnaBot',
          drawerIcon: () => (
            <View style={[styles.item, { backgroundColor: '#000' }]}>
              <Image
                source={require('@/assets/images/logo-white.png')}
                style={styles.btnImage}
              />
            </View>
          ),
          headerRight: () => (
            <Link href={'/(auth)/(drawer)/(chat)/new'} push asChild>
              <TouchableOpacity>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors.grey}
                  style={{ marginRight: 16 }}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />

      <Drawer.Screen
        name="dalle"
        options={{
          title: 'DALL·E',
          drawerIcon: () => (
            <View style={[styles.item, { backgroundColor: '#000' }]}>
              <Image
                source={require('@/assets/images/dalle.png')}
                style={styles.dallEImage}
              />
            </View>
          ),
        }}
      />

      <Drawer.Screen
        name="explore"
        options={{
          title: 'Explore GPTs',
          drawerIcon: () => (
            <View
              style={[
                styles.item,
                {
                  backgroundColor: '#fff',
                  width: 28,
                  height: 28,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              <Ionicons name="apps-outline" size={18} color="#000" />
            </View>
          ),
        }}
      />
    </Drawer>
  );
};

const styles = StyleSheet.create({
  item: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  btnImage: {
    margin: 6,
    width: 16,
    height: 16,
  },
  dallEImage: {
    width: 28,
    height: 28,
    resizeMode: 'cover',
  },
  searchSection: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.input,
    borderRadius: 10,
    height: 34,
  },
  searchIcon: { padding: 6 },
  input: {
    flex: 1,
    color: '#424242',
    paddingRight: 8,
  },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 10 },
  userName: { flex: 1, fontSize: 16, fontWeight: '600' },
});

export default Layout;
