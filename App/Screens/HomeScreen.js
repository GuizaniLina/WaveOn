
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert,Modal, FlatList, StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Security from './Security';
import Automation from './Automation';
import Devices from './Devices';
import Home from './Home';
import Groups from './Groups';
import LottieView from 'lottie-react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ThemeContext } from '../ThemeProvider';
import { useTranslation } from 'react-i18next';
import { DrawerActions } from '@react-navigation/native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler'; 

const Tab = createMaterialBottomTabNavigator();

const Accueil = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [dateTime, setDateTime] = useState({
    date: moment().format('LL'),
    time: moment().format('LTS'),
  });
  const [notifications, setNotifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
 
    const fetchNotifications = async () => {
      const idclient = await AsyncStorage.getItem('idclient');
        const storedNotifications = await AsyncStorage.getItem(`notifications_${idclient}`);
        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications));
        }
      
    };
    useEffect(() => {
    fetchNotifications();
  }, []);

  const addNotification = async (message) => {
    const newNotification = {
      id: notifications.length + 1,
      message: message,
      time: moment().format('LTS'),
      date: moment().format('LL'),
    };
    setNotifications((prevNotifications) => {
      const updatedNotifications = [...prevNotifications, newNotification];
      storeNotifications(updatedNotifications); // Store user-specific notifications
      return updatedNotifications;
    });
  };

  const storeNotifications = async (notificationsList) => {
    
    const idclient = await AsyncStorage.getItem('idclient');
      await AsyncStorage.setItem(`notifications_${idclient}`, JSON.stringify(notificationsList));
  
  };
 
  useEffect(() => {
    const checkProfileChange = async () => {
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const token = await AsyncStorage.getItem('token');
      if (idclient && iduser && token) {
        fetchNotifications();
      }
    };

    const unsubscribe = navigation.addListener('focus', checkProfileChange);
    return unsubscribe;
  }, [navigation]);

  const deleteNotification = async (id) => {
    const updatedNotifications = notifications.filter((item) => item.id !== id);
    setNotifications(updatedNotifications);
    const idclient = await AsyncStorage.getItem('idclient');
    await AsyncStorage.setItem(`notifications_${idclient}`, JSON.stringify(updatedNotifications));
  };
  const handleDelete = (id) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteNotification(id) },
      ],
      { cancelable: true }
    );
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime({
        date: moment().format('LL'),
        time: moment().format('LTS'),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);



  // Handle notification icon click
  const openNotificationModal = () => {
    setModalVisible(true);
  };
  const renderRightActions = (id) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDelete(id)}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );
  const renderNotificationItem = ({ item }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id)}
    >
      <View style={[styles.notificationItem, { backgroundColor: theme.$standard }]}>
        <Text style={[styles.notificationMessage, { color: theme.$textColor }]}>{item.message}</Text>
        <Text style={[styles.notificationTime, { color: theme.$textColor }]}>{item.time} - {item.date}</Text>
      </View>
    </Swipeable>
  );
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Image source={require('../../assets/icons/menu.png')} style={[styles.icon, { tintColor: theme.$iconColor }]} />
        </TouchableOpacity>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateText}>{dateTime.date}</Text>
          <Text style={styles.timeText}>{dateTime.time}</Text>
        </View>
        <TouchableOpacity onPress={openNotificationModal}>
          <View style={styles.notificationIconWrapper}>
            <Image source={require('../../assets/icons/notification.png')} style={[styles.icon, { tintColor: theme.$iconColor }]} />
            {notifications.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{notifications.length}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <Tab.Navigator
        initialRouteName="Home"
        barStyle={{ backgroundColor: '#58c487', height: 85 }}
        activeColor={'#2a6ebd'}
        inactiveColor={'white'}
      >
        <Tab.Screen
          name="Devices"
          component={Devices}
          options={{
            tabBarIcon: () => <Image style={[styles.image, { tintColor: theme.$iconColor }]} source={require('../../assets/icons/devices.png')} />,
            tabBarLabel: t('devices'),
          }}
        />
        <Tab.Screen
          name="Groups"
          component={Groups}
          options={{
            tabBarIcon: () => <Image style={[styles.image, { tintColor: theme.$iconColor }]} source={require('../../assets/icons/groups.png')} />,
            tabBarLabel: t('groups'),
          }}
        />
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: () => (
              <View style={[styles.homeIconWrapper, { backgroundColor: theme.$backgroundColor }]}>
                <LottieView source={require('../../assets/lottiefile/robot_loading.json')} autoPlay loop style={styles.animation} />
              </View>
            ),
            tabBarLabel: '',
          }}
        />
     
        <Tab.Screen
  name="Security"
  options={{
    tabBarIcon: () => <Image style={[styles.image, { tintColor: theme.$iconColor }]} source={require('../../assets/icons/security.png')} />,
    tabBarLabel: t('security'),
  }}
>
  {() => <Security addNotification={addNotification} navigation={navigation} />}
</Tab.Screen>
        <Tab.Screen
          name="Automation"
          component={Automation}
          options={{
            tabBarIcon: () => <Image style={[styles.image, { tintColor: theme.$iconColor }]} source={require('../../assets/icons/automation.png')} />,
            tabBarLabel: t('automation'),
          }}
        />
      </Tab.Navigator>

      {/* Notification Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <View style={[styles.modalContainer, { backgroundColor: theme.$backgroundColor }]}>
          <Text style={[styles.modalTitle, { color: theme.$textColor }]}>Notifications</Text>
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderNotificationItem}
          />
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = EStyleSheet.create({
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
    width: 25,
    height: 25,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
  },
  image: {
    width: 20,
    height: 20,
  },
  dateTimeContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  dateText: {
    color: 'white',
    fontSize: 12,
  },
  timeText: {
    color: 'white',
    fontSize: 13,
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    width: 35,
    height: 35,
    marginRight: 5,
  },
  weatherText: {
    color: 'yellow',
    fontSize: 14,
    marginRight: 5,
    fontWeight: 'bold',
  },
  weatherDescription: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
  homeIconWrapper: {
    position: 'absolute',
    bottom: -28,
    left: '50%',
    transform: [{ translateX: -35 }],
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  meteoIcon: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  animation: {
    width: 100,
    height: 100,
  },
  notificationIconWrapper: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop :'20%'
  },
  notificationItem: {
    marginHorizontal : 5,
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
  notificationMessage: {
    fontSize: 16,
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#58c487',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '90%',
    borderRadius :20
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Accueil;