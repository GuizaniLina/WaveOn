import React, { useState, useContext, useEffect, useRef } from 'react';
import { Alert, StyleSheet, TouchableOpacity, Text, View, Modal, RefreshControl, ScrollView } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import DeviceContainer from './components/DeviceContainer';
import TwoLampsContainer from './components/TwoLampsContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwitchContainer from './components/SwitchContainer';
import Node from '../Class/Node';
import { connectMQTT, toggleDeviceState, publishMQTT, disconnectMQTT } from '../services/mqttService';
import LottieView from 'lottie-react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import { ThemeContext } from '../ThemeProvider';
import { useTranslation } from 'react-i18next';

export default function Devices({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [nodes, setNodes] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [refreshing, setRefreshing] = useState(false); 


  const fetchNodes = async () => {
    try {
      const USER_ID = await AsyncStorage.getItem('idclient');
      const nodesString = await AsyncStorage.getItem(`nodes_${USER_ID}`);
      if (nodesString) {
        const parsedNodes = JSON.parse(nodesString).map(data => new Node(data));
        setNodes(parsedNodes);
      } else {
        console.warn('No nodes data found in AsyncStorage.');
        setNodes([]);
      }
    } catch (error) {
      console.error('Error parsing nodes data:', error);
      Alert.alert(t('error'), t('error_retrieving_data'));
      setNodes([]);
    } finally {
      setRefreshing(false); // Stop the refreshing animation
    }
  };

  useEffect(() => {
    fetchNodes(); // Fetch nodes initially
  }, []); // Run on component mount

  const onRefresh = () => {
    setRefreshing(true);
    fetchNodes(); // Manually trigger data refresh
  };

  useEffect(() => {
    const updateDevices = (updatedDevices) => {
      setNodes((prevNodes) =>
        prevNodes.map(node => {
          const updatedDevice = updatedDevices.find(dev => dev.unicastAddress === node.unicastAddress);
          if (updatedDevice) {
            //console.log('updateee',updatedDevice);
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
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleDragEnd = async ({ data }) => {
    setNodes(data);
    try {
      const USER_ID = await AsyncStorage.getItem('idclient');
      await AsyncStorage.setItem(`nodes_${USER_ID}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving nodes data:', error);
      Alert.alert(t('error'), t('error_saving_data'));
    }
  };

  const handleAddPress = () => {
    if (hasPermission === null) {
      Alert.alert(t('permission'), t('request_camera_permission'));
    } else if (hasPermission === false) {
      Alert.alert(t('no_camera_access'), t('enable_camera_permissions'));
    } else {
      setIsScannerVisible(true);
    }
  };

  const handleQRCodeRead = async ({ data }) => {
    try {
      const newDeviceData = JSON.parse(data); // Assuming QR code contains JSON data
      const newDevice = new Node(newDeviceData);
      setNodes((prevNodes) => [...prevNodes, newDevice]);

      const USER_ID = await AsyncStorage.getItem('idclient');
      await AsyncStorage.setItem(`nodes_${USER_ID}`, JSON.stringify([...nodes, newDevice]));
      setIsScannerVisible(false);
    } catch (error) {
      console.error('Error adding new device from QR code:', error);
      Alert.alert(t('error'), t('invalid_qr_code'));
      setIsScannerVisible(false);
    }
  };

  const renderItem = ({ item: node, drag }) => {
    const commonProps = {
      onLongPress: drag,
      key: node.deviceKey,
      title: node.name,
      onSliderChange: (value) => publishMQTT(node.unicastAddress, node.getElementAddresses()[0], value,'BlindsLevel'),
    };

    const handlePressLamp1 = () => {
      toggleDeviceState(node, 0);
    };

    const handlePressLamp2 = () => {
      toggleDeviceState(node, 1);
    };
    const handleNavigateToControl = () => {
      navigation.navigate('TwoLampsControl', { node });
    };

    

    switch (node.pid) {
      case 0:
        return (
          <DeviceContainer
            {...commonProps}
            icon={require('../../assets/icons/lampe1.png')}
            sliderValues={{ min: 0, max: 100, initial: node.getElementStates()[0] || 0 }}
            onPress={() => navigation.navigate('BlindsControl', { node })}
            infoIcons={[
              { icon: require('../../assets/icons/chrono.png'), color: 'rgba(74, 207, 244, 1)', value: node.getChrono() + ' s' },
              { icon: require('../../assets/icons/eclat.png'), color: 'yellow', value: node.getEclat() + ' %' },
            ]}
          />
        );
      case 1:
        return (
          <DeviceContainer
            {...commonProps}
            icon={require('../../assets/icons/remote_light.png')}
            sliderValues={{ min: 0, max: 100, initial: node.getElementStates()[0] || 0 }}
            onPress={() => navigation.navigate('BlindsControl', { node })}
            infoIcons={[
              { icon: require('../../assets/icons/batterie.png'), color: 'green', value: node.getBatterie() + ' %' },
            ]}
          />
        );
      case 2:
        return (
          <TwoLampsContainer
            {...commonProps}
            onPressLamp1={handlePressLamp1}
            onPressLamp2={handlePressLamp2}
            onPress={handleNavigateToControl}
            icon1={require('../../assets/icons/lampe_dark.png')}
            icon2={require('../../assets/icons/lampe_dark.png')}
            level_A={(node.getElementStates()[0]) != null ? (node.getElementStates()[0] + ' %') : '--'}
            level_B={(node.getElementStates()[1]) != null ? (node.getElementStates()[1] + ' %') : '--'}
            infoIcons={[
              {
                icon: node.getOccupancy() === 0 || node.getOccupancy() === '--' ? require('../../assets/icons/no_one.png') : require('../../assets/icons/man.png'),
                color: node.getOccupancy() === 0 || node.getOccupancy() === '--' ? 'rgba(74, 207, 244, 1)' : 'rgba(240, 69, 32, 1)',
                value: node.getOccupancy() + ' s',
              },
              { icon: require('../../assets/icons/temperatures.png'), color: 'rgba(240, 69, 32, 1)', value: node.getTemperature() + ' °C' },
              { icon: require('../../assets/icons/humidite.png'), color: 'rgba(41, 43, 234, 1)', value: node.getHumidity() + ' %' },
              { icon: require('../../assets/icons/luminosite.png'), color: 'rgba(244, 231, 74, 1)', value: node.getLuminosity() + ' %' },
            ]}
          />
        );
      case 3:
        return (
          <DeviceContainer
            {...commonProps}
            icon={require('../../assets/icons/volet.png')}
            sliderValues={{ min: 0, max: 100, initial: node.getElementStates()[0] || 0 }}
            onPress={() => navigation.navigate('BlindsControl', { node })}
            infoIcons={[
              {
                icon: node.getOccupancy() === 0 || node.getOccupancy() === '--' ? require('../../assets/icons/no_one.png') : require('../../assets/icons/man.png'),
                color: node.getOccupancy() === 0 || node.getOccupancy() === '--' ? 'rgba(74, 207, 244, 1)' : 'rgba(240, 69, 32, 1)',
                value: node.getOccupancy() + ' s',
              },
              { icon: require('../../assets/icons/temperatures.png'), color: 'rgba(240, 69, 32, 1)', value: node.getTemperature() + ' °C' },
              { icon: require('../../assets/icons/humidite.png'), color: 'rgba(41, 43, 234, 1)', value: node.getHumidity() + ' %' },
              { icon: require('../../assets/icons/luminosite.png'), color: 'rgba(244, 231, 74, 1)', value: node.getLuminosity() + ' %' },
            ]}
          />
        );
      case 4:
        return (
          <DeviceContainer
            {...commonProps}
            icon={require('../../assets/icons/antenne.png')}
            sliderValues={{ min: 0, max: 100, initial: node.getElementStates()[0] || 0 }}
            onPress={() => navigation.navigate('BlindsControl', { node })}
            infoIcons={[
              { icon: require('../../assets/icons/batterie.png'), color: 'green', value: node.getBatterie() + ' %' },
            ]}
          />
        );
      case 5:
        return (
          <TwoLampsContainer
            {...commonProps}
            onPressLamp1={handlePressLamp1}
            onPressLamp2={handlePressLamp2}
            icon1={require('../../assets/icons/lampe_dark.png')}
            icon2={require('../../assets/icons/lampe_dark.png')}
            onPress={handleNavigateToControl}
            level_A={(node.getElementStates()[0]) ? (node.getElementStates()[0] + ' %') : '--'}
            level_B={(node.getElementStates()[1]) ? (node.getElementStates()[1] + ' %') : '--'}
            infoIcons={[
              { icon: require('../../assets/icons/chrono.png'), color: 'rgba(74, 207, 244, 1)', value: node.getChrono() + ' s' },
              { icon: require('../../assets/icons/eclat.png'), color: 'yellow', value: node.getEclat() + ' %' },
            ]}
          />
        );
      case 6:
        return (
          <DeviceContainer
            {...commonProps}
            icon={require('../../assets/icons/garage.png')}
            sliderValues={{ min: 0, max: 100, initial: node.getElementStates()[0] || 0 }}
            onPress={() => navigation.navigate('BlindsControl', { node })}
            infoIcons={[
              { icon: require('../../assets/icons/eclat.png'), color: 'yellow', value: node.getEclat() + ' %' },
            ]}
          />
        );
      case 7:
        return (
          <SwitchContainer
            {...commonProps}
            icon={require('../../assets/icons/clima.png')}
            infoIcons={[
              { icon: require('../../assets/icons/eclat.png'), color: 'yellow', value: node.getEclat() + ' %' },
            ]}
          />
        );
      case 8:
        return (
          <SwitchContainer
            {...commonProps}
            icon={require('../../assets/icons/garage1.png')}
            infoIcons={[
              { icon: require('../../assets/icons/chrono.png'), color: 'rgba(74, 207, 244, 1)', value: node.getChrono() + ' s' },
            ]}
          />
        );
      case 9:
        return (
          <SwitchContainer
            {...commonProps}
            icon={require('../../assets/icons/default.png')}
            infoIcons={[
              { icon: require('../../assets/icons/batterie.png'), color: 'green', value: node.getBatterie() + ' %' },
            ]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container , {backgroundColor :theme.$backgroundColor}]}>
      <Text style={[styles.title ,{color : theme.$textColor}]}>{t('devices_list_title')}</Text>
      <Text style={[styles.status , {color : theme.$textColor}]}>
      {isConnected ? t('mqtt_connected') : t('mqtt_connecting')}
      </Text>
      {nodes ?
        <DraggableFlatList
          data={nodes}
          renderItem={renderItem}
          keyExtractor={item => item.deviceKey}
          onDragEnd={handleDragEnd}
          contentContainerStyle={styles.scrollViewContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.$primaryColor]}
            />
          }
        /> : (
          <View style={styles.content}>
            <LottieView
              source={require('../../assets/lottiefile/nodata.json')}
              autoPlay
              loop
              style={styles.lottie_noData}
            />
            <Text style={styles.noDataText}>{t('no_devices')}</Text>
          </View>
        )}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity onPress={handleAddPress}>
          <LottieView
            source={require('../../assets/lottiefile/Add.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </TouchableOpacity>
      </View>

      <Modal visible={isScannerVisible} animationType="slide">
        <BarCodeScanner
          onBarCodeScanned={handleQRCodeRead}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.scannerOverlay}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setIsScannerVisible(false)}>
            <Text style={styles.buttonText}>{t('cancel')}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    backgroundColor: '#333',
    paddingBottom: 60
  },
  title: {
    fontSize: 24,
    margin: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollViewContainer: {
    flexGrow: 1,
    padding: 5,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  status: {
    textAlign: 'center',
    color: 'white',
    marginRight: 10
  },
  animation: {
    width: 70,
    height: 70,
  },
  onButton: {
    paddingVertical: 5,
    marginRight: 10,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  lottie_noData: {
    width: 200,
    height: 200,
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cancelButton: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
});