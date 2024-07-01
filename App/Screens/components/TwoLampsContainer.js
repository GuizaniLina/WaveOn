import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import Slider from '@react-native-community/slider';

const TwoLampsContainer = ({ title, icon1,icon2, slider_1_Values,slider_2_Values, infoIcons }) => {
  return (
    <View style={styles.deviceContainer}>
       
    <View style={styles.lampContainer}>
  <View style={styles.cercle}>
      <TouchableOpacity >
        <Image source={icon1} style={styles.icon} />
      </TouchableOpacity>
      
      </View>
      <View style={styles.cercle}>
      <TouchableOpacity >
        <Image source={icon2} style={styles.icon} />
      </TouchableOpacity>
      </View>
      </View>
      
    <View style={styles.textContainer}>
      <Text style={styles.deviceTitle}>
        {title}
        
      </Text>

      
  <View style={styles.controls}>
  <TouchableOpacity style={styles.stopButton}>
  <View style={styles.stopIcon} />
</TouchableOpacity>
  <Slider
    style={styles.slider}
    minimumValue={0}
    maximumValue={100}
    minimumTrackTintColor="#FFFFFF"
    maximumTrackTintColor="#000000"
  />
    </View> 
    <View style={styles.controls}>
  <TouchableOpacity style={styles.stopButton}>
  <View style={styles.stopIcon} />
</TouchableOpacity>
  <Slider
    style={styles.slider}
    minimumValue={0}
    maximumValue={100}
    minimumTrackTintColor="#FFFFFF"
    maximumTrackTintColor="#000000"
  />
    
    </View>
    </View>
  
 
      <View style={styles.iconContainer}>
        {infoIcons.map((info, index) => (
          <View key={index} style={styles.infoContainer}>
            <Image source={info.icon} style={[styles.infoIcon, { tintColor: info.color }]} />
            <Text style={styles.value}>{info.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}; 

const styles = StyleSheet.create({
  lampContainer :{
    flexDirection:'coloum',
    //backgroundColor : "white",
    marginTop :15,
    
  },
  deviceTitle: {
    fontSize: 18,
    marginTop: 5,
    fontWeight: 'bold',
    marginBottom: 16,
    color :'white'
  },
  lampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
    width: 40,
    height: 40,
    tintColor: '#FFF',
  },
  controls: {
    flexDirection: 'row',
      paddingTop: 10,
      
  },
  iconContainer: {
    flex: 0.35,
  // margin :2 ,
    //height : '80%',
   paddingTop : 5,
   
  //  backgroundColor : 'white'
  },
  stopButton: {
    width: 28,
    height: 28,
    borderRadius: 25,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:5,
    marginRight :5
   // marginLeft: 1,
  },
  deviceContainer: {
    flexDirection: 'row', // Align children horizontally
    alignItems: 'center', // Align children vertically
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: "grey",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    elevation: 3,
  },

   stopIcon: {
  width: 10,
  height: 10,
  backgroundColor: '#FFF',
},
slider: {
  width: 130,
  height: 35,
  marginBottom : 10,
 
},
infoContainer :{
  flexDirection: 'row',
},
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoIcon: { 
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 16,
    color: 'black',
  },
  deviceContainer: {
    flexDirection: 'row', // Align children horizontally
    alignItems: 'center', // Align children vertically
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: "grey",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
   margin :2 ,
  paddingLeft :5,
   height : '100 %',
  // width:100,

  //backgroundColor : "#fff" // Take remaining space in the row
  },

});

export default TwoLampsContainer;