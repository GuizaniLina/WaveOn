import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialBottomTabBar } from '@react-navigation/material-bottom-tabs';
import { useNavigation } from '@react-navigation/native';

const CustomTabBar = (props) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <MaterialBottomTabBar {...props} />
      <TouchableOpacity
        style={styles.centralButton}
        onPress={() => navigation.navigate('CentralActionScreen')} // Change to your central action screen
      >
        <Image
          source={require('../../assets/icons/central-icon.png')} // Replace with your central button icon
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#58c487', // Match your app's theme color
  },
  centralButton: {
    position: 'absolute',
    bottom: 35, // Adjust to position the button
    left: '50%',
    transform: [{ translateX: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default CustomTabBar;