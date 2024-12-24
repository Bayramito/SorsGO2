import React, {useState} from 'react';
import {
  Alert,
  Button,
  Image,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {login} from '../../api/auth';
import {getAccessToken, storeAccessToken} from '../../utils/storage';
import {registerDevice} from '../../api/user';
import DeviceInfo from 'react-native-device-info';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const data = await login(username, password);
      console.log('Login data:', data); // Eklendi: Gelen data'yı kontrol etmek için
      if (data.success) {
        await storeAccessToken(data.data.accessToken);
        await registerDeviceInfo();
        navigation.replace('Dashboard');
      } else {
        Alert.alert('Hata', data.message || 'Giriş başarısız.');
      }
    } catch (error) {
      console.log('Login Error:', error);
      Alert.alert('Hata', 'Giriş yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const testToken = async () => {
    const storedToken = await getAccessToken();
    console.log('Stored Token:', storedToken);
  };

  const registerDeviceInfo = async () => {
    try {
      const deviceInfo = {
        serialNumber: await DeviceInfo.getSerialNumber(),
        manufacturer: await DeviceInfo.getManufacturer(),
        model: DeviceInfo.getModel(),
        osVersion: DeviceInfo.getSystemVersion(),
        platform: Platform.OS,
        hardware: await DeviceInfo.getHardware(),
        appName: await DeviceInfo.getApplicationName(),
        appVersion: DeviceInfo.getVersion(),
        product: await DeviceInfo.getProduct(),
        totalDiskSpace: await DeviceInfo.getTotalDiskCapacity(),
      };

      await registerDevice(deviceInfo);
      console.log('Cihaz kaydedildi');
    } catch (error) {
      console.error('Error registering device:', error);
      Alert.alert('Hata', 'Cihaz kaydedilemedi.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/sorsgologo.png')}
        style={styles.logo}
      />
      <View style={styles.inputContainer}>
        <Icon name="person" size={24} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Kullanıcı Adı"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={24} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Button title="GİRİŞ YAP" onPress={handleLogin} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
});

export default LoginScreen;
