import {configurePersistable} from 'mobx-persist-store';
import {AppRegistry} from 'react-native';
import {MMKV} from 'react-native-mmkv';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import Root from './src/screens/root/Root';

const storage = new MMKV();

configurePersistable({
  storage: {
    setItem: (key, data) => storage.set(key, data),
    getItem: key => storage.getString(key),
    removeItem: key => storage.delete(key),
  },
});

AppRegistry.registerComponent(appName, () => Root);
