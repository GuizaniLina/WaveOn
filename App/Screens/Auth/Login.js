import React, { useState } from 'react';
import { View, ImageBackground, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import { useNavigation ,CommonActions } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook
import LoginService from '../../services/LoginService';
import downloadFile from '../../services/downloadFileService';
import { startPeriodicPing } from '../../services/pingManager'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const { t } = useTranslation(); // Use the t function for translations
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await LoginService.login(email, password);
      const { idclient, iduser, token } = response;
      await AsyncStorage.setItem(`password_${idclient}`, password);
      await downloadFile(idclient, iduser, token); // Download file on login
  
      // Start periodic ping
      startPeriodicPing(idclient, iduser, token);
  
      // Store the token in AsyncStorage
      await AsyncStorage.setItem('token', token);
  
      // Handle successful login - reset navigation stack
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }],
        })
      );
    } catch (error) {
      Alert.alert(t('error'), t('login_failed'));
      console.error('Login error:', error);
    }
  
    // Dismiss keyboard after login attempt
    Keyboard.dismiss();
  };

  const handleForgotPassword = () => {
    if (email.trim() === '') {
      Alert.alert(t('error'), t('reset_password_prompt'));
      return;
    }
    console.log('Forgot password for email:', email);
    Alert.alert(t('reset_password'), t('reset_password_email_sent'));
    Keyboard.dismiss();
  };

  const handleSignUp = () => {
    console.log('Sign Up clicked!');
    navigation.navigate('Signup');
  };
  
  return (
    <ImageBackground source={require('../../../assets/smart_home1.jpg')} style={styles.background}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.container, { backgroundColor: 'rgba(34, 34, 34, 0.8)' }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: '#fff' }]}>{t('waveon')}</Text>
            <Image source={require('../../../assets/logo.png')} style={styles.logo} />
          </View>
          <TextInput
            style={[styles.input, { color: '#fff', borderColor: '#fff' }]}
            placeholder={t('email')}
            placeholderTextColor={'#fff'}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <View style={[styles.input, { color: '#fff', borderColor: '#fff'}]}>
            <TextInput
              placeholder={t('password')}
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
          <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
            <Text style={[styles.forgotPasswordText, { color:'#fff'}]}>{t('forgot_password')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={[styles.buttonText, { color: '#fff' }]}>{t('login')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={[styles.buttonText, { color: '#fff' }]}>{t('sign_up')}</Text>
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
    height: '60%', 
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
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    alignSelf: 'flex-end'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    justifyContent: "center",
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  loginButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#2b5c94',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  forgotPasswordButton: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  forgotPasswordText: {
    fontSize: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#58c487',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  }
});

export default LoginScreen;