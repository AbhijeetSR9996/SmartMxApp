import React, {useEffect, useState} from 'react';
import axios from 'axios';

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  alert,
  Modal,
  TextInput,
} from 'react-native';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {icons, images} from '../../constant';
import TextButton from '../../reusablecomponent/TextButton';
import DeleteBtn from '../../assets/svg/DeleteBtn.svg';
import SearchUnitA from '../../assets/svg/SearchUnitA.svg';

const UnitA = ({navigation, route}) => {
  const userData = route.params.res;

  // ----------------------------------GroupData
  const {res, grpId, grpName} = route.params;

  // ------------------------------------------
  console.log(route.params.res.id);
  const [bookMarkedData, setBookMarkedData] = useState([]);

  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get('http://smart.techpanda.art/newpatient/')
      .then(response => {
        const filteredData = response.data.filter(
          item =>
            item.user === userData.id &&
            item.bookmark1 === true &&
            item.grp === grpId,
        );
        setBookMarkedData(filteredData);
      })
      .catch(error => {
        console.log(error);
      });
  }, [userData.id, grpId]);

  const Item = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('PatientDetails2', {patient: item})}
      style={{
        padding: 16,
        borderRadius: 20,
        marginHorizontal: 20,
        marginTop: 15,
        borderWidth: 0.5,
        borderColor: '#10011C',
        backgroundColor: 'transparent',
      }}>
      <View style={{flexDirection: 'row'}}>
        <Image source={item.image || images.personal1} />

        <View style={{flexDirection: 'column', marginLeft: 20}}>
          <Text style={styles.name}>{item.fullname}</Text>
          <Text style={styles.dignosis}>Diagnosis: {item.dignosis1}</Text>
          <Text style={styles.dignosis}>Location: {item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // dataGetting FlatList
  const [getPatient, setGetPatient] = useState([]);

  useEffect(() => {
    handleGetdPatient();
  }, []);

  const handleGetdPatient = () => {
    const {grpId} = route.params;
    const url = 'http://smart.techpanda.art/newpatient/';
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    fetch(url, {method: 'GET', headers})
      .then(response => response.json())
      .then(response => {
        const filteredData = response.filter(item => item.grp === grpId);
        setGetPatient(filteredData);
      })
      .catch(error => console.log(error));
  };

  const handleFavouritePress = item => {
    const updatedData = getPatient.map(patient => {
      if (patient.id === item.id) {
        return {
          ...patient,
          bookmark1: !patient.bookmark1,
        };
      }
      return patient;
    });
    setGetPatient(updatedData);

    const url = `http://smart.techpanda.art/newpatient/${item.id}/`;
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        bookmark1: !item.bookmark1,
      }),
    })
      .then(response => response.json())
      .catch(error => console.log(error));
  };

  const PatientCards = ({item, index}) => (
    <View
      style={{
        backgroundColor: item.status ? '#06C270' : '#FFA500',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        marginHorizontal: 20,
        marginTop: 15,
        ...(index % 3 === 2
          ? {
              borderWidth: 0.5,
              borderColor: '#10011C',
              backgroundColor: 'transparent',
            }
          : {}),
      }}>
      <Image
        source={images.profile}
        style={{width: 55, height: 55, resizeMode: 'contain'}}
      />
      <TouchableOpacity
        style={{flexDirection: 'row'}}
        onPress={() => navigation.navigate('PatientDetails', {patient: item})}>
        <View style={{flexDirection: 'column', marginLeft: 20}}>
          <Text style={styles.name}>{item.fullname}</Text>

          <Text>Diagnosis: {item.dignosis1}</Text>
          <Text>Location: {item.location}</Text>
        </View>
      </TouchableOpacity>
      <View
        style={{position: 'absolute', top: 40, right: 20, alignSelf: 'center'}}>
        <TouchableOpacity onPress={() => handleFavouritePress(item)}>
          <Image
            source={item.bookmark1 ? icons.archive_minus : icons.archive}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  // ------------------------------------Delete Group
  console.log('grpId:', grpId);

  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete the group?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            // User confirmed deletion, execute deletion logic
            executeDelete(grpId);
          },
        },
      ],
      {cancelable: false},
    );
  };

  const executeDelete = grpId => {
    axios
      .delete(`http://smart.techpanda.art/newgroup/${grpId}/`)
      .then(response => {
        console.log('Deleted successfully.');
      })
      .catch(error => {
        console.error(error);
      });
  };

  // ------------------------------Search Bar Start  -----------

  // console.log('group ', grpId, grpName);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSearch = query => {
    setSearchQuery(query);
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      // Make the API request to search for patients
      axios
        .get(`https://smart.techpanda.art/groupdata/${grpId}/`)
        .then(response => {
          const filteredResults = response.data.results.filter(item =>
            item.fullname.toLowerCase().includes(searchQuery.toLowerCase()),
          );
          setSearchResults(filteredResults);
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handlePatientPress = item => {
    setModalVisible(false); // Close the modal after selecting a patient
    // console.log('search data  :', item);
    navigation.navigate('PatientDetails', {patient: item});
    console.log('search ID:', item.pati_id);
  };

  const renderPatientItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => handlePatientPress(item)}
        style={styles.patientItem}>
        <Text>{item.fullname}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={images.dashBg}
        style={styles.imageBackground}
        resizeMode="cover">
        <View style={styles.header}>
          <>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={icons.arrow_back} style={styles.image} />
            </TouchableOpacity>
            <Text style={styles.title}>{grpName}</Text>
          </>
          <>
            <View style={{marginTop: 9}}>
              <TouchableOpacity onPress={handleDelete}>
                <DeleteBtn />
              </TouchableOpacity>
            </View>
          </>
        </View>
        <View style={styles.userInfo}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.label}>Group Admin:</Text>
            <Text style={styles.adminName}>{userData.fullname}</Text>
          </View>

          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <SearchUnitA
              style={[styles.adminName, {paddingTop: 2, marginRight: 8}]}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          data={getPatient}
          renderItem={({item}) => <PatientCards item={item} />}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 20}}
        />

        <View style={styles.buttonContainer}>
          <TextButton
            title="Add New Patient details"
            bgColor="#6D21A9"
            color="#ffffff"
            icon={icons.plus}
            onPress={() =>
              navigation.navigate('AddPatient2', {res: userData, grpId: grpId})
            }
          />
        </View>

        {/* --------------------------Search Start----------------------- */}
        <Modal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <TextInput
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search patients by fullname"
            style={styles.input}
          />

          <FlatList
            data={searchResults}
            renderItem={renderPatientItem}
            keyExtractor={item => item.pati_id.toString()}
            style={styles.flatList}
          />
        </Modal>

        {/* --------------------------Search Start----------------------- */}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default UnitA;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    marginTop: 64,
    marginHorizontal: 17,
    justifyContent: 'space-between',
  },
  image: {
    width: 36,
    height: 36,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 27,
    letterSpacing: 1,
    color: '#150124',
    marginLeft: 10,
    marginTop: 5,
  },
  userInfo: {
    flexDirection: 'row',
    marginTop: 40,
    marginHorizontal: 20,
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 1,
    color: '#150124',
  },
  adminName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 1,
    color: '#150124',
  },
  noDetailsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDetailsText: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontSize: 24,
    lineHeight: 36,
    letterSpacing: 1,
    color: '#6D21A9',
    opacity: 0.5,
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  name: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#10011C',
  },

  // Search------

  input: {
    marginBottom: hp('2%'),
    padding: wp('2%'),
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  flatList: {
    flex: 1,
    width: '100%',
  },
  patientItem: {
    padding: wp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
});
