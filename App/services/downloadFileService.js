import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://iot.waveon.tn/WS_WAVEON';

const downloadFile = async (idclient, iduser, token) => {
    try {
        // Retrieve the lastUpdate value from AsyncStorage, or use a default value if not found
        const lastUpdate = await AsyncStorage.getItem('lastUpdate') || '2019-10-01 01:01:01';
       
        // Prepare the request payload
        

        console.log('Sending downloadFile request:',{
            idclient,
            iduser,
            token,
            lastUpdate,
            commandLastId: 0,
            permissionsLastUpdate: lastUpdate,
            roomsLastUpdate: lastUpdate,
            automationLastUpdate: lastUpdate,
           // securityLastUpdate: lastUpdate
        });

        // Send the POST request to the downloadFile endpoint
        const response = await axios.post(`${BASE_URL}/downloadFile/`,{
            idclient,
            iduser,
            token,
            lastupdate :lastUpdate ,
            commandLastId: 0,
            permissionsLastUpdate: lastUpdate,
            roomsLastUpdate: lastUpdate,
            automationLastUpdate: lastUpdate,
           // securityLastUpdate: lastUpdate
        });
       
        // Check the response headers or body for the lastUpdate value
        const serverLastUpdate = response.headers['lastupdate'] || response.data.lastupdate;

        // Save the lastUpdate value to AsyncStorage
        await AsyncStorage.setItem('lastUpdate', serverLastUpdate);
        await AsyncStorage.setItem('nodes', JSON.stringify(response.data.nodes));
        console.log('data json:',response.data.nodes );
        console.log('File downloaded and lastUpdate saved:', serverLastUpdate);
        return response.data;
    } catch (error) {
        console.error('Error downloading file:', error);
        throw new Error('Failed to download file: ' + error.message);
    }
};

export default downloadFile;