import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.profileIcon}
        />
        <Text style={styles.profileName}>WaveOn</Text>
        <Text style={styles.profileName}>www.alphatechnology.tn</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    height: 150,
    backgroundColor: '#58c487',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CustomDrawerContent;