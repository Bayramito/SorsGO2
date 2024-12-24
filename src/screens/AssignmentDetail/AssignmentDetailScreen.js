import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getAssignmentDetail, saveAssignmentLocation} from '../../api/user';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {getDayName} from '../../utils/helpers';

const AssignmentDetailScreen = ({route, navigation}) => {
  const {assignmentId} = route.params;
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationConfirmed, setLocationConfirmed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAssignmentDetail(assignmentId);
        if (response.success && response.data && response.data.length > 0) {
          setAssignment(response.data[0]); // İlk elemanı al
        } else {
          console.error(
            'Assignment detail fetch failed:',
            response.message || 'Bilinmeyen hata',
          );
          Alert.alert(
            'Hata',
            response.message || 'Detaylar alınırken bir hata oluştu.',
          );
        }
      } catch (error) {
        console.error('Error fetching assignment detail:', error);
        Alert.alert(
          'Hata',
          'Detaylar alınırken bir hata oluştu. Lütfen tekrar deneyin.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assignmentId]);

  const handleConfirmLocation = async () => {
    try {
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

      Geolocation.getCurrentPosition(
        async position => {
          const {latitude, longitude} = position.coords;
          console.log('Current Position:', latitude, longitude);

          // Konumu kaydet
          const response = await saveAssignmentLocation(
            assignmentId,
            latitude,
            longitude,
          );
          if (response.success) {
            Alert.alert('Başarılı', 'Konum kaydedildi.');
            setLocationConfirmed(true); // Konum kaydedildikten sonra state'i güncelle
          } else {
            Alert.alert('Hata', response.message || 'Konum kaydedilemedi.');
          }
        },
        error => {
          console.error('Error getting current position:', error);
          Alert.alert('Hata', 'Mevcut konum alınamadı.');
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (error) {
      console.error('Error handling location confirmation:', error);
      Alert.alert('Hata', 'Konum onayı sırasında bir hata oluştu.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!assignment) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Detay bilgileri yüklenemedi veya bulunamadı.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.columnsContainer}>
        <View style={styles.column}>
          <View
            style={[
              styles.dataContainer,
              {backgroundColor: `#${assignment.fbgcolor}`},
            ]}>
            <Text
              style={
                (styles.label,
                {
                  color: `#${assignment.fcolor}`,
                  fontWeight: 'bold',
                  marginBottom: 5,
                  fontSize: 16,
                })
              }>
              Firma Adı:
            </Text>
            <Text style={[styles.value, {color: `#${assignment.fcolor}`}]}>
              {assignment.firma}
            </Text>
          </View>
          <View
            style={[
              styles.dataContainer,
              {backgroundColor: `#${assignment.dtbgcolor}`},
            ]}>
            <Text
              style={
                (styles.label,
                {
                  color: `#${assignment.dtcolor}`,
                  fontWeight: 'bold',
                  marginBottom: 5,
                  fontSize: 16,
                })
              }>
              Dosya Tipi:
            </Text>
            <Text style={[styles.value, {color: `#${assignment.dtcolor}`}]}>
              {assignment.dosyatip}
            </Text>
          </View>
          <View style={styles.dataContainer}>
            <Text style={styles.label}>Borçlu Adı:</Text>
            <Text style={styles.value}>{assignment.isim}</Text>
          </View>
          <View style={styles.dataContainer}>
            <Text style={styles.label}>TC Numarası:</Text>
            <Text style={styles.value}>{assignment.tcno}</Text>
          </View>
          <View style={styles.dataContainer}>
            <Text style={styles.label}>Baba Adı:</Text>
            <Text style={styles.value}>{assignment.baba}</Text>
          </View>
          <View style={styles.dataContainer}>
            <Text style={styles.label}>Doğum Yeri / Tarihi:</Text>
            <Text style={styles.value}>
              {assignment.dogyer} / {assignment.dogtar}
            </Text>
          </View>
          <View style={styles.dataContainer}>
            <Text style={styles.label}>Dosya Yetkilisi:</Text>
            <Text style={styles.value}>{assignment.ilgili}</Text>
          </View>
        </View>

        <View style={styles.column}>
          <View style={styles.dataContainer}>
            <Text style={styles.label}>Dosya ID:</Text>
            <Text style={styles.value}>{assignment.d_id}</Text>
          </View>
          <View style={styles.dataContainer}>
            <Text style={styles.label}>Portföy Adı:</Text>
            <Text style={styles.value}>{assignment.ana}</Text>
          </View>
          <View style={styles.dataContainer}>
            <Text style={styles.label}>Borçlu Soyadı:</Text>
            <Text style={styles.value}>{assignment.soyisim}</Text>
          </View>
          <View style={styles.dataContainer}>
            <Text style={styles.label}>sOrs Dosya No:</Text>
            <Text style={styles.value}>{assignment.a_id}</Text>
          </View>
          <View style={styles.dataContainer}>
            <Text style={styles.label}>Plan Günü:</Text>
            <Text style={styles.value}>{getDayName(assignment.a_plan)}</Text>
          </View>

          <View style={styles.dataContainer}>
            <Text style={styles.label}>İlgili Notu:</Text>
            <Text style={styles.value}>{assignment.ilgilinot}</Text>
          </View>
        </View>
      </View>

      <View style={styles.fullWidthRow}>
        <Text style={styles.label}>Gidilecek Adres:</Text>
        <Text style={styles.value}>
          {assignment.a_adres} {assignment.kent} / {assignment.a_ilce}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, locationConfirmed && styles.disabledButton]}
        onPress={handleConfirmLocation}
        disabled={locationConfirmed}>
        <Icon
          name={locationConfirmed ? 'check' : 'location-on'}
          size={24}
          color="#fff"
        />
        <Text style={styles.buttonText}>
          {locationConfirmed ? 'Konum Kaydedildi' : 'Konumu Onayla'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  dataContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#212529',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
  fullWidthRow: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default AssignmentDetailScreen;
