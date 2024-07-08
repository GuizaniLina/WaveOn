import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import AutomationContainer from './components/AutomationContainer';
import Automation from '../Class/Automation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import automationGetService from '../services/automationGetService';
import LottieView from 'lottie-react-native';

const ICONS = {
  '-2': require('../../assets/icons/mix.png'), // Mixed
  '-1': require('../../assets/icons/appel.png'), // Phone
  '0': require('../../assets/icons/lampe1.png'), // Lampe
  '1': require('../../assets/icons/outlet.png'), // Outlet
  '2': require('../../assets/icons/dual_lampe.png'), // Dual Lampe
  '3': require('../../assets/icons/volet.png'), // Blinds
  '5': require('../../assets/icons/dual_lampe.png'), // Micro Dual Bulb
  '6': require('../../assets/icons/volet.png'), // Micro Blinds
  '7': require('../../assets/icons/devices.png'), // Micro Switch Module
  '8': require('../../assets/icons/default.png'), // Micro Gate Controller
  // Ajoutez d'autres icônes si nécessaire
};

const AutomationScreen = () => {
  const [automations, setAutomations] = useState([]);

  useEffect(() => {
    const fetchAutomation = async () => {
      try {
        const idclient = await AsyncStorage.getItem('idclient');
        const iduser = await AsyncStorage.getItem('iduser');
        const idNetwork = 1;
        const token = await AsyncStorage.getItem('token');

        const automationResponse = await automationGetService(idclient, iduser, idNetwork, token);
        console.log('Automation data:', automationResponse);

        const automationInstances = automationResponse.automations.map(autoData => new Automation(autoData));
        setAutomations(automationInstances);
      } catch (error) {
        console.error('Erreur lors du parsing des données des automations:', error);
        Alert.alert('Erreur', 'Erreur lors de la récupération des données des automations');
      }
    };

    fetchAutomation();
  }, []);

  const handleToggleSwitch = (index) => {
    setAutomations((prevAutomations) => {
      const updatedAutomations = [...prevAutomations];
      const automation = updatedAutomations[index];
      if (automation instanceof Automation) {
        automation.state = automation.isActive() ? 0 : 1;  // Toggle state
        console.log(`Updated automation state: ${automation.state}`);
      } else {
        console.error('L’objet automation n’est pas une instance de la classe Automation.');
      }
      return updatedAutomations;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Automation</Text>
      </View>

      <ScrollView>
        {automations.map((automation, index) => {
          if (automation instanceof Automation) {
            return (
              <AutomationContainer
                key={index}
                icon={ICONS[automation.targetType] || require('../../assets/icons/default.png')}
                text={automation.name}
                isEnabled={automation.isActive()}
                toggleSwitch={() => handleToggleSwitch(index)}
              />
            );
          } else {
            console.error('L’objet automation n’est pas une instance de la classe Automation.');
            return null;
          }
        })}

        
      </ScrollView>

      {/* Animation Lottie pour l'ajout */}
      <View style={styles.addButtonContainer}>
        <LottieView
          source={require('../../assets/lottiefile/Add.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    padding: 16,
  },
  header: {
    backgroundColor: '#58c487',
    alignItems: 'center',
    borderBottomEndRadius: 35,
    borderBottomStartRadius: 35,
    height: 120,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 35,
    color: '#FFF',
    marginTop: 40,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    padding: 16,
    borderRadius: 25,
    marginBottom: 16,
  },
  optionIcon: {
    width: 30,
    height: 30,
    marginRight: 20,
    tintColor: '#FFF',
  },
  optionText: {
    fontSize: 18,
    color: '#FFF',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,  // Laissez un espace pour la vue fixe
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

export default AutomationScreen;