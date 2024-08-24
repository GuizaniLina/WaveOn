import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://iot.waveon.tn/WS_WAVEON'

const LoginService = {
   
  login: async (email, password) => {
    try {
        
      const response = await axios.post(`${BASE_URL}/LoginWebGuestService/`, { email, password });
      const { token, idclient, iduser } = response.data;
      const profileData = response.data;
      // Store the token and user info
      await AsyncStorage.setItem('user', JSON.stringify(profileData));
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('idclient', idclient.toString());
      await AsyncStorage.setItem('iduser', iduser.toString());
      await AsyncStorage.setItem('user_email', profileData.email);
      await AsyncStorage.setItem('user_passwordMQTT',profileData.password);
      await AsyncStorage.setItem('user_isadmin', profileData.isadmin.toString());
      await AsyncStorage.setItem('user_isgateway', profileData.isgateway.toString());
          // Store the profile under a unique key
          const profileKey = `profile_${profileData.idclient}`;
          await AsyncStorage.setItem(profileKey, JSON.stringify(profileData));

      // Download file right after login
      return profileData; // Assuming the token is returned upon successful login
    } catch (error) {
      throw new Error('Failed to login' + error.message);
    }
  },



};

export default LoginService;