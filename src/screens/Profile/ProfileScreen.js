import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getProfile} from '../../api/user';

const ProfileScreen = () => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProfile();
        if (data.success) {
          setProfileData(data.data);
        } else {
          console.error('Profile data fetch failed:', data.message);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="account-circle" size={80} color="#888" />
        <Text style={styles.headerText}>
          {profileData ? profileData.user : 'Loading...'}
        </Text>
      </View>
      {profileData && (
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Icon
              name="person"
              size={24}
              color="#888"
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              Kullanıcı Adı: {profileData.username}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon
              name="fingerprint"
              size={24}
              color="#888"
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>Muf ID: {profileData.mufid}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon
              name="verified-user"
              size={24}
              color="#888"
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>KID: {profileData.kid}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  infoContainer: {},
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
  },
});

export default ProfileScreen;
