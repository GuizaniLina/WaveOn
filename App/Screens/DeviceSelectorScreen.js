import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../ThemeProvider';
import { useTranslation } from 'react-i18next';
import { FontAwesome5 } from '@expo/vector-icons';
import Node from '../Class/Node';  // Import the Node class
import securityUpdateService from '../services/securityUpdateService';  // Import the security update service

const DeviceSelectorScreen = ({ navigation, route }) => {
  const { theme } = useContext(ThemeContext);  // Get theme context
  const { t } = useTranslation();  // Use translation hook
  let { option } = route.params;  // Get the security option (e.g., 'send sms', 'send notification', 'alarm')

  // Map the option value to the correct trigger field
  const optionMap = {
    'send sms': 'sms',
    'send email': 'email',
    'send notification': 'notification',
    'alarm': 'alarm'
  };

  // Map the option to the correct key in the trigger
  option = optionMap[option.toLowerCase()];  // Convert the option to the correct field in the trigger
  
  const [nodes, setNodes] = useState([]);  // Store the nodes
  const [selectedDevices, setSelectedDevices] = useState({});  // Track selected devices
  const [securityTriggers, setSecurityTriggers] = useState([]);  // Store the security triggers

  useEffect(() => {
    const fetchDevicesAndTriggers = async () => {
      try {
        const USER_ID = await AsyncStorage.getItem('idclient');  // Get client ID
        const nodesString = await AsyncStorage.getItem(`nodes_${USER_ID}`);  // Fetch nodes from AsyncStorage
        const triggersString = await AsyncStorage.getItem('securityTriggers');  // Fetch security triggers from AsyncStorage
        
        if (nodesString && triggersString) {
          // Parse nodes data and convert each to a Node instance
          const parsedNodes = JSON.parse(nodesString).map(data => new Node(data));
          setNodes(parsedNodes);  // Set nodes in state

          // Parse the security triggers
          const parsedTriggers = JSON.parse(triggersString);
          setSecurityTriggers(parsedTriggers);  // Set security triggers

          // Initialize selectedDevices based on triggers
          const initialSelectedDevices = {};
          parsedTriggers.forEach(trigger => {
            if (trigger[option] === 1) {
              initialSelectedDevices[trigger.unicast] = true;  // Mark the device with unicast as selected
            }
          });

          setSelectedDevices(initialSelectedDevices);  // Set selected devices based on security triggers
        } else {
          console.warn('No nodes or security triggers data found in AsyncStorage.');
          setNodes([]);  // Set an empty array if no devices are found
        }
      } catch (error) {
        console.error('Error fetching nodes or security triggers:', error);
        Alert.alert(t('error'), t('error_retrieving_nodes_or_triggers'));
      }
    };

    fetchDevicesAndTriggers();
  }, [option]);  // Re-run when the option changes (sms, email, etc.)

  // Function to toggle the selection state of a device and update the server
  const toggleDevice = async (unicastAddress) => {
    const updatedDevices = {
      ...selectedDevices,
      [unicastAddress]: !selectedDevices[unicastAddress],  // Toggle device selection
    };

    setSelectedDevices(updatedDevices);  // Update the local state

    let deviceInTriggers = false;
    const updateSecurityTriggers = securityTriggers.map(trigger => {
      if (trigger.unicast === unicastAddress) {
        deviceInTriggers = true;
        return {
          ...trigger,
          [option]: updatedDevices[unicastAddress] ? 1 : 0,  // Update the option (alarm, sms, etc.)
        };
      }
      return trigger;
    });

    // If device is not in triggers, create a new one
    if (!deviceInTriggers) {
      const newTrigger = {
        id: securityTriggers.length + 1,  // Generate a new id, this may come from the server if needed
        idNetwork: 1,  // Assuming network ID is 1, adjust if needed
        unicast: unicastAddress,  // Use the correct unicast address
        notification: 0,
        sms: 0,
        email: 0,
        alarm: 0,
        sensor_type: 'occupancy',  // Define the sensor type, adjust if necessary
        custom_security_id: 0,
        [option]: updatedDevices[unicastAddress] ? 1 : 0,  // Set the selected option to 1
      };

      updateSecurityTriggers.push(newTrigger);  // Add the new trigger to the triggers array
    }

    setSecurityTriggers(updateSecurityTriggers);  // Update the local triggers state

    // Save the updated triggers back to AsyncStorage
    try {
      await AsyncStorage.setItem('securityTriggers', JSON.stringify(updateSecurityTriggers));  // Save to AsyncStorage
      console.log('Updated security triggers saved locally');
    } catch (error) {
      console.error('Error saving security triggers to AsyncStorage:', error);
    }

     // If the option is "send notification", update storedNotificationNodes
  if (option === 'notification') {
    const selectedNotificationNodes = Object.keys(updatedDevices).filter(unicast => updatedDevices[unicast]);
    try {
      const USER_ID = await AsyncStorage.getItem('idclient');
      await AsyncStorage.setItem(`storedNotificationNodes_${USER_ID}`, JSON.stringify(selectedNotificationNodes));
      console.log('Selected notification nodes saved:', selectedNotificationNodes);
    } catch (error) {
      console.error('Error saving notification nodes:', error);
    }
  }
    // Now call the server update service to sync the changes
    try {
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const idNetwork = 1;  // Set network ID
      const token = await AsyncStorage.getItem('token');
      const securityOption = JSON.parse(await AsyncStorage.getItem('securityOption'));
      const updateSecurityConfig = JSON.parse(await AsyncStorage.getItem('securityConfig'));

      // Call the security update service
      await securityUpdateService(idclient, iduser, idNetwork, token, securityOption, updateSecurityConfig, updateSecurityTriggers);

      console.log('Security options updated successfully on the server');
    } catch (error) {
      console.error('Error updating security on server:', error);
      Alert.alert(t('error'), t('update_option_error'));
    }
  };

  // Render the nodes
  return (
    <View style={[styles.container, { backgroundColor: theme.$backgroundColor }]}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={24} color={theme.$iconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={''}>
          <Image source={require('../../assets/icons/notification.png')} style={[styles.icon, { tintColor: theme.$iconColor }]} />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t(`automation_form.select_devices`)}</Text>
      </View>
      
      <FlatList
        data={nodes}  // Use the original nodes without transformation
        keyExtractor={(item) => item.deviceKey}  // Use deviceKey as the unique key
        renderItem={({ item }) => (
          <View 
  style={[
    styles.deviceItem, 
    selectedDevices[item.unicastAddress] 
      ?  {backgroundColor: 'rgba(112, 160, 214, 0.5)'}
      : {backgroundColor: theme.$standard}
  ]}>
            <View style={styles.deviceInfo}>
              <Text style={[styles.deviceName, { color: theme.$textColor }]}>{t(item.name)}</Text>
            </View>
            {/* FontAwesome5 square checkbox */}
            <TouchableOpacity onPress={() => toggleDevice(item.unicastAddress)}>
              <FontAwesome5
                name={selectedDevices[item.unicastAddress] ? 'check-square' : 'square'}
                size={24}  // Set the size of the checkbox
                color={theme.$textColor}  // Use theme color for the checkbox
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#58c487',
    alignItems: 'center',
    borderBottomEndRadius: 35,
    borderBottomStartRadius: 35,
    height: 70,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 30,
    color: '#FFF',
    marginTop: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#58c487',
    height: 90,
  },
  icon: {
    width: 24,
    height: 24,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceName: {
    fontSize: 18,
  },
});

export default DeviceSelectorScreen;
