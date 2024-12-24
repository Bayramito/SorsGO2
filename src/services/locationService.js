import {Alert, Platform} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {getAccessToken} from '../utils/storage';

const API_URL = 'https://www2.sors.com.tr/API/livelocation'; // Bu API'nin var olup olmadığını ve doğru çalıştığını kontrol edin.

let lastLocation = null;

export const startLocationTracking = async () => {
  try {
    // Konum izni kontrolü
    const permissionStatus = await check(
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );

    if (permissionStatus !== RESULTS.GRANTED) {
      const requestStatus = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      if (requestStatus !== RESULTS.GRANTED) {
        Alert.alert(
          'Konum İzni Gerekli',
          'Uygulamanın çalışması için konum izni vermelisiniz.',
        );
        return;
      }
    }

    // Arka plan konum izni kontrolü (Android 10 ve üzeri için)
    if (Platform.OS === 'android' && Platform.Version >= 29) {
      const backgroundPermissionStatus = await check(
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      );

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
  } catch (error) {
    console.warn(err);
  }
};

// API'ye konum bilgisini göndermek için ayrı bir fonksiyon (opsiyonel)
const sendLocationToApi = async (lat, lng, speed) => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat,
        lng,
        speed,
      }),
    });

    if (!response.ok) {
      throw new Error('Konum bilgisi gönderilemedi.');
    }

    const data = await response.json();
    console.log('Konum bilgisi gönderildi:', data);
  } catch (error) {
    console.error('Konum bilgisi gönderme hatası:', error);
  }
};
