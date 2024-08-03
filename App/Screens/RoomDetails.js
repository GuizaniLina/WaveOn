import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, Switch, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import LampsContainer from './components/LampsContainer';
import BlindsContainer from './components/BlindsContainer';
import { connectMQTT, toggleDeviceState, disconnectMQTT } from '../services/mqttService'; // Importez les fonctions MQTT
import Node from '../Class/Node'; // Assurez-vous d'importer la classe Node
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importez AsyncStorage

const deviceComponents = {
  2: LampsContainer,
  3: BlindsContainer,
  // Add other device types and their corresponding components here
};

const RoomDetails = ({ route }) => {
  const { roomId, roomName, roomImage, assignments } = route.params;
  const navigation = useNavigation();
  const [deviceStates, setDeviceStates] = useState(
    assignments.reduce((acc, assignment) => ({ ...acc, [assignment.id]: false }), {})
  );
  const [hasClimatiseur, setHasClimatiseur] = useState(false);
  const [hasPorte, setHasPorte] = useState(false);
  const [devices, setDevices] = useState([]);
  const [nodes, setNodes] = useState([]); // State to store Node instances
  const [isConnected, setIsConnected] = useState(false);
  const [filteredNodes, setFilteredNodes] = useState([]);
  const [temperature, setTemperature] = useState(null);

  useEffect(() => {
    const climatiseurPresent = assignments.some(assignment => assignment.deviceType === 7 && assignment.idRoom === roomId);
    const portePresent = assignments.some(assignment => assignment.deviceType === 8 && assignment.idRoom === roomId);
    setHasClimatiseur(climatiseurPresent);
    setHasPorte(portePresent);

    const loadNodesFromStorage = async () => {
      try {
        const nodesString = await AsyncStorage.getItem(`nodes_${USER_ID}`);
        if (nodesString) {
          const storedNodes = JSON.parse(nodesString);
          const newNodes = storedNodes.map(node => new Node(node));
          setNodes(newNodes);
        }
      } catch (error) {
        console.error('Error loading nodes from storage:', error);
      }
    };

    loadNodesFromStorage();

    const updateDevices = (updatedDevices) => {
      console.log('Received updated devices:', updatedDevices); // Log updated devices
      const newDevices = updatedDevices.map(device => ({
        unicastAddress: device.unicastAddress,
        deviceType: device.deviceType,
        elementIndex: device.elementIndex,
      }));
      setDevices(newDevices);
      
      // Create or update Node instances
      const updatedNodes = newDevices.map(device => {
        const existingNode = nodes.find(node => node.unicastAddress === device.unicastAddress);
       
        if (existingNode) {
          existingNode.updateFromDevice(device);
          return existingNode;
        } else {
          const newNode = new Node(device);
          newNode.updateFromDevice(device);
          return newNode;
        }
      });
      setNodes(updatedNodes);
    };

    connectMQTT(setIsConnected, updateDevices)
      .catch(error => {
        console.error('MQTT connection error:', error);
        Alert.alert('Error', 'Error connecting to MQTT broker');
      });

    return () => {
      disconnectMQTT();
    };
  }, [assignments]);

  useEffect(() => {
    const devicesInRoom = assignments.filter(assignment => assignment.idRoom === roomId);
    console.log('Assignments in room:', devicesInRoom);
    console.log('All devices:', devices);
  
    if (devicesInRoom.length > 0) {
      // Filter nodes based on unicastAddress matching devices in the room
      const filtered = nodes.filter(node => {
        const nodeUnicast = String(node.unicastAddress);
        return devicesInRoom.some(assignment => {
          const assignmentUnicast = String(assignment.unicast);
          console.log('Comparing', nodeUnicast, 'with', assignmentUnicast);
          return assignmentUnicast === nodeUnicast;
        });
      });
  
      // Combine filtered nodes with existing filteredNodes, avoiding duplicates
      const combined = [...filteredNodes];
      filtered.forEach(newNode => {
        if (!combined.some(existingNode => existingNode.unicastAddress === newNode.unicastAddress)) {
          combined.push(newNode);
        }
      });
  
      console.log('Filtered nodes:', combined);
      setFilteredNodes(combined);
    } else {
      console.error('devicesInRoom is empty or not an array');
      setFilteredNodes([]);
    }
  }, [nodes, assignments, roomId]);

  useEffect(() => {
    const tempNode = filteredNodes.find(node => node.getTemperature() != null);

    if (tempNode) {
      setTemperature(tempNode.getTemperature() );
    } else {
      setTemperature('--');
    }
  }, [filteredNodes]);

  const toggleDevice = (id) => {
    setDeviceStates((prevStates) => ({
      ...prevStates,
      [id]: !prevStates[id],
    }));
  };

  const handleDeviceToggle = async (device, elementIndex) => {
    try {
      await toggleDeviceState(device, elementIndex);
    } catch (error) {
      console.error('Error toggling device state:', error);
    }
  };

  return (
    <ImageBackground source={{ uri: roomImage }} style={styles.background} blurRadius={6}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{roomName}</Text>
        </View>

        <View style={styles.temperatureContainer}>
          <View style={styles.infoContainer}>
        <Text style={styles.temperatureText}>{temperature}</Text>
            <Text style={styles.temperature}>°c</Text>
          </View>
          <View>
            <View style={styles.infoContainer}>
              <Text style={styles.temperatureLabel}>Humidity :</Text>
              <Text style={styles.value}>--</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.temperatureLabel}>Luminosity :</Text>
              <Text style={styles.value}>--</Text>
            </View>
            <View style={styles.infoContainer}>
              <Image source={require('../../assets/icons/no_one.png')} style={[styles.infoIcon, {tintColor:'white'}]} />
              <Text style={styles.value}>--</Text>
            </View>
          </View>
        </View>

        <View style={styles.controlContainer}>
          <View style={[styles.twoContainer, !hasClimatiseur && styles.disabledContainer]}>
            <Image source={require('../../assets/icons/clima.png')} style={styles.icon} />
            <Text style={styles.twoDeviceName}>Climatiseur</Text>
            <Switch
              value={deviceStates['Climatiseur']}
              onValueChange={() => toggleDevice('Climatiseur')}
              thumbColor={deviceStates['Climatiseur'] ? 'white' : 'rgba(172, 208, 170, 0.8)'}
              trackColor={{ false: 'white', true: 'rgba(172, 208, 170, 0.8)' }}
              disabled={!hasClimatiseur}
            />
          </View>
          <View style={[styles.twoContainer, !hasPorte && styles.disabledContainer]}>
            <Image source={require('../../assets/icons/garage1.png')} style={styles.icon} />
            <Text style={styles.twoDeviceName}>Porte</Text>
            <Switch
              value={deviceStates['Porte']}
              onValueChange={() => toggleDevice('Porte')}
              thumbColor={deviceStates['Porte'] ? 'white' : 'rgba(172, 208, 170, 0.8)'}
              trackColor={{ false: 'white', true: 'rgba(172, 208, 170, 0.8)' }}
              disabled={!hasPorte}
            />
          </View>
        </View>

        <View style={styles.deviceListContainer}>
          <FlatList
            data={filteredNodes}
            keyExtractor={(item) => item.unicastAddress.toString()}
            numColumns={2}
            renderItem={({ item }) => {
              const DeviceComponent = deviceComponents[item.pid];
              return DeviceComponent ? (
                <DeviceComponent
                  key={item.unicastAddress}
                  assignment={item}
                  onToggle={() => handleDeviceToggle(item, item.elementIndex)}
                  level_A={item.pid === 2 ? ((item.getElementStates()[0]) != null ? (item.getElementStates()[0] + ' %') : '--') : undefined}
                  level_B={item.pid === 2 ? ((item.getElementStates()[1]) != null ? (item.getElementStates()[1] + ' %') : '--') : undefined}
                  onPressLamp1={item.pid === 2 ? '' : undefined}
                  onPressLamp2={item.pid === 2 ? '' : undefined}
                />
              ) : null;
            }}
          />
        </View>
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '96%',
    padding: 5,
    top: 40,
    left: 10,
    backgroundColor: 'rgba(4, 4, 4, 0.65)',
    borderRadius: 50,
  },
  backButton: {
    padding: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginHorizontal: 11,
    tintColor: 'black',
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFF',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(172, 208, 170, 0.8)',
    borderRadius: 20,
    margin: 20,
    marginTop: 60,
    height: '25%',
  },
  temperature: {
    fontSize: 35,
    color: 'white',
    fontWeight: 'bold',
  },
  temperatureText: {
    fontSize: 110,
    color: 'white',
  },
  temperatureLabel: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  controlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  deviceListContainer: {
    flex: 1,
    marginTop: 20,
    width: '100%',
    backgroundColor: 'rgba(4, 4, 4, 0.65)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  infoContainer: {
    flexDirection: 'row',
  },
  value: {
    fontSize: 20,
    marginBottom: 20,
    color: 'white',
  },
  infoIcon: {
    width: 30,
    height: 30,
  },
  deviceContainer: {
    backgroundColor: 'rgba(69, 69, 69, 0.85)',
    margin: 7,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderColor: 'white',
    borderWidth: 0.3,
  },
  twoContainer: {
    backgroundColor: 'white',
    margin: 7,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderColor: 'black',
    borderWidth: 0.3,
  },
  deviceName: {
    color: 'white',
    marginVertical: 10,
  },
  twoDeviceName: {
    color: 'black',
    marginVertical: 10,
  },
  disabledContainer: {
    opacity: 0.5,
  },
});

export default RoomDetails;