import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import MeshNetworkData from '../Viewmodels/MeshNetworkData';

const downloadJsonService = async () => {
  try {
    const response = await axios.get('https://iot.waveon.tn/WS_WAVEON/downloadFile/'); // Replace with the correct endpoint
    const jsonData = response.data;
    

    // Use the model to validate and parse the data
    const meshData = MeshNetworkData.fromJson(JSON.stringify(jsonData));

    // Save to file
    const filePath = `${FileSystem.documentDirectory}meshNetworkData.json`;
     // Write the data to the file
     await FileSystem.writeAsStringAsync(filePath, meshData.toJson());

     console.log('JSON file downloaded and saved successfully:', filePath);
    return meshData;
  } catch (error) {
    console.error('Error downloading JSON file:', error);
    throw error;
  }
};

export default downloadJsonService;