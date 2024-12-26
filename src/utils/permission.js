import {Alert, Linking, Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

/**
 * Handles location permissions for Android.
 * @returns {Promise<boolean>} True if permissions are granted, false otherwise.
 */
export async function handleLocationPermissions() {
  try {
    if (Platform.OS !== 'android') {
      console.warn('This function is designed for Android only.');
      return false;
    }

    // Check the current permission status
    const status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

    if (status === RESULTS.GRANTED) {
      console.log('Location permission already granted.');
      return true;
    }

    if (status === RESULTS.DENIED) {
      console.log('Requesting location permission...');
      const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      if (result === RESULTS.GRANTED) {
        console.log('Location permission granted.');
        return true;
      } else {
        console.warn('Location permission denied.');
        return false;
      }
    }

    if (status === RESULTS.BLOCKED) {
      askToOpenSettings();
      return false;
    }

    console.warn('Location permission status: ', status);
    return false;
  } catch (error) {
    console.error('Error handling location permissions:', error);
    return false;
  }
}

export const askToOpenSettings = () => {
  Alert.alert(
    'Konum İzni Gerekli',
    'Uygulamanın konum bilgilerine erişebilmesi için ayarlara gitmek ister misiniz?',
    [
      {
        text: 'Hayır',
        style: 'cancel',
      },
      {
        text: 'Evet',
        onPress: () =>
          Linking.openSettings().then(() => console.log('Settings opened')),
      },
    ],
  );
};
