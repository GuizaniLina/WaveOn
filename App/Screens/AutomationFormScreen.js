import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard, Switch, TextInput, StyleSheet, Alert, TouchableOpacity, Image, FlatList } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import MultiSelect from 'react-native-multiple-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Node from '../Class/Node';
import { ThemeContext } from '../ThemeProvider';
import { FontAwesome5 } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { useTranslation } from 'react-i18next';

const AutomationFormScreen = ({ navigation, route }) => {
  const { addAutomation } = route.params;
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [date, setDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(date.getHours() % 12 || 12);
  const [selectedMinute, setSelectedMinute] = useState(date.getMinutes());
  const [selectedSecond, setSelectedSecond] = useState(date.getSeconds());
  const [amPm, setAmPm] = useState(date.getHours() >= 12 ? 'PM' : 'AM');
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [eventType, setEventType] = useState(0);
  const [condition, setCondition] = useState(null);
  const [operator, setOperator] = useState(null);
  const [value, setValue] = useState('');
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [deviceStates, setDeviceStates] = useState({});
  const [nodes, setNodes] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedDeclencheur, setSelectedDeclencheur] = useState(null);
  const [showPlanification, setShowPlanification] = useState(false);
  const [déclencheurData, setDéclencheurData] = useState([]);
  const [transformedNodes, setTransformedNodes] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null);
  const [isGateway, setIsGateway] = useState(null);

  const hours = Array.from({ length: 24 }, (_, i) => ({ label: i.toString().padStart(2, '0'), value: i }));
  const minutes = Array.from({ length: 60 }, (_, i) => ({ label: i.toString().padStart(2, '0'), value: i }));
  const seconds = Array.from({ length: 60 }, (_, i) => ({ label: i.toString().padStart(2, '0'), value: i }));
  const amPmOptions = [
    { label: 'AM', value: 'AM' },
    { label: 'PM', value: 'PM' },
  ];

  const daysOfWeek = [
    { key: 1, label:   t(`automation_form.Monday`) },
    { key: 2, label:  t(`automation_form.Tuesday`) },
    { key: 3, label:  t(`automation_form.Wednesday`) },
    { key: 4, label: t(`automation_form.Thursday`) },
    { key: 5, label: t(`automation_form.Friday`) },
    { key: 6, label: t(`automation_form.Saturday`) },
    { key: 7, label: t(`automation_form.Sunday`) },
  ];

  const parseAutomationTriggers = (automationTriggers) => {
    automationTriggers.split(';').filter(Boolean).forEach(target => {
      const [deviceName, unicastAddress, plan, condition, operator, value] = target.split(':');
      setCondition(parseInt(condition));
      setOperator(parseInt(operator));
      setValue(value);
      setSelectedDeclencheur(déclencheurData.find(item => item.label === deviceName)?.key || null);
      setShowPlanification(plan === '1');
    });
  };

  const parseAutomationTimes = (automationTimes) => {
    const [hour, minute, second] = automationTimes.split(';')[0]?.split('#')[0]?.split(':') || [];
    const selectedDays = automationTimes.split(';').filter(Boolean).map(time => {
      const [, day, period] = time.split('#');
      return parseInt(day, 10);
    });
    const amPm = automationTimes.split(';')[0]?.split('#')[2] === '0' ? 'PM' : 'AM';

    setSelectedHour(parseInt(hour, 10));
    setSelectedMinute(parseInt(minute, 10));
    setSelectedSecond(parseInt(second, 10));
    setAmPm(amPm);
    setSelectedDays(selectedDays);
  };

  const parseAutomationTargets = (automationTargets) => {
    const devices = [];
    const deviceStates = {};
    automationTargets.split(';').filter(Boolean).forEach(target => {
      const [deviceName, elementAddress, unicastAddress, value] = target.split(':');
      const device = transformedNodes.find(node => node.name === deviceName);
      devices.push(device?.deviceKey);
      deviceStates[device?.deviceKey] = value === '100' ? 'on' : value === '0' ? 'off' : value;
    });

    setSelectedDevices(devices);
    setDeviceStates(deviceStates);
  };

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setIsAdmin(await AsyncStorage.getItem('user_isadmin'));
        setIsGateway(await AsyncStorage.getItem('user_isgateway'));
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
        Alert.alert(t('Error'), "Error retrieving nodes data");
        setNodes([]);
      }
    };
    fetchDevices();
  }, []);

  useEffect(() => {
    // Update déclencheurData and transformedNodes when nodes change
    const transformed = nodes.flatMap(node => {
      if ((node.pid === 2) || (node.pid === 5)) {
        return [
          { ...node, deviceKey: `${node.deviceKey}-A`, name: `${node.name} A` },
          { ...node, deviceKey: `${node.deviceKey}-B`, name: `${node.name} B` },
        ];
      }
      return node;
    });

    setTransformedNodes(transformed);

    const déclencheur = nodes.filter(node => node.pid === 2 || node.pid === 3).map(node => ({
      key: node.deviceKey,
      label: node.name,
      unicastAddress: node.unicastAddress,
    }));

    setDéclencheurData(déclencheur);
  }, [nodes]);

  useEffect(() => {
    if (route.params?.editAutomation) {
      const automation = route.params.editAutomation;
      setName(automation.name);
      setEventType(automation.eventType);

      // Call the parsing functions
      parseAutomationTriggers(automation.automationTriggers);
      parseAutomationTimes(automation.automationTimes);
      parseAutomationTargets(automation.automationTargets);
    }
  }, [route.params?.editAutomation, déclencheurData, transformedNodes]);

  const handleTimeChange = (hour, minute, second, amPm) => {
    let adjustedHour = amPm === 'PM' && hour < 12 ? hour + 12 : hour;
    if (amPm === 'AM' && hour === 12) adjustedHour = 0; // Handle 12 AM case
    setSelectedHour(hour);
    setSelectedMinute(minute);
    setSelectedSecond(second);
    setAmPm(amPm);

    const updatedDate = new Date(date);
    updatedDate.setHours(adjustedHour, minute, second);
    setDate(updatedDate);
  };

  const handleDeviceSelectionChange = (selectedItems) => {
    setSelectedDevices(selectedItems);
  };

  const handleSwitchChange = (deviceKey, state) => {
    setDeviceStates(prevDeviceStates => ({
      ...prevDeviceStates,
      [deviceKey]: state
    }));
  };

  const handleCustomValueChange = (deviceKey, value) => {
    setDeviceStates(prevDeviceStates => ({
      ...prevDeviceStates,
      [deviceKey]: value
    }));
  };

  const handleNext = () => {
    if (step === 1 && name.trim() && eventType !== null) {
      if (eventType === 2) {
        setStep(3); // Skip to planification step if "Schedule" is selected
      } else {
        setStep(2); // Go to condition step
      }
    } else if (step === 2) {
      if (showPlanification) {
        setStep(3); // Go to planification if selected
      } else {
        setStep(4); // Skip to device selection if no planification
      }
    } else if (step === 3) {
      setStep(4); // Proceed to device selection
    } else if (step === 4) {
      setStep(5); // Proceed to final step
    }
  };

  const handlePrevious = () => {
    if (step === 5) {
      setStep(4); // Return to device selection
    } else if (step === 4) {
      if (eventType === 2 || showPlanification) {
        setStep(3); // Return to planification if eventType is 2 or planification was selected
      } else {
        setStep(2); // Return to condition step if no planification
      }
    } else if (step === 3) {
      if (eventType === 2) {
        setStep(1); // Skip back to initial step if Schedule was selected
      } else {
        setStep(2); // Return to condition step
      }
    } else if (step === 2) {
      setStep(1); // Return to initial step
    }
  };

  const toggleDaySelection = (dayKey) => {
    setSelectedDays((prevSelectedDays) =>
      prevSelectedDays.includes(dayKey)
        ? prevSelectedDays.filter((key) => key !== dayKey)
        : [...prevSelectedDays, dayKey]
    );
  };

  const handleSubmit = async () => {
    try {
      console.log("Starting submission...");
      if (isAdmin === '0' && isGateway === '0') {
        Alert.alert(t('Sorry'), t('should_be_admin_gateway'));
      } else {
      if (!name) {
        Alert.alert(t('Error'), t(`automation_form.error_name`)  );
        return;
      }
  
      // If we are editing, use the existing automation ID
      const idAutomation = route.params?.editAutomation?.idAutomation || Math.floor(Date.now() / 1000);
  
      const selectedPIDs = selectedDevices.map(deviceKey => {
        const device = transformedNodes.find(node => node.deviceKey === deviceKey);
        return device?.pid || 0;  // Return PID or 0 if not found
      });
      
      // Calculate the unique PIDs
      const uniquePIDs = [...new Set(selectedPIDs)];
      
      // Determine the targetType based on the uniquePIDs
      let targetType = 0;
      
      if (uniquePIDs.length === 1) {
        targetType = uniquePIDs[0] === 2 ? 2 : uniquePIDs[0] === 3 ? 3 : 0;
      } else if (uniquePIDs.includes(2) && uniquePIDs.includes(3)) {
        targetType = -2; // Mixed PIDs
      }
  
      // Constructing automationTargets
      const automationTargets = selectedDevices.map(deviceKey => {
        const device = transformedNodes.find(node => node.deviceKey === deviceKey);
        const deviceName = device?.name || '';
        const unicastAddress = device?.unicastAddress || '';
      
        // Determine the elementAddress based on whether it's Lamp A, Lamp B, or neither
        const elementAddress = deviceKey.includes('-A')
          ? unicastAddress
          : deviceKey.includes('-B')
          ? `${parseInt(unicastAddress, 10) + 1}`
          : unicastAddress;
      
        const value = deviceStates[deviceKey] === 'on' ? '100'
                    : deviceStates[deviceKey] === 'off' ? '0'
                    : deviceStates[deviceKey]; // Use the custom value if provided
      
        return `${deviceName}:${elementAddress}:${unicastAddress}:${value}`;
      }).join(';') + ';';
  
      // Constructing automationTimes (for scheduled events)
      const automationTimes = (eventType === 2 || showPlanification) 
      ? selectedDays.map(day => {
          const hour = amPm === 'PM' ? selectedHour % 12 + 12 : selectedHour % 12; // Convert to 24-hour format
          const period = amPm === 'PM' ? '0' : '1'; // '1' for PM, '0' for AM
          return `${hour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}:${selectedSecond.toString().padStart(2, '0')}#${day}#${period};`;
        }).join('')
      : '';
      const declencheur = déclencheurData.find(item => item.key === selectedDeclencheur); 
      const automationTriggers = (eventType === 0 || eventType === 3 || eventType === 1) && selectedDeclencheur
      ? `${declencheur.label}:${declencheur.unicastAddress || ''}:${showPlanification ? 1 : 0}:${condition}:${operator}:${value};`
      : '';
  
      // Prepare the automation data
      const automationData = {
        idAutomation,
        idNetwork: 1,
        name,
        state: 1,
        eventType,
        targetType,
        automationTargets,
        automationTimes,
        automationTriggers,
      };
  
      if (route.params?.editAutomation) {
        // If editing, update the existing automation
        console.log('Updating automation:', automationData);
        route.params.updateAutomation(automationData);
      } else {
        // If adding, create a new automation
        console.log('Adding new automation:', automationData);
        addAutomation(automationData);
      }
  
      navigation.goBack();
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      Alert.alert(t('Error'), t('automation_form.automation_update_failed'));
    }
  };
  const eventTypeData = [
    { key: 0, label: t(`automation_form.On Request`) },
    { key: 1, label:t(`automation_form.Network`)  },
    { key: 2, label: t(`automation_form.Schedule`)  },
    { key: 3, label: t(`automation_form.External API`) },
    { key: 4, label: t(`automation_form.Alarm`) },
  ];

  const conditionData = [
    { key: 0, label: t(`automation_form.Temperature`) },
    { key: 1, label:  t(`automation_form.Humidity`) },
    { key: 2, label:  t(`automation_form.Occupancy`) },
    { key: 3, label:  t(`automation_form.Luminosity`) },
    { key: 4, label:  t(`automation_form.Power`) },
  ];

  const operatorData = [
    { key: 0, label:  t(`automation_form.Upper`) },
    { key: 1, label: t(`automation_form.Equal`) },
    { key: 2, label: t(`automation_form.Less`) },

  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: theme.$backgroundColor }]}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome5 name="arrow-left" size={24} color={theme.$iconColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={''}>
            <Image source={require('../../assets/icons/notification.png')} style={[styles.icon, { tintColor: theme.$iconColor }]} />
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('automation_form.title')}</Text>
        </View>

        <View style={[styles.formContainer, { backgroundColor: theme.$standard }]}>
          {step === 1 && (
            <>
              <Text style={[styles.label, { color: theme.$textColor }]}>{t('automation_form.name')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.$standard, borderColor: theme.$textColor, color: theme.$textColor }]}
                value={name}
                placeholder={t('automation_form.name_placeholder')}
                onChangeText={setName}
              />

              <Text style={[styles.label, { color: theme.$textColor }]}>{t('automation_form.event_type')}</Text>
              <ModalSelector
                data={eventTypeData.map(item => ({ key: item.key, label: item.label }))}
                initValue={t('automation_form.select_event_type')}
                onChange={(option) => setEventType(option.key)}
                style={styles.selector}
              >
                <TextInput
                  style={[styles.input, { backgroundColor: theme.$standard, borderColor: theme.$textColor, color: theme.$textColor }]}
                  editable={false}
                  placeholder={t('automation_form.select_event_type')}
                  value={eventTypeData.find(item => item.key === eventType)?.label}
                />
              </ModalSelector>
            </>
          )}

          {step === 2 && (
            <>
              {((eventType === 0) || (eventType === 3) ||(eventType === 1) ) && (
                <View style={styles.conditionalContainer}>
                  <Text style={[styles.label, { color: theme.$textColor }]}>{t('automation_form.trigger')}</Text>
                  <ModalSelector
                    data={déclencheurData}
                    initValue={t('automation_form.select_trigger')}
                    onChange={(option) => setSelectedDeclencheur(option.key)}
                    style={styles.selector}
                  >
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.$standard, borderColor: theme.$textColor, color: theme.$textColor }]}
                      editable={false}
                      placeholder={t('automation_form.select_trigger')}
                      value={déclencheurData.find(item => item.key === selectedDeclencheur)?.label}
                    />
                  </ModalSelector>

                  <Text style={[styles.label, { color: theme.$textColor }]}>{t('automation_form.condition')}</Text>
                  <ModalSelector
                    data={conditionData.map(item => ({ key: item.key, label: item.label}))}
                    initValue={t('automation_form.select_condition')}
                    onChange={(option) => setCondition(option.key)}
                    style={styles.selector}
                  >
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.$standard, borderColor: theme.$textColor, color: theme.$textColor }]}
                      editable={false}
                      placeholder={t('automation_form.select_condition')}
                      value={conditionData.find(item => item.key === condition)?.label}
                    />
                  </ModalSelector>

                  <Text style={[styles.label, { color: theme.$textColor }]}>{t('automation_form.operator')}</Text>
                  <ModalSelector
                    data={operatorData.map(item => ({ key: item.key, label: item.label }))}
                    initValue={t('automation_form.select_operator')}
                    onChange={(option) => setOperator(option.key)}
                    style={styles.selector}
                  >
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.$standard, borderColor: theme.$textColor, color: theme.$textColor }]}
                      editable={false}
                      placeholder={t('automation_form.select_operator')}
                      value={operatorData.find(item => item.key === operator)?.label}
                    />
                  </ModalSelector>

                  <Text style={[styles.label, { color: theme.$textColor }]}>{t('automation_form.value')}</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.$standard, borderColor: theme.$textColor, color: theme.$textColor }]}
                    value={value}
                    onChangeText={setValue}
                    keyboardType="numeric"
                  />

                  <Text style={[styles.label, { color: theme.$textColor }]}>{t('automation_form.add_schedule')}</Text>
                  <Switch
                    value={showPlanification}
                    onValueChange={setShowPlanification}
                  />
                </View>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <View style={styles.planificationContainer}>
                <Text style={[styles.label, { color: theme.$textColor }]}>{t('automation_form.date_time')}</Text>
                <View style={styles.timePickerContainer}>
                  <View style={styles.pickerContainer}>
                    <RNPickerSelect
                      placeholder={{}}
                      items={hours}
                      onValueChange={(hour) => handleTimeChange(hour, selectedMinute, selectedSecond, amPm)}
                      value={selectedHour}
                      style={pickerSelectStyles}
                    />
                  </View>
                  <Text style={[styles.colon, { color: theme.$textColor }]}>:</Text>
                  <View style={styles.pickerContainer}>
                    <RNPickerSelect
                      placeholder={{}}
                      items={minutes}
                      onValueChange={(minute) => handleTimeChange(selectedHour, minute, selectedSecond, amPm)}
                      value={selectedMinute}
                      style={pickerSelectStyles}
                    />
                  </View>
                  <Text style={[styles.colon, { color: theme.$textColor }]}>:</Text>
                  <View style={styles.pickerContainer}>
                    <RNPickerSelect
                      placeholder={{}}
                      items={seconds}
                      onValueChange={(second) => handleTimeChange(selectedHour, selectedMinute, second, amPm)}
                      value={selectedSecond}
                      style={pickerSelectStyles}
                    />
                  </View>
                  <View style={styles.pickerContainer}>
                    <RNPickerSelect
                      placeholder={{}}
                      items={amPmOptions}
                      onValueChange={(ampm) => handleTimeChange(selectedHour, selectedMinute, selectedSecond, ampm)}
                      value={amPm}
                      style={pickerSelectStyles}
                    />
                  </View>
                </View>
                <Text style={[styles.selectedValue, { color: theme.$textColor }]}>
                  {`${selectedHour}:${selectedMinute}:${selectedSecond} ${amPm}`}
                </Text>

                <Text style={[styles.label, { color: theme.$textColor }]}>{t('automation_form.days')}</Text>
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
              </View>
            </>
          )}

          {step === 4 && (
            <>
              <Text style={[styles.label, { color: theme.$textColor }]}>{t('automation_form.devices')}</Text>
              <MultiSelect
                items={transformedNodes.map(device => ({ deviceKey: device.deviceKey, deviceName: device.name }))}
                uniqueKey="deviceKey"
                onSelectedItemsChange={handleDeviceSelectionChange}
                selectedItems={selectedDevices}
                selectText={t('automation_form.select_devices')}
                searchInputPlaceholderText={t('automation_form.search_devices')}
                displayKey="deviceName"
                styleSelectorContainer={[styles.multiSelectSelector, { maxHeight: 150 }]}
                styleDropdownMenuSubsection={[styles.multiSelectDropdown]}
                styleTextDropdown={styles.multiSelectTextDropdown}
                styleTextTag={styles.multiSelectTextTag}
                styleInputGroup={styles.multiSelectInput}
                submitButtonText={t('automation_form.submit')}
              />
            </>
          )}

          {step === 5 && (
            <>
              <Text style={[styles.label, { color: theme.$textColor }]}>{t('automation_form.selected_devices')}</Text>
              <FlatList
                style={styles.scroll}
                data={selectedDevices}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <View style={styles.deviceItemContainer}>
                    <Text style={[styles.deviceName, { color: theme.$textColor }]}>
                      {transformedNodes.find(node => node.deviceKey === item)?.name}
                    </Text>
                    <ModalSelector
                      data={[
                        { key: 'on', label: t('automation_form.on') },
                        { key: 'off', label: t('automation_form.off') },
                      ]}
                      initValue={t('automation_form.state')}
                      onChange={(option) => handleSwitchChange(item, option.key)}
                      style={styles.stateSelector}
                    >
                      <TextInput
                        style={[styles.input, styles.stateInput, { backgroundColor: theme.$standard, borderColor: theme.$textColor, color: theme.$textColor }]}
                        editable={false}
                        placeholder={t('automation_form.state')}
                        value={deviceStates[item] || t('automation_form.state')}
                      />
                    </ModalSelector>
                    <TextInput
                      style={[styles.input, styles.customValueInput, { backgroundColor: theme.$standard, borderColor: theme.$textColor, color: theme.$textColor }]}
                      placeholder={t('automation_form.value')}
                      value={deviceStates[item] || t('automation_form.value')}
                      onChangeText={(value) => handleCustomValueChange(item, value)}
                    />
                  </View>
                )}
              />
            </>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {step > 1 && (
            <TouchableOpacity style={[styles.navigationButton]} onPress={handlePrevious}>
              <Text style={[styles.navigationButtonText, { color: theme.$textColor }]}>{t('automation_form.previous')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.navigationButton, !name.trim() && step === 1 && { backgroundColor: 'gray' }]}
            onPress={step === 5 ? handleSubmit : handleNext}
            disabled={!name.trim() && step === 1}
          >
            <Text style={[styles.navigationButtonText, { color: theme.$textColor }]}>
              {step === 5 ? t('automation_form.add_automation') : t('automation_form.next')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  headerTitle: {
    fontSize: 30,
    color: '#FFF',
    marginTop: 10,
  },
  header: {
    backgroundColor: '#58c487',
    alignItems: 'center',
    borderBottomEndRadius: 35,
    borderBottomStartRadius: 35,
    height: 70,
    marginBottom: 15,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  label: {
    fontSize: 18,
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
    borderRadius: 8,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  selectedValue: {
    marginLeft: 110,
    marginTop: 10,
    fontSize: 18,
    color: '#FFF',
  },
  navigationButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
  selector: {
    marginBottom: 16,
  },
  multiSelectSelector: {
    marginBottom: 16,
  },
  multiSelectDropdown: {
    backgroundColor: '#333',
    borderColor: '#fff',
  },
  multiSelectTextDropdown: {
    
  },
  multiSelectTextTag: {
    
  },
  multiSelectInput: {
    
  },
  planificationContainer: {
    marginBottom: 24,
  },
  daySelectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  dayButton: {
    width: '28%',
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#58c487',
    borderColor: '#58c487',
  },
  dayButtonText: {
    fontSize: 15,
    color: '#000',
  },
  dayButtonTextSelected: {
    color: '#fff',
  },
  scroll: {
    marginTop: 10,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  pickerContainer: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  colon: {
    fontSize: 24,
    marginHorizontal: 5,
  },
  deviceItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  deviceName: {
    flex: 3,
    fontSize: 14,
    fontWeight: 'bold',
  },
  stateSelector: {
    flex: 1,
    marginHorizontal: 8,
  },
  stateInput: {
    textAlign: 'center',
  },
  customValueInput: {
    flex: 1,
    textAlign: 'center',
  },
  navigationButton: {
    backgroundColor: '#58c487',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
});

export default AutomationFormScreen;