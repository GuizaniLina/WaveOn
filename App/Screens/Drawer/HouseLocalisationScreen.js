/*import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';

const HouseLocalisationScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const saveLocation = async () => {
    try {
      await AsyncStorage.setItem('house_location', JSON.stringify(location));
      Alert.alert('Success', 'House location saved successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving location:', error);
      Alert.alert('Error', 'Error saving location');
    }
  };

  const handleManualLocation = () => {
    const [lat, lon] = address.split(',').map(coord => parseFloat(coord.trim()));
    if (lat && lon) {
      setLocation({ coords: { latitude: lat, longitude: lon } });
      setRegion({
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } else {
      Alert.alert('Invalid address', 'Please enter a valid address in the format "latitude, longitude"');
    }
  };

  const shareLocation = async () => {
    if (!location) {
      Alert.alert('No location set', 'Please set your house location first');
      return;
    }

    const message = `My house location: https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;
    await Linking.openURL(`whatsapp://send?text=${message}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set House Location</Text>
      <MapView style={styles.map} region={region} onRegionChangeComplete={setRegion}>
        {location && <Marker coordinate={location.coords} />}
      </MapView>
      <TextInput
        style={styles.input}
        placeholder="Enter location (latitude, longitude)"
        value={address}
        onChangeText={setAddress}
      />
      <View style={styles.buttons}>
        <Button title="Set Manually" onPress={handleManualLocation} />
        <Button title="Use Current Location" onPress={() => setLocation(region)} />
        <Button title="Save Location" onPress={saveLocation} />
        <Button title="Share Location" onPress={shareLocation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  map: {
    flex: 1,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: '#fff',
    backgroundColor: '#444',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default HouseLocalisationScreen;*/