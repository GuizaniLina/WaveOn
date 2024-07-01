import * as FileSystem from 'expo-file-system';

const readLastUpdateFromFile = async () => {
  try {
    const filePath = `${FileSystem.documentDirectory}meshNetworkData.json`;
    console.log('hoooooooooooooooo');
    const createFileIfNotExist = async () => {
      const filePath = `${FileSystem.documentDirectory}meshNetworkData.json`;
      try {
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (!fileInfo.exists) {
          console.log('File does not exist. Creating file at path:', filePath);
          await FileSystem.writeAsStringAsync(filePath, '{}');  // Write an empty JSON object
          console.log('File created successfully.');
        } else {
          console.log('File already exists at path:', filePath);
        }
      } catch (error) {
        console.error('Error creating file:', error);
      }
    };
    
    createFileIfNotExist();
    
    const fileContent = await FileSystem.readAsStringAsync(filePath);
    console.log('hiiiiiiiiiiiiii');
    const jsonData = JSON.parse(fileContent);

    if (jsonData && jsonData.lastupdate) {
      return jsonData.lastupdate;
    } else {
      throw new Error('lastUpdate not found in JSON file');
    }
  } catch (error) {
    console.error('Error reading lastUpdate:', error);
    throw error;
  }
};

export default readLastUpdateFromFile;