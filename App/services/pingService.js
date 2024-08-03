import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import downloadFile from './downloadFileService';

const BASE_URL = 'https://iot.waveon.tn/WS_WAVEON';

const pingService = async (idclient, iduser, token) => {
    try {
        const lastUpdate = await AsyncStorage.getItem('lastUpdate') || '2019-10-01 01:01:01'; // Default value
        const automationlastUpdate = await AsyncStorage.getItem('automationlastUpdate') || '2020-01-01 00:00:00';
        const securitylastUpdate = await AsyncStorage.getItem('securitylastUpdate') || '2020-01-01 00:00:00';
        const roomslastUpdate = await AsyncStorage.getItem('roomslastUpdate') || '2020-01-01 00:00:00';

        const requestData = {
            idclient,
            iduser,
            token,
            lastUpdate,
            idNetwork: 1,
            commandLastId: 0,
            permissionsLastUpdate: lastUpdate,
            roomsLastUpdate: roomslastUpdate,
            automationLastUpdate: automationlastUpdate,
            securityLastUpdate: securitylastUpdate
        };

        console.log('Sending ping request:', requestData);

        const response = await axios.post(`${BASE_URL}/ping/`, requestData);
       
       


        if (response.data.networkUpdated == 0) {
            console.log('Newer version available. Downloading file...');
            await downloadFile(idclient, iduser, token);
        } else {
            console.log('Local version is up-to-date.');
        }

        return response.data;
    } catch (error) {
        console.error('Ping error:', error);
        throw new Error('Failed to ping server: ' + error.message);
    }
};

export default pingService;