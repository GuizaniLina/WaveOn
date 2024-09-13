import React, { useContext } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { ThemeContext } from '../../ThemeProvider';
import { useTranslation } from 'react-i18next';

const LampsContainer = ({ level_A, level_B, onPressLamp1, onPressLamp2, onPress ,name}) => {
  const isLevelActive = (level) => level !== '0 %' && level !== '--';
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <TouchableOpacity 
      style={[styles.deviceContainer, { backgroundColor: theme.$standard, borderColor: theme.$standard }]}
      onPress={onPress} // Navigate to TwoLampsControlScreen
    >
      <View style={styles.textContainer}>
        <Text style={[styles.deviceTitle, { color: theme.$textColor }]}>{name}</Text>
      </View>

      <View style={styles.lampContainer}>
        <View style={[styles.cercle, isLevelActive(level_A) ? styles.cercleActive : {}]}>
          <TouchableOpacity onPress={onPressLamp1}>
            <Image source={require('../../../assets/icons/lampe_dark.png')} style={[styles.icon, isLevelActive(level_A) ? styles.iconActive : {}]} />
          </TouchableOpacity>
        </View>
        <View style={[styles.cercle, isLevelActive(level_B) ? styles.cercleActive : {}]}>
          <TouchableOpacity onPress={onPressLamp2}>
            <Image source={require('../../../assets/icons/lampe_dark.png')} style={[styles.icon, isLevelActive(level_B) ? styles.iconActive : {}]} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  lampContainer: {
    flexDirection: 'row',
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  LevelContainer: {
    flexDirection: 'row',
  },
  deviceTitle: {
    fontSize: 18,
    marginTop: 5,
    fontWeight: 'bold',
    marginBottom: 14,
    color: 'white',
  },
  bodyinfo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: '#FFF',
  },
  textContainer: {
    flex: 1,
  },
  cercleActive: {
    backgroundColor: 'white', // White background for active level
    borderColor: '#000', // Black border for active level
  },
  iconActive: {
    tintColor: '#000', // Black icon for active level
  },
});

export default LampsContainer;