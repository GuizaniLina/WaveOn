import React, { useState, useContext ,useEffect  } from 'react';
import { View,ImageBackground, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import { ThemeContext } from '../../ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import LoginService from '../../services/LoginService';
import pingService from '../../services/pingService';
import downloadFile from '../../services/downloadFileService';
import roomGetService from '../../services/roomGetService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
    try {
      // Call the login function from AuthService
      console.log('hi im here');
      const response = await LoginService.login(email, password);
      const { idclient, iduser, token } = response;
      
      await downloadFile(idclient, iduser, token); // Download file on login

    //  console.log('Tentative de récupération des données des salles...');
    //  const roomData = await roomGetService(idclient, iduser, 1, token); // Utilisez idNetwork = 1 ici
    //  console.log('Données des salles récupérées avec succès:', roomData);

      startPeriodicPing( idclient, iduser, token);
     
      // Handle successful login (e.g., store token in AsyncStorage, navigate to next screen)
      console.log('Login successful. response:', response);
      // Navigate to the home screen or any other screen as needed
       navigation.navigate('HomeScreen');
    } catch (error) {
      // Handle login error
      Alert.alert('Error', 'Failed to login. Please check your credentials.');
      console.error('Login error:', error);
    }
    // Dismiss keyboard after login attempt
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
    navigation.navigate('Signup'); // Navigate to the Signup screen
  };
  const startPeriodicPing = ( idclient, iduser, token) => {
    // Perform initial ping
    performPing( idclient, iduser, token);

     // Set up interval to perform ping every 5 seconds
     const pingInterval = setInterval(() => {
      performPing( idclient, iduser, token);
    }, 10000);

     // Clean up interval on component unmount
     return () => clearInterval(pingInterval);
    };

     // Function to perform ping
  const performPing = async ( idclient, iduser, token) => {
    try {
      await pingService( idclient, iduser, token);
      console.log('Ping successful');
    } catch (error) {
      console.error('Ping error:', error);
    }
  };

  return (
    <ImageBackground source={require('../../../assets/smart_home1.jpg')} style={styles.background}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
       
      <View style={styles.header}>
  <Text style={[styles.title, { color: theme.textColor }]}>WaveOn</Text>
  <Image source={require('../../../assets/logo.png')} style={styles.logo} />
   </View>
        <TextInput
          style={[styles.input, { color: theme.textColor, borderColor: theme.textColor }]}
          placeholder="Email"
          placeholderTextColor={theme.textColor}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <View style={[styles.input, { color: theme.textColor, borderColor: theme.textColor }]}>
        <TextInput
          
          placeholder="Password"
          placeholderTextColor={theme.textColor}
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
        <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
          <Text style={[styles.forgotPasswordText, { color: theme.textColor }]}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={[styles.buttonText, { color: theme.buttonTextColor }]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={[styles.buttonText, { color: theme.buttonTextColor }]}>Sign Up</Text>
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
   // justifyContent: 'center',
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
    alignSelf: 'flex-end'
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
   justifyContent:"center",
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
  }
});

export default LoginScreen;