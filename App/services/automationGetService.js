import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://iot.waveon.tn/WS_WAVEON';

const automationGetService = async (idclient, iduser, idNetwork, token) => {
  try {
    // Get the last update dates from AsyncStorage
    const lastUpdate = await AsyncStorage.getItem(`lastUpdate_${idclient}`) || '2020-01-01 00:00:00';
    const automationlastUpdate = await AsyncStorage.getItem(`automationlastUpdate_${idclient}`) || '2020-01-01 00:00:00';
    const roomslastUpdate = await AsyncStorage.getItem(`roomslastUpdate_${idclient}`) || '2020-01-01 00:00:00';
    
    // Prepare the request data
    const requestData = {
      idclient,
      iduser,
      automationsLastUpdate: automationlastUpdate,
      token,
      idNetwork,
      lastupdate: lastUpdate,
      commandLastId: 0,
      permissionsLastUpdate: lastUpdate,
      roomsLastUpdate: roomslastUpdate,
      automationLastUpdate: automationlastUpdate
    };

    // Call the web service
    const response = await axios.post(`${BASE_URL}/AutomationGetService/`, requestData);

    if (response.data && response.data.automations) {
      // Store data in AsyncStorage
      await AsyncStorage.setItem('automationFile', JSON.stringify(response.data));
      await AsyncStorage.setItem('automations', JSON.stringify(response.data.automations));
      await AsyncStorage.setItem(`automationlastUpdate_${idclient}`, JSON.stringify(response.data.automationsLastUpdate));
      console.log('Automation data successfully stored');
    } else {
      console.error('Invalid response from service');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching automation data:', error);
    throw new Error('Failed to fetch automation data: ' + error.message);
  }
};

export default automationGetService;