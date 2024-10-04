import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://iot.waveon.tn/WS_WAVEON';

const securityGetService = async (idclient, iduser, idNetwork, token,navigation) => {
    try {
        // Obtenir la date de la dernière mise à jour depuis AsyncStorage
        const lastUpdate = await AsyncStorage.getItem(`lastUpdate_${idclient}`) || '2020-01-01 00:00:00';
        const automationlastUpdate = await AsyncStorage.getItem(`automationlastUpdate_${idclient}`) || '2020-01-01 00:00:00';
        const securitylastUpdate = await AsyncStorage.getItem(`securitylastUpdate_${idclient}`) || '2020-01-01 00:00:00';
        const roomslastUpdate = await AsyncStorage.getItem(`roomslastUpdate_${idclient}`) || '2020-01-01 00:00:00';
        
        // Structure de la requête
        const requestData ={
            idclient,
            iduser,
            automationsLastUpdate:automationlastUpdate,
            token,
            idNetwork,
            lastupdate:lastUpdate ,
            commandLastId: 0,
            permissionsLastUpdate: lastUpdate,
            roomsLastUpdate: roomslastUpdate,
            securityLastUpdate: securitylastUpdate
        };

        // Appeler le service web
        const response = await axios.post(`${BASE_URL}/SecurityGetService/`,requestData);
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
        if (response.data && response.data.securityOption && response.data.securityTriggers) {
            await AsyncStorage.setItem('security', JSON.stringify(response));
            await AsyncStorage.setItem('securityOption', JSON.stringify(response.data.securityOption));
            await AsyncStorage.setItem('securityConfig', JSON.stringify(response.data.securityConfig));
            await AsyncStorage.setItem('securityTriggers', JSON.stringify(response.data.securityTriggers));
            await AsyncStorage.setItem(`securitylastUpdate_${idclient}`, response.data.securityLastUpdate.toString());
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