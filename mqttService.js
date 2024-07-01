import MQTT from 'react-native-mqtt-client';

const client = new MQTT({
    uri: 'mqtt://197.14.52.129:8855',
    clientId: 'waveon_client',
    username: 'houssem.ouali@alphatechnology.tn',
    password: 'SD63qRL32WqfNTltYhpDpw==AlphaTechnology'
});

client.connect()
    .then(() => {
        console.log('Connected to MQTT broker');
        // Perform additional setup or actions after successful connection
        // For example, you can subscribe to topics or publish messages here
        // client.subscribe('myTopic').then(() => {
        //     console.log('Subscribed to topic');
        // });
    })
    .catch((error) => {
        console.error('Failed to connect to MQTT broker:', error);
    });

export default client;