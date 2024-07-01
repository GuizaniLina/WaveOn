import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://iot.waveon.tn/WS_WAVEON';

const roomGetService = async (idclient, iduser, idNetwork, token) => {
    try {
        // Obtenir la date de la dernière mise à jour depuis AsyncStorage
        const lastUpdate = await AsyncStorage.getItem('lastUpdate') || '2020-01-01 00:00:00';
        
        // Structure de la requête
        const requestData = {
            idclient,
            iduser,
            idNetwork,
            token,
            lastupdate:lastUpdate,
            commandLastId: 0,
            permissionsLastUpdate:lastUpdate,
            roomsLastUpdate:lastUpdate,
            automationLastUpdate:lastUpdate
        };

        // Appeler le service web
        const response = await axios.post(`${BASE_URL}/RoomGetService/`,requestData);
        if (response.data && response.data.rooms && response.data.assignments) {
            await AsyncStorage.setItem('rooms', JSON.stringify(response.data.rooms));
            await AsyncStorage.setItem('assignments', JSON.stringify(response.data.assignments));
            console.log('Données des salles stockées avec succès');
        } else {
            console.error('Réponse invalide du service');
        }
        // Vérifier si la réponse est correcte
     /*   if (response.status === 200 && response.data.token === 'ok') {
            // Sauvegarder la nouvelle date de mise à jour dans AsyncStorage
            const serverLastUpdate = response.data.roomsLastUpdate;
            await AsyncStorage.setItem('lastUpdate', serverLastUpdate);*/

            // Retourner les données
            return response.data;
       /* } else {
            throw new Error('Échec de la récupération des données des salles : ' + response.statusText);
        }*/

 
    } catch (error) {
        console.error('Erreur lors de la récupération des données des salles:', error);
        throw new Error('Échec de la récupération des données des salles : ' + error.message);
    }
};

export default roomGetService;