import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

const Start = () => {
  const navigation = useNavigation();
  const { t } = useTranslation(); // Use the t function for translations

  const handleGetStarted = () => {
    navigation.navigate('Signup'); // Navigate to Signup screen
  };

  const handleLogin = () => {
    navigation.navigate('Login'); // Navigate to Login screen
  };

  return (
    <ImageBackground source={require('../../assets/smart_home1.jpg')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{t('control_your_house')}</Text>
          <Text style={styles.paragraph}>{t('control_smart_devices')}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, styles.blueButton]} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>{t('get_started')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.greenButton]} onPress={handleLogin}>
            <Text style={styles.buttonText}>{t('login')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end', // Align content at the bottom
    alignItems: 'center',
    marginBottom: 50, // Adjust the margin to add some space between buttons and bottom
  },
  content: {
    alignItems: 'center', // Center content horizontally
    marginBottom: 25,
    marginHorizontal: 25, // Adjust margin between content and buttons
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  paragraph: {
    textAlign: 'center',
    fontSize: 17,
    color: '#fff',
  },
  buttonsContainer: {
    flexDirection: 'column', // Arrange buttons vertically
  },
  button: {
    width: 350, // Adjust button width as needed
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginVertical: 10,
  },
  blueButton: {
    backgroundColor: '#2a6ebd',
  },
  greenButton: {
    backgroundColor: '#58c487',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Start;