import React, { useState, useEffect,useContext } from 'react';
import { View, TouchableOpacity, Image, Text, TextInput, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MultiSelect from 'react-native-multiple-select';
import roomUpdateService from '../services/roomUpdateService';
import Node from '../Class/Node';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ModalSelector from 'react-native-modal-selector';
import uuid from 'react-native-uuid';
import { ThemeContext } from '../ThemeProvider';

const RoomFormScreen = ({ navigation, route }) => {
    const { rooms, assignments } = route.params;
    const { theme} = useContext(ThemeContext);
  const [roomName, setRoomName] = useState(route.params?.roomName || '');
  const [selectedRoomName, setSelectedRoomName] = useState('');
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [imageUri, setImageUri] = useState(null);
  const [step, setStep] = useState(1);
  const [newRoomId, setNewRoomId] = useState( Math.floor(Date.now() / 1000));

  useEffect(() => {
    fetchDevices();
  }, []);

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

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSaveRoom = async () => {
    if (selectedDevices.length === 0) {
        Alert.alert('Error', 'Please select at least one device');
        return;
      }
    try {
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const idNetwork = 1;
      const token = await AsyncStorage.getItem('token');

      const newRoom = [{
        picture: imageUri || getDefaultImageForRoom(roomName),
        idRoom: newRoomId,
        idNetwork,
        name: roomName,
        mainSensorUnicast: 0,
        
      }];

      const updatedRooms = [...rooms, newRoom];
      const newRoomAssignments = generateAssignmentsForRoom(newRoomId, selectedDevices);
      const updatedAssignments = [...assignments, ...newRoomAssignments];
      console.log('updatedAssignments :',updatedAssignments);
      console.log('Selected Devices:', selectedDevices); 
      await roomUpdateService(idclient, iduser,token, updatedRooms, updatedAssignments);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving room:', error);
    }
  };

  const generateAssignmentsForRoom = (idRoom, deviceIds) => {
    return deviceIds.map(deviceId => {
      const device = nodes.find(node => node.deviceKey === deviceId);
      if (device) {
        return {
          unicast: device.unicastAddress,
          elementAdress: device.unicastAddress, // Assuming your Node class has this property
          idNetwork: 1,
          idRoom,
          deviceName: device.name,
          deviceType: device.pid, 
        };
      }
      return null;
    }).filter(Boolean); // Filter out any null values in case a device is not found
  };

  const handleRoomNameChange = (name) => {
    setSelectedRoomName(name);
    if (name === 'Personalize') {
      setRoomName('');
    } else {
      setRoomName(name);
      setImageUri(getDefaultImageForRoom(name));
    }
  };

  const getDefaultImageForRoom = (name) => {
    switch (name) {
      case 'Bedroom':
        return require('../../assets/bedroom.jpg');
      case 'Kitchen':
        return require('../../assets/kitchen1.jpg');
      case 'Bathroom':
        return require('../../assets/bathroom.jpg');
      case 'Garden':
        return require('../../assets/garden.jpg');
      case 'Kidsroom':
        return require('../../assets/kidsroom.jpg');
      case 'Livingroom':
        return require('../../assets/livingroom1.jpg');
      default:
        return null;
    }
  };

  const roomOptions = [
    { key: 1, label: 'Bedroom' },
    { key: 2, label: 'Kitchen' },
    { key: 3, label: 'Bathroom' },
    { key: 4, label: 'Garden' },
    { key: 5, label: 'Kidsroom' },
    { key: 6, label: 'Livingroom' },
    { key: 7, label: 'Personalize' },
  ];

  return (
    <View style={[styles.container,{backgroundColor :theme.$backgroundColor }]}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={24} color={theme.$iconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={''}>
          <Image source={require('../../assets/icons/notification.png')} style={[styles.icon ,{ tintColor : theme.$iconColor}]} />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Room</Text>
      </View>

      <View style={[styles.formContainer,{backgroundColor :theme.$standard }]}>
        {step === 1 && (
          <>
           
            <ModalSelector
              data={roomOptions}
              initValue="Select a Room"
              onChange={(option) => handleRoomNameChange(option.label)}
              style={styles.modalSelector}
              selectTextStyle={styles.modalSelectText}
            ><Text style={[styles.label , {color  : theme.$textColor}]}>Select a Room</Text>
            <TextInput
            style={[styles.input, {backgroundColor :theme.$standard, borderColor : theme.$textColor, color :theme.$textColor}]}
            editable={false}
            placeholder="Select event type"
            value={roomOptions.find(item => item.label === selectedRoomName)?.label}
          />
          </ModalSelector>

            {selectedRoomName === 'Personalize' && (
              <> 
              <Text style={[styles.label , {color  : theme.$textColor}]}>Room Name</Text>
                <TextInput
                  style={[styles.input, {backgroundColor :theme.$standard, borderColor : theme.$textColor, color :theme.$textColor}]}
                  placeholder="Enter Custom Room Name"
                  value={roomName}
                  onChangeText={setRoomName}
                />
                <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
                  <Text style={styles.imagePickerButtonText}>Choose Image</Text>
                </TouchableOpacity>
                {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
              </>
            )}

            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: step === 1 && roomName ? 'rgba(112, 160, 214, 1)' : 'gray' }]}
              onPress={() => setStep(2)}
              disabled={!roomName}
            >
              <Text style={styles.nextButtonText}>Suivant</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={[styles.label , {color  : theme.$textColor}]}>Devices</Text>
            <MultiSelect
              items={nodes.map(device => ({ deviceKey: device.deviceKey, deviceName: device.name }))}
              uniqueKey="deviceKey"
              onSelectedItemsChange={setSelectedDevices}
              selectedItems={selectedDevices}
              selectText="Select Devices"
              searchInputPlaceholderText="Search Devices..."
              displayKey="deviceName"
              styleSelectorContainer={styles.multiSelectSelector}
              styleDropdownMenuSubsection={styles.multiSelectDropdown}
              styleTextDropdown={styles.multiSelectTextDropdown}
              styleTextTag={styles.multiSelectTextTag}
              styleInputGroup={styles.multiSelectInput}
              submitButtonText="Submit"
            />

            <View style={styles.navigationButtons}>
              <TouchableOpacity
                style={[styles.prevButton, { backgroundColor: 'rgba(112, 160, 214, 1)' }]}
                onPress={() => setStep(1)}
              >
                <Text style={styles.prevButtonText}>Precedent</Text>
              </TouchableOpacity>

             
            </View>
            
          </>
        )}
      </View>
      <TouchableOpacity
                style={[styles.addButton, !selectedDevices.length && { backgroundColor: 'gray' }]}
                onPress={handleSaveRoom}
                disabled={!selectedDevices.length}
              >
                <Text style={styles.addButtonText}>ADD</Text>
              </TouchableOpacity>
    </View>
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
  multiSelectDropdown: {
    backgroundColor: 'rgba(69, 69, 69, 1)',
  },
  multiSelectInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(69, 69, 69, 1)',
  },
  multiSelectSelector: {
   // color: '#000',
   
  },
  multiSelectTextDropdown: {
    color: '#fff',
  },
  multiSelectTextTag: {
   
   color : '#fff'

  },
  addButton: {
    backgroundColor: '#58c487',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom : 20
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  label: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  imagePickerButton: {
    backgroundColor: '#58c487',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: 'rgba(112, 160, 214, 0.3)',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 200,
    marginTop: 10,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  prevButton: {
    backgroundColor: 'rgba(112, 160, 214, 0.3)',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 200,
  },
  prevButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RoomFormScreen;