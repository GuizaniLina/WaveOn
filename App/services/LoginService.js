import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://iot.waveon.tn/WS_WAVEON'

const LoginService = {
   
  login: async (email, password) => {
    try {
        
      const response = await axios.post(`${BASE_URL}/LoginWebGuestService/`, { email, password });
      const { token, idclient, iduser } = response.data;

      // Store the token and user info
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('idclient', idclient.toString());
      await AsyncStorage.setItem('iduser', iduser.toString());
      // Download file right after login
      return response.data; // Assuming the token is returned upon successful login
    } catch (error) {
      throw new Error('Failed to login' + error.message);
    }
  },



};

export default LoginService;