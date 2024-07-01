import {React,useState,useEffect} from 'react';
import { ScrollView,Alert, StyleSheet, Text, View } from 'react-native';
import DeviceContainer from './components/DeviceContainer';
import LampContainer from './components/TwoLampsContainer';
import TwoLampsContainer from './components/TwoLampsContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Devices() {
  const [nodes, setNodes] = useState([]);
  useEffect(() => {
    const fetchNodes = async () => {
      try {
  const nodesString = await AsyncStorage.getItem('nodes');
  setNodes(JSON.parse(nodesString) )
 // let DeviceArray = [];
  }catch (error) {
        console.error('Erreur lors du parsing des données des affectations:', error);
        Alert.alert('Erreur', 'Erreur lors de la récupération des données des affectations');
    }
  const deviceData = [
    { 
      type:1,
      title: 'Title 1',
      icon: require('../../assets/icons/volet.png'),
      sliderValues: { min: 0, max: 100 },
      infoIcons: [
        { icon: require('../../assets/icons/oeil.png'), color: 'rgba(74, 207, 244, 1)', value: '--' },
        { icon: require('../../assets/icons/temperatures.png'), color: 'rgba(240, 69, 32, 1)', value: '--' },
        { icon: require('../../assets/icons/humidite.png'), color: 'rgba(41, 43, 234, 1)', value: '--' },
        { icon: require('../../assets/icons/luminosite.png'), color: 'rgba(244, 231, 74, 1)', value: '--' },
      ],
    },
    {
      type:1,
      title: 'Title 2',
      icon: require('../../assets/icons/remote_dark.png'),
      sliderValues: { min: 0, max: 100 },
      infoIcons: [
        { icon: require('../../assets/icons/batterie.png'), color: 'red', value: '20%' },
      ],
    },
    { 
      type:2,
      title: 'Title 3',
      icon1: require('../../assets/icons/lampe_dark.png'),
      icon2: require('../../assets/icons/lampe_dark.png'),
      slider_1_Values: { min: 0, max: 100 },
      slider_2_Values: { min: 0, max: 100 },
      infoIcons: [
        { icon: require('../../assets/icons/oeil.png'), color: 'rgba(74, 207, 244, 1)', value: '--' },
        { icon: require('../../assets/icons/temperatures.png'), color: 'rgba(240, 69, 32, 1)', value: '--' },
        { icon: require('../../assets/icons/humidite.png'), color: 'rgba(41, 43, 234, 1)', value: '--' },
        { icon: require('../../assets/icons/luminosite.png'), color: 'rgba(244, 231, 74, 1)', value: '--' },
      ],
    },
    { 
      type:2,
      title: 'Title 4',
      icon1: require('../../assets/icons/lampe1.png'),
      icon2: require('../../assets/icons/lampe1.png'),
      slider_1_Values: { min: 0, max: 100 },
      slider_2_Values: { min: 0, max: 100 },
      infoIcons: [
        { icon: require('../../assets/icons/chrono.png'), color: 'rgba(74, 207, 244, 1)', value: '--' },
        { icon: require('../../assets/icons/eclat.png'), color: 'rgba(240, 69, 32, 1)', value: '--' },

      ],
    },
    
  ];
  fetchNodes();
}}, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{'Liste des Appareils'}</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {nodes.map((device, index) => (
          device.type === 1 ? (
          <DeviceContainer
            key={index}
            title={device.title}
            icon={device.icon}
            sliderValues={device.sliderValues}
            infoIcons={device.infoIcons}
          />
        ) : (
          <TwoLampsContainer key={index}
          title={device.title}
           icon1={device.icon1} 
          icon2={device.icon2}
          slider_1_Values={device.slider_1_Values}
          slider_2_Values={device.slider_2_Values}
          infoIcons={device.infoIcons}/>
        )
         
        ))}
       
      </ScrollView>
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