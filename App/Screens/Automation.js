import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import AutomationContainer from './components/AutomationContainer';
import Automation from '../Class/Automation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import automationGetService from '../services/automationGetService';
import automationUpdateService from '../services/automationUpdateService';
import LottieView from 'lottie-react-native';

const ICONS = {
  '-2': require('../../assets/icons/mix.png'),
  '-1': require('../../assets/icons/appel.png'),
  '0': require('../../assets/icons/lampe1.png'),
  '1': require('../../assets/icons/outlet.png'),
  '2': require('../../assets/icons/dual_lampe.png'),
  '3': require('../../assets/icons/volet.png'),
  '5': require('../../assets/icons/dual_lampe.png'),
  '6': require('../../assets/icons/volet.png'),
  '7': require('../../assets/icons/devices.png'),
  '8': require('../../assets/icons/default.png'),
  '9': require('../../assets/icons/alarme.png')
};

const AutomationScreen = ({ navigation }) => {
  const [automations, setAutomations] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null);
  const [isGateway, setIsGateway] = useState(null);

  useEffect(() => {
    const fetchAutomation = async () => {
      try {
        const idclient = await AsyncStorage.getItem('idclient');
        const iduser = await AsyncStorage.getItem('iduser');
        const idNetwork = 1;
        const token = await AsyncStorage.getItem('token');
        const ad = await AsyncStorage.getItem('user_isadmin')
        setIsAdmin ( await AsyncStorage.getItem('user_isadmin'));
         setIsGateway (  await AsyncStorage.getItem('user_isgateway'));
        
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
        // Toggle the state
        automation.state = automation.isActive() ? 0 : 1;
        console.log(`Updated automation state: ${automation.state}`);
        
        // Save the updated automation (e.g., API call or local storage update)
        saveAutomationChanges(automation); // This is a function you need to implement
      } else {
        console.error('L’objet automation n’est pas une instance de la classe Automation.');
      }
      return updatedAutomations;
    });
  };
  
  const saveAutomationChanges = async (automation) => {
    try {
      const updatedAutomations = automations.map((auto) => 
        auto.idAutomation === automation.idAutomation ? automation : auto
      );
      setAutomations(updatedAutomations);
  
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const idNetwork = 1;
      const token = await AsyncStorage.getItem('token');
  
      await automationUpdateService(idclient, iduser, idNetwork, token, updatedAutomations);
     
    } catch (error) {
      console.error('Error saving automation:', error);
      Alert.alert('Error', 'Failed to save automation. Please try again.');
    }
  };
  const handleDeleteAutomation = async (indexToDelete) => {
    try {
      const updatedAutomations = automations.filter((_, index) => index !== indexToDelete);
      setAutomations(updatedAutomations);
  
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const idNetwork = 1;
      const token = await AsyncStorage.getItem('token');
  
      await automationUpdateService(idclient, iduser, idNetwork, token, updatedAutomations);
      Alert.alert('Success', 'Automation deleted successfully');
    } catch (error) {
      console.error('Error deleting automation:', error);
      Alert.alert('Error', 'Failed to delete automation. Please try again.');
    }
  };
  const handleAddAutomation = async (newAutomation) => {
    try {
      const updatedAutomations = [...automations, new Automation(newAutomation)];
      console.log('updatedAutomations',updatedAutomations),
      setAutomations(updatedAutomations);
  
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const idNetwork = 1;
      const token = await AsyncStorage.getItem('token');
  
      await automationUpdateService(idclient, iduser, idNetwork, token, updatedAutomations);
      Alert.alert('Success', 'Automation added successfully');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'automation:', error);
      Alert.alert('Erreur', 'Erreur lors de l\'ajout de l\'automation');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Automation</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {automations.map((automation, index) => {
          if (automation instanceof Automation) {
            return (
              <AutomationContainer
                key={index}
                icon={
                  automation.eventType === 2 ? ICONS[9] : ICONS[automation.targetType] || require('../../assets/icons/default.png')
                }
                text={automation.name}
                isEnabled={automation.isActive()}
                onToggle={() => ((isAdmin==='0' )&&(isGateway==='0')) ? Alert.alert('Sorry', 'Should be an Admin or Gateway'):handleToggleSwitch(index)}
                onDelete={() =>((isAdmin==='0' )&&(isGateway==='0')) ? Alert.alert('Sorry', 'Should be an Admin or Gateway'): handleDeleteAutomation(index)}
              />
            );
          } else {
            console.error('L’objet automation n’est pas une instance de la classe Automation.');
            return null;
          }
        })}
      </ScrollView>

      <TouchableOpacity style={styles.addButtonContainer} onPress={() => ((isAdmin==='0' )&&(isGateway==='0')) ? Alert.alert('Sorry', 'Should be an Admin or Gateway') :navigation.navigate('AutomationFormScreen', { addAutomation: handleAddAutomation }) }>
        <LottieView
          source={require('../../assets/lottiefile/Add.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
      </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: 100,
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