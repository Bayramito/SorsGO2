import {Provider} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import App from '../../../App';
import Loader from '../../components/global/Loader';
import {
  createStores,
  destroyStores,
  initializeStores,
} from '../../stores/ConfigureStores';
const stores = createStores();
const Root = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    initializeStores().then(() => {
      setReady(true);
    });

    return () => {
      destroyStores();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <Provider {...stores}>{ready ? <App /> : <Loader />}</Provider>
    </SafeAreaProvider>
  );
};

export default Root;
