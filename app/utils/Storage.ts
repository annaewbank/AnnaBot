import { MMKV } from 'react-native-mmkv';

export const Storage = new MMKV({
  id: 'com.annabot.app',
});

/*
Examples:
const userStorage = new MMKV({ id: `user-${userId}-storage` })
const globalStorage = new MMKV({ id: 'global-app-storage' })
*/
