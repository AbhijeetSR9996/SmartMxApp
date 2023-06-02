import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {icons, images} from '../../constant';
import Divider from '../../reusablecomponent/Divider';
import ProfieEdit from '../../assets/svg/ProfieEdit.svg';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import ImagePickerModal from '../../reusablecomponent/ImagePicker';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';

const Profile = ({navigation, route}) => {
  const userData = route?.params?.res;

  const isFocused = useIsFocused();

  const {ref} = route.params;

  const [data, setData] = useState([]);
  const [imageDataID, setImageIDData] = useState();
  const [cameraImag, setCameraImag] = useState(null);
  const [upload, setUpload] = useState('');
  const [pickerResponse, setPickerResponse] = useState(null);
  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);
  const [loading, setLoading] = useState(true);

  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    axios
      .get(`https://smart.techpanda.art/userprofilefilter/${userData.id}`)
      .then(response => setData(response.data.results))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    fetch(`https://smart.techpanda.art/image/`)
      .then(response => {
        console.log('Response:', response);
        return response.json();
      })
      .then(data => {
        const filteredData = data.filter(item => item.user === userData.id);
        setImageData(filteredData[0]?.image);
        const imageID = filteredData[0]?.id;
        setImageIDData(imageID);
      })
      .catch(error => console.log(error))
      .finally(() => setLoading(false));
  }, [ref, refresh, isUpdated]);

  useEffect(() => {
    console.log('shyam', imageData);
    setRefresh(!refresh);
    setIsUpdated(false);
  }, [imageData, userData, isFocused, isUpdated]);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        console.log('image', image);
        setCameraImag(image.path);
        console.log('imagepath', image.path);
      })
      .catch(error => console.log(error));
  };

  const selectDoc = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      setUpload(res.uri);
      console.log('Selected image:', res.uri);
      setCameraImag(res.uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err))
        console.log('User cancelled the upload');
      else console.log(err);
    }
  };

  const updateImage = imagePath => {
    const formData = new FormData();
    formData.append('image', {
      uri: imagePath,
      name: 'image.jpg',
      type: 'image/jpeg',
    });
    axios
      .patch(`https://smart.techpanda.art/image/${imageDataID}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        setIsUpdated(true);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (cameraImag !== null) {
      setVisible(false);
      updateImage(cameraImag);
      console.log('Profile Picture updated successfully');
      setRefresh(!refresh);
    }
  }, [cameraImag, isFocused]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 30,
            marginHorizontal: 17,
            paddingVertical: 9,
          }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Home', {userData: userData, refresh: true})
            }>
            <Image source={icons.arrow_back} style={styles.image} />
          </TouchableOpacity>
          <Text style={styles.text}>Profile</Text>
        </View>

        <FlatList
          data={data}
          keyExtractor={item => item.username}
          renderItem={({item}) => (
            <>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 30,
                }}>
                {imageData && (
                  <Image
                    source={{uri: imageData}}
                    style={{
                      width: 125,
                      height: 120,
                      borderRadius: 10,
                      marginTop: 1,
                    }}
                  />
                )}
                <TouchableOpacity
                  style={{position: 'absolute', top: 96}}
                  onPress={() => setVisible(true)}>
                  <ProfieEdit />
                </TouchableOpacity>
              </View>
              <View style={{alignItems: 'center', marginTop: 30}}>
                <Text style={styles.name}>{item.fullname}</Text>
                <Text style={styles.rank}>Rank: 4.5</Text>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.box}>
                  <View style={{padding: 15}}>
                    <View style={styles.infoContainer}>
                      <Text style={styles.infoLabel}>Username</Text>
                      <Text style={styles.infoValue}>{item.username}</Text>
                    </View>
                    <Divider />
                    <View style={styles.infoContainer}>
                      <Text style={styles.infoLabel}>Course</Text>
                      <Text style={styles.infoValue}>{item.course}</Text>
                    </View>
                    <Divider />
                    <View style={styles.infoContainer}>
                      <Text style={styles.infoLabel}>Speciality</Text>
                      <Text style={styles.infoValue}>{item.specialist}</Text>
                    </View>
                    <Divider />
                    <View style={styles.infoContainer}>
                      <Text style={styles.infoLabel}>Role</Text>
                      <Text style={styles.infoValue}>{item.role}</Text>
                    </View>
                    <Divider />
                    <View style={styles.infoContainer}>
                      <Text style={styles.infoLabel}>Cases</Text>
                      <Text style={styles.infoValue}>{item.cases}</Text>
                    </View>
                    <Divider />
                    <View style={styles.infoContainer}>
                      <Text style={styles.infoLabel}>College Name</Text>
                      <Text style={styles.infoValue}>{item.college}</Text>
                    </View>
                  </View>
                </View>
                <ImagePickerModal
                  isVisible={visible}
                  onClose={() => setVisible(false)}
                  onImageLibraryPress={selectDoc}
                  onOpenCameraPress={takePhotoFromCamera}
                />
              </ScrollView>
            </>
          )}
        />
      </>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  image: {
    width: 36,
    height: 36,
  },
  text: {
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

  name: {
    fontFamily: 'Poppins-Bold',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 25.48,
    lineHeight: 38,
    letterSpacing: 0.5,
    color: '#10011C',
  },
  rank: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 30,
    letterSpacing: 0.5,
    color: '#10011C',
    opacity: 0.5,
  },
  box: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0.957055,
    borderColor: '#10011C',
    borderRadius: 19.1411,
    shadowColor: '#10011C',
    shadowOffset: {
      width: 0,
      height: 3.82822,
    },
    shadowOpacity: 0.08,
    shadowRadius: 28.7117,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 50,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.05,
    color: '#10011C',
  },
  infoValue: {
    fontFamily: 'Poppins-Bold',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.05,
    color: '#10011C',
    width: '60%',
    textAlign: 'right',
  },
  // Loading Style
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
