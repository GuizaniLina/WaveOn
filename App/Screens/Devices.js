import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import DeviceContainer from './components/DeviceContainer';
import TwoLampsContainer from './components/TwoLampsContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwitchContainer from './components/SwitchContainer';
import Node from '../Class/Node';
import { connectMQTT, toggleDeviceState ,disconnectMQTT} from '../services/mqttService';
import LottieView from 'lottie-react-native';

export default function Devices() {
  const [nodes, setNodes] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const nodesString = await AsyncStorage.getItem('nodes');
        if (nodesString) {
          const parsedNodes = JSON.parse(nodesString).map(data => new Node(data));
          setNodes(parsedNodes);
        } else {
          console.warn('No nodes data found in AsyncStorage.');
          setNodes([]);
        }
      } catch (error) {
        console.error('Error parsing nodes data:', error);
        Alert.alert('Error', 'Error retrieving nodes data');
        setNodes([]);
      }
    };

    fetchNodes();

    const updateDevices = (updatedDevices) => {
      setNodes((prevNodes) =>
        prevNodes.map(node => {
          const updatedDevice = updatedDevices.find(dev => dev.unicastAddress === node.unicastAddress);
          if (updatedDevice) {
            node.updateFromDevice(updatedDevice);
          }
          return node;
        })
      );
    };

    connectMQTT(setIsConnected)
      .then(async (client) => {
        setIsConnected(true);
        await client.subscribe(`${client.clientId}/#`, (error, granted) => {
          if (error) {
            console.error('Subscription error:', error);
            return;
          }
          console.log('Subscribed to:', granted);
          client.on('message', (topic, message) => {
            const updatedDevices = JSON.parse(message.toString());
            updateDevices(updatedDevices);
          });
        });
      })
      .catch(error => {
        console.error('MQTT connection error:', error);
        Alert.alert('Error', 'Error connecting to MQTT broker');
      });

    return () => {
      disconnectMQTT();
    };
  }, []);
  
  const handleDragEnd = async ({ data }) => {
    setNodes(data);
    try {
      await AsyncStorage.setItem('nodes', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving nodes data:', error);
      Alert.alert('Error', 'Error saving nodes data');
    }
  };

  const renderItem = ({ item: node, drag }) => {
    const commonProps = {
      onLongPress: drag,
      key: node.deviceKey,
      title: node.name,
    };

    switch (node.pid) {
      case '0000':
        return (
          <DeviceContainer
            {...commonProps}
            icon={require('../../assets/icons/lampe1.png')}
            sliderValues={{ min: 0, max: 100 }}
            infoIcons={[
              { icon: require('../../assets/icons/chrono.png'), color: 'rgba(74, 207, 244, 1)', value: node.getChrono() },
              { icon: require('../../assets/icons/eclat.png'), color: 'yellow', value: node.getEclat() },
            ]}
          />
        );
      case '0001':
        return (
          <DeviceContainer
            {...commonProps}
            icon={require('../../assets/icons/remote_light.png')}
            sliderValues={{ min: 0, max: 100 }}
            infoIcons={[
              { icon: require('../../assets/icons/batterie.png'), color: 'green', value: node.getBatterie() },
            ]}
          />
        );
      case '0002':
        return (
          <TwoLampsContainer
            {...commonProps}
            icon1={require('../../assets/icons/lampe_dark.png')}
            icon2={require('../../assets/icons/lampe_dark.png')}
            slider_1_Values={{ min: 0, max: 100 }}
            slider_2_Values={{ min: 0, max: 100 }}
            infoIcons={[
              { icon: require('../../assets/icons/oeil.png'), color: 'rgba(74, 207, 244, 1)', value: node.getOccupancy() },
              { icon: require('../../assets/icons/temperatures.png'), color: 'rgba(240, 69, 32, 1)', value: node.getTemperature() },
              { icon: require('../../assets/icons/humidite.png'), color: 'rgba(41, 43, 234, 1)', value: node.getHumidity() },
              { icon: require('../../assets/icons/luminosite.png'), color: 'rgba(244, 231, 74, 1)', value: node.getLuminosity() },
            ]}
          />
        );
      case '0003':
        return (
          <DeviceContainer
            {...commonProps}
            icon={require('../../assets/icons/volet.png')}
            sliderValues={{ min: 0, max: 100 }}
            infoIcons={[
              { icon: require('../../assets/icons/oeil.png'), color: 'rgba(74, 207, 244, 1)', value: node.getOccupancy() },
              { icon: require('../../assets/icons/temperatures.png'), color: 'rgba(240, 69, 32, 1)', value: node.getTemperature() },
              { icon: require('../../assets/icons/humidite.png'), color: 'rgba(41, 43, 234, 1)', value: node.getHumidity() },
              { icon: require('../../assets/icons/luminosite.png'), color: 'rgba(244, 231, 74, 1)', value: node.getLuminosity() },
            ]}
          />
        );
      case '0004':
        return (
          <DeviceContainer
            {...commonProps}
            icon={require('../../assets/icons/antenne.png')}
            sliderValues={{ min: 0, max: 100 }}
            infoIcons={[
              { icon: require('../../assets/icons/batterie.png'), color: 'green', value: node.getBatterie() },
            ]}
          />
        );
      case '0005':
        return (
          <TwoLampsContainer
            {...commonProps}
            icon1={require('../../assets/icons/lampe_dark.png')}
            icon2={require('../../assets/icons/lampe_dark.png')}
            slider_1_Values={{ min: 0, max: 80 }}
            slider_2_Values={{ min: 0, max: 80 }}
            infoIcons={[
              { icon: require('../../assets/icons/chrono.png'), color: 'rgba(74, 207, 244, 1)', value: node.getChrono() },
              { icon: require('../../assets/icons/eclat.png'), color: 'yellow', value: node.getEclat() },
            ]}
          />
        );
      case '0006':
        return (
          <DeviceContainer
            {...commonProps}
            icon={require('../../assets/icons/garage.png')}
            sliderValues={{ min: 0, max: 60 }}
            infoIcons={[
              { icon: require('../../assets/icons/eclat.png'), color: 'yellow', value: node.getEclat() },
            ]}
          />
        );
      case '0007':
        return (
          <SwitchContainer
            {...commonProps}
            icon={require('../../assets/icons/default.png')}
            infoIcons={[
              { icon: require('../../assets/icons/eclat.png'), color: 'yellow', value: node.getEclat() },
            ]}
          />
        );
      case '0008':
        return (
          <SwitchContainer
            {...commonProps}
            icon={require('../../assets/icons/default.png')}
            infoIcons={[
              { icon: require('../../assets/icons/chrono.png'), color: 'rgba(74, 207, 244, 1)', value: node.getChrono() },
            ]}
          />
        );
      case '0009':
        return (
          <SwitchContainer
            {...commonProps}
            icon={require('../../assets/icons/default.png')}
            infoIcons={[
              { icon: require('../../assets/icons/batterie.png'), color: 'green', value: node.getBatterie() },
            ]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
     
      <Text style={styles.title}>{'Liste des Appareils'}</Text>
     
      
      <Text style={styles.status}>
        {isConnected ? 'Connected to MQTT' : 'Connecting...'}
      </Text>
     
      
     
      <DraggableFlatList
        data={nodes}
        renderItem={renderItem}
        keyExtractor={item => item.deviceKey}
        onDragEnd={handleDragEnd}
        contentContainerStyle={styles.scrollViewContainer}
      />
       {/* Animation Lottie pour l'ajout */}
       <View style={styles.addButtonContainer}>
        <LottieView
          source={require('../../assets/lottiefile/Add.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
        </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    margin :16,
    fontWeight: 'bold',
    
    color: 'white',
    
  },
  scrollViewContainer: {
    flexGrow: 1,
    padding: 5,
  },
  status: {
    textAlign: 'center',
    color: 'white',
   // marginTop: 10,
   marginRight : 10
  },
  animation: {
    width: 70,
    height: 70,
    
  },
  row : {
    flexDirection: 'row', // Align items horizontally
    justifyContent:'space-between',
     // Distribute space evenly
   // alignItems: 'center', // Align items vertically centered
   // paddingTop: 20,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 60,
    height: 60,
  },
  lottie: {
    width: 70,
    height: 70,
  },
});