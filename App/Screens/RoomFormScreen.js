import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, Image, Text, TextInput, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MultiSelect from 'react-native-multiple-select';
import roomUpdateService from '../services/roomUpdateService';
import Node from '../Class/Node';
import { FontAwesome5 } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import ModalSelector from 'react-native-modal-selector';
import { ThemeContext } from '../ThemeProvider';
import { useTranslation } from 'react-i18next';

const RoomFormScreen = ({ navigation, route }) => {
    const { roomId, roomName: initialRoomName, roomImage, selectedDevices: initialSelectedDevices, rooms, assignments } = route.params;
    const { theme } = useContext(ThemeContext);
    const { t } = useTranslation();
    const [roomName, setRoomName] = useState(initialRoomName || '');
    const [selectedRoomName, setSelectedRoomName] = useState(initialRoomName || '');
    const [selectedDevices, setSelectedDevices] = useState(initialSelectedDevices || []);
    const [nodes, setNodes] = useState([]);
    const [imageUri, setImageUri] = useState(null);
    const [photo, setPhoto] = useState(roomImage || null);
    const [step, setStep] = useState(1);
    const [idRoom] = useState(roomId || Math.floor(Date.now() / 1000));
    const [isPersonalized, setIsPersonalized] = useState(false); // Track if the room is personalized

    useEffect(() => {
        console.log('selectedDevices',selectedDevices);
        fetchDevices();
        initializeForm();
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

    const initializeForm = () => {
        // Check if the room is personalized
        const predefinedRoom = roomOptions.find(option => option.label === initialRoomName);
        if (predefinedRoom) {
            setSelectedRoomName(initialRoomName);
            setIsPersonalized(false);
        } else {
            setSelectedRoomName(t('personalize'));
            setIsPersonalized(true);
        }
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert(t('camera_permission'));
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const base64Image = await FileSystem.readAsStringAsync(result.assets[0].uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            
            setImageUri(base64Image);
            setPhoto({ uri: `data:image/jpeg;base64,${base64Image}` });
        }
    };

    const handleSaveRoom = async () => {
        if (selectedDevices.length === 0) {
            Alert.alert(t('error'), t('select_warning'));
            return;
        }
        try {
            const idclient = await AsyncStorage.getItem('idclient');
            const iduser = await AsyncStorage.getItem('iduser');
            const idNetwork = 1;
            const token = await AsyncStorage.getItem('token');

            const updatedRoom = {
                picture: imageUri || roomImage,
                idRoom,
                idNetwork,
                name: roomName,
                mainSensorUnicast: 0,
            };

            let updatedRooms;
            if (roomId) {
                // Updating existing room
                updatedRooms = rooms.map(room => (room.idRoom === idRoom ? updatedRoom : room));
            } else {
                // Adding new room
                updatedRooms = [...rooms, updatedRoom];
            }

            const newRoomAssignments = generateAssignmentsForRoom(idRoom, selectedDevices);
            const updatedAssignments = assignments
                .filter(assignment => assignment.idRoom !== idRoom)
                .concat(newRoomAssignments);

            await roomUpdateService(idclient, iduser, token, updatedRooms, updatedAssignments,navigation);
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Error saving room');
        }
    };

    const generateAssignmentsForRoom = (idRoom, deviceIds) => {
        return deviceIds.map(deviceId => {
            const device = nodes.find(node => node.unicastAddress === deviceId);
            return {
                unicast: device.unicastAddress,
                elementAdress: device.unicastAddress,
                idNetwork: 1,
                idRoom,
                deviceName: device.name,
                deviceType: device.pid,
            };
        }).filter(Boolean);
    };

    const handleRoomNameChange = (option) => {
        setSelectedRoomName(option.label);
        if (option.key === 7) {
            setRoomName(''); 
            setImageUri(null);
            setPhoto(null) 
            setIsPersonalized(true);
        } else {
            setRoomName(option.label); 
            setImageUri(getDefaultImageForRoom(option.key)); 
            setPhoto(getDefaultImageForRoom(option.key))
            setIsPersonalized(false);
        }
    };

    const getDefaultImageForRoom = (key) => {
        switch (key) {
            case 1:
                return 'bedroom.jpg';
            case 2:
                return 'kitchen1.jpg';
            case 3:
                return 'bathroom.jpg';
            case 4:
                return 'garden.jpg';
            case 5:
                return 'kidsroom.jpg';
            case 6:
                return 'livingroom1.jpg';
            default:
                return null;
        }
    };

    const roomOptions = [
        { key: 1, label: t('Bedroom') },
        { key: 2, label: t('Kitchen') },
        { key: 3, label: t('Bathroom') },
        { key: 4, label: t('Garden') },
        { key: 5, label: t('Kidsroom') },
        { key: 6, label: t('Livingroom') },
        { key: 7, label: t('personalize') },
    ];

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
                <Text style={styles.headerTitle}>{t('add_room')}</Text>
            </View>

            <View style={[styles.formContainer, { backgroundColor: theme.$standard }]}>
                {step === 1 && (
                    <>
                        <ModalSelector
                            data={roomOptions}
                            initValue={t('select_room')}
                            onChange={(option) => handleRoomNameChange(option)}
                            style={styles.modalSelector}
                            selectTextStyle={styles.modalSelectText}
                        >
                            <Text style={[styles.label, { color: theme.$textColor }]}>{t('select_room')}</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.$standard, borderColor: theme.$textColor, color: theme.$textColor }]}
                                editable={false}
                                placeholder="Select room type"
                                value={selectedRoomName}
                            />
                        </ModalSelector>

                        {isPersonalized && (
                            <>
                                <Text style={[styles.label, { color: theme.$textColor }]}>{t('room_name')}</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.$standard, borderColor: theme.$textColor, color: theme.$textColor }]}
                                    placeholder={t('enter_custom_room_name')}
                                    value={roomName}
                                    onChangeText={setRoomName}
                                />
                                <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
                                    <Text style={styles.imagePickerButtonText}>{t('choose_image')}</Text>
                                </TouchableOpacity>
                                 <Image source={photo} style={styles.imagePreview} />
                            </>
                        )}

                        <TouchableOpacity
                            style={[styles.nextButton, { backgroundColor: step === 1 && roomName ? 'rgba(112, 160, 214, 1)' : 'gray' }]}
                            onPress={() => setStep(2)}
                            disabled={!roomName}
                        >
                            <Text style={styles.nextButtonText}>{t('next')}</Text>
                        </TouchableOpacity>
                    </>
                )}

                {step === 2 && (
                    <>
                        <Text style={[styles.label, { color: theme.$textColor }]}>{t('devices')}</Text>
                        <MultiSelect
                            items={nodes
                                .filter(device => [2, 3, 7, 8].includes(device.pid) && !assignments.some(a => a.unicast === device.unicastAddress && a.idRoom !== idRoom))
                                .map(device => ({ deviceKey: device.unicastAddress, deviceName: device.name }))}
                            uniqueKey="deviceKey"
                            onSelectedItemsChange={setSelectedDevices}
                            selectedItems={selectedDevices}
                            selectText={t('select_devices')}
                            searchInputPlaceholderText={t('search_devices')}
                            displayKey="deviceName"
                            styleSelectorContainer={styles.multiSelectSelector}
                            styleDropdownMenuSubsection={styles.multiSelectDropdown}
                            styleTextDropdown={styles.multiSelectTextDropdown}
                            styleTextTag={styles.multiSelectTextTag}
                            styleInputGroup={styles.multiSelectInput}
                            submitButtonText={t('submit')}
                        />

                        <View style={styles.navigationButtons}>
                            <TouchableOpacity style={[styles.prevButton, { backgroundColor: 'rgba(112, 160, 214, 1)' }]} onPress={() => setStep(1)}>
                                <Text style={styles.prevButtonText}>{t('previous')}</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
            <TouchableOpacity style={[styles.addButton, !selectedDevices.length && { backgroundColor: 'gray' }]} onPress={handleSaveRoom} disabled={!selectedDevices.length}>
                <Text style={styles.addButtonText}>{t('add')}</Text>
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
    multiSelectSelector: {},
    multiSelectTextDropdown: {
        color: '#fff',
    },
    multiSelectTextTag: {
        color: '#fff',
    },
    addButton: {
        backgroundColor: '#58c487',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
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