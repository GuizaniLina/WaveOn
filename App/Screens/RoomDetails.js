import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, Modal, ImageBackground, TouchableOpacity, Switch, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import LampsContainer from './components/LampsContainer';
import BlindsContainer from './components/BlindsContainer';
import { connectMQTT, toggleDeviceState, disconnectMQTT, publishMQTT } from '../services/mqttService';
import Node from '../Class/Node';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../ThemeProvider';
import { useTranslation } from 'react-i18next';

const deviceComponents = {
  2: LampsContainer,
  3: BlindsContainer,
  // Add other device types and their corresponding components here
};

const RoomDetails = ({ route }) => {
  const { roomId, roomName, roomImage, assignments } = route.params;
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [deviceStates, setDeviceStates] = useState(
    assignments.reduce((acc, assignment) => ({ ...acc, [assignment.id]: false }), {})
  );
  const [hasClimatiseur, setHasClimatiseur] = useState(false);
  const [hasPorte, setHasPorte] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [filteredNodes, setFilteredNodes] = useState([]);
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [luminosity, setLuminosity] = useState(null);
  const [occupancy, setOccupancy] = useState(null);


  useEffect(() => {
    const climatiseurPresent = assignments.some(assignment => assignment.deviceType === 7 && assignment.idRoom === roomId);
    const portePresent = assignments.some(assignment => assignment.deviceType === 8 && assignment.idRoom === roomId);
    setHasClimatiseur(climatiseurPresent);
    setHasPorte(portePresent);

    const loadNodesFromStorage = async () => {
      try {
        const USER_ID = await AsyncStorage.getItem('idclient');
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
      setNodes((prevNodes) =>
        prevNodes.map(node => {
          const deviceInRoom = assignments.find(assignment => 
            assignment.idRoom === roomId && 
            assignment.unicast === node.unicastAddress
          );
          const updatedDevice = updatedDevices.find(dev => dev.unicastAddress === node.unicastAddress);

          if (deviceInRoom && updatedDevice) {
            node.updateFromDevice(updatedDevice);
          }
          return node;
        })
      );
    };

    connectMQTT(setIsConnected, updateDevices)
      .catch(error => {
        console.error('MQTT connection error:', error);
        Alert.alert(t('error'), t('error_connecting_mqtt'));
      });

    return () => {
      disconnectMQTT();
    };
  }, [assignments, roomId , t]);

  useEffect(() => {
    const devicesInRoom = assignments.filter(assignment => assignment.idRoom === roomId);

    if (devicesInRoom.length > 0) {
      const filtered = nodes.filter(node => 
        devicesInRoom.some(assignment => assignment.unicast === node.unicastAddress)
      );

      setFilteredNodes(filtered);
    } else {
      setFilteredNodes([]);
    }
  }, [nodes, assignments, roomId]);

  useEffect(() => {
    const tempNode = filteredNodes.find(node => node.getTemperature() != null);

    if (tempNode) {
      setTemperature(tempNode.getTemperature());
      setOccupancy(tempNode.getOccupancy());
      setLuminosity(tempNode.getLuminosity());
      setHumidity(tempNode.getHumidity());
    } else {
      setTemperature('--');
      setOccupancy('--');
      setLuminosity('--');
      setHumidity('--');
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
  const handleNavigateToControl = (node) => {
    navigation.navigate('TwoLampsControl', { node });
  };
  
  const handlePressLamp1 = async (node) => {
    try {
      await toggleDeviceState(node, 0);
    } catch (error) {
      console.error('Error toggling Lamp 1 state:', error);
    }
  };
  
  const handlePressLamp2 = async (node) => {
    try {
      await toggleDeviceState(node, 1);
    } catch (error) {
      console.error('Error toggling Lamp 2 state:', error);
    }
  };

  const handleOptionsPress = () => {
    setModalVisible(true);
  };
  const handleModify = () => {
    setModalVisible(false);
    // Navigate to modify screen or perform modify action
    console.log('Modify option selected');
  };

  const handleDelete = () => {
    setModalVisible(false);
    // Perform delete action (e.g., show confirmation alert)
    Alert.alert(
      t('delete_room'),
      t('delete_room_confirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('delete'), onPress: () => console.log('Delete option selected') },
      ]
    );
  };
  // Handles navigation to the BlindsControlScreen
  const handleNavigateToBlindsControl = (node) => {
    navigation.navigate('BlindsControl', { node });
  };

  const handleBlindsSliderChange = async (node, value) => {
    await publishMQTT(node.unicastAddress, node.getElementAddresses()[0], value, 'BlindsLevel');
  };

  return (
    <ImageBackground source={roomImage} style={styles.background} blurRadius={1}>
      <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.$backgroundColor }]}>
  <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
    <FontAwesome5 name="arrow-left" size={24} color={theme.$textColor} />
  </TouchableOpacity>
  
  <Text style={[styles.headerTitle, { color: theme.$textColor }]}>{roomName}</Text>
  
  <TouchableOpacity style={styles.optionsButton} onPress={handleOptionsPress}>
    <FontAwesome5 name="ellipsis-h" size={24} color={theme.$textColor} />
  </TouchableOpacity>
  <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalOption} onPress={handleModify}>
              <Text style={styles.modalOptionText}>{t('modify')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={handleDelete}>
              <Text style={styles.modalOptionText}>{t('delete')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
</View>

        <View style={styles.temperatureContainer}>
          <View style={styles.infoContainer}>
            <Text style={styles.temperatureText}>{temperature}</Text>
            <Text style={styles.temperature}>°c</Text>
          </View>
          <View>
            <View style={styles.infoContainer}>
              <Text style={styles.temperatureLabel}>{t('humidity_label')} : </Text>
              <Text style={styles.value}>{humidity} %</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.temperatureLabel}>{t('luminosity_label')} :</Text>
              <Text style={styles.value}>{luminosity} %</Text>
            </View>
            <View style={styles.infoContainer}>
  <Image 
    source={
      occupancy === null || occupancy === '--' || occupancy === 0 
        ? require('../../assets/icons/no_one.png') 
        : require('../../assets/icons/man.png')
    } 
    style={[
      styles.infoIcon, 
      { tintColor: occupancy === null || occupancy === '--' || occupancy === 0 ? 'white' : 'red' }
    ]} 
  />
  <Text style={styles.value}>{occupancy}</Text>
</View>
          </View>
        </View>

        <View style={styles.controlContainer}>
          <View style={[styles.twoContainer, !hasClimatiseur && styles.disabledContainer]}>
            <Image source={require('../../assets/icons/clima.png')} style={styles.icon} />
            <Text style={styles.twoDeviceName}>{t('climatiseur')}</Text>
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
            <Text style={styles.twoDeviceName}>{t('porte')}</Text>
            <Switch
              value={deviceStates['Porte']}
              onValueChange={() => toggleDevice('Porte')}
              thumbColor={deviceStates['Porte'] ? 'white' : 'rgba(172, 208, 170, 0.8)'}
              trackColor={{ false: 'white', true: 'rgba(172, 208, 170, 0.8)' }}
              disabled={!hasPorte}
            />
          </View>
        </View>

        <View style={[styles.deviceListContainer, { backgroundColor: theme.$backgroundColor }]}>
          <FlatList
            data={filteredNodes}
            keyExtractor={(item) => item.unicastAddress.toString()}
            numColumns={2}
            renderItem={({ item }) => {
              const DeviceComponent = deviceComponents[item.pid];
              if (!DeviceComponent) return null;

              return (
                <DeviceComponent
                
                  level_A={item.pid === 2 ? ((item.getElementStates()[0]) != null ? (item.getElementStates()[0] + ' %') : '--') : undefined}
                  level_B={item.pid === 2 ? ((item.getElementStates()[1]) != null ? (item.getElementStates()[1] + ' %') : '--') : undefined}
                  sliderValues={item.pid === 3 ? item.getElementStates()[0] || 0 : undefined}
                  onPressLamp1={item.pid === 2 ? () => handlePressLamp1(item) : undefined}
                  onPressLamp2={item.pid === 2 ? () => handlePressLamp2(item) : undefined}
                  onPress={() => item.pid === 2 ? handleNavigateToControl(item) : item.pid === 3 ? handleNavigateToBlindsControl(item) : null}
                  onSliderChange={item.pid === 3 ? (value) => handleBlindsSliderChange(item, value) : undefined}
                />
              );
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
    padding: 5,
    justifyContent: 'space-between', 
    borderBottomEndRadius: 35,
    borderBottomStartRadius: 35,
    height: 120,
    backgroundColor: '#333',
  },
  optionsButton: {
    padding: 10,
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
   // marginLeft: 10,
    
    fontWeight: 'bold',
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(172, 208, 170, 0.95)',
    borderRadius: 20,
    margin: 20,
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
    backgroundColor: '#333',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  infoContainer: {
    flexDirection: 'row',
  },
  value: {
    fontSize: 13,
    marginBottom: 20,
    color: 'white',
  },
  infoIcon: {
    width: 50,
    height: 50,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: 300,
    alignItems: 'center',
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 18,
    color: '#333',
  },
  modalCancel: {
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 18,
    color: 'red',
  },modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: 300,
    alignItems: 'center',
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 18,
    color: '#333',
  },
  modalCancel: {
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 18,
    color: 'red',
  },
});

export default RoomDetails;