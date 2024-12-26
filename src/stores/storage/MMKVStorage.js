import {configurePersistable} from 'mobx-persist-store';
import {MMKV} from 'react-native-mmkv';

const storage = new MMKV();

configurePersistable({
  storage: {
    setItem: (key, data) => storage.set(key, data),
    getItem: key => storage.getString(key),
    removeItem: key => storage.delete(key),
  },
});

export default storage;
