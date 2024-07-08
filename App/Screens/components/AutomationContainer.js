import React from 'react';
import { View, Text, Switch, Image, StyleSheet } from 'react-native';

const AutomationContainer = ({ icon, text, isEnabled, toggleSwitch }) => {
  return (
    <View style={styles.optionContainer}>
        <View style={styles.cercle}>
      <Image source={icon} style={styles.optionIcon} />
      </View>
      <Text style={styles.optionText}>{text}</Text>
     
      <Switch
            value={isEnabled}
            onValueChange={toggleSwitch}
            trackColor={{ false: '#333', true: 'rgba(153, 222, 160, 0.74)' }}
            thumbColor={isEnabled ? '#333' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    paddingVertical: 16,
    paddingHorizontal : 10,
    borderRadius: 25,
    marginBottom: 16,
  },
  optionIcon: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
   
    tintColor: '#FFF',
  },
  optionText: {
    marginRight :5 ,
    fontSize: 16,
    color: '#FFF',
    flex: 1,
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
    marginRight: 10,
  },
});

export default AutomationContainer;