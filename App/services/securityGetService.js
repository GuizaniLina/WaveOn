import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://iot.waveon.tn/WS_WAVEON';

const securityGetService = async (idclient, iduser, idNetwork, token) => {
    try {
        // Obtenir la date de la dernière mise à jour depuis AsyncStorage
        const lastUpdate = await AsyncStorage.getItem('lastUpdate') || '2020-01-01 00:00:00';
        
        // Structure de la requête
        const requestData ={
            idclient,
            iduser,
            automationsLastUpdate:lastUpdate,
            token,
            idNetwork,
            lastupdate:lastUpdate ,
            commandLastId: 0,
            permissionsLastUpdate: lastUpdate,
            roomsLastUpdate: lastUpdate,
            automationLastUpdate: lastUpdate
        };

        // Appeler le service web
        const response = await axios.post(`${BASE_URL}/SecurityGetService/`,requestData);
        if (response.data && response.data.securityOption && response.data.securityTriggers) {
            await AsyncStorage.setItem('security', JSON.stringify(response));
            await AsyncStorage.setItem('securityOption', JSON.stringify(response.data.securityOption));
            await AsyncStorage.setItem('securityTriggers', JSON.stringify(response.data.securityTriggers));
            console.log('Données des securités stockées avec succès');
        } else {
            console.error('Réponse invalide du service');
        }
        // Vérifier si la réponse est correcte
        /*if (response.status === 200 && response.data.token === 'ok') {
            // Sauvegarder la nouvelle date de mise à jour dans AsyncStorage
            const serverLastUpdate = response.data.roomsLastUpdate;
            await AsyncStorage.setItem('lastUpdate', serverLastUpdate);*/

            // Retourner les données
            return response.data;
        /*} else {
            throw new Error('Échec de la récupération des données des salles : ' + response.statusText);
        }*/

 
    } catch (error) {
        console.error('Erreur lors de la récupération des données des securité:', error);
        throw new Error('Échec de la récupération des données des securité : ' + error.message);
    }
};

export default securityGetService;