import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  alert,
  // -----------voice start --
  PermissionsAndroid,
  // -----------voice end--
  // -----------share start --
  Share,
  // -----------share end --
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {icons, images} from '../../constant';
import InputField from '../../reusablecomponent/InputField';
import SelectDropdown from 'react-native-select-dropdown';
//----------------
import ShareSvg from '../../assets/svg/share.svg';
import PdfSvg from '../../assets/svg/pdfupload.svg';
import MicSvg from '../../assets/svg/voiceupload.svg';
import ImageSvg from '../../assets/svg/imageupload.svg';
import VoiceRed from '../../assets/svg/VoiceRed.svg';

//----------------
// -----------image start--
import DocumentPicker from 'react-native-document-picker';
// -----------image end--
// -----------voice start --

import {Buffer} from 'buffer';
import {Permissions} from 'react-native-permissions';
import AudioRecord from 'react-native-audio-record';
import RNFS from 'react-native-fs';
// -----------voice end--

import { useRoute, useNavigation } from '@react-navigation/native';

const {width} = Dimensions.get('window');
const Edit = ({navigation, route}) => {
 
  const {patient } = route.params;
  const userData = route.params.res;
 
  // -------------share start--
  const [complete, setComplete] = useState('');
  // -------------share end--
  const [fullname, setFullname] = useState('');
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState('Male');
 
  const [dignosis1, setDignosis1] = useState([]);

  const [discharged, setDischarged] = useState('');
  const [investigationplaned, setInvestigationplaned] = useState('');
  const [treatmentplan, setTreatmentplan] = useState('');
  const [status, setStatus] = useState(true);
  const [bookmark1, setBookmark1] = useState(false);
  const [comment, setComment] = useState('');

  console.log("status" , status)
  // const [grp, setGrp] = useState(5);
  // -----------voice start --
  const [audioFile, setAudioFile] = useState('');
  const [recording, setRecording] = useState(false);
  // -----------voice end--
  // -----------image start --
  const [upload, setUpload] = useState("");
  // -----------image end --
  // -----------voice start --
  const [voice, setVoice] = useState("");
  // -----------voice end --
  // --------Documents start
  const [pdffile, setPdffile] = useState("");
  //---------Documents end
  // -----------voice start --
  //console.log('id check', user);
  console.log('image', upload);
  console.log('voice', voice);
  console.log('pdf', pdffile);
  let sound = null;

  useEffect(() => {
    const checkPermission = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Audio Recording Permission',
          message: 'This app requires permission to record audio.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
  
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        initializeAudioRecord();
      } else {
        console.log('Recording permission denied');
      }
    };

    const initializeAudioRecord = () => {
      if (Platform.OS === 'android') {
        const options = {
          sampleRate: 16000,
          channels: 1,
          bitsPerSample: 16,
          wavFile: 'test.wav',
        };
    
        AudioRecord.init(options);
      }
  
      AudioRecord.on('data', data => {
        const chunk = Buffer.from(data, 'base64');
        console.log('chunk size', chunk.byteLength);
      });
    };
  
    checkPermission();
  
    return () => {
      AudioRecord.stop();
      // Additional cleanup if needed
    };
  }, []);

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    console.log('start record');
    setAudioFile('');
    setRecording(true);
    AudioRecord.start();
  };

  const stopRecording = async () => {
    if (!recording) return;
    console.log('stop record');
    let audioFile = await AudioRecord.stop();
    console.log('audioFile', audioFile);
    setVoice(audioFile);
    setRecording(false);
  };




  // useEffect(() => {
  //   checkPermission();

  //   const options = {
  //     sampleRate: 16000,
  //     channels: 1,
  //     bitsPerSample: 16,
  //     wavFile: 'test.wav',
  //   };

  //   AudioRecord.init(options);

  //   AudioRecord.on('data', data => {
  //     const chunk = Buffer.from(data, 'base64');
  //     console.log('chunk size', chunk.byteLength);
  //   });

  //   return () => {
  //     AudioRecord.stop();
  //     if (sound) {
  //       sound.release();
  //       sound = null;
  //     }
  //   };
  // }, []);
  // -----------voice end--
 

  const genderlist = [
    {title: 'Male', image: require('../../assets/icon/gender2.png')},
    {title: 'Female', image: require('../../assets/icon/gender2.png')},
    {title: 'Other', image: require('../../assets/icon/gender2.png')},
  ];

  const dischargedornot = [{title: 'Discharged'}, {title: 'Not Discharged'}];

  const statusArray = [
    {
      image: require('../../assets/icon/completeicon.png'),
      title: 'Complete',
      datag: true,
      id: 1,
    },
    {
      image: require('../../assets/icon/pendingicon.png'),
      title: 'Pending',
      datag: false,
      id: 2,
    },
  ];

  // --------- Get data -----------
  useEffect(() => {
    fetch(`http://smart.techpanda.art/newpatient/${patient.id}`, {
   
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('jj===', data);
        console.log('image_data',data.upload);
        console.log('voice_data',data.voice);
        //console.log('pdf_data',data.pdffile);
        setFullname(data.fullname);
        setLocation(data.location);
        setGender(data.gender);
        setDignosis1(data.dignosis1);
        setDischarged(data.discharged);
        setInvestigationplaned(data.investigationplaned);
        setTreatmentplan(data.treatmentplan);
        setComment(data.comment);
      })
      .catch(error => console.log(error));
  }, [patient.id]);



  const uploadfunction = async () => {
    // -----------image start--
    const fileUri = upload;
    const fileImage = {
      uri: fileUri,
      name: 'image.jpg',
      type: 'image/jpeg', // Modify the type according to your image file type
    };
    // -----------image end--
    //------for Documents start---
    const docu = pdffile;
    const doc = {
      uri: docu,
      name: 'document.pdf',
      type: 'text/pdf',
    };

    //------for Documents end---
    // -----------voice start--

    let file = null;

    if (voice) {
      const filePath = '/data/user/0/com.smartmx/files/test.wav';
      const fileStat = await RNFS.stat(filePath);

      file = {
        uri: 'file://' + filePath,
        name: 'recording.wav',
        type: 'audio/wav',
        size: fileStat.size,
      };
    }
    // -----------voice end--
    // Rest of your code...
    let url = `http://smart.techpanda.art/newpatient/${patient.id}/`;
    // const requestBody = {
    //   fullname: fullname,
    //   location: location,
    //   gender: gender,
    //   dignosis1: dignosis1,
    //   discharged: discharged,
    //   investigationplaned: investigationplaned,
    //   treatmentplan: treatmentplan,
    //   status: status,
    //   bookmark1: bookmark1,
    //   comment: comment,
    // };

    const requestBody = new FormData();
          requestBody.append('fullname', fullname);
          requestBody.append('location', location);
          requestBody.append('gender', gender);
          requestBody.append('dignosis1', JSON.stringify(dignosis1));
          requestBody.append('discharged', discharged);
          requestBody.append('investigationplaned', investigationplaned);
          requestBody.append('treatmentplan', treatmentplan);
          requestBody.append('status', status);
          requestBody.append('bookmark1', bookmark1);
          requestBody.append('comment', comment);
           // -----------image start--
          //  if (fileImage.uri) {
          //   requestBody.append('upload', fileImage);
          // }
          if (upload) {
            const fileImage = {
              uri: upload,
              name: 'image.jpg',
              type: 'image/jpeg',
            };
            requestBody.append('upload', fileImage);
          }
          // -----------image end--
          //------for Documents start---
          //  if (doc) {
          //   requestBody.append('pdffile',doc);
          // }
          if (pdffile) {
            const docu = pdffile;
       const doc = {
         uri: docu,
         name: 'document.pdf',
         type: 'text/pdf',
       };
       requestBody.append('pdffile',doc);
         }
          //------for Documents end---
          // -----------voice start--
          // if (file) {
          //   requestBody.append('voice',file);
          // }
          if (voice) {
            const fileStat = await RNFS.stat(voice);
            const file = {
              uri: 'file://' + voice,
              name: 'recording.wav',
              type: 'audio/wav',
              size: fileStat.size,
            };
            requestBody.append('voice', file);
          }
          // -----------voice end--

    fetch(url, {
      // ...
      method: 'PATCH',
      // body: JSON.stringify(requestBody),
      // headers: {
      //   Accept: 'application/json',
      //   'Content-Type': 'application/json',
      // },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: requestBody,
    })
      .then(response => response.json())
      .then(response => {
        console.log('User Data Updated successfully:', response);
        Alert.alert('Success', 'User Data Updated successfully.', [
          {
            text: 'OK',
            // onPress: () => navigation.goBack(),
          },
        ]);
        navigation.navigate('PatientDetails', {
          patient: patient,
          res: userData,
          refresh: true,
        });
 
      })
      .catch(error => {
        console.log(error);
        Alert.alert('Error', 'Something went wrong. Please try again later.');
      });
  };
  
  // ---------------------------------
