import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeAccessToken = async token => {
  try {
    console.log('Storing token:', token); // Eklendi: Token değerini kontrol etmek için
    await AsyncStorage.setItem('accessToken', token);
    console.log('Token stored successfully');
  } catch (error) {
    console.error('Error storing access token:', error);
  }
};

export const getAccessToken = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    console.log('Retrieved token:', token); // Eklendi: Alınan token değerini kontrol etmek için
    return token;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

export const removeAccessToken = async () => {
  try {
    await AsyncStorage.removeItem('accessToken');
    console.log('Token removed successfully'); // Eklendi: Token'ın silindiğini doğrulamak için
  } catch (error) {
    console.error('Error removing access token:', error);
  }
};
