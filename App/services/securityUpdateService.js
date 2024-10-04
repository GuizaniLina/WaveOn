import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://iot.waveon.tn/WS_WAVEON';

const securityUpdateService = async (idclient, iduser, idNetwork, token, securityOption ,updateSecurityConfig ,updateSecurityTriggers,navigation) => {
  try {
    const formatDateTime = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
    
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
 
    const requestData = {
      idclient,
      iduser,
      securityLastUpdate: formatDateTime(new Date()),
      token,
      idnetwork : idNetwork,
      securityOption,
      securityConfig :updateSecurityConfig,
      securityTriggers: updateSecurityTriggers,
      };
    
    console.log('Request Data:', requestData);
    const response = await axios.post(`${BASE_URL}/SecurityUpdateService/`, requestData);

    if (response.data.id === -1 || response.data.value === 'Athentification error') {
      // Authentication error detected, clear AsyncStorage and navigate to login
      await AsyncStorage.multiRemove(['token', 'user', 'idclient', 'iduser', 'user_email', 'user_passwordMQTT', 'user_isadmin', 'user_isgateway']);
      navigation.dispatch(
          CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }], 
          })
      );
      return null; 
  }


    if (response.data.value === 'Must Be Admin Or Gateway') {
      throw new Error('You must be an admin or gateway to perform this action');
    } else if (response.data.value === 'Synchronise First') {
      throw new Error('Synchronize first');
    }

    return response.data;
   
  } catch (error) {
    console.error('Error updating automations:', error);
    throw new Error('Failed to update automations: ' + error.message);
  }
};

export default securityUpdateService;