import { Client, Message } from 'react-native-paho-mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MQTT_SERVER = 'ws://197.14.52.129:8866/ws';
let client;

export const connectMQTT = async (setIsConnected) => {
  console.log('Initializing MQTT connection...');

  const myStorage = {
    setItem: (key, item) => { 
      console.log(`Saving item to storage: ${key}`);
      myStorage[key] = item; 
    },
    getItem: (key) => {
      console.log(`Retrieving item from storage: ${key}`);
      return myStorage[key];
    },
    removeItem: (key) => {
      console.log(`Removing item from storage: ${key}`);
      delete myStorage[key];
    },
  };

  const clientId = await AsyncStorage.getItem('idclient') || 'default-client-id';
  console.log(`Client ID: ${clientId}`);

  client = new Client({
    uri: MQTT_SERVER,
    clientId: clientId,
    storage: myStorage,
    username: 'houssem.ouali@alphatechnology.tn',
    password: 'SD63qRL32WqfNTltYhpDpw==AlphaTechnology'
  });

  const wakeUpServer = async () => {
    console.log('Sending wake up message...');
    const message = new Message('Wake up message');
    message.destinationName = '0/0/Ping/11';
    await client.send(message);
    console.log('Wake up message sent.');
  };

  client.onConnectionLost = (response) => {
    if (response.errorCode !== 0) {
      console.log('Connection lost:', response.errorMessage);
      setIsConnected(false);
    }
  };

  client.onMessageArrived = (message) => {
    const msg = message.payloadString;
    console.log('Received message:', msg);
    const devices = parseMessage(msg);
    handleUpdateDevices(devices);
  };

  client.onConnected = async () => {
    console.log('Client connected!');
    await wakeUpServer();
    console.log('Subscribing to topic...');
    await client.subscribe(`${clientId}/#`);
    console.log(`Subscribed to topic: ${clientId}/#`);
    setIsConnected(true);
  };

  try {
    console.log('Attempting to connect to MQTT...');
    await connectToMQTT(client, setIsConnected);
    console.log('MQTT connection successful.');
  } catch (error) {
    console.error('MQTT Connection Error:', error);
    setIsConnected(false);
  }
};

const connectToMQTT = async (client, setIsConnected) => {
  try {
    return await new Promise((resolve, reject) => {
      console.log('Initiating MQTT connection...');
      client.connect({
        onSuccess: () => {
          console.log('Connection successful!');
          setIsConnected(true);
          resolve();
        },
        onFailure: (error_1) => {
          console.error('Connection failed:', error_1);
          setIsConnected(false);
          reject(error_1);
        },
        // timeout: 30, // Augmenter le timeout
        useSSL: true, // Essayez avec useSSL: true si nécessaire
      });
    });
  } catch (error_2) {
    // Catching promise rejection ici
    console.error('Unhandled Promise Rejection:', error_2);
    throw error_2; // Re-throw pour traiter ailleurs si nécessaire
  }
};

const parseMessage = (message) => {
  console.log('Parsing message:', message);
  const msgParts = message.split('/');
  const [unicastAddress, elementAddress, property, value] = msgParts;

  return [{
    name: 'Mock Device',
    unicastAddress,
    temperature: property === 'Temperature' ? Number(value) : null,
    humidity: property === 'Humidity' ? Number(value) : null,
    elements: [{
      address: elementAddress,
      state: property === 'LightLevel' ? Number(value) : -32768,
    }]
  }];
};

export const toggleDeviceState = async (device, elementIndex) => {
  console.log('Toggling device state...');
  if (client.isConnected()) {
    const element = device.elements[elementIndex];
    const newState = element.state > -32768 ? -32768 : 32767;
    console.log(`Sending message to toggle device state to: ${newState}`);

    const message = new Message(`${device.unicastAddress}/${element.address}/LightLevel/${newState}`);
    message.destinationName = `${client.clientId}/1/Gateway`;
    await client.send(message);
    console.log('Message sent.');
  } else {
    console.error('Cannot send message, client is not connected.');
  }
};

export const disconnectMQTT = () => {
  console.log('Disconnecting MQTT...');
  if (client && client.isConnected()) {
    client.disconnect();
    console.log('MQTT disconnected.');
  } else {
    console.log('MQTT client is not connected.');
  }
};