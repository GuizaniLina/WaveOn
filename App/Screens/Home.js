import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, ScrollView, SafeAreaView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import roomGetService from '../services/roomGetService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import WeatherComponent from './components/WeatherComponent';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ThemeContext } from '../ThemeProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next'; 


const Home = () => {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const { t } = useTranslation(); // Use the t function for translations
  const [rooms, setRooms] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [deviceCount, setDeviceCount] = useState({});
  const [isLoading, setIsLoading] = useState(true); // State to track loading
  const [isAdmin, setIsAdmin] = useState(null);
  const [isGateway, setIsGateway] = useState(null);

  const fetchRooms = async () => {
    try {
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const idNetwork = 1;
      const token = await AsyncStorage.getItem('token');
      setIsAdmin(await AsyncStorage.getItem('user_isadmin'));
      setIsGateway(await AsyncStorage.getItem('user_isgateway'));

      const roomResponse = await roomGetService(idclient, iduser, idNetwork, token,navigation);
      setRooms(roomResponse.rooms);
      setAssignments(roomResponse.assignments);

      let roomsArray = [];
      let assignmentsArray = [];

      try {
        roomsArray = typeof roomResponse.rooms === 'string' ? JSON.parse(roomResponse.rooms) : roomResponse.rooms;
      } catch (error) {
        console.error('Erreur lors du parsing des données des salles:', error);
       
      }

      try {
        assignmentsArray = typeof roomResponse.assignments === 'string' ? JSON.parse(roomResponse.assignments) : roomResponse.assignments;
      } catch (error) {
        console.error('Erreur lors du parsing des données des affectations:', error);
        
      }

      const deviceCountByRoom = countDevicesByRoom(roomsArray, assignmentsArray);
      setDeviceCount(deviceCountByRoom);
    } catch (error) {
      console.error('Erreur lors de la récupération des données des salles:', error);
      
    } finally {
      setIsLoading(false); // Set loading to false once data is loaded
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []); // Run on component mount

  useEffect(() => {
    const checkProfileChange = async () => {
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const token = await AsyncStorage.getItem('token');
      
      if (idclient && iduser && token) {
        fetchRooms();
      }
    };

    const unsubscribe = navigation.addListener('focus', checkProfileChange);
    return unsubscribe;
  }, [navigation]);

  const countDevicesByRoom = (rooms, assignments) => {
    const deviceCountByRoom = {};
    rooms.forEach(room => {
      const devicesInRoom = assignments.filter(assignment => assignment.idRoom === room.idRoom);
      deviceCountByRoom[room.idRoom] = devicesInRoom.length;
    });
    return deviceCountByRoom;
  };

  // Images...
  const kitchenImage = require('../../assets/kitchen.jpg');
  const bedroomImage = require('../../assets/bedroom.jpg');
  const bathroomImage = require('../../assets/bathroom.jpg');
  const gardenImage = require('../../assets/garden.jpg');
  const kidsroomImage = require('../../assets/kidsroom.jpg');
  const livingroomImage = require('../../assets/livingroom1.jpg');

  const imageMap = {
    'bedroom.jpg': bedroomImage,
    'kitchen1.jpg': kitchenImage,
    'bathroom.jpg': bathroomImage,
    'garden.jpg': gardenImage,
    'kidsroom.jpg': kidsroomImage,
    'livingroom1.jpg': livingroomImage,
  };

  const getPictureUri = (picture) => {
    if (picture) {
      if (picture.startsWith('file://') || picture.startsWith('http')) {
        return picture;
      } else if (picture.endsWith('.jpg') || picture.endsWith('.png')) {
        return imageMap[picture];
      } else {
        return { uri: `data:image/jpeg;base64,${picture}` };
      }
    }
    return null;
  };

  const countDevicesByType = (assignments, roomId) => {
    const deviceTypes = [2, 3, 7, 8];
    const deviceCount = {};

    deviceTypes.forEach(type => {
      deviceCount[type] = assignments.filter(assignment => assignment.idRoom === roomId && assignment.deviceType === type).length;
    });

    return deviceCount;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.$backgroundColor }]}>
      <WeatherComponent /> 

      {isLoading ? ( // Show loading spinner while data is loading
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.$primaryColor} />
          <Text style={{ color: theme.$textColor }}>{t('loading')}</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
        >
          {rooms.map((room) => {
            const deviceCount = countDevicesByType(assignments, room.idRoom);
            const totalDevices = Object.values(deviceCount).reduce((a, b) => a + b, 0);
            const pictureUri = getPictureUri(room.picture);

            return (
              <TouchableOpacity 
                key={room.idRoom} 
                style={styles.card} 
                onPress={() => navigation.navigate('RoomDetails', {
                  rooms,
                  roomId: room.idRoom,
                  roomName: room.name,
                  roomImage: pictureUri,
                  assignments
                })}
              >
                <ImageBackground source={pictureUri} style={styles.cardImageBackground}>
                  <LinearGradient
                    colors={['#58c487', 'rgba(112, 160, 214, 0.3)']} 
                    style={styles.overlay}
                  >
                    <Text style={styles.cardTitle}>{t(room.name)}</Text>
                  </LinearGradient>
                  <LinearGradient
                    colors={['rgba(88, 209, 91, 0.3)', 'rgba(112, 160, 214, 1)']} 
                    style={styles.deviceContainer}
                  >
                    <Text style={styles.totalDevices}>{totalDevices} {t('devices')}</Text>
                    <View style={styles.deviceIconContainer}>
                      <View style={styles.deviceItem}>
                        <View style={styles.iconCircle}>
                          <Image source={require('../../assets/icons/lampe1.png')} style={styles.icon} />
                        </View>
                        <Text style={styles.num}>{deviceCount[2]}</Text>
                      </View>
                      <View style={styles.deviceItem}>
                        <View style={styles.iconCircle}>
                          <Image source={require('../../assets/icons/volet.png')} style={styles.icon} />
                        </View>
                        <Text style={styles.num}>{deviceCount[3]}</Text>
                      </View>
                      <View style={styles.deviceItem}>
                        <View style={styles.iconCircle}>
                          <Image source={require('../../assets/icons/garage.png')} style={styles.icon} />
                        </View>
                        <Text style={styles.num}>{deviceCount[8]}</Text>
                      </View>
                      <View style={styles.deviceItem}>
                        <View style={styles.iconCircle}>
                          <Image source={require('../../assets/icons/prise.png')} style={styles.icon} />
                        </View>
                        <Text style={styles.num}>{deviceCount[7]}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity 
            style={[styles.addcard , {backgroundColor : theme.$standard}]} 
            onPress={() => ((isAdmin === '0') && (isGateway === '0')) 
              ? Alert.alert(t('sorry'), t('should_be_admin_gateway')) 
              : navigation.navigate('RoomFormScreen', { rooms, assignments })
            }
          >
            <LottieView
              source={require('../../assets/lottiefile/Add.json')}
              autoPlay
              loop
              style={styles.Addicon}
            />
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$backgroundColor',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {},
  Addicon: {
    width: 100,
    height: 100,
  },
  card: {
    marginHorizontal: 10,
    backgroundColor: '#3E4349',
    borderRadius: 10,
    width: 260,
    height: '95%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
  },
  addcard: {
    marginHorizontal: 10,
    backgroundColor: 'rgba(223, 220, 201, 0.8)',
    borderRadius: 10,
    width: 260,
    height: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  cardImageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  overlay: {
    width: '100%',
    position: 'absolute',
    borderRadius: 10,
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(66, 80, 65, 0.65)',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  deviceContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(112, 160, 214, 0.5)',
    borderRadius: 10,
    paddingTop: 9,
    position: 'absolute',
    width: '100%',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  deviceIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
  },
  totalDevices: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceItem: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconCircle: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 10,
    marginBottom: 5,
  },
  icon: {
    width: 24,
    height: 24,
  },
  num: {
    color: '#fff',
    fontSize: 14,
  },
});

export default Home;