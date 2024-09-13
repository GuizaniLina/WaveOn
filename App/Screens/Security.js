import securityGetService from '../services/securityGetService';
import securityUpdateService from '../services/securityUpdateService';
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Switch, SafeAreaView, Image, TouchableOpacity, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../ThemeProvider';
import { useTranslation } from 'react-i18next';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager'; // Import Task Manager for background tasks
import Node from '../Class/Node';
import throttle from 'lodash.throttle';
import moment from 'moment';

// Define background task name
const BACKGROUND_FETCH_TASK = 'check-node-occupancy-task';

const Security = ({ navigation, addNotification }) => {
  const [securityOptions, setSecurityOptions] = useState([]);
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(null);
  const [isGateway, setIsGateway] = useState(null); 
  const [localNotificationEnabled, setLocalNotificationEnabled] = useState(false); // Local state for notifications
  const [selectedNotificationNodes, setSelectedNotificationNodes] = useState([]); // Selected nodes for notification

  // Ask for notification permissions on iOS and Android
  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission for notifications was denied.');
    }
  };
  useEffect(() => {
    const checkProfileChange = async () => {
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const token = await AsyncStorage.getItem('token');
      if (idclient && iduser && token) {
        fetchSecurity();
      }
    };

    const unsubscribe = navigation.addListener('focus', checkProfileChange);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    requestNotificationPermissions();
    fetchSecurity();

    // Register background fetch task
    registerBackgroundFetchTask();
  }, []);

  // Fetch security options and notification nodes
  const fetchSecurity = async () => {
    try {
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const idNetwork = 1;
      const token = await AsyncStorage.getItem('token');
      const USER_ID = await AsyncStorage.getItem('idclient');

      setIsAdmin(await AsyncStorage.getItem('user_isadmin'));
      setIsGateway(await AsyncStorage.getItem('user_isgateway'));

      const securityResponse = await securityGetService(idclient, iduser, idNetwork, token);
      setSecurityOptions(securityResponse.securityOption);

      const storedNotificationNodes = await AsyncStorage.getItem(`storedNotificationNodes_${USER_ID}`);
      if (storedNotificationNodes) {
        setSelectedNotificationNodes(JSON.parse(storedNotificationNodes));
      }

      const storedLocalNotificationEnabled = await AsyncStorage.getItem(`localNotificationEnabled_${USER_ID}`);
      if (storedLocalNotificationEnabled !== null) {
        setLocalNotificationEnabled(JSON.parse(storedLocalNotificationEnabled));
      }
    } catch (error) {
      console.error(t('fetch_security_error'), error);
    }
  };

  // Throttle node occupancy checks
  const checkNodeOccupancy = throttle(async () => {
    try {
      const USER_ID = await AsyncStorage.getItem('idclient');
      const nodesString = await AsyncStorage.getItem(`nodes_${USER_ID}`);

      if (nodesString) {
        const nodes = JSON.parse(nodesString).map(data => new Node(data));
        const filteredNodes = nodes.filter(node => selectedNotificationNodes.includes(node.unicastAddress));

        filteredNodes.forEach(node => {
          if (node.getOccupancy() > 0 && localNotificationEnabled) {
            sendLocalNotification(node.name); // Trigger notification if occupancy > 0
          }
        });
      }
    } catch (error) {
      console.error('Error checking node occupancy:', error);
    }
  }, 5000);

  // Background fetch task function
  const checkNodeOccupancyInBackground = async () => {
    try {
      console.log('Running background task...');
      await checkNodeOccupancy(); // Call the same logic used for checking node occupancy
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
      console.error('Error in background task:', error);
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  };

  // Register the background task
  const registerBackgroundFetchTask = async () => {
    try {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 15 * 60, // 15 minutes
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log('Background fetch task registered');
    } catch (error) {
      console.error('Error registering background fetch task:', error);
    }
  };

  // Define the background task with TaskManager
  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    return checkNodeOccupancyInBackground();
  });

  const sendLocalNotification = async (nodeName) => {
    try {
      const user = await AsyncStorage.getItem('user');
      const parsedUser = JSON.parse(user);
      const message = `${parsedUser.clientname}\n${nodeName} detected movement!`;
    
    // Add to notification array in Accueil component
    addNotification(message);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Occupancy Alert',
          body: `${parsedUser.clientname}\n${nodeName} detected movement!`,
          sound: true,
        },
        trigger: null, // Immediate notification
      });
      console.log("Notification scheduled successfully");
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleNotificationToggle = async () => {
    const USER_ID = await AsyncStorage.getItem('idclient');
    const newValue = !localNotificationEnabled;
    setLocalNotificationEnabled(newValue);
    await AsyncStorage.setItem(`localNotificationEnabled_${USER_ID}`, JSON.stringify(newValue));
  };

  const handleToggle = async (option) => {
    if (option.name === 'Send Notification') {
      handleNotificationToggle();
    } else {
      try {
        const updatedOptions = securityOptions.map(item =>
          item.idSecurityOption === option.idSecurityOption ? { ...item, enable: !item.enable } : item
        );
        setSecurityOptions(updatedOptions);
        await AsyncStorage.setItem('securityOption', JSON.stringify(updatedOptions));

        const storedConfig = await AsyncStorage.getItem('securityConfig');
        const securityConfig = storedConfig ? JSON.parse(storedConfig) : {};
        const idclient = await AsyncStorage.getItem('idclient');
        const iduser = await AsyncStorage.getItem('iduser');
        const idNetwork = 1;
        const token = await AsyncStorage.getItem('token');
        const updateSecurityTriggers = JSON.parse(await AsyncStorage.getItem('securityTriggers'));

        await securityUpdateService(idclient, iduser, idNetwork, token, updatedOptions, securityConfig, updateSecurityTriggers);
      } catch (error) {
        console.error(t('update_option_error'), error);
      }
    }
  };

  const triggerTestNotification = () => {
    sendLocalNotification("Test Device");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.$backgroundColor }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('security')}</Text>
        <TouchableOpacity style={styles.paramButton} onPress={() => navigation.navigate('SecurityConfig')}>
          <Image source={require('../../assets/icons/default.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      {securityOptions.map(option => (
        <TouchableOpacity
          style={[styles.optionContainer, { backgroundColor: theme.$standard }]}
          key={option.idSecurityOption}
          onPress={() => navigation.navigate('DeviceSelectorScreen', { option: option.name })}
        >
          <Image
            source={getIcon(option.name)}
            style={[styles.optionIcon, { tintColor: theme.$textColor }]}
          />
          <Text style={[styles.optionText, { color: theme.$textColor }]}>{t(option.name.toLowerCase().replace(/ /g, '_'))}</Text>
          <Switch
            value={option.name === 'Send Notification' ? localNotificationEnabled : option.enable}
            onValueChange={() => handleToggle(option)}
            trackColor={{ false: theme.$standard, true: 'rgba(153, 222, 160, 0.74)' }}
            thumbColor={option.name === 'Send Notification' ? (localNotificationEnabled ? theme.$standard : theme.$standard) : theme.$standard }
          />
        </TouchableOpacity>
      ))}

      <View style={styles.testButtonContainer}>
        <Button title="Send Test Notification" onPress={triggerTestNotification} />
      </View>
    </SafeAreaView>
  );
};

const getIcon = (name) => {
  switch (name) {
    case 'Send Notification':
      return require('../../assets/icons/notification.png');
    case 'Send Email':
      return require('../../assets/icons/email.png');
    case 'Send SMS':
      return require('../../assets/icons/sms.png');
    case 'Alarm':
      return require('../../assets/icons/feu.png');
    default:
      return require('../../assets/icons/lampe1.png');
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  header: {
    backgroundColor: '#58c487',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderBottomEndRadius: 35,
    borderBottomStartRadius: 35,
    height: 120,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 35,
    color: '#FFF',
    marginTop: 40,
    marginLeft: '33%',
  },
  paramButton: {
    marginTop: 40,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#FFF',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    padding: 16,
    borderRadius: 25,
    marginBottom: 16,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
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
  testButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default Security;
