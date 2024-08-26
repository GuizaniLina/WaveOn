import React, { useState,useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { ThemeContext } from '../../ThemeProvider';
import { useTranslation } from 'react-i18next';

const BlindsContainer = ({ sliderValues, onPress,onSliderChange }) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [sliderValue, setSliderValue] = useState(sliderValues);

  const handleSliderChange = (value) => {
    setSliderValue(value);
    if (onSliderChange) {
      onSliderChange(value);
    }
  };
  return (
    <TouchableOpacity onPress={onPress} style={[styles.deviceContainer, { backgroundColor: theme.$standard, borderColor: theme.$standard }]}>
      <View style={styles.textContainer}>
        <Text style={[styles.deviceTitle, { color: theme.$textColor }]}>{t('blinds')}</Text>
      </View>
      <View style={styles.headerContainer}>
        <View style={styles.cercle}>
          <Image source={require('../../../assets/icons/volet.png')} style={styles.icon} />
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          value={sliderValues}
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="#000000"
          onValueChange={handleSliderChange}
        />
      </View>
    </TouchableOpacity>
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
    height: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
    height: 25,
    tintColor: '#FFF',
  },
  textContainer: {
    flex: 1,
  },
  deviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerContainer: {
    alignItems: 'center',
  },
  slider: {
    width: 140,
  },
});

export default BlindsContainer;