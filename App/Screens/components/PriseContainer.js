import React, { useState,useContext } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { ThemeContext } from '../../ThemeProvider';
import { useTranslation } from 'react-i18next';

const PriseContainer = ({ isOn, onToggle, name, setPriseName }) => {
    const { theme } = useContext(ThemeContext);
    const { t } = useTranslation();
  const [isEditingName, setIsEditingName] = useState(false); // State to toggle editing

  const handlePressPrise = () => {
    setIsEditingName(true); // Activate the input field to edit the name
  };

  const handleNameChange = (newName) => {
    setPriseName(newName); // Update the Prise name
  };

  const handleNameSubmit = () => {
    setIsEditingName(false); // Hide the input field after submitting the name
  };

  return (
    <View style={[styles.twoContainer,{ backgroundColor: theme.$standard, borderColor: theme.$standard }]}>
      <Image source={require('../../../assets/icons/prise.png')} style={styles.icon} />
     
          <Text style={[styles.twoDeviceName,{ color: theme.$textColor }]}>{name}</Text>

      <Switch
        value={isOn} // Toggle switch based on Prise state
        onValueChange={onToggle} // Call toggle function when switched
        thumbColor={isOn ? 'white' : 'rgba(172, 208, 170, 0.8)'}
        trackColor={{ false: 'white', true: 'rgba(172, 208, 170, 0.8)' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  twoContainer: {
    backgroundColor: 'rgba(69, 66, 66, 0.52)',
    margin: 7,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderColor: 'white',
    borderWidth: 0.3,
    height: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  disabledContainer: {
    opacity: 0.5, // Reduce opacity if Prise is off
  },
  icon: {
    width: 30,
    height: 30,
    marginHorizontal: 11,
    tintColor: 'black',
  },
  priseNameInput: {
    color: 'black',
    marginVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
    padding: 5,
    width: 150,
  },
  twoDeviceName: {
    color: 'black',
    marginVertical: 10,
  },
});

export default PriseContainer;
