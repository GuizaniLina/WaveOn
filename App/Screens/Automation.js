import React, { useState, useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Alert, TouchableOpacity, RefreshControl } from 'react-native';
import AutomationContainer from './components/AutomationContainer';
import Automation from '../Class/Automation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import automationGetService from '../services/automationGetService';
import automationUpdateService from '../services/automationUpdateService';
import LottieView from 'lottie-react-native';
import { ThemeContext } from '../ThemeProvider';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

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
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation(); // Use the t function for translations
  const [automations, setAutomations] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null);
  const [isGateway, setIsGateway] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAutomation = async () => {
    try {
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const idNetwork = 1;
      const token = await AsyncStorage.getItem('token');
   
      setIsAdmin(await AsyncStorage.getItem('user_isadmin'));
      setIsGateway(await AsyncStorage.getItem('user_isgateway'));
      
      const automationResponse = await automationGetService(idclient, iduser, idNetwork, token,navigation);
      console.log('Automation data:', automationResponse);

      const automationInstances = automationResponse.automations.map(autoData => new Automation(autoData));
      setAutomations(automationInstances);
    } catch (error) {
      console.error('Erreur lors du parsing des données des automations:', error);
      Alert.alert(t('error'), t('automation_update_failed'));
    }
  };

  useEffect(() => {
    fetchAutomation();
  }, []);

  useEffect(() => {
    const checkProfileChange = async () => {
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const token = await AsyncStorage.getItem('token');
      
      if (idclient && iduser && token) {
        fetchAutomation();
      }
    };

    const unsubscribe = navigation.addListener('focus', checkProfileChange);
    return unsubscribe;
  }, [navigation]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAutomation();
    setRefreshing(false);
  };

  const handleToggleSwitch = (index) => {
    setAutomations((prevAutomations) => {
      const updatedAutomations = [...prevAutomations];
      const automation = updatedAutomations[index];
      if (automation instanceof Automation) {
        automation.state = automation.isActive() ? 0 : 1;
        saveAutomationChanges(automation);
      } else {
        console.error('L’objet automation n’est pas une instance de la classe Automation.');
      }
      return updatedAutomations;
    });
  };

  const handleEditAutomation = (automation) => {
    navigation.navigate('AutomationFormScreen', { 
      editAutomation: automation, 
      updateAutomation: handleUpdateAutomation 
    });
  };

  const handleUpdateAutomation = async (updatedAutomation) => {
    try {
      const updatedAutomations = automations.map(auto => 
        auto.idAutomation === updatedAutomation.idAutomation ? new Automation(updatedAutomation) : auto
      );
      setAutomations(updatedAutomations);
  
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const idNetwork = 1;
      const token = await AsyncStorage.getItem('token');
  
      await automationUpdateService(idclient, iduser, idNetwork, token, updatedAutomations,navigation);
      Alert.alert(t('success'), t('automation_updated'));
    } catch (error) {
      console.error('Error updating automation:', error);
      Alert.alert(t('error'), t('automation_update_failed'));
    }
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
  
      await automationUpdateService(idclient, iduser, idNetwork, token, updatedAutomations,navigation);
    } catch (error) {
      console.error('Error saving automation:', error);
      Alert.alert(t('error'), t('automation_update_failed'));
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
  
      await automationUpdateService(idclient, iduser, idNetwork, token, updatedAutomations,navigation);
      Alert.alert(t('success'), t('automation_deleted'));
    } catch (error) {
      console.error('Error deleting automation:', error);
      Alert.alert(t('error'), t('automation_delete_failed'));
    }
  };

  const handleAddAutomation = async (newAutomation) => {
    try {
      const updatedAutomations = [...automations, new Automation(newAutomation)];
      setAutomations(updatedAutomations);
  
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const idNetwork = 1;
      const token = await AsyncStorage.getItem('token');
  
      await automationUpdateService(idclient, iduser, idNetwork, token, updatedAutomations,navigation);
      Alert.alert(t('success'), t('automation_added'));
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'automation:', error);
      Alert.alert(t('error'), t('automation_add_failed'));
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.$backgroundColor }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('automation')}</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
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
                onToggle={() => ((isAdmin === '0' ) && (isGateway === '0')) ? Alert.alert(t('sorry'), t('should_be_admin_gateway')) : handleToggleSwitch(index)}
                onDelete={() => ((isAdmin === '0' ) && (isGateway === '0')) ? Alert.alert(t('sorry'), t('should_be_admin_gateway')) : handleDeleteAutomation(index)}
                onPress={() => handleEditAutomation(automation)} 
              />
            );
          } else {
            console.error('L’objet automation n’est pas une instance de la classe Automation.');
            return null;
          }
        })}
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButtonContainer} 
        onPress={() => ((isAdmin === '0' ) && (isGateway === '0')) ? Alert.alert(t('sorry'), t('should_be_admin_gateway')) : navigation.navigate('AutomationFormScreen', { addAutomation: handleAddAutomation })}>
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