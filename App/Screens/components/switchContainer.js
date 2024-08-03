import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const SwitchContainer = ({ title, icon, infoIcons, onLongPress }) => {
  const [isOn, setIsOn] = useState(true);

  const handleOnPress = () => {
    setIsOn(true);
  };

  const handleOffPress = () => {
    setIsOn(false);
  };

  return (
    <TouchableOpacity onLongPress={onLongPress} style={styles.deviceContainer}>
      <View style={styles.cercle}>
        <Image source={icon} style={styles.icon} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.deviceTitle}>{title}</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isOn ? styles.activeButton : styles.inactiveButton]}
            onPress={handleOnPress}
          >
            <Text style={styles.buttonText}>On</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, !isOn ? styles.activeButton : styles.inactiveButton]}
            onPress={handleOffPress}
          >
            <Text style={styles.buttonText}>Off</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.iconContainer}>
        {infoIcons.map((info, index) => (
          <View key={index} style={styles.infoContainer}>
            <Image
              source={info.icon}
              style={[styles.infoIcon, { tintColor: info.color }]}
            />
            <Text style={styles.value}>{info.value}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  deviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: 'grey',
    borderRadius: 35,
    padding: 7,
    marginBottom: 16,
    elevation: 3,
  },
  cercle: {
    width: 50,
    height: 50,
    borderWidth: 0.5,
    borderColor: 'white',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    margin: 5,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    tintColor: '#FFF',
  },
  textContainer: {
    flex: 1,
    margin: 2,
    paddingLeft: 5,
  },
  deviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    width: 120,
    marginLeft: 30,
  },
  button: {
    flex: 1,
    paddingVertical: 5,
    marginHorizontal: 5,
    alignItems: 'center',
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#4CAF50',
  },
  inactiveButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sliderContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  slider: {
    width: 130,
    height: 35,
    marginBottom: 10,
  },
  iconContainer: {
    flex: 0.35,
    paddingTop: 5,
  },
  infoContainer: {
    flexDirection: 'row',
  },
  infoIcon: {
    width: 15,
    height:15,
    marginHorizontal: 5,
    marginBottom: 7,
  },
  value: {
    
    paddingTop : 2,
    fontSize: 12,
    color: 'white',
  },
});

export default SwitchContainer;