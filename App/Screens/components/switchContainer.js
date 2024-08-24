import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Switch } from 'react-native';
import { ThemeContext } from '../../ThemeProvider';

const SwitchContainer = ({ title, icon, infoIcons, onLongPress }) => {
  const [isOn, setIsOn] = useState(false);
  const { theme } = useContext(ThemeContext);

  const toggleSwitch = () => setIsOn(previousState => !previousState);

  return (
    <TouchableOpacity onLongPress={onLongPress} style={[styles.deviceContainer, { backgroundColor: theme.$standard, borderColor: theme.$standard }]}>
      <View style={styles.cercle}>
        <Image source={icon} style={styles.icon} />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.deviceTitle, { color: theme.$textColor }]}>{title}</Text>

        <View style={styles.switchContainer}>
          <Text style={[styles.stateText , {color : theme.$textColor}]}>State : {isOn ? 'On' : 'Off'}</Text>
         
          <Switch
            trackColor={{ false: theme.$standard, true: '#81b0ff' }}
            thumbColor={isOn ? theme.$primaryColor : '#58c487'}
           // ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isOn}
          />
        </View>
      </View>

      <View style={styles.iconContainer}>
        {infoIcons.map((info, index) => (
          <View key={index} style={styles.infoContainer}>
            <Image source={info.icon} style={[styles.infoIcon, { tintColor: info.color }]} />
            <Text style={[styles.value, { color: theme.$textColor }]}>{info.value}</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginLeft: 10,
    width: 120,
  },
  stateText: {
    fontSize: 13,
    fontWeight: 'bold',
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
    height: 15,
    marginHorizontal: 5,
    marginBottom: 7,
  },
  value: {
    paddingTop: 2,
    fontSize: 12,
    color: 'white',
  },
});

export default SwitchContainer;