//------for Documents start---
const selectPdf = async () => {
  try {
    const res = await DocumentPicker.pickSingle({
      type: [DocumentPicker.types.allFiles],
    });
    //setUpload(res.uri);
    setPdffile(res.uri);
    console.log('Selected doc:', res.uri);
  } catch (err) {
    if (DocumentPicker.isCancel(err))
      console.log('User cancelled the upload');
    else console.log(err);
  }
};
   //------for Documents end---

 // -----------image start--
 const selectDoc = async () => {
  try {
    const res = await DocumentPicker.pickSingle({
      type: [DocumentPicker.types.images],
    });
    setUpload(res.uri);
    console.log('Selected image:', res.uri);
  } catch (err) {
    if (DocumentPicker.isCancel(err))
      console.log('User cancelled the upload');
    else console.log(err);
  }
};
// -----------image end--

// -----------voice start--
// const checkPermission = async () => {
//   const granted = await PermissionsAndroid.request(
//     PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//     {
//       title: 'Cool Photo App Camera Permission',
//       message:
//         'Cool Photo App needs access to your camera' +
//         'so you can take awesome pictures.',
//       buttonNeutral: 'Ask Me Later',
//       buttonNegative: 'Cancel',
//       buttonPositive: 'OK',
//     },
//   );

