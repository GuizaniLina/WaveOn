import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Image, Alert, TouchableWithoutFeedback, Keyboard, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MultiSelect from 'react-native-multiple-select';
import securityUpdateService from '../services/securityUpdateService';
import { FontAwesome5 } from '@expo/vector-icons';
import { ThemeContext } from '../ThemeProvider';
import Node from '../Class/Node';
import { useTranslation } from 'react-i18next';

const SecurityConfig = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [emails, setEmails] = useState(['']);
  const [phoneNumbers, setPhoneNumbers] = useState(['']);
  const [securityTarget, setSecurityTarget] = useState([]);
  const [alarmDelay, setAlarmDelay] = useState('');
  const [isAdmin, setIsAdmin] = useState(null);
  const [isGateway, setIsGateway] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [transformedNodes, setTransformedNodes] = useState([]);
  const [securityConfig, setSecurityConfig] = useState(null);

  useEffect(() => {
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
        console.error('Error fetching nodes:', error);
        Alert.alert(t('error'), t('error_retrieving_nodes'));
      }
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    if (nodes.length > 0) {
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
    }
  }, [nodes]);

  useEffect(() => {
    const fetchSecurityConfig = async () => {
      try {
        const storedConfig = await AsyncStorage.getItem('securityConfig');
        setIsAdmin(await AsyncStorage.getItem('user_isadmin'));
        setIsGateway(await AsyncStorage.getItem('user_isgateway'));
        if (storedConfig) {
          const config = JSON.parse(storedConfig);
          setSecurityConfig(config);
          setEmails(parseEmails(config.emails));
          setPhoneNumbers(parsePhoneNumbers(config.phoneNumbers));
          setAlarmDelay(config.alarmDelay.toString());
        }
      } catch (error) {
        console.error('Failed to fetch security config:', error);
      }
    };

    fetchSecurityConfig();
  }, []);

  useEffect(() => {
    if (transformedNodes.length > 0 && securityConfig) {
      parseSecurityTargets(securityConfig.securityTarget);
    }
  }, [transformedNodes, securityConfig]);

  const handleSave = async () => {
    try {
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const idNetwork = 1;
      const token = await AsyncStorage.getItem('token');
      const securityOption = JSON.parse(await AsyncStorage.getItem('securityOption'));
      const updateSecurityTriggers = JSON.parse(await AsyncStorage.getItem('securityTriggers'));

      const formattedEmails = emails.filter(email => email).join(';');
      const formattedPhoneNumbers = phoneNumbers.filter(number => number).join(';');

      const formattedSecurityTargets = securityTarget.map(deviceKey => {
        const device = transformedNodes.find(node => node.deviceKey === deviceKey);
        return device ? `${device.name}:0:0:0` : ''; 
      }).filter(Boolean).join(';'); 

      const updateSecurityConfig = {
        emails: formattedEmails,
        phoneNumbers: formattedPhoneNumbers,
        securityTarget: formattedSecurityTargets,
        alarmDelay: parseInt(alarmDelay, 10),
        alarmDelay: 0,
        emailLastSend: null,
        smsLastSend: null,
        batteryAlertLastSend: null,
        alarmPassKey: null
      };

      await securityUpdateService(idclient, iduser, idNetwork, token, securityOption, updateSecurityConfig, updateSecurityTriggers,navigation);
      await AsyncStorage.setItem('securityConfig', JSON.stringify(updateSecurityConfig));

      Alert.alert(t('success'), t('security_config_updated'));
      navigation.goBack();
    } catch (error) {
      Alert.alert(t('error'), t('failed_to_update_security_config'));
      console.error('Failed to update security configuration:', error);
    }
  };

  const parseEmails = (emails) => {
    return emails ? emails.split(';').filter(Boolean) : [''];
  };

  const parsePhoneNumbers = (numbers) => {
    return numbers ? numbers.split(';').filter(Boolean) : [''];
  };

  const parseSecurityTargets = (targets) => {
    const selectedDevices = [];
    targets?.split(';').filter(Boolean).forEach(target => {
      const [deviceName] = target.split(':');
      const device = transformedNodes.find(node => node.name === deviceName);
      if (device) {
        selectedDevices.push(device.deviceKey);
      }
    });
    setSecurityTarget(selectedDevices);
  };

  const addEmailField = () => setEmails([...emails, '']);
  const addPhoneNumberField = () => setPhoneNumbers([...phoneNumbers, '']);

  const handleEmailChange = (index, value) => {
    const updatedEmails = emails.map((email, i) => (i === index ? value : email));
    setEmails(updatedEmails);
  };

  const handlePhoneNumberChange = (index, value) => {
    const updatedPhoneNumbers = phoneNumbers.map((number, i) => (i === index ? value : number));
    setPhoneNumbers(updatedPhoneNumbers);
  };

  const removeEmailField = (index) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const removePhoneNumberField = (index) => {
    setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
          <Text style={styles.headerTitle}>{t('configuration')}</Text>
        </View>

        <View style={[styles.formContainer, { backgroundColor: theme.$standard }]}>
          <Text style={[styles.label, { color: theme.$textColor }]}>{t('emergency_emails')}</Text>
          {emails.map((email, index) => (
            <View key={index} style={styles.inputRow}>
              <TextInput
                style={[styles.input, { backgroundColor: theme.$standard, borderColor: theme.$textColor, color: theme.$textColor }]}
                value={email}
                onChangeText={(value) => handleEmailChange(index, value)}
                placeholder={t('email')}
              />
              {index === 0 ? (
                <TouchableOpacity onPress={addEmailField} style={styles.addButton}>
                  <FontAwesome5 name="plus" size={24} color={theme.$textColor} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => removeEmailField(index)} style={styles.removeButton}>
                  <FontAwesome5 name="trash" size={24} color={theme.$textColor} />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <Text style={[styles.label, { color: theme.$textColor }]}>{t('emergency_phone_numbers')}</Text>
          {phoneNumbers.map((number, index) => (
            <View key={index} style={styles.inputRow}>
              <TextInput
                style={[styles.input, { backgroundColor: theme.$standard, borderColor: theme.$textColor, color: theme.$textColor }]}
                value={number}
                onChangeText={(value) => handlePhoneNumberChange(index, value)}
                placeholder={t('phone_number')}
                keyboardType="phone-pad"
              />
              {index === 0 ? (
                <TouchableOpacity onPress={addPhoneNumberField} style={styles.addButton}>
                  <FontAwesome5 name="plus" size={24} color={theme.$textColor} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => removePhoneNumberField(index)} style={styles.removeButton}>
                  <FontAwesome5 name="trash" size={24} color={theme.$textColor} />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <Text style={[styles.label, { color: theme.$textColor }]}>{t('alarm_delay_seconds')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.$standard, borderColor: theme.$textColor, color: theme.$textColor }]}
            value={alarmDelay}
            onChangeText={setAlarmDelay}
            placeholder={t('alarm_delay')}
            keyboardType="numeric"
          />
          <Text style={[styles.label, { color: theme.$textColor }]}>{t('security_target')}</Text>
          <MultiSelect
            items={transformedNodes.map(device => ({ id: device.deviceKey, name: device.name }))}
            uniqueKey="id"
            onSelectedItemsChange={setSecurityTarget}
            selectedItems={securityTarget}
            selectText={t('select_security_targets')}
            searchInputPlaceholderText={t('search_devices')}
            displayKey="name"
            styleSelectorContainer={[styles.multiSelectSelector, { maxHeight: 100 }]}
            styleDropdownMenuSubsection={[styles.multiSelectDropdown]}
            styleTextDropdown={styles.multiSelectTextDropdown}
            styleTextTag={styles.multiSelectTextTag}
            styleInputGroup={styles.multiSelectInput}
            submitButtonText="Submit"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={() => ((isAdmin === '0') && (isGateway === '0')) ? Alert.alert(t('error'), t('admin_gateway_error')) : handleSave()}>
          <Text style={styles.saveButtonText}>{t('save')}</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2F33',
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
    marginBottom: 15,
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
  formContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(69, 69, 69, 1)',
    borderRadius: 25,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  label: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(69, 69, 69, 1)',
    borderRadius: 8,
    color: '#FFF',
  },
  addButton: {
    marginLeft: 10,
  },
  removeButton: {
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#58c487',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
  multiSelectSelector: {
    marginBottom: 16,
  },
  multiSelectDropdown: {
    backgroundColor: '#333',
    borderColor: '#fff',
  },
  multiSelectTextDropdown: {
    color: '#fff',
  },
  multiSelectTextTag: {},
  multiSelectInput: {},
});

export default SecurityConfig;