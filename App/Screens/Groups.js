import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl, Switch, Image, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { ThemeContext } from '../ThemeProvider';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { BlurView } from '@react-native-community/blur';

const Groups = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [groups, setGroups] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [USER_ID, setUSER_ID] = useState(null);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchGroups = async () => {
    try {
      const userId = await AsyncStorage.getItem('idclient');
      setUSER_ID(userId);
      setRefreshing(true);
      const storedGroups = await AsyncStorage.getItem(`groups_${userId}`);
      if (storedGroups) {
        setGroups(JSON.parse(storedGroups));
      }
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [])
  );

  const onRefresh = () => {
    fetchGroups();
  };
  useEffect(() => {
    const checkProfileChange = async () => {
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const token = await AsyncStorage.getItem('token');
      if (idclient && iduser && token) {
        fetchGroups();
      }
    };

    const unsubscribe = navigation.addListener('focus', checkProfileChange);
    return unsubscribe;
  }, [navigation]);

  const getCategoryIcon = (pid, isActive, value) => {
    let icon;
    switch (pid) {
      case 2:
        icon = require('../../assets/icons/lampe1.png');
        break;
      case 3:
        icon = require('../../assets/icons/volet.png');
        break;
      case 7:
        icon = require('../../assets/icons/clima.png');
        break;
      case 8:
        icon = require('../../assets/icons/garage.png');
        break;
      default:
        icon = require('../../assets/icons/default.png');
    }

    const circleStyle = {
      borderColor: isActive ? 'rgba(251, 216, 92,1)' : theme.$textColor,
      backgroundColor: value > 0 ? `rgba(251, 216, 92, ${value / 100})` : theme.$backgroundColor,
    };

    return (
      <View style={[styles.categoryCircle, circleStyle]}>
        <Image source={icon} style={[styles.categoryIcon, { tintColor: isActive ? 'rgba(251, 216, 92,1)' : theme.$textColor } ]} />
      </View>
    );
  };

  const toggleGroupEnable = async (groupId, value) => {
    const updatedGroups = groups.map(g =>
      g.id === groupId ? { ...g, enabled: value } : g
    );
    setGroups(updatedGroups);
    await AsyncStorage.setItem(`groups_${USER_ID}`, JSON.stringify(updatedGroups));
  };

  const handleLongPress = (group) => {
    Alert.alert(
      t('Options'),
      t('Choose an option'),
      [
        {
          text: t('Modify'),
          onPress: () => navigation.navigate('CreateGroupScreen', { group })
        },
        {
          text: t('Delete'),
          onPress: () => deleteGroup(group.id)
        },
        { text: t('Cancel'), style: 'cancel' }
      ]
    );
  };

  const deleteGroup = async (groupId) => {
    const updatedGroups = groups.filter(g => g.id !== groupId);
    setGroups(updatedGroups);
    await AsyncStorage.setItem(`groups_${USER_ID}`, JSON.stringify(updatedGroups));
  };

  const toggleExpandGroup = (group) => {
    setExpandedGroup(group);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setExpandedGroup(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.$backgroundColor }]}>
      {groups.length === 0 ? (
        <View style={styles.content}>
          <LottieView
            source={require('../../assets/lottiefile/nodata.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
          <Text style={[styles.noDataText, { color: theme.$textColor }]}>
            {t('no_group_configured')}
          </Text>
          <Text style={[styles.noDataDescription, { color: theme.$textColor }]}>
            {t('create_group_description')}
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.gridContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {groups.map((group) => (
            <TouchableOpacity 
              key={group.id} 
              onPress={() => toggleExpandGroup(group)}
              onLongPress={() => handleLongPress(group)}
              style={[styles.groupContainer, { backgroundColor: theme.$standard }]}
            >
              <View style={styles.groupContent}>
                {getCategoryIcon(group.devices[0].pid, group.enabled, group.position || group.luminosity || 0)}
                <Text style={[styles.groupTitle, { color: theme.$textColor }]}>{group.name}</Text>
                <View style={styles.controlsContainer}>
                  {group.devices[0].pid === 2 && (
                    <>
                      <Slider
                        style={styles.verticalSlider}
                        minimumValue={0}
                        maximumValue={100}
                        value={group.luminosity || 0}
                        minimumTrackTintColor="'rgba(251, 216, 92,1)'"
                        maximumTrackTintColor="#000000"
                        vertical={true} // To make it vertical
                        onValueChange={(value) => {
                          const updatedGroups = groups.map(g =>
                            g.id === group.id ? { ...g, luminosity: value } : g
                          );
                          setGroups(updatedGroups);
                          AsyncStorage.setItem(`groups_${USER_ID}`, JSON.stringify(updatedGroups));
                        }}
                      />
                      <Switch
                        value={group.enabled}
                        onValueChange={(value) => toggleGroupEnable(group.id, value)}
                        trackColor={{ false: theme.$textColor, true: 'rgba(251, 216, 92,1)' }}
                        thumbColor={theme.$backgroundColor}
                        style={styles.switchRight}
                      />
                    </>
                  )}
                  {group.devices[0].pid === 3 && (
                    <View style={styles.sliderContainer}>
                      <Slider
                        style={styles.verticalSlider}
                        minimumValue={0}
                        maximumValue={100}
                        minimumTrackTintColor="'rgba(251, 216, 92,1)'"
                        maximumTrackTintColor="#000000"
                        vertical={true} // To make it vertical
                        value={group.position || 0}
                        onValueChange={(value) => {
                          const updatedGroups = groups.map(g =>
                            g.id === group.id ? { ...g, position: value } : g
                          );
                          setGroups(updatedGroups);
                          AsyncStorage.setItem(`groups_${USER_ID}`, JSON.stringify(updatedGroups));
                        }}
                      />
                      <Text style={[styles.groupDescription, { color: theme.$textColor }]}>
                         {Math.round(group.position || 0)}%
                      </Text>
                    </View>
                  )}
                  {(group.devices[0].pid === 7 || group.devices[0]?.pid === 8) && (
                    <Switch
                      value={group.enabled}
                      onValueChange={(value) => toggleGroupEnable(group.id, value)}
                      trackColor={{ false: theme.$textColor, true: 'rgba(251, 216, 92,0.7)' }}
                      thumbColor={theme.$backgroundColor}
                      style={styles.switch}
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('CreateGroupScreen')}>
          <LottieView
            source={require('../../assets/lottiefile/Add.json')}
            autoPlay
            loop
            style={styles.lottieAdd}
          />
        </TouchableOpacity>
      </View>

      {/* Modal to display the device list with a blurred background */}
      {expandedGroup && (
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeModal}
        >
          <BlurView
            style={styles.absolute}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
          />
          <View style={styles.modalContainer}>
            <Text style={[styles.modalTitle, { color: theme.$textColor }]}>
              {expandedGroup.name}
            </Text>
            {expandedGroup.devices.map((device, index) => (
              <Text key={index} style={[styles.modalDeviceItem, { color: theme.$textColor }]}>
                {device.name}
              </Text>
            ))}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>{t('Close')}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  lottie: {
    width: 150,
    height: 150,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 60,
    height: 60,
  },
  lottieAdd: {
    width: 70,
    height: 70,
  },
  noDataText: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: 'bold',
  },
  noDataDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  gridContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  groupContainer: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  groupContent: {
    alignItems: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  verticalSlider: {
    width: 80,
    paddingBottom: 50,
    paddingLeft: 20,
    transform: [{ rotate: '-90deg' }],
  },
  sliderText: {
    fontSize: 16,
  },
  categoryCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryIcon: {
    width: 24,
    height: 24,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  switchRight: {
    marginLeft: 10,
    transform: [{ rotate: '-90deg' }],
  },
  switch: {
    marginLeft: 100,
    transform: [{ rotate: '-90deg' }],
  },
  deviceList: {
    marginTop: 10,
  },
  deviceItem: {
    fontSize: 14,
    marginBottom: 5,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalDeviceItem: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#58c487',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  groupDescription:{
    fontSize:25,
    fontWeight:"bold"
   
  }
});

export default Groups;