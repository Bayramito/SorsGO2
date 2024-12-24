import React, {useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getDashboard} from '../../api/user';
import {removeAccessToken} from '../../utils/storage';

const DashboardScreen = ({navigation}) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboard();
        if (data.success) {
          setDashboardData(data.data);
        } else {
          console.error('Dashboard data fetch failed:', data.message);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await removeAccessToken();
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuIcon}>
          <Icon name="menu" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          Hoş Geldiniz, {dashboardData ? dashboardData.user : ''}
        </Text>
      </View>

      {/* Menü İçeriği */}
      {isMenuOpen && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.menuItem}>Profil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AssignmentList')}>
            <Text style={styles.menuItem}>Atamalar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={[styles.menuItem, styles.logoutButton]}>Çıkış</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Dashboard İçeriği */}
      {dashboardData && (
        <View style={styles.cardContainer}>
          <View style={[styles.card, {backgroundColor: '#FFC107'}]}>
            <Icon name="assignment" size={40} color="#fff" />
            <Text style={styles.cardText}>
              Atanan Dosya: {dashboardData.assignedfile}
            </Text>
          </View>
          <View style={[styles.card, {backgroundColor: '#4CAF50'}]}>
            <Icon name="assignment-turned-in" size={40} color="#fff" />
            <Text style={styles.cardText}>
              Hazır Dosya: {dashboardData.readytogofile}
            </Text>
          </View>
          <View style={[styles.card, {backgroundColor: '#F44336'}]}>
            <Icon name="assignment-late" size={40} color="#fff" />
            <Text style={styles.cardText}>
              Bugün Kapanan: {dashboardData.closedfiletoday}
            </Text>
          </View>
          <View style={[styles.card, {backgroundColor: '#2196F3'}]}>
            <Icon name="assignment-turned-in" size={40} color="#fff" />
            <Text style={styles.cardText}>
              Bu Periyod Kapanan: {dashboardData.closedfilethisperiod}
            </Text>
          </View>
          <View style={[styles.card, {backgroundColor: '#9C27B0'}]}>
            <Icon name="assignment-turned-in" size={40} color="#fff" />
            <Text style={styles.cardText}>
              Geçen Periyod Kapanan: {dashboardData.closedfilelastperiod}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  menuIcon: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    padding: 20,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cardText: {
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
  },
  menu: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
  },
  menuItem: {
    paddingVertical: 8,
    fontSize: 16,
  },
  logoutButton: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
