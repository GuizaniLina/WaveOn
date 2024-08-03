import Paho from "paho-mqtt";

import { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Button, View } from 'react-native';

client = new Paho.Client(
  "197.14.52.129",
  Number(8866),
  `mqtt-async-test-${parseInt(Math.random() * 100)}`
);

 function test() {

  const [value, setValue] = useState(0);

  function onMessage(message) {
    const msg = message.payloadString;
  console.log('Received message:', msg);
  const devices = parseMessage(msg);
  }

  const parseMessage = (message) => {
    console.log('Parsing message:', message);
    const msgParts = message.split('/');
    const [unicastAddress, elementAddress, property, value] = msgParts;
  
    return [{
      name: 'Bureau Houssem',
      unicastAddress,
      temperature: property === 'Temperature' ? Number(value) : null,
      humidity: property === 'Humidity' ? Number(value) : null,
      occupancy: property === 'Occupancy' ? Number(value) : null,
      luminosity: property === 'Luminosity' ? Number(value) : null,
      elements: [{
        address: elementAddress,
        state: property === 'LightLevel' ? Number(value) : -32768,
      }]
    }];
  };

  useEffect(() => {
    client.connect( {
      onSuccess: () => { 
      console.log("Connected!");
     client.subscribe("2/#");
     console.log("hello");
      client.onMessageArrived = onMessage;
    },
    onFailure: () => {
      console.log("Failed to connect!"); 
    }
    
  });
  }, [])

  function changeValue(c) {
    const message = new Paho.Message(value.toString());
    console.log('Received message:', message);
    message.destinationName = "2/#";
    c.send(message);
  }

  return (
    <View style={styles.container}>
      <Text>Value is: {value}</Text>
      <Button onPress={() => { changeValue(client)} } title="Press Me"/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default test;