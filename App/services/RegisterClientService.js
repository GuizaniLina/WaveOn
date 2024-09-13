import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://iot.waveon.tn/WS_WAVEON';

const RegisterClientService = async (email, password, username,country,city,phonenumber) => {
    try {
        const requestData = {
            email,
            password,
            clientname : username,
            username,
            country,
            city,
            phonenumber,

        };

        
        const response = await axios.post(`${BASE_URL}/RegisterClientService/`,requestData);
        
        
            return response.data;
      

 
    } catch (error) {
        console.error('Erreur ', error);
        throw new Error('Échec d\'inscription' + error.message);
    }
};

export default RegisterClientService;