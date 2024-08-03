import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://iot.waveon.tn/WS_WAVEON';

const downloadFile = async (idclient, iduser, token) => {
    try {
        // Date de mise à jour initiale (date ancienne)
        const initialDate = '2019-10-01 01:01:01';
        USER_ID=idclient;
        // Récupérer la dernière date de mise à jour stockée, sinon utiliser la date initiale
        const lastUpdate = await AsyncStorage.getItem('lastUpdate') || initialDate;
        const automationlastUpdate = await AsyncStorage.getItem('automationlastUpdate') || '2020-01-01 00:00:00';
        const roomslastUpdate = await AsyncStorage.getItem('roomslastUpdate') || '2020-01-01 00:00:00';

        // Préparer la charge utile de la requête
        const requestPayload = {
            idclient,
            iduser,
            token,
            lastupdate: lastUpdate ,
            commandLastId: 0,
            permissionsLastUpdate: initialDate,
            roomsLastUpdate: roomslastUpdate,
            automationLastUpdate: automationlastUpdate,
        };

        console.log('Sending downloadFile request:', requestPayload);

        // Envoyer la requête POST à l'endpoint downloadFile
        const response = await axios.post(`${BASE_URL}/downloadFile/`, requestPayload);

        // Récupérer la date de mise à jour du serveur
        const serverLastUpdate = response.headers['lastupdate'] || lastUpdate;

        // Si la date de mise à jour du serveur est différente de la date locale
        if (serverLastUpdate !== lastUpdate) {
            
            // Mettre à jour la date de mise à jour et les données des dispositifs
            await AsyncStorage.setItem('lastUpdate', serverLastUpdate);
            await AsyncStorage.setItem(`nodes_${USER_ID}`, JSON.stringify(response.data.nodes));
            console.log('File downloaded and lastUpdate saved:', serverLastUpdate);
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