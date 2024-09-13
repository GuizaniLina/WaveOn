import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import downloadFile from './downloadFileService';
import securityGetService from './securityGetService';
import automationGetService from './automationGetService';
import roomGetService from './roomGetService';

const BASE_URL = 'https://iot.waveon.tn/WS_WAVEON';

const pingService = async (idclient, iduser, token) => {
    try {
        const lastUpdate = await AsyncStorage.getItem(`lastUpdate_${idclient}`) || '2019-10-01 01:01:01'; 
        const automationlastUpdate = await AsyncStorage.getItem(`automationlastUpdate_${idclient}`) || '2020-01-01 00:00:00';
        const securitylastUpdate = await AsyncStorage.getItem(`securitylastUpdate_${idclient}`) || '2020-01-01 00:00:00';
        const roomsLastUpdate = await AsyncStorage.getItem(`roomslastUpdate_${idclient}`) || '2020-01-01 00:00:00';

        const requestData = {
            idclient,
            iduser,
            token,
            lastUpdate,
            idNetwork: 1,
            commandLastId: 0,
            permissionsLastUpdate: lastUpdate,
            roomsLastUpdate,
            automationLastUpdate: automationlastUpdate,
            securityLastUpdate: securitylastUpdate
        };

        console.log('Sending ping request:', requestData);

        const response = await axios.post(`${BASE_URL}/ping/`, requestData);
        const responseData = response.data;
       console.log('responseData',responseData);

     // Handle updates based on response flags
   /*  if (responseData.networkUpdated === 1) {
        console.log('Network is updated. Downloading latest file...');
        await downloadFile(idclient, iduser, token);
    }

    if (responseData.roomsUpdated === 1) {
        console.log('Rooms are updated. Fetching latest rooms data...');
        await roomGetService(idclient, iduser, 1, token);
    }

    if (responseData.automationUpdated === 1) {
        console.log('Automation data is updated. Fetching latest automation data...');
        await automationGetService(idclient, iduser,1, token);
    }

    if (responseData.securityUpdated === 1) {
        console.log('Security data is updated. Fetching latest security data...');
        await securityGetService(idclient, iduser,1, token);
    }*/

        return response.data;
    } catch (error) {
        console.error('Ping error:', error);
        throw new Error('Failed to ping server: ' + error.message);
    }
};

export default pingService;