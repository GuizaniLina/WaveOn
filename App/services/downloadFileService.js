import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://iot.waveon.tn/WS_WAVEON';

const downloadFile = async (idclient, iduser, token,navigation) => {
    try {
        const initialDate = '2019-10-01 01:01:01';
        const lastUpdate =  initialDate;
        const automationlastUpdate = await AsyncStorage.getItem(`automationlastUpdate_${idclient}`) || '2020-01-01 00:00:00';
        const roomslastUpdate = await AsyncStorage.getItem(`roomslastUpdate_${idclient}`) || '2020-01-01 00:00:00';

        const requestPayload = {
            idclient,
            iduser,
            token,
            lastupdate: initialDate,
            commandLastId: 0,
            permissionsLastUpdate: initialDate,
            roomsLastUpdate: roomslastUpdate,
            automationLastUpdate: automationlastUpdate,
        };

     

        const response = await axios.post(`${BASE_URL}/downloadFile/`, requestPayload);
        
        if (response.data.idclient === -1 || response.data.token === null) {
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
       
        const serverLastUpdate = response.headers['lastupdate'] || lastUpdate;
    //    await AsyncStorage.setItem(`nodes_${idclient}`, JSON.stringify(response.data.nodes));

        // Convert the lastUpdate and serverLastUpdate to Date objects
        const lastUpdateDate = new Date(lastUpdate);
        const serverLastUpdateDate = new Date(serverLastUpdate);

        // Check if serverLastUpdate is more recent than lastUpdate
        if (serverLastUpdateDate > lastUpdateDate) {
            console.log('New update available, updating AsyncStorage...');

            // Update lastUpdate in AsyncStorage
            await AsyncStorage.setItem(`lastUpdate_${idclient}`, serverLastUpdate);

            // Check if nodes data is available before saving
            if (response.data.nodes) {
                await AsyncStorage.setItem(`nodes_${idclient}`, JSON.stringify(response.data.nodes));
                console.log('File downloaded and lastUpdate saved:', serverLastUpdate);
            } else {
                console.warn(`nodes_${idclient} is undefined, skipping save to AsyncStorage`);
            }
        } else {
            console.log('No update available. Using cached data.');
        }

        return response.data;
    } catch (error) {
        console.error('Error downloading file:', error);
        throw new Error('Failed to download file: ' + error.message);
    }
};

export default downloadFile;