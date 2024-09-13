import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://iot.waveon.tn/WS_WAVEON';

const SetUserAsAdminRequestService = async (idclient, iduser, token) => {
    try {
        // Obtenir la date de la dernière mise à jour depuis AsyncStorage
        const lastUpdate = await AsyncStorage.getItem(`lastUpdate_${idclient}`) || '2020-01-01 00:00:00';
        const automationlastUpdate = await AsyncStorage.getItem(`automationlastUpdate_${idclient}`) || '2020-01-01 00:00:00';
        const roomslastUpdate = await AsyncStorage.getItem(`roomslastUpdate_${idclient}`) || '2020-01-01 00:00:00';


        // Structure de la requête
        const requestData = {
            idclient,
            iduser,
            token,
            lastupdate:lastUpdate,
            commandLastId: 0,
            permissionsLastUpdate:lastUpdate,
            roomsLastUpdate:roomslastUpdate,
            automationLastUpdate: automationlastUpdate

        };

        
        const response = await axios.post(`${BASE_URL}/SetUserAsAdminRequestService/`,requestData);
        
        
            return response.data;
      

 
    } catch (error) {
        console.error('Erreur ', error);
        throw new Error('Échec d"envoyer la demande d\'administration' + error.message);
    }
};

export default SetUserAsAdminRequestService;