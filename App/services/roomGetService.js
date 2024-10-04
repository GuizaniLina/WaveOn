import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native'; // For navigating to the login screen

const BASE_URL = 'https://iot.waveon.tn/WS_WAVEON';

const roomGetService = async (idclient, iduser, idNetwork, token, navigation) => {
    try {
        const lastUpdate = await AsyncStorage.getItem(`lastUpdate_${idclient}`) || '2020-01-01 00:00:00';
        const automationlastUpdate = await AsyncStorage.getItem(`automationlastUpdate_${idclient}`) || '2020-01-01 00:00:00';
        const securitylastUpdate = await AsyncStorage.getItem(`securitylastUpdate_${idclient}`) || '2020-01-01 00:00:00';
        const roomslastUpdate = await AsyncStorage.getItem(`roomslastUpdate_${idclient}`) || '2020-01-01 00:00:00';

        const requestData = {
            idclient,
            iduser,
            idNetwork,
            token,
            lastupdate: lastUpdate,
            commandLastId: 0,
            permissionsLastUpdate: lastUpdate,
            roomsLastUpdate: roomslastUpdate,
            automationLastUpdate: automationlastUpdate,
        };

        const response = await axios.post(`${BASE_URL}/RoomGetService/`, requestData);

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

        // If authentication is successful, store the received data
        if (response.data && response.data.rooms && response.data.assignments) {
            await AsyncStorage.setItem('rooms', JSON.stringify(response.data.rooms));
            await AsyncStorage.setItem('assignments', JSON.stringify(response.data.assignments));
            await AsyncStorage.setItem(`roomslastUpdate_${idclient}`, response.data.roomsLastUpdate.toString());
            console.log('Room data stored successfully');
        } else {
            console.error('Invalid response from service');
        }

        return response.data; 

    } catch (error) {
        console.error('Error fetching room data:', error);
        throw new Error('Failed to fetch room data: ' + error.message);
    }
};

export default roomGetService;
