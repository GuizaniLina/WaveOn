import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../ThemeProvider';
import { useTranslation } from 'react-i18next';
import ModalSelector from 'react-native-modal-selector';
import { FontAwesome5 } from '@expo/vector-icons';

const CreateGroupScreen = ({ navigation, route }) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const { group } = route.params || {}; // Get the group data from route params if available
  const [groupName, setGroupName] = useState(group ? group.name : ''); // Pre-fill with group name if editing
  const [selectedDevices, setSelectedDevices] = useState(group ? group.devices.map(device => device.deviceKey) : []); // Pre-fill selected devices
  const [nodes, setNodes] = useState([]);
  const [category, setCategory] = useState(group ? group.type : null); // Pre-fill category if editing

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const USER_ID = await AsyncStorage.getItem('idclient');
      const nodesString = await AsyncStorage.getItem(`nodes_${USER_ID}`);
      if (nodesString) {
        const parsedNodes = JSON.parse(nodesString); // Load devices
        setNodes(parsedNodes);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const handleCreateGroup = async () => {
    if (selectedDevices.length === 0 || !groupName) {
      Alert.alert(t('error'), t('enter_group_name_and_select_devices'));
      return;
    }

    const groupType = nodes.find(node => node.deviceKey === selectedDevices[0]).pid;
    const newGroup = {
      id: group ? group.id : Math.floor(Date.now() / 1000).toString(), // Use existing group id if editing
      name: groupName,
      devices: selectedDevices.map((deviceKey) => {
        const device = nodes.find(node => node.deviceKey === deviceKey);
        return {
          ...device,
          luminosity: device.pid === 2 ? (group ? group.devices.find(d => d.deviceKey === deviceKey).luminosity : 0) : undefined, // Keep or default luminosity
          position: device.pid === 3 ? (group ? group.devices.find(d => d.deviceKey === deviceKey).position : 0) : undefined,    // Keep or default position
        };
      }),
      enable: group ? group.enable : false, // Keep existing enabled status or default to false
      type: groupType,
    };

    try {
      const USER_ID = await AsyncStorage.getItem('idclient');
      const storedGroups = await AsyncStorage.getItem(`groups_${USER_ID}`);
      const groups = storedGroups ? JSON.parse(storedGroups) : [];
      
      let updatedGroups;
      if (group) {
        // Update existing group
        updatedGroups = groups.map(g => g.id === group.id ? newGroup : g);
      } else {
        // Create new group
        updatedGroups = [...groups, newGroup];
      }

      await AsyncStorage.setItem(`groups_${USER_ID}`, JSON.stringify(updatedGroups));
      navigation.goBack(); // Go back to the Groups screen
    } catch (error) {
      console.error('Error saving group:', error);
    }
  };

  const categoryOptions = [
    { key: 2, label: t('Lamps') },
    { key: 3, label: t('Blinds') },
    { key: 7, label: t('prise') },
    { key: 8, label: t('Porte') },
  ];

  const filteredDevices = nodes.filter(node => node.pid == category);

  return (
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
        <Text style={styles.headerTitle}>{group ? t('Modify Group') : t('Collection')}</Text>
      </View>

      <View style={[styles.formContainer, { backgroundColor: theme.$standard }]}>
        <Text style={[styles.label, { color: theme.$textColor }]}>{t('Collection Name')}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.$standard, borderColor: theme.$textColor, color: theme.$textColor }]}
          placeholder={t('enter_group_name')}
          placeholderTextColor={theme.$textColor}
          value={groupName}
          onChangeText={setGroupName}
        />

        <Text style={[styles.label, { color: theme.$textColor }]}>{t('Category')}</Text>
        <ModalSelector
          data={categoryOptions}
          initValue={t('select_category')}
          onChange={(option) => setCategory(option.key)}
          style={styles.modalSelector}
          selectTextStyle={styles.modalSelectText}
        >
          <TextInput
            style={[styles.input, { backgroundColor: theme.$standard, borderColor: theme.$textColor, color: theme.$textColor }]}
            editable={false}
            placeholder={t('select_category')}
            value={categoryOptions.find(item => item.key === category)?.label}
          />
        </ModalSelector>

        <Text style={[styles.label, { color: theme.$textColor }]}>{t('Devices')}</Text>
        <MultiSelect
          items={filteredDevices.map(node => ({ deviceKey: node.deviceKey, name: node.name, pid: node.pid }))}
          uniqueKey="deviceKey"
          onSelectedItemsChange={setSelectedDevices}
          selectedItems={selectedDevices}
          selectText={t('select_devices')}
          searchInputPlaceholderText={t('search_devices')}
          displayKey="name"
          styleSelectorContainer={styles.multiSelect}
          styleDropdownMenuSubsection={styles.multiSelectDropdown}
        />
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
        <Text style={styles.createButtonText}>{group ? t('Save Changes') : t('Add')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  formContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 25,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
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
  label: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(69, 69, 69, 1)',
    borderRadius: 8,
    color: '#FFF',
  },
  modalSelector: {
    marginBottom: 16,
  },
  modalSelectText: {
    color: '#FFF',
    fontSize: 16,
    padding: 10,
    backgroundColor: 'rgba(69, 69, 69, 1)',
    borderRadius: 8,
  },
  multiSelect: {
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#58c487',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateGroupScreen;