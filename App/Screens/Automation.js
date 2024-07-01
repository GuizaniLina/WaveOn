import React, { useState } from 'react';
import { View, Text,ImageBackground, StyleSheet, Switch, SafeAreaView, Image, TouchableOpacity } from 'react-native';

const Automation = ({ navigation }) => {
  const [lightsEnabled, setLightsEnabled] = useState(false);
  const [blindsEnabled, setBlindsEnabled] = useState(false);
  const [hallwayLightsEnabled, setHallwayLightsEnabled] = useState(true);
  const [temperatureNotificationEnabled, setTemperatureNotificationEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
    
      <Text style={styles.headerTitle}>Automation</Text>
        </View>
        <View style={styles.optionContainer}>
        <Image source={require('../../assets/icons/lampe1.png')} style={styles.optionIcon} />
        <Text style={styles.optionText}>Turn OFF all lights</Text>
        <Switch
          value={lightsEnabled}
          onValueChange={setLightsEnabled}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={lightsEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
        />
      </View>

      <View style={styles.optionContainer}>
        <Image source={require('../../assets/icons/volet.png')} style={styles.optionIcon} />
        <Text style={styles.optionText}>Close all blinds</Text>
        <Switch
          value={blindsEnabled}
          onValueChange={setBlindsEnabled}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={blindsEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
        />
      </View>

      <View style={styles.optionContainer}>
        <Image source={require('../../assets/icons/notification.png')} style={styles.optionIcon} />
        <Text style={styles.optionText}>Turn On Hallway Lights at 19:30</Text>
        <Switch
          value={hallwayLightsEnabled}
          onValueChange={setHallwayLightsEnabled}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={hallwayLightsEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
        />
      </View>

      <View style={styles.optionContainer}>
        <Image source={require('../../assets/icons/temperatures.png')} style={styles.optionIcon} />
        <Text style={styles.optionText}>Temperature Notification  30°C</Text>
        <Switch
          value={temperatureNotificationEnabled}
          onValueChange={setTemperatureNotificationEnabled}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={temperatureNotificationEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
        />
      </View>

      <View style={styles.optionContainer}>
        <Image source={require('../../assets/gif/ADD.gif')} style={styles.optionIcon} />
        <Text style={styles.optionText}>New automation</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    padding: 16,
  },
  header: {
    backgroundColor : '#58c487',
    alignItems: 'center',
    borderBottomEndRadius: 35,
    borderBottomStartRadius: 35,
    height : 120,
    marginBottom :20
    
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#FFF',
  },
 
  connectText: {
    fontSize: 16,
    color: '#FFF',
  },
  headerTitle: {
    fontSize: 35,
    color: '#FFF',
    marginTop: 40,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    padding: 16,
    borderRadius: 25,
    marginBottom: 16,
  },
  optionIcon: {
    width: 30,
    height: 30,
    marginRight: 20,
    tintColor: '#FFF',
  },
  background:{
    resizeMode: 'cover',
  },
  optionText: {
    fontSize: 18,
    color: '#FFF',
    flex: 1,
  },
});

export default Automation;