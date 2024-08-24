import React, { useState } from 'react';
import { View, ImageBackground, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

const Signup = () => {
  const { t } = useTranslation(); // Use the t function for translations
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifPassword, setVerifPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
    Keyboard.dismiss();
  };

  const handleForgotPassword = () => {
    if (email.trim() === '') {
      Alert.alert('Error', t('reset_password_prompt'));
      return;
    }
    console.log('Forgot password for email:', email);
    Alert.alert(t('reset_password'), t('reset_password_email_sent'));
    Keyboard.dismiss();
  };

  const handleSignUp = () => {
    console.log('Sign Up clicked!');
    navigation.navigate('HomeScreen');
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
            placeholder={t('username')}
            placeholderTextColor={'#fff'}
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={[styles.input, { color: '#fff', borderColor: '#fff' }]}
            placeholder={t('email')}
            placeholderTextColor={'#fff'}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <View style={[styles.input, { color: '#fff', borderColor: '#fff' }]}>
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
          <View style={[styles.input, { color: '#fff', borderColor: '#fff' }]}>
            <TextInput
              placeholder={t('set_password_again')}
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
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={[styles.buttonText, { color: '#fff' }]}>{t('sign_up')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginRedirect} onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: '#fff' }}>{t('login_redirect')}</Text>
          </TouchableOpacity>
          <Text style={{ color: '#fff' }}>{t('or')}</Text>
          <View style={styles.socialIconsContainer}>
            <TouchableOpacity>
              <Image source={require('../../../assets/icons/google.png')} style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('../../../assets/icons/facebook.png')} style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('../../../assets/icons/apple.png')} style={[styles.socialIcon, { tintColor: 'white' }]} />
            </TouchableOpacity>
          </View>
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
    marginBottom: 20,
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
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 30,
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
  loginRedirect: {
    marginTop: 20,
  },
});

export default Signup;