import React from 'react';
import {SafeAreaView, Text, Pressable, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';

const ImagePickerModal = ({isVisible, onClose, onImageLibraryPress, onOpenCameraPress}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      style={styles.modal}>
      <SafeAreaView
        style={[styles.buttons, {marginBottom: '3%', marginLeft: '5%', top:'5%'}]}>
        <Text style={[styles.buttonText, {color: 'black'}]}>ADD PICTURE</Text>
      </SafeAreaView>
      <SafeAreaView style={[styles.buttons, {marginBottom: '8%'}]}>
        <Pressable style={[styles.button]} onPress={onOpenCameraPress}>
          <Text style={[styles.buttonText]}>OPEN CAMERA</Text>
        </Pressable>
      </SafeAreaView>
      <SafeAreaView style={[styles.buttons, {marginBottom: '8%'}]}>
        <Pressable style={[styles.button]} onPress={onImageLibraryPress}>
          <Text style={[styles.buttonText]}>CHOOSE FROM LIBRARY</Text>
        </Pressable>
      </SafeAreaView>
      <SafeAreaView style={[styles.buttons,{marginBottom: '8%'}]}>
        <Pressable style={[styles.button]} onPress={onClose}>
          <Text style={styles.buttonText}>CANCEL</Text>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
}

export default ImagePickerModal;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    marginVertical: '80%',
  },
  buttonIcon: {
    width: 30,
    height: 30,
    margin: 10,
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    marginHorizontal: 15,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'turquoise',
  },
});
