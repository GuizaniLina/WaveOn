import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
  // Adjust the path as needed
import automationUpdateService from '../services/automationUpdateService';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome5 } from '@expo/vector-icons';
import ModalSelector from 'react-native-modal-selector';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Node from '../Class/Node'; 
import automation from '../Class/Automation'; // Import the automation class

const AutomationFormScreen = ({ navigation, route }) => {
  const { addAutomation } = route.params;

  const [name, setName] = useState('');
  const [eventType, setEventType] = useState(0); // Default to the first numeric event type
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [condition, setCondition] = useState(automation.TEMPERATURE); // Default to first condition type
  const [operator, setOperator] = useState(automation.GREATER); // Default to first operator
  const [value, setValue] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]); // Add state for selected device


  const daysOfWeek = [
    { key: 0, label: 'Lundi' },
    { key: 1, label: 'Mardi' },
    { key: 2, label: 'Mercredi' },
    { key: 3, label: 'Jeudi' },
    { key: 4, label: 'Vendredi' },
    { key: 5, label: 'Samedi' },
    { key: 6, label: 'Dimanche' },
  ];

  const toggleDaySelection = (dayKey) => {
    setSelectedDays((prevSelectedDays) =>
      prevSelectedDays.includes(dayKey)
        ? prevSelectedDays.filter((key) => key !== dayKey)
        : [...prevSelectedDays, dayKey]
    );
  };

  useEffect(() => {
    validateForm();
    const fetchDevices = async () => {
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
        Alert.alert('Error', 'Error retrieving nodes data');
        setNodes([]);
      }
    };

    fetchDevices();
  }, []);

  const validateForm = () => {
    if (name.trim() !== '' && eventType !== null && (eventType !== 0 || (condition !== null && operator !== null && value.trim() !== ''))) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Starting submission...");
  
      if (!name) {
        Alert.alert('Error', 'Please enter a name for the automation.');
        return;
      }
  
      const idAutomation = Math.floor(Date.now() / 1000);
  
      const automationData = [{
        idAutomation ,
        idNetwork: 1,
        name ,
        state: 1,
        eventType,
        targetType: 0,
        automationTargets: '',
        automationTimes: eventType === 2 ? date.toISOString() : '',
        automationTriggers: eventType === 0 ? `${condition}:${operator}:${value}` : '',
      }];
  
      console.log('Automation data:', automationData);
  
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const token = await AsyncStorage.getItem('token');
      const idNetwork =1;
      
      console.log("Making service call...");
  
      //const updateResponse = await automationUpdateService(idclient, iduser, idNetwork, token, [automationData]);
      console.log('Update response:', automationData[0]);
  
      addAutomation(automationData[0]);
      navigation.goBack();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      Alert.alert('Error', 'Failed to update automation. Please try again.');
    }
  };
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const eventTypeData = [
    { key: 0, label: 'On Request' },
    { key: 1, label: 'Network' },
    { key: 2, label: 'Schedule' },
    { key: 3, label: 'External API' },
    { key: 4, label: 'Alarm' },
  ];

  const conditionData = [
    { key: automation.TEMPERATURE, label: 'Temperature' },
    { key: automation.HUMIDITY, label: 'Humidity' },
    { key: automation.OCCUPANCY, label: 'Occupancy' },
    { key: automation.LUMINOSITY, label: 'Luminosity' },
  ];

  const operatorData = [
    { key: automation.GREATER, label: 'Superieur' },
    { key: automation.LESS, label: 'Inferieur' },
    { key: automation.EQUAL, label: 'Egale' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={''}>
          <Image source={require('../../assets/icons/notification.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Automation</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={text => {
            setName(text);
            validateForm();
          }}
        />

        <Text style={styles.label}>Type Evenement</Text>
        <ModalSelector
          data={eventTypeData}
          initValue="Select event type"
          onChange={(option) => {
            setEventType(option.key);
            validateForm();
          }}
          style={styles.selector}
        >
          <TextInput
            style={styles.input}
            editable={false}
            placeholder="Select event type"
            value={eventTypeData.find(item => item.key === eventType)?.label}
          />
        </ModalSelector>

        {eventType === 0 && (
          <View style={styles.conditionalContainer}>
            <Text style={styles.label}>Si</Text>
            <ModalSelector
              data={conditionData}
              initValue="Select condition"
              onChange={(option) => {
                setCondition(option.key);
                validateForm();
              }}
              style={styles.selector}
            >
              <TextInput
                style={styles.input}
                editable={false}
                placeholder="Select condition"
                value={conditionData.find(item => item.key === condition)?.label}
              />
            </ModalSelector>

            <Text style={styles.label}>Est</Text>
            <ModalSelector
              data={operatorData}
              initValue="Select operator"
              onChange={(option) => {
                setOperator(option.key);
                validateForm();
              }}
              style={styles.selector}
            >
              <TextInput
                style={styles.input}
                editable={false}
                placeholder="Select operator"
                value={operatorData.find(item => item.key === operator)?.label}
              />
            </ModalSelector>

            <Text style={styles.label}>à</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={text => {
                setValue(text);
                validateForm();
              }}
              keyboardType="numeric"
            />

            <ModalSelector
              data={nodes.map(device => ({ key: device.deviceKey, label: device.name }))}
              initValue="Select Device"
              onChange={(option) => setSelectedDevice(option.key)}
              style={styles.selector}
            ><Text style={styles.label}>Forcer</Text>
              <TextInput
                style={styles.input}
                editable={false}
                placeholder="Select Device"
                value={nodes.find(item => item.deviceKey === selectedDevice)?.name}
              />
            </ModalSelector>
          </View>
        )}
           {eventType === 1 && (
          <View style={styles.conditionalContainer}>
            <Text style={styles.label}>Déclencheur</Text>
           
             <TextInput
              style={styles.input}
              value={value}
              onChangeText={text => {
                setValue(text);
                validateForm();
              }}
              keyboardType="numeric"
            />
           
            </View>
           )}
        {eventType === 2 && (
          <View style={styles.planificationContainer}>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.label}>De</Text>
            <TextInput
              style={styles.input}
              value={date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              onFocus={() => setShowDatePicker(true)}
            />
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
          <View style={styles.daySelectionContainer}>
  {daysOfWeek.map((day) => (
    <TouchableOpacity
      key={day.key}
      style={[
        styles.dayButton,
        selectedDays.includes(day.key) && styles.dayButtonSelected,
      ]}
      onPress={() => toggleDaySelection(day.key)}
    >
      <Text
        style={[
          styles.dayButtonText,
          selectedDays.includes(day.key) && styles.dayButtonTextSelected,
        ]}
      >
        {day.label}
      </Text>
    </TouchableOpacity>
  ))}
</View>
          <ModalSelector
              data={nodes.map(device => ({ key: device.deviceKey, label: device.name }))}
              initValue="Select Device"
              onChange={(option) => setSelectedDevice(option.key)}
              style={styles.selector}
            ><Text style={styles.label}>Forcer</Text>
              <TextInput
                style={styles.input}
                editable={false}
                placeholder="Select Device"
                value={nodes.find(item => item.deviceKey === selectedDevice)?.name}
              />
            </ModalSelector>
        </View>
      )}

      </View>
      <TouchableOpacity
        style={[styles.addButton, !isFormValid && { backgroundColor: 'gray' }]}
        onPress={handleSubmit}
        disabled={!isFormValid}
      >
        <Text style={[styles.addButtonText, !isFormValid && { color: 'rgba(69, 69, 69, 0.75)' }]}>Add Automation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor : '#333'
  },
  backgroundAnimation: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    fontSize: 35,
    color: '#FFF',
    marginTop: 10,
  },
  header: {
    backgroundColor: '#58c487',
    alignItems: 'center',
    borderBottomEndRadius: 35,
    borderBottomStartRadius: 35,
    height: 70,
    marginBottom:15,
  },

  backButton: {
    marginRight: 10,
  },
  formContainer: {
    flex: 1,
    backgroundColor: 'rgba(69, 69, 69, 1)',
    padding: 16,
    borderRadius: 25,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  label: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: 10,
  },
 input: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(69, 69, 69, 1)',
    borderRadius : 8,
  },

  dateText: {
    fontSize: 18,
    color: '#FFF',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#58c487',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
  },

  conditionalContainer: {
   // marginTop: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#58c487',
    height: 90, // Adjust the height as needed
  },

  icon: {
    width: 24,
    height: 24,
  },
  planificationContainer: {
    marginBottom: 24,
  },
  daySelectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  dayButton: {
    width: '28%', // Adjust to fit three buttons per row with some margin
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center', // Center the text horizontally
  },
  dayButtonSelected: {
    backgroundColor: '#58c487',
    borderColor: '#58c487',
  },
  dayButtonText: {
    fontSize: 16,
    color: '#000',
  },
  dayButtonTextSelected: {
    color: '#fff',
  },
});



export default AutomationFormScreen;