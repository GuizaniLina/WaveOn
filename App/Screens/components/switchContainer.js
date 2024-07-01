import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const switchContainer = ({ title, icon, sliderValues, infoIcons }) => {
  return (
    <View style={styles.deviceContainer}>
      <View style={styles.cercle}>
        <TouchableOpacity>
          <Image source={icon} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.deviceTitle}>{title}</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.onButton}>
            <Text style={styles.buttonText}>On</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.offButton}>
            <Text style={styles.buttonText}>Off</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.sliderContainer}>
          {sliderValues.map((value, index) => (
            <Slider
              key={index}
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={value}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
            />
          ))}
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
    </View>
  );
};

const styles = StyleSheet.create({
  deviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: 'grey',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    elevation: 3,
  },
  cercle: {
    width: 70,
    height: 70,
    borderWidth: 0.5,
    borderColor: 'white',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    margin: 5,
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
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
    marginBottom: 16,
  },
  onButton: {
    flex: 1,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: '#4CAF50', // Green color
    alignItems: 'center',
    borderRadius: 5,
  },
  offButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F44336', // Red color
    alignItems: 'center',
    borderRadius: 5,
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
    width: 20,
    height: 20,
    marginHorizontal: 5,
    marginBottom: 7,
  },
  value: {
    fontSize: 16,
    color: 'black',
  },
});

export default switchContainer;