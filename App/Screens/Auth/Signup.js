import React, { useState, useContext } from 'react';
import { View,ImageBackground, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import { ThemeContext } from '../../ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword , verifPassword , username] = useState('');
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
    Keyboard.dismiss();
  };

  const handleForgotPassword = () => {
    if (email.trim() === '') {
      Alert.alert('Error', 'Please enter your email to reset password');
      return;
    }
    console.log('Forgot password for email:', email);
    Alert.alert('Reset Password', 'An email has been sent to reset your password.');
    Keyboard.dismiss();
  };

  const handleSignUp = () => {
    // Implement sign up logic here
    console.log('Sign Up clicked!');
    // Navigate to the signup screen
    navigation.navigate('HomeScreen'); // Navigate to the Signup screen
  };

  return (
    <ImageBackground source={require('../../../assets/home2.jpg')} style={styles.background}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
       
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textColor }]}>WaveOn</Text>
        <Image source={require('../../../assets/logo.png')} style={styles.logo} />
      </View>
      <TextInput
        style={[styles.input, { color: theme.textColor, borderColor: theme.textColor }]}
        placeholder="Username"
        autoCapitalize="none"
        onChangeText={username}
      />
      <TextInput
        style={[styles.input, { color: theme.textColor, borderColor: theme.textColor }]}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <View style={[styles.input, { color: theme.textColor, borderColor: theme.textColor }]}>
        <TextInput
          placeholder="Password"
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
            color={theme.textColor}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.input, { color: theme.textColor, borderColor: theme.textColor }]}>
        <TextInput
          placeholder="Set Password"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={verifPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <FontAwesome
            name={passwordVisible ? 'eye-slash' : 'eye'}
            size={24}
            color={theme.textColor}
          />
        </TouchableOpacity>
      </View>
     
     
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={[styles.buttonText, { color: theme.buttonTextColor }]}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginRedirect} onPress={() => navigation.navigate('Login')}>
        <Text style={{ color: theme.textColor }}>Already have an account? Login</Text>
      </TouchableOpacity>
      <Text style={{ color: theme.textColor }}>Or</Text>
      <View style={styles.socialIconsContainer}>
        <TouchableOpacity>
          <Image source={require('../../../assets/icons/google.png')} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../../../assets/icons/facebook.png')} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../../../assets/icons/apple.png')} style={styles.socialIcon} />
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
    //justifyContent: 'center',
    alignItems: 'center',
    width : '100%',
    borderRadius: 40,
    padding : 20,
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
    backgroundColor: '#58c487', // Customize the color as needed
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