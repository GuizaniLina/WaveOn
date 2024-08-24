import React, { useContext } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { ThemeContext } from '../../ThemeProvider';

const TwoLampsContainer = ({ title, icon1, icon2, level_A, level_B, infoIcons, onLongPress, onPressLamp1, onPressLamp2 , onPress}) => {
  const isLevelActive = (level) => level !== '0 %' && level !== '--';
  const { theme} = useContext(ThemeContext);

  return (
    <TouchableOpacity onLongPress={onLongPress} onPress={onPress} style={[styles.deviceContainer,{backgroundColor :theme.$standard , borderColor:theme.$standard}]}>
      <View style={styles.lampContainer}>
        <View style={[styles.cercle, isLevelActive(level_A) ? styles.cercleActive : {}]}>
          <TouchableOpacity onPress={onPressLamp1}>
            <Image source={icon1} style={[styles.icon, isLevelActive(level_A) ? styles.iconActive : {}]} />
          </TouchableOpacity>
        </View>
        <View style={[styles.cercle, isLevelActive(level_B) ? styles.cercleActive : {}]}>
          <TouchableOpacity onPress={onPressLamp2}>
            <Image source={icon2} style={[styles.icon, isLevelActive(level_B) ? styles.iconActive : {}]} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.deviceTitle ,{ color : theme.$textColor}]}>{title}</Text>
        <View>
          <Text style={[styles.bodyinfo , {color : theme.$textColor}]}>A Level : {level_A}</Text>
          <Text style={[styles.bodyinfo, {color : theme.$textColor}, { marginTop: 45 }]}>B Level : {level_B}</Text>
        </View>
      </View>
      <View style={styles.iconContainer}>
        {infoIcons.map((info, index) => (
          <View key={index} style={styles.infoContainer}>
            <Image source={info.icon} style={[styles.infoIcon, { tintColor: info.color }]} />
            <Text style={[styles.value ,{ color : theme.$textColor}]}>{info.value}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
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
    marginBottom: 14,
    color :'white'
  },
  bodyinfo: {
    fontSize: 12,
   // marginTop: 5,
    fontWeight: 'bold',
   // marginBottom: 5,
    color :'#333'
  },
  lampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
    width: 30,
    height: 30,
    tintColor: '#FFF',
  },

  iconContainer: {
    flex: 0.35,
  // margin :2 ,
    //height : '80%',
   paddingTop : 5,
   
  //  backgroundColor : 'white'
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
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  value: {
    fontSize: 12,
    marginBottom: 12,
    color: 'white',
    paddingTop :2
  },
  deviceContainer: {
    flexDirection: 'row', // Align children horizontally
    alignItems: 'center', // Align children vertically
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: "grey",
    borderRadius: 35,
    padding: 7,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  textContainer: {
    flex: 1,
   margin :2 ,
  paddingLeft :5,
   height : '100 %',
  // width:100,

  //backgroundColor : "#fff" // Take remaining space in the row
  },
  cercleActive: {
    backgroundColor: '#FFF', // White background for active level
    borderColor: '#000', // Black border for active level
  },
  iconActive: {
    tintColor: '#000', // Black icon for active level
  },

});

export default TwoLampsContainer;