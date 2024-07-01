import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

const CustomHeader = ({ onMenuPress, onSearchPress }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onMenuPress}>
        <Image style={styles.icon} source={require('../../assets/icons/menu.png')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onSearchPress}>
        <Image style={styles.icon} source={require('../../assets/icons/search.png')} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#58c487',
    height: 90, // Adjust the height as needed
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default CustomHeader;