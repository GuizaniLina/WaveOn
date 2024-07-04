import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import DeviceContainer from './components/DeviceContainer';
import TwoLampsContainer from './components/TwoLampsContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwitchContainer from './components/SwitchContainer';
import Node from '../Class/Node';

export default function Devices() {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const nodesString = await AsyncStorage.getItem('nodes');
        if (nodesString) {
          setNodes(JSON.parse(nodesString).map(data => new Node(data)));
        } else {
          console.warn('No nodes data found in AsyncStorage.');
          setNodes([]);
        }
      } catch (error) {
        console.error('Erreur lors du parsing des données des affectations:', error);
        Alert.alert('Erreur', 'Erreur lors de la récupération des données des affectations');
        setNodes([]);
      }
    };

    fetchNodes();
  }, []);
  const handleDragEnd = async ({ data }) => {
    setNodes(data);
    try {
      await AsyncStorage.setItem('nodes', JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
      Alert.alert('Erreur', 'Erreur lors de la sauvegarde des données');
    }
  };

  const renderItem = ({ item: node, drag }) => {
    switch (node.pid) {
      case "0000":
        return (
          <DeviceContainer
            onLongPress={drag}
            key={node.deviceKey}
            title={node.name}
            icon={require('../../assets/icons/lampe1.png')}
            sliderValues={{ min: 0, max: 100 }}
            infoIcons={[
              { icon: require('../../assets/icons/chrono.png'), color: 'rgba(74, 207, 244, 1)', value: node.getChrono() },
              { icon: require('../../assets/icons/eclat.png'), color: 'yellow', value: node.getEclat() },
            ]}
          />
        );
      case "0001":
        return (
          <DeviceContainer
            onLongPress={drag}
            key={node.deviceKey}
            title={node.name}
            icon={require('../../assets/icons/remote_light.png')}
            sliderValues={{ min: 0, max: 100 }}
            infoIcons={[
              { icon: require('../../assets/icons/batterie.png'), color: 'green', value: node.getBatterie() },
            ]}
          />
        );
      case "0002":
        return (
          <TwoLampsContainer
            onLongPress={drag}
            key={node.deviceKey}
            title={node.name}
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
      case "0003":
        return (
          <DeviceContainer
            onLongPress={drag}
            key={node.deviceKey}
            title={node.name}
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
      case "0004":
        return (
          <DeviceContainer
            onLongPress={drag}
            key={node.deviceKey}
            title={node.name}
            icon={require('../../assets/icons/antenne.png')}
            sliderValues={{ min: 0, max: 100 }}
            infoIcons={[
              { icon: require('../../assets/icons/batterie.png'), color: 'green', value: node.getBatterie() },
            ]}
          />
        );
      case "0005":
        return (
          <TwoLampsContainer
            onLongPress={drag}
            key={node.deviceKey}
            title={node.name}
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
      case "0006":
        return (
          <DeviceContainer
            onLongPress={drag}
            key={node.deviceKey}
            title={node.name}
            icon={require('../../assets/icons/garage.png')}
            sliderValues={{ min: 0, max: 60 }}
            infoIcons={[
              { icon: require('../../assets/icons/eclat.png'), color: 'yellow', value: node.getEclat() },
            ]}
          />
        );
      case "0007":
        return (
          <SwitchContainer
            onLongPress={drag}
            key={node.deviceKey}
            title={node.name}
            icon={require('../../assets/icons/default.png')}
            infoIcons={[
              { icon: require('../../assets/icons/eclat.png'), color: 'yellow', value: node.getEclat() },
            ]}
          />
        );
      case "0008":
        return (
          <SwitchContainer
            onLongPress={drag}
            key={node.deviceKey}
            title={node.name}
            icon={require('../../assets/icons/default.png')}
            infoIcons={[
              { icon: require('../../assets/icons/chrono.png'), color: 'rgba(74, 207, 244, 1)', value: node.getChrono() },
            ]}
          />
        );
      case "0009":
        return (
          <SwitchContainer
            onLongPress={drag}
            key={node.deviceKey}
            title={node.name}
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
      <DraggableFlatList
        data={nodes}
        renderItem={renderItem}
        keyExtractor={item => item.deviceKey}
        onDragEnd={handleDragEnd}
        contentContainerStyle={styles.scrollViewContainer}
      />
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
    marginTop: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  scrollViewContainer: {
    flexGrow: 1,
    padding: 5,
  },
});