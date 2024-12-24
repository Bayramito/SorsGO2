import React, {useEffect, useState} from 'react';
import AppNavigation from './src/navigation/AppNavigation';
import {startLocationTracking} from './src/services/locationService';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {Alert, AppState, Linking, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [permissionRequested, setPermissionRequested] = useState(false);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const permissionRequested = await AsyncStorage.getItem(
          'locationPermissionRequested',
        );
        if (permissionRequested === 'true') {
          // İzin daha önce istendiyse, tekrar sorma
          startLocationTracking(); // Sadece konum izni gerekiyorsa, doğrudan başlat
          return;
        }

        let permissionStatus = await check(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );

        if (permissionStatus === RESULTS.BLOCKED) {
          Alert.alert(
            'Konum İzni Gerekli',
            'Uygulamanın çalışması için konum izni vermelisiniz. Lütfen ayarlardan izin verin.',
            [
              {text: 'İptal', style: 'cancel'},
              {text: 'Ayarlar', onPress: () => Linking.openSettings()},
            ],
          );
          return;
        }

        if (permissionStatus !== RESULTS.GRANTED) {
          permissionStatus = await request(
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          );
          if (permissionStatus !== RESULTS.GRANTED) {
            Alert.alert(
              'Konum İzni Gerekli',
              'Uygulamanın çalışması için konum izni vermelisiniz.',
            );
            return;
          }
        }

        if (Platform.OS === 'android' && Platform.Version >= 29) {
          const backgroundPermissionStatus = await check(
            PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
          );

          if (backgroundPermissionStatus === RESULTS.BLOCKED) {
            Alert.alert(
              'Arka Plan Konum İzni Gerekli',
              'Uygulamanın arka planda çalışması için konum izni vermelisiniz. Lütfen ayarlardan izin verin.',
              [
                {text: 'İptal', style: 'cancel'},
                {text: 'Ayarlar', onPress: () => Linking.openSettings()},
              ],
            );
            return;
          }
          if (backgroundPermissionStatus !== RESULTS.GRANTED) {
            const requestStatus = await request(
              PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
            );
            if (requestStatus !== RESULTS.GRANTED) {
              Alert.alert(
                'Arka Plan Konum İzni Gerekli',
                'Uygulamanın arka planda çalışması için konum izni vermelisiniz.',
              );
              return;
            }
          }
        }

        // İzinler alındıysa, takip işlemini başlat
        startLocationTracking();
      } catch (err) {
        console.warn(err);
      } finally {
        // İzin istendiğini AsyncStorage'e kaydet
        await AsyncStorage.setItem('locationPermissionRequested', 'true');
      }
    };

    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'active') {
        requestLocationPermission();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    requestLocationPermission();

    return () => subscription.remove();
  }, []);

  return <AppNavigation />;
};
// test
export default App;
