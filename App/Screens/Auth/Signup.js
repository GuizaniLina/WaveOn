import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import RegisterClientService from '../../services/RegisterClientService'; // Import the registration service

const Signup = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifPassword, setVerifPassword] = useState('');
  const [username, setUsername] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSignUpEnabled, setIsSignUpEnabled] = useState(false);

  useEffect(() => {
    // Enable the signup button only if all required fields are filled
    const isFormValid = username && email && phoneNumber && password && verifPassword && country && city && (password === verifPassword);
    setIsSignUpEnabled(isFormValid);
  }, [username, email, phoneNumber, password, verifPassword]);

  const handleSignUp = async () => {
    if (password !== verifPassword) {
      Alert.alert('Error', t('password_mismatch'));
      return;
    }

    if (!email || !password || !username || !phoneNumber || !country || !city) {
      Alert.alert('Error', t('fill_required_fields'));
      return;
    }

    try {
      const response = await RegisterClientService(email, password, username, country, city, phoneNumber);
      console.log('hiiiiiiiiiii');
      if (response && response.id === -2 && response.value === 'Err_exisingClientEmail') {
        Alert.alert('Error', t('email_exists'));
      } else {
        Alert.alert('Success', t('signup_success'));
        navigation.navigate('Login');
      }
    } catch (error) {
      Alert.alert('Error', t('signup_failed'));
      console.error('Error during sign up:', error.message);
    }
  };

  return (
    <ImageBackground source={require('../../../assets/smart_home1.jpg')} style={styles.background}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.container, { backgroundColor: 'rgba(34, 34, 34, 0.8)' }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: '#fff' }]}>{t('waveon')}</Text>
            <Image source={require('../../../assets/logo.png')} style={styles.logo} />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: '#fff', borderColor: '#fff' }]}
              placeholder={`${t('username')} *`}
              placeholderTextColor={'#fff'}
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: '#fff', borderColor: '#fff' }]}
              placeholder={`${t('email')} *`}
              placeholderTextColor={'#fff'}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: '#fff', borderColor: '#fff' }]}
              placeholder={`${t('city')} *`}
              placeholderTextColor={'#fff'}
              autoCapitalize="none"
              value={city}
              onChangeText={setCity}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: '#fff', borderColor: '#fff' }]}
              placeholder={`${t('country')} *`}
              placeholderTextColor={'#fff'}
              autoCapitalize="none"
              value={country}
              onChangeText={setCountry}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: '#fff', borderColor: '#fff' }]}
              placeholder={`${t('phone_number')} *`}
              placeholderTextColor={'#fff'}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={[styles.input, { color: '#fff', borderColor: '#fff' }]}>
              <TextInput
                placeholder={`${t('password')} *`}
                placeholderTextColor={'#fff'}
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <FontAwesome
                  name={passwordVisible ? 'eye-slash' : 'eye'}
                  size={24}
                  color={'#fff'}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={[styles.input, { color: '#fff', borderColor: '#fff' }]}>
              <TextInput
                placeholder={`${t('set_password_again')} *`}
                placeholderTextColor={'#fff'}
                secureTextEntry={!passwordVisible}
                value={verifPassword}
                onChangeText={setVerifPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <FontAwesome
                  name={passwordVisible ? 'eye-slash' : 'eye'}
                  size={24}
                  color={'#fff'}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.signUpButton, { backgroundColor: isSignUpEnabled ? '#58c487' : 'gray' }]}
            onPress={handleSignUp}
            disabled={!isSignUpEnabled}
          >
            <Text style={[styles.buttonText, { color: '#fff' }]}>{t('sign_up')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginRedirect} onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: '#fff' }}>{t('login_redirect')}</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'top',
    alignItems: 'center',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    height: '80%', // 70% of the screen height
    alignItems: 'center',
    width: '100%',
    borderRadius: 40,
    padding: 20,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    justifyContent: "center",
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  inputContainer: {
    width: '100%',
  },
  signUpButton: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  loginRedirect: {
    marginTop: 10,
  },
});

export default Signup;