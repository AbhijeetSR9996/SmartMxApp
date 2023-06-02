import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {icons, images} from '../../constant';
import Divider from '../../reusablecomponent/Divider';
import EditBtn from '../../assets/svg/EditBtn.svg';
import DeleteBtn from '../../assets/svg/DeleteBtn.svg';
import axios from 'axios';
import Sound from 'react-native-sound';
import RNFetchBlob from 'rn-fetch-blob';

import {useIsFocused, useFocusEffect} from '@react-navigation/native';

const PatientDetails = ({navigation, route, voice}) => {
  // Destructure the route parameters
  const { res, patient } = route.params;
  
  const [patientData, setPatient] = useState(null);
  const isFocused = useIsFocused();
  const [refresh, setRefresh] = useState(false);

  // This effect will be triggered when the screen gains focus
  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);


  // This effect will be triggered when the `refresh` parameter changes
  useEffect(() => {
    if (route.params.refresh) {
      fetchData();
    }
  }, [route.params.refresh]);

  // Fetch patient data from the API
  const fetchData = () => {
    axios
      .get(`http://smart.techpanda.art/newpatient/${patient.id}/`)
      .then(response => {
        const patientData = response.data;
        setPatient(patientData);
        setRefresh(false); // Reset the refresh state
      })
      .catch(error => {
        console.error('Error fetching patient data:', error);
      });
  };


  const userData = route.params.res;
 
  useEffect(() => {
    axios
      .get(`http://smart.techpanda.art/newpatient/${patient.id}/`)
      .then(response => {
        const patientData = response.data;
        setPatient(patientData);
      })
      .catch(error => {
        console.error('Error fetching patient data:', error);
      });
  }, [refresh]);

  const errorHandiler = () => {
    navigation.navigate('Edit', {patient: patientData, res: userData});
  };

  //  console.log("patient screen useData 1 ================",userData)

  // ---------- modal ---------
  const [audioModal, setaudioModal] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [FileType, setFileType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackInstance, setPlaybackInstance] = useState(null);
  const [pdfFile, setPdfFile] = useState('');

  // -------------------------------------Delete Logic start
  const [showConfirm, setShowConfirm] = useState(false);

  //Delete
  const handleDelete = () => {
    axios
      .delete(`http://smart.techpanda.art/newpatient/${patientData.id}/`)
      .then(() => {
        console.log('Data deleted successfully from API');
        navigation.goBack({res: userData});
      })
      .catch(error => {
        console.error('Error deleting data:', error);
      });
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const handleConfirm = () => {
    setShowConfirm(true);
  };


  console.log('url for voicex',patient.voice)


  // ------------- Condition for audio url --------
  const handleResponse = response => {
    if (response.includes('.wav')) {
      setFileType(response);
      setaudioModal(true);
    } else if (response.includes('.jpg') || response.includes('.png')) {
      setFileType('');
      Alert.alert('Data not found');
      setFileType('');
      Alert.alert('Invalid file type');
    }
  };

  // -------------- Audio modal function ---------
  useEffect(() => {
    return () => {
      if (playbackInstance !== null) {
        playbackInstance.stop();
        playbackInstance.release();
      }
    };
  }, [playbackInstance, refresh]);



  const handlePlayPause = () => {
    if (playbackInstance === null) {
      setIsLoading(true);
      const sound = new Sound(patientData.voice, Sound.MAIN_BUNDLE, error => {
        setIsLoading(false);
        if (error) {
          console.log('Error loading audio:', error);
        } else {
          setPlaybackInstance(sound);
          sound.play(() => setIsPlaying(false));
          setIsPlaying(true);
        }
      });
    } else {
      if (isPlaying) {
        playbackInstance.pause(() => setIsPlaying(false));
      } else {
        playbackInstance.play(() => setIsPlaying(true));
      }
    }
  };

  // ------------ Primission for pdf download --------
  const requestPdfPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'PDF Download App Permission',
          message:
            'PDF Download app needs access to your phone ' +
            'so you can download files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        DownloadPdfFile();
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handlepdf = response => {
    if (response && response.includes && response.includes('.pdf')) {
      setPdfFile(response);
      console.log('checkkkkk', pdfFile);
      requestPdfPermission();
    } else {
      Alert.alert('Not Found data');
    }
  };

  // ---------Download file code ---
  const DownloadPdfFile = async () => {
    const {config, fs} = RNFetchBlob;
    const downloadsPath = fs.dirs.DownloadDir;
    const fileUrl = patientData.pdffile;
    const fileName = 'document.pdf';

    const options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: `${downloadsPath}/${fileName}`,
        description: 'Downloading file...',
      },
    };

    config(options)
      .fetch('GET', fileUrl)
      .then(res => {
        Alert.alert('File downloaded successfully.');
      })
      .catch(error => {
        console.error('Error downloading file:', error);
      });
  };

  if (!patientData) {
    return null; // or a loading indicator
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View
            style={{flexDirection: 'row', marginTop: 64, marginHorizontal: 17}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={icons.arrow_back} style={styles.image} />
            </TouchableOpacity>
            <Text style={styles.text}>Patient details</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 70,
            }}>
            <TouchableOpacity
              style={{width: '20%', marginHorizontal: 20, marginRight: -20}}
              onPress={errorHandiler}>
              <EditBtn />
            </TouchableOpacity>

            <TouchableOpacity
              style={{width: '-90%', marginLeft: -30}}
              onPress={handleConfirm}>
              <DeleteBtn />
            </TouchableOpacity>

            {showConfirm && (
              <View>
                {Alert.alert(
                  'Confirmation',
                  `Are you sure you want to delete ${patientData.fullname}?`,
                  [
                    {text: 'Cancel', onPress: handleCancel},
                    {text: 'Confirm', onPress: handleDelete},
                  ],
                )}
              </View>
            )}
            {/* ------------------------------------------Delete end */}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.box}>
            <View style={{padding: 15}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.diagnosis}>Name</Text>

                <Text style={styles.treatment}>{patientData.fullname}</Text>
              </View>

              <Divider />

              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.diagnosis}>Gender</Text>
                <Text style={styles.treatment}>{patientData.gender}</Text>
              </View>

              <Divider />

              <View>
                {patientData.dignosis1.map((diagnosis, index) => (
                  <View key={index}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.diagnosis}>
                        Diagnosis {index + 1}
                      </Text>
                      <Text style={styles.treatment}>{diagnosis}</Text>
                    </View>
                    <Divider />
                  </View>
                ))}
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.diagnosis}>Discharged</Text>
                <Text style={styles.treatment}>{patientData.discharged}</Text>
              </View>
             
              <Divider />
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.diagnosis}>Investigations planned</Text>
                <Text style={styles.treatment}>
                  {patientData.investigationplaned}
                </Text>
              </View>

              <Divider />
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.diagnosis}>Treatment planned</Text>
                <Text style={styles.treatment}>
                  {patientData.treatmentplan}
                </Text>
              </View>

              <Divider />
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.diagnosis}>Status</Text>
                {patientData.status ? (
                  <Text style={styles.treatment}>Complete</Text>
                ) : (
                  <Text style={styles.treatment}>Incomplete</Text>
                )}
              </View>
            </View>
          </View>

          <View style={{marginHorizontal: 20}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Bold',
                lineHeight: 24,
                letterSpacing: 0.05,
                fontWeight: 500,
                color: '#10011C',
              }}>
              Comments
            </Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.contend}>{patientData.comment}</Text>
          </View>

          <View style={{marginHorizontal: 20}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Bold',
                lineHeight: 24,
                letterSpacing: 0.05,
                fontWeight: 500,
                color: '#10011C',
              }}>
              Photos/Audio
            </Text>
            <View
              style={{flexDirection: 'row', marginBottom: 70, marginTop: 18}}>
              <TouchableOpacity
                onPress={() => {
                  setImageModal(true);
                }}>
                <Image
                  source={{uri: patientData.upload}}
                  style={styles.photoItem}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{marginLeft: 15}}
                onPress={() => {
                  handlepdf(patientData.pdffile);
                }}>
                <Image
                  source={images.pdf}
                  style={styles.photoItem}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  width: 80,
                  alignItems: 'center',
                  marginLeft: 15,
                  borderRadius: 10,
                }}
                onPress={() => {
                  handleResponse(patientData.voice);
                }}>
                <View>
                  <Image
                    source={images.MpVoice}
                    style={styles.photoItem}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* ------------ Audio play Modal --------- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={audioModal}
        onRequestClose={() => {
          setaudioModal(false);
        }}>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => setaudioModal(false)}
            style={{position: 'absolute', top: '4%', left: 14}}>
            <Image source={icons.arrow_back} style={styles.image} />
          </TouchableOpacity>

          <Image
            source={images.Music}
            style={{width: '60%', height: '50%', tintColor: 'white'}}
            resizeMode="contain"
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '60%',
            }}>
            <TouchableOpacity
              style={[styles.button, {width: '70%', alignSelf: 'center'}]}
              onPress={handlePlayPause}
              disabled={isLoading}>
              <Text style={styles.buttonText}>
                {isPlaying ? 'Pause' : 'Play'}
              </Text>
            </TouchableOpacity>
          </View>

          {isLoading && <ActivityIndicator size="small" />}
        </View>
      </Modal>




      {/* ------------ Image display Modal --------- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={imageModal}
        onRequestClose={() => {
          setImageModal(false);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => setImageModal(false)}
            style={{position: 'absolute', top: '4%', left: 14}}>
            <Image source={icons.arrow_back} style={styles.image} />
          </TouchableOpacity>

          <Image
            source={{uri: patientData.upload}}
            style={{width: '90%', height: '80%'}}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PatientDetails;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },

  image: {
    width: 36,
    height: 36,
  },
  text: {
    fontFamily: 'Poppins-Bold',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 18,
    lineHeight: 27,
    letterSpacing: 1,
    color: '#150124',
    marginLeft: 10,
    marginTop: 5,
  },
  heading: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    color: '#10011c',
    marginLeft: '5%',
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
    marginTop: 25,
    marginBottom: 25,
  },
  contend: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.05,
    color: '#000000',
    alignSelf: 'center',
    padding: 15,
    opacity: 0.5,
  },
  diagnosis: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.05,
    color: '#10011C',
  },
  treatment: {
    fontFamily: 'Poppins-Bold',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.05,
    color: '#10011C',
  },
  listContainer: {
    paddingVertical: 18,
    marginBottom: 40,
  },
  photoItem: {
    width: 80,
    height: 80,
  },
  audioItem: {
    width: '100%',
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  audioText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  imageContainer: {
    marginHorizontal: 10,
    justifyContent: 'space-between',
  },

  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  View: {
    backgroundColor: 'white',
    height: 140,
    width: 250,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 2,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  statusText: {
    fontSize: 18,
  },
  volumeText: {
    fontSize: 16,
    marginTop: 10,
  },
});
