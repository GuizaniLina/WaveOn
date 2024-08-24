
import AsyncStorage from '@react-native-async-storage/async-storage';
import Paho from 'paho-mqtt';

const MQTT_SERVER = 'ws://197.14.52.129:8866/ws';
let client;
let USER_ID = null;
let USER_EMAIL = null;
let USER_PW = null;

const wakeUpServer = async () => {
  if (client && client.isConnected()) {
    console.log('Sending wake up message...');
    const message = new Paho.Message('0/0/Ping/11');
    message.destinationName = '2/1/Gateway';
    await client.send(message);
    console.log('Wake up message sent.');
  } else {
    console.log('Client is not connected. Cannot send wake up message.');
  }
};

const handleClientConnected = async (setIsConnected) => {
  console.log('Client connected!');
  await wakeUpServer();
  if (client && client.isConnected()) {
    console.log('Subscribing to topic...');
    await client.subscribe(`${USER_ID}/#`);
    console.log(`Subscribed to topic: ${USER_ID}/#`);
    setIsConnected(true);
  } else {
    console.log('Client is not connected. Cannot subscribe to topic.');
  }
};

const onConnectSuccess = async (setIsConnected) => {
  console.log("Connected!");
  await handleClientConnected(setIsConnected);
};

const onConnectFailure = (response) => {
  console.log("Connection failed:", response.errorMessage);
};

const connectToMQTT = async (setIsConnected, username, password) => {
  console.log('Initiating MQTT connection...');

  return new Promise((resolve, reject) => {
    client.connect({
      onSuccess: async () => {
        try {
          await onConnectSuccess(setIsConnected);
          resolve();
        } catch (error) {
          reject(error);
        }
      },
      onFailure: (response) => {
        onConnectFailure(response);
        reject(response);
      },
      useSSL: false,
      reconnect: true,
      userName: username,
      password: password,
    });
  });
};

const parseMessage = (message) => {
  
  const msgParts = message.split('/');
  const [unicastAddress, elementAddress, property, value] = msgParts;
 
  return [{
    unicastAddress:Number(unicastAddress),
    Temperature: property === 'Temperature' ? Number(value) : null,
    Humidity: property === 'Humidity' ? Number(value) : null,
    Occupancy: property === 'Occupancy' ? Number(value) : null,
    Luminosity: property === 'Luminosity' ? Number(value) : null,
    Chrono: property === 'Counter' ? Number(value) : null,
    Eclat: property === 'MeteringLevel' ? Number(value) : null,
    elements: [{
      address: (property === 'LightLevel' || property === 'BlindsLevel') ? Number(elementAddress) : null,
      state: (property === 'LightLevel' || property === 'BlindsLevel') ? Number(value) : null,
    }]
  }];
};

export const connectMQTT = async (setIsConnected, updateDevices) => {
  console.log('Initializing MQTT connection...');

  USER_ID = await AsyncStorage.getItem('idclient') || null;
  USER_EMAIL = await AsyncStorage.getItem('user_email') || null;
  USER_PW = await AsyncStorage.getItem('user_passwordMQTT') || null;
  console.log('user_email', USER_PW);

  function generateClientId() {
    return 'client_' + Math.random().toString(16).substr(2, 8) + '_' + Date.now();
  }

  const clientId = generateClientId();
  console.log(`Generated Client ID: ${clientId}`);

  client = new Paho.Client(
    MQTT_SERVER,
    clientId
  );

  client.onConnectionLost = (response) => {
    if (response.errorCode !== 0) {
      console.log('Connection lost:', response.errorMessage);
      setIsConnected(false);
      reconnectMQTT(setIsConnected, updateDevices); // Reconnect on connection lost
    }
  };

  const handleMessageArrived =  (message) => {
    const msg = message.payloadString;
    try {
      const devices = parseMessage(msg);
     // console.log('device sending', devices);
       updateDevices(devices);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  };

  client.onMessageArrived = handleMessageArrived;

  try {
    console.log('Attempting to connect to MQTT...');
    await connectToMQTT(setIsConnected, USER_EMAIL, USER_PW);
    console.log('MQTT connection successful.');
  } catch (error) {
    console.error('MQTT Connection Error:', error);
    setIsConnected(false);
  }
};

const reconnectMQTT = async (setIsConnected, updateDevices) => {
  console.log('Reconnecting to MQTT...');
  try {
    await connectToMQTT(setIsConnected, USER_EMAIL, USER_PW);
    console.log('Reconnection successful.');
  } catch (error) {
    console.error('Reconnection failed:', error);
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

export const toggleDeviceState = async (device, elementIndex) => {
  const address = device.unicastAddress;
  const elementAddress = device.getElementAddresses()[elementIndex];
  const currentState = device.getElementStates()[elementIndex];
  if (currentState != null){
  const newState = currentState > 0 ? -32768 : 32767;
  
  await publishMQTT(address, elementAddress, newState,'LightLevel');
  console.log('published with success');
  }
};

export const publishMQTT = async (unicastAddress, elementAddress, state, property) => {
  if (!client.isConnected()) {
    console.error('MQTT is not connected');
    return;
  }

  const USER_ID = await AsyncStorage.getItem('idclient');
  const topic = `${USER_ID}/1/Gateway`;
  const payload = `${unicastAddress}/${elementAddress}/${property}/${state}`;
  const message = new Paho.Message(payload);
  message.destinationName = topic;
  message.qos = 0;
  message.retained = false;

  client.send(message);
};

// Function to watch connection status
const watchConnectionStatus = (callback, interval = 1000) => {
  try {
    let previousStatus = client.isConnected();
    setInterval(() => {
      const currentStatus = client.isConnected();
      if (currentStatus !== previousStatus) {
        callback(currentStatus);
        previousStatus = currentStatus;
      }
    }, interval);
  } catch (e) {
    console.log(e);
  }
};


// Callback function to handle connection status changes
const onConnectionStatusChange = (isConnected) => {
  if (isConnected) {
    console.log("Client connected");
  } else {
    console.log("Client disconnected");
  }
};