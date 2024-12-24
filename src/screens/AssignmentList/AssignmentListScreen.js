import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getAssignments, searchAssignments} from '../../api/user';
import {removeAccessToken} from '../../utils/storage';

const AssignmentListScreen = ({navigation}) => {
  const [assignments, setAssignments] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const tableHead = ['#', 'Firma', 'Adı Soyadı', 'İlçe', 'Plan'];

  useEffect(() => {
    const fetchData = async () => {
      await handleSearch();
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let response;
      if (searchText) {
        response = await searchAssignments(searchText);
      } else {
        response = await getAssignments();
      }
      console.log('API response:', response);

      if (response.success) {
        const fetchedAssignments = Object.values(response.data).filter(
          item => typeof item === 'object' && item.a_id,
        );
        setAssignments(fetchedAssignments);
        setDataLoaded(true);
      } else {
        if (response.statusCode === 401) {
          console.error('Token süresi dolmuş:', response.message);
          Alert.alert(
            'Hata',
            response.message ||
              'Oturum süresi doldu. Lütfen tekrar giriş yapın.',
            [
              {
                text: 'Tamam',
                onPress: async () => {
                  await removeAccessToken(); // Token'ı AsyncStorage'den sil
                  navigation.replace('Login'); // Login ekranına yönlendir
                },
              },
            ],
          );
        } else {
          console.error(
            'Assignments fetch failed:',
            response.message || 'Bilinmeyen hata',
          );
          Alert.alert('Hata', response.message || 'Veriler alınamadı.');
        }
      }
    } catch (error) {
      console.error('Arama hatası:', error.message || error);
      Alert.alert('Hata', 'Arama yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async text => {
    try {
      const response = await searchAssignments(text);
      if (response.success) {
        // Öneri olarak isimleri kullan
        const fetchedSuggestions = Object.values(response.data)
          .filter(item => typeof item === 'object' && item.isim)
          .map(item => item.isim);
        setSuggestions(fetchedSuggestions);
      }
    } catch (error) {
      console.error('Öneri hatası:', error);
    }
  };

  const onSearchTextChanged = text => {
    setSearchText(text);
    if (text) {
      fetchSuggestions(text);
    } else {
      setSuggestions([]);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      key={item.a_id}
      onPress={() =>
        navigation.navigate('AssignmentDetail', {assignmentId: item.a_id})
      }
      style={styles.tableRow}>
      <Text style={[styles.tableCell, styles.tableCellText]}>{item.count}</Text>
      <Text style={[styles.tableCell, styles.tableCellText]}>{item.firma}</Text>
      <Text style={[styles.tableCell, styles.tableCellText]}>
        {item.isim} {item.soyisim}
      </Text>
      <Text style={[styles.tableCell, styles.tableCellText]}>
        {item.a_ilce}
      </Text>
      <Text style={[styles.tableCell, styles.tableCellText]}>
        {item.a_plan}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={24}
          color="#007bff"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Ara..."
          placeholderTextColor="#7f8c8d"
          value={searchText}
          onChangeText={onSearchTextChanged}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Ara</Text>
        </TouchableOpacity>
      </View>

      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => {
                setSearchText(suggestion);
                setSuggestions([]);
                handleSearch();
              }}>
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            {tableHead.map((header, index) => (
              <Text
                key={index}
                style={[styles.tableCell, styles.tableHeaderText]}>
                {header}
              </Text>
            ))}
          </View>

          <ScrollView style={styles.tableData}>
            {assignments.length > 0
              ? assignments.map((item, index) => renderItem({item, index}))
              : dataLoaded && (
                  <Text style={styles.noDataText}>
                    Aradığınız kritere uygun sonuç bulunamadı.
                  </Text>
                )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#2c3e50',
  },
  searchButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tableContainer: {
    flex: 1,
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    borderWidth: 1,
    borderColor: '#007bff',
    paddingVertical: 8,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    flex: 1,
    paddingHorizontal: 2,
  },
  tableData: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#007bff',
    backgroundColor: '#f6f8fa',
  },
  tableCell: {
    flex: 1,
    padding: 10,
  },
  tableCellText: {
    textAlign: 'center',
    fontSize: 10,
  },
  noDataText: {
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: 10,
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
    color: '#000',
  },
});

export default AssignmentListScreen;
