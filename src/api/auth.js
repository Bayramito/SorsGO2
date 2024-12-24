import axios from 'axios';

const BASE_URL = 'https://www2.sors.com.tr/API';

export const login = async (username, password) => {
  try {
    console.log('Sending login request with:', {username, password}); // Eklendi: Gönderilen verileri kontrol etmek için
    const response = await axios.post(`${BASE_URL}/user/validateOtp/`, {
      username,
      password,
    });
    console.log('Login response:', response.data); // Eklendi: API'den dönen yanıtı görmek için
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
