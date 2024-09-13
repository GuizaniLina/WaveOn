import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert } from 'react-native';
const BASE_URL = 'https://iot.waveon.tn/WS_WAVEON';

const roomUpdateService = async (idclient, iduser, token, updatedRooms, updatedAssignments) => {
  try {
    const formatDateTime = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
    
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
 
    const requestData = {
       
        idclient,
        iduser,
        roomsLastUpdate:formatDateTime(new Date()),
        token,
        Rooms:updatedRooms,
        assignments:updatedAssignments,
    

      };
    
   // console.log('Request Data:', requestData);
    const response = await axios.post(`${BASE_URL}/RoomUpdateService/`, requestData);

    if (response.data.value === 'Must Be Admin Or Gateway') {
      throw new Error('You must be an admin or gateway to perform this action');
    } else if (response.data.value === 'Synchronise First') {
      throw new Error('Synchronize first');
    }

    return response.data;
   
  } catch (error) {
     if ( error.response.status === 500) {
       
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    
  }
};

export default roomUpdateService;