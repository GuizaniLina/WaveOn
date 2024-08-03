import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const BlindsContainer = ({ sliderValues }) => {
  return (
    <View style={styles.deviceContainer}>
        <View style={styles.textContainer}>
        <Text style={styles.deviceTitle}>Blinds</Text>
        </View>
        <View style={styles.headerContainer}>
      <View style={styles.cercle}>
        <TouchableOpacity>
          <Image source={require('../../../assets/icons/volet.png')} style={styles.icon} />
        </TouchableOpacity>
      </View> 
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor="rgba(172, 208, 170, 0.8)"
            maximumTrackTintColor="#000000"
          />
       
      
       </View>
    
    </View>
  );
};

const styles = StyleSheet.create({
    deviceContainer: {
        backgroundColor: 'rgba(69, 66, 66, 0.52)',
        margin: 7,
        padding: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        borderColor: 'white',
        borderWidth: 0.3,
        height :120
      },
  cercle: {
    width: 40,
    height: 40,
    borderWidth: 0.5,
    borderColor: 'white',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
   // margin: 5,
  },
  icon: {
    justifyContent:"center",
    alignItems : "center",
    width: 25,
    height: 25,
    tintColor: '#FFF',
    //marginHorizontal: 10,
  },
  textContainer: {
    flex: 1,
   
  },
  deviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
   // marginBottom: 16,
    color: 'white',
  },
  headerContainer: {
  
    alignItems: 'center',
   
  },
 
 
 
  slider: {
    width: 140,
  //  height: 20,
   
   // transform: [{ rotate: '270deg' }]
   
  },
  
});

export default BlindsContainer;