//   const p = await Permissions.check('microphone');
//   console.log('permissions check', p);
//   if (p === 'authorized') return;
//   return requestPermission();
// };

// const requestPermission = async () => {
//   const p = await Permissions.request('microphone');
//   console.log('permissions request', p);
// };

// const toggleRecording = () => {
//   //checkPermission();
//   if (recording) {
//     stopRecording();
//   } else {
//     startRecording();
//   }
// };

// const startRecording = () => {
//   console.log('start record');
//   setAudioFile('');
//   setRecording(true);
//   AudioRecord.start();
// };

// const stopRecording = async () => {
//   if (!recording) return;
//   console.log('stop record');
//   let audioFile = await AudioRecord.stop();
//   console.log('audioFile', audioFile);
//   setVoice(audioFile);
//   setRecording(false);
// };
// -----------voice end--

 // -------------share start--
 const handleShare = () => {
  const message = `Name: ${fullname}
\nlocation: ${location}
\nGender: ${gender}
\nDiagnosis: ${dignosis1[0]}
\nDischarged: ${discharged}
\nInvestigationPlan: ${investigationplaned}
\nTreatmentPlan: ${treatmentplan}
\nCompleteStatus: ${complete}
\nComment: ${comment}`;
  Share.share({
    message: message,
  });
};
// -------------share end--


  // ---------------------------------------







  // const upload = () => {
 
  //   let url = `http://smart.techpanda.art/newpatient/${patient.id}/`;
  //   const requestBody = {
  //     fullname: fullname,
  //     location: location,
  //     gender: gender,
  //     dignosis1: dignosis1,
  //     discharged: discharged,
  //     investigationplaned: investigationplaned,
  //     treatmentplan: treatmentplan,
  //     status: status,
  //     bookmark1: bookmark1,
  //     comment: comment,
  //   };

  //   // console.log('Request body:', requestBody);

  //   fetch(url, {
  //     // ... 
  //     method: 'PATCH',
  //     body: JSON.stringify(requestBody),
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .then(response => response.json())
  //     .then(response => {
  //       console.log('User Data Updated successfully:', response);
  //       navigation.navigate('PatientDetails', {
  //         patient: patient,
  //         res: userData,
  //         refresh: true,
  //       });
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       Alert.alert('Error', 'Something went wrong. Please try again later.');
  //     });
  // };
  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        source={images.dashBg}
        resizeMode="cover"
        style={{
          widht: '100%',
          height: '100%',
        }}>
        <View
          style={{flexDirection: 'row', marginTop: 64, marginHorizontal: 17}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={icons.arrow_back} style={styles.image} />
          </TouchableOpacity>

          <Text style={styles.text}>Edit Profile</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{flex: 1, marginHorizontal: 20, marginTop: 20}}>
            <InputField
              editable={true}
              placeholder="Full Name"
              icon={icons.user}
              title="Full Name"
              value={fullname}
              onChange={setFullname}
            />

            <InputField
              editable={true}
              placeholder="Location"
              icon={icons.location}
              title="Location"
              value={location}
              onChange={setLocation}
            />

            {/* ---------- gender ----------- */}
            <View style={styles.viewContainer}>
              <SelectDropdown
                data={genderlist}
                onSelect={(selectedItem, index) => {
                  setGender(selectedItem.title);
                  console.log('gender changes', gender);
                }}
                buttonStyle={styles.dropdown3BtnStyle}
                renderCustomizedButtonChild={(selectedItem, index) => {
                  return (
                    <View style={styles.dropdown3BtnChildStyle}>
                      {selectedItem ? (
                        <Image
                          source={selectedItem.image}
                          style={styles.dropdown3BtnImage}
                        />
                      ) : (
                        <Image
                          source={require('../../assets/icon/gender2.png')}
                        />
                      )}
                      <Text
                        style={[
                          styles.dropdown3BtnTxt,
                          {marginHorizontal: 20},
                        ]}>
                        {selectedItem ? selectedItem.title : gender}
                      </Text>
                    </View>
                  );
                }}
                renderDropdownIcon={isOpened => {
                  return isOpened ? (
                    ''
                  ) : (
                    <Image
                      source={require('../../assets/icon/arrow-down.png')}
                    />
                  );
                }}
                dropdownIconPosition={'right'}
                rowStyle={styles.dropdown3RowStyle}
                renderCustomizedRowChild={(item, index) => {
                  return (
                    <View style={styles.dropdown3RowChildStyle}>
                      <Image
                        source={item.image}
                        style={styles.dropdownRowImage}
                      />
                      <Text
                        style={[
                          styles.dropdown3RowTxt,
                          {marginHorizontal: 15},
                        ]}>
                        {item.title}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>
            <View
              style={{
                height: 56,
                width: '100%',
                borderWidth: 0.5,
                borderColor: '#FFFFFF',
                borderRadius: 10,
                marginBottom: 15,
                backgroundColor: 'rgba(178, 37, 204, 0.05)',
              }}>
              <View
                style={{
                  marginHorizontal: 17.67,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                }}>
                <Image
                  source={icons.diagnosis}
                  style={{
                    tintColor: '#02141F',
                    width: 20,
                    height: 20,
                    marginRight: 12.67,
                    opacity: 0.5,
                  }}
                />

                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 14,
                    lineHeight: 21,
                    fontWeight: '400',
                    fontFamily: 'Poppins-Regular',
                    color: '#10011C',
                    opacity: 0.4,
                    letterSpacing: 0.05,
                    height: 56,
                  }}
                  editable
                  placeholder={`Diagnosis ${
                    dignosis1.length > 0 ? dignosis1.length : '1'
                  }`}
                  placeholderTextColor={'#10011C'}
                  value={dignosis1[0]} // Use dignosis1[0] instead of dignosis1
                  onChangeText={text => {
                    const updatedDiagnosis = [text]; // Wrap the text in an array
                    setDignosis1(updatedDiagnosis);
                  }}
                />
              </View>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  flexDirection: 'row',
                  bottom: 10,
                  right: 20,
                }}
                onPress={() => {
                  const updatedDiagnosis = [...dignosis1, '']; // Add an empty string to the array
                  setDignosis1(updatedDiagnosis);
                }}>
                <Image source={icons.add} style={{marginVertical: 8}} />
              </TouchableOpacity>
            </View>
            {dignosis1.slice(1).map((item, index) => (
              <View
                key={index}
                style={{
                  height: 56,
                  width: '100%',
                  borderWidth: 0.5,
                  borderColor: '#FFFFFF',
                  borderRadius: 10,
                  marginBottom: 15,
                  backgroundColor: 'rgba(178, 37, 204, 0.03)',
                }}>
                <View
                  style={{
                    marginHorizontal: 17.67,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Image
                    source={icons.diagnosis}
                    style={{
                      tintColor: '#02141F',
                      width: 20,
                      height: 20,
                      marginRight: 12.67,
                      opacity: 0.5,
                    }}
                  />

                  <TextInput
                    style={{
                      flex: 1,
                      fontSize: 14,
                      lineHeight: 21,
                      fontWeight: '400',
                      fontFamily: 'Poppins-Regular',
                      color: '#10011C',
                      opacity: 0.4,
                      letterSpacing: 0.05,
                      height: 56,
                    }}
                    editable
                    placeholder={`Diagnosis ${index + 2}`}
                    placeholderTextColor={'#10011C'}
                    value={item}
                    onChangeText={text => {
                      const updatedDiagnosis = [...dignosis1];
                      updatedDiagnosis[index + 1] = text;
                      setDignosis1(updatedDiagnosis);
                    }}
                  />
                </View>
              </View>
            ))}

            {/* ------ Discharged------------ */}
            <View style={styles.viewContainer}>
              <SelectDropdown
                data={dischargedornot}
                defaultValueByIndex={0}
                onSelect={(selectedItem, index) => {
                  setDischarged(selectedItem.title);
                }}
                buttonStyle={styles.dropdown3BtnStyle}
                renderCustomizedButtonChild={(selectedItem, index) => {
                  return (
                    <View style={styles.dropdown3BtnChildStyle}>
                      <Text style={styles.dropdown3BtnTxt}>
                        {selectedItem ? selectedItem.title : discharged}
                      </Text>
                    </View>
                  );
                }}
                renderDropdownIcon={isOpened => {
                  return isOpened ? (
                    ''
                  ) : (
                    <Image
                      source={require('../../assets/icon/arrow-down.png')}
                    />
                  );
                }}
                dropdownIconPosition={'right'}
                rowStyle={styles.dropdown3RowStyle}
                renderCustomizedRowChild={(item, index) => {
                  return (
                    <View style={styles.dropdown3RowChildStyle}>
                      <Image
                        source={item.image}
                        style={styles.dropdownRowImage}
                      />
                      <Text style={styles.dropdown3RowTxt}>{item.title}</Text>
                    </View>
                  );
                }}
              />
            </View>

            <InputField
              editable={true}
              placeholder="Investigations planned"
              icon={icons.searchLight}
              value={investigationplaned}
              onChange={setInvestigationplaned}
            />

            <InputField
              editable={true}
              placeholder="Treatment planned"
              icon={icons.diagnosis}
              value={treatmentplan}
              onChange={setTreatmentplan}
            />

            <View style={styles.viewContainer}>
              <SelectDropdown
                data={statusArray}
                defaultValueByIndex={0}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem.datag);
                  setStatus(selectedItem.datag);
                  setComplete(selectedItem.title);
                }}
                buttonStyle={styles.dropdown3BtnStyle}
                renderCustomizedButtonChild={(selectedItem, index) => {
                  return (
                    <View style={styles.dropdown3BtnChildStyle}>
                      {selectedItem ? (
                        <Image
                          source={selectedItem.image}
                          style={[
                            styles.dropdown3BtnImage,
                            {marginHorizontal: 3},
                          ]}
                        />
                      ) : (
                        <Image
                          source={require('../../assets/icon/completeicon.png')}
                        />
                      )}
                      {selectedItem ? (
                        <Text
                          style={[
                            styles.dropdown3BtnTxt,
                            {
                              marginHorizontal: 13,
                              color: index === 0 ? '#06C270' : '#F0AA40',
                            },
                          ]}>
                          {selectedItem.title}
                        </Text>
                      ) : (
                        <Text style={styles.dropdown3BtnTxt}>Complete</Text>
                      )}
                    </View>
                  );
                }}
                renderDropdownIcon={isOpened => {
                  return isOpened ? null : (
                    <Image
                      source={require('../../assets/icon/arrow-down.png')}
                    />
                  );
                }}
                dropdownIconPosition={'right'}
                rowStyle={styles.dropdown3RowStyle}
                renderCustomizedRowChild={item => {
                  return (
                    <View style={styles.dropdown3RowChildStyle}>
                      <Image
                        source={item.image}
                        style={styles.dropdownRowImage}
                      />
                      <Text
                        style={[
                          styles.dropdown3RowTxt,
                          {
                            marginHorizontal: 15,
                            color: item.id === 1 ? '#06C270' : '#F0AA40',
                          },
                        ]}>
                        {item.title}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>

            <View
              style={{
                width: '100%',
                borderWidth: 0.5,
                borderColor: '#FFFFFF',
                borderRadius: 10,
                marginBottom: 15,
                backgroundColor: 'rgba(178, 37, 204, 0.05)',
                height: '20%',
              }}>
              <View
                style={{
                  marginHorizontal: 17.67,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.sms}
                  style={{
                    tintColor: '#02141F',
                    width: 20,
                    height: 20,
                    marginRight: 12.67,
                    opacity: 0.5,
                    marginBottom: 45,
                  }}
                />

                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 14,
                    lineHeight: 21,
                    fontWeight: '400',
                    fontFamily: 'Poppins-Regular',
                    color: '#10011C',
                    opacity: 0.4,
                    letterSpacing: 0.05,
                    marginBottom: 40,
                    borderWidth: 0.5,
                    borderColor: '#FFFFFF',
                    borderRadius: 10,
                    padding: 10,
                  }}
                  editable
                  placeholder="Comments"
                  placeholderTextColor="#10011C"
                  value={comment}
                  onChangeText={setComment}
                  multiline={true}
                  numberOfLines={2}
                />
              </View>

              <View
                style={{
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  backgroundColor: 'grey',
                  marginTop: '20%',
                }}>
                  <TouchableOpacity
                  style={{
                    position: 'absolute',
                    flexDirection: 'row',
                    bottom: 10,
                    right: 10,
                  }}
                  //------for Documents start---
                  onPress={selectPdf}
                  //------for Documents end---
                >
                  <PdfSvg style={{marginHorizontal: 105}} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    flexDirection: 'row',
                    bottom: 10,
                    right: 80,
                  }}
                  // -----------image start--
                  onPress={selectDoc}
                  // -----------image end--
                >
                  <ImageSvg />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    flexDirection: 'row',
                    bottom: 10,
                    right: 45,
                  }}
                  // -----------voice start--
                  onPress={toggleRecording}
                  // -----------voice end--
                >
                    {recording ?  <VoiceRed/> : <MicSvg />}   
                  {/* <MicSvg/> */}
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    flexDirection: 'row',
                    bottom: 10,
                    right: 10,
                  }}
                  // -------------share start--
                  onPress={handleShare}
                  // -------------share end--
                >
                  <ShareSvg style={{marginHorizontal: 5}} />
                </TouchableOpacity>
              </View>
              
            </View>

            {/* ------------ Update btn --------- */}

            <TouchableOpacity
              onPress={uploadfunction}
              style={{
                backgroundColor: '#6D21A9',
                borderRadius: 10,
                height: 63,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                borderWidth: 1,
                borderColor: '#6D21A9',
                flexDirection: 'row',
                marginBottom: 90,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Bold',
                  fontSize: 18,
                  fontSize: 18,
                  lineHeight: 27,
                  letterSpacing: 0.05,
                  color: '#ffffff',
                  marginLeft: 5,
                }}>
                Update
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Edit;

const styles = StyleSheet.create({
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
  viewContainer: {
    flex: 1,
    width: width,
    backgroundColor: 'transparent',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '50%',
    paddingBottom: '20%',
    borderRadius: 10,
  },

  dropdown3BtnStyle: {
    width: '90%',
    padding: 5,
    backgroundColor: 'rgba(178, 37, 204, 0.05)',
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: '#fff',
    marginBottom: 15,
  },
  dropdown3BtnChildStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  dropdown3BtnTxt: {
    color: '#10011C',
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'Poppins-Regular',
    marginHorizontal: 3,
    opacity: 0.5,
  },
  dropdown3RowStyle: {
    backgroundColor: 'rgba(178, 37, 204, 0.05)',
    borderBottomColor: '#fff',
    height: 50,
    borderRadius: 10,
  },
  dropdown3RowChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: 'rgba(178, 37, 204, 0.02)',
  },
  dropdown3RowTxt: {
    color: '#10011C',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',

    opacity: 0.4,
  },
});
