import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import roomGetService from '../services/roomGetService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const Home = () => {
  const navigation = useNavigation();
  const [rooms, setRooms] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [deviceCount, setDeviceCount] = useState({});

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const idclient = await AsyncStorage.getItem('idclient');
        const iduser = await AsyncStorage.getItem('iduser');
        const idNetwork = 1;
        const token = await AsyncStorage.getItem('token');

        const roomResponse = await roomGetService(idclient, iduser, idNetwork, token);
        
        setRooms(roomResponse.rooms);
        setAssignments(roomResponse.assignments);
        
        let roomsArray = [];
        let assignmentsArray = [];
        
        try {
          roomsArray = typeof roomResponse.rooms === 'string' ? JSON.parse(roomResponse.rooms) : roomResponse.rooms;
        } catch (error) {
          console.error('Erreur lors du parsing des données des salles:', error);
          Alert.alert('Erreur', 'Erreur lors de la récupération des données des salles');
        } 
        
        try {
          assignmentsArray = typeof roomResponse.assignments === 'string' ? JSON.parse(roomResponse.assignments) : roomResponse.assignments;
        } catch (error) {
          console.error('Erreur lors du parsing des données des affectations:', error);
          Alert.alert('Erreur', 'Erreur lors de la récupération des données des affectations');
        }
    
        const deviceCountByRoom = countDevicesByRoom(roomsArray, assignmentsArray);
        setDeviceCount(deviceCountByRoom);
      } catch (error) {
        console.error('Erreur lors de la récupération des données des salles:', error);
        Alert.alert('Erreur', 'Échec de la récupération des données des salles');
      }
    };

    fetchRooms();
  }, []);
 
  const countDevicesByRoom = (rooms, assignments) => {
    const deviceCountByRoom = {};
    rooms.forEach(room => {
      const devicesInRoom = assignments.filter(assignment => assignment.idRoom === room.idRoom);
      deviceCountByRoom[room.idRoom] = devicesInRoom.length;
    });
    return deviceCountByRoom;
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
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        {rooms.map((room) => {
          const deviceCount = countDevicesByType(assignments, room.idRoom);
          const pictureUri = `data:image/jpeg;base64,${room.picture}`;

          return (
            <TouchableOpacity 
              key={room.idRoom} 
              style={styles.card} 
              onPress={() => navigation.navigate('RoomDetails', { roomId: room.idRoom, roomName: room.name, roomImage: pictureUri, assignments })}
            >
              <Text style={styles.cardTitle}>{room.name}</Text>
              <Image source={{ uri: pictureUri }} style={styles.cardImage} />
              <Text style={styles.detail}>{Object.values(deviceCount).reduce((a, b) => a + b, 0)} Devices</Text>
              <View style={styles.deviceContainer}>
                <Text style={styles.num}>{deviceCount[2]}</Text>
                <Image source={require('../../assets/icons/lampe1.png')} style={styles.icon} />
                <Text style={styles.num}>{deviceCount[8]}</Text>
                <Image source={require('../../assets/icons/volet.png')} style={styles.icon} />
                <Text style={styles.num}>{deviceCount[3]}</Text>
                <Image source={require('../../assets/icons/garage.png')} style={styles.icon} />
                <Text style={styles.num}>{deviceCount[7]}</Text>
                <Image source={require('../../assets/icons/clima.png')} style={styles.icon} />
              </View>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity style={styles.card}>
          <LottieView
            source={require('../../assets/lottiefile/Add.json')}
            autoPlay
            loop
            style={styles.Addicon}
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2F33',
  },
  scrollView: {
    paddingVertical: 20,
  },
  card: {
    marginHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: '#3E4349',
    borderRadius: 10,
    overflow: 'hidden',
    width: 300,
    height: 600,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Addicon: {
    width: 100,
    height: 100,
  },
  cardImage: {
    width: '100%',
    height: '75%',
    resizeMode: 'cover',
    marginBottom: 10,
  },
  cardTitle: {
    bottom: 10,
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  deviceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
  },
  icon: {
    width: 30,
    height: 30,
    marginHorizontal: 11,
    tintColor: '#FFF',
  },
  detail: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  num: {
    color: '#FFF',
    fontSize: 17,
    lineHeight: 30,
    textAlign: 'center',
  },
});

export default Home;