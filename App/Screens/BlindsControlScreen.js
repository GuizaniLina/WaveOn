import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { publishMQTT } from '../services/mqttService';
import Slider from '@react-native-community/slider';
import { ThemeContext } from '../ThemeProvider';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

export default function BlindsControlScreen({ route, navigation }) {
  const { node } = route.params;
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [blindPosition, setBlindPosition] = useState(node.getElementStates()[0] || 0);
  const [isStopEnabled, setIsStopEnabled] = useState(false);
  const [isUpEnabled, setIsUpEnabled] = useState(true);
  const [isDownEnabled, setIsDownEnabled] = useState(true);
  const [intervalId, setIntervalId] = useState(null);

  const handleBlindChange = async (value) => {
    setBlindPosition(value);
    await publishMQTT(node.unicastAddress, node.getElementAddresses()[0], value, 'BlindsLevel');
  };

  const handleStopPress = async () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsStopEnabled(false);
    setIsUpEnabled(true);
    setIsDownEnabled(true);
    await publishMQTT(node.unicastAddress, node.getElementAddresses()[0], blindPosition, 'BlindsLevel');
  };

  const handleUpPress = async () => {
    setIsUpEnabled(false);
    setIsDownEnabled(true);
    setIsStopEnabled(true);
    incrementBlindPosition(1); // Increment the blind position up
  };

  const handleDownPress = async () => {
    setIsDownEnabled(false);
    setIsUpEnabled(true);
    setIsStopEnabled(true);
    incrementBlindPosition(-1); // Decrement the blind position down
  };

  const incrementBlindPosition = (direction) => {
    const id = setInterval(() => {
      setBlindPosition(prevPosition => {
        let newPosition = prevPosition + direction * 5; // Change the increment/decrement value here
        if (newPosition > 100) newPosition = 100;
        if (newPosition < 0) newPosition = 0;
        publishMQTT(node.unicastAddress, node.getElementAddresses()[0], newPosition, 'BlindsLevel');
        return newPosition;
      });
    }, 500); // Adjust the interval speed here
    setIntervalId(id);
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <View style={[styles.container, { backgroundColor: theme.$backgroundColor }]}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={24} color={theme.$iconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={''}>
          <Image source={require('../../assets/icons/notification.png')} style={[styles.icon ,{ tintColor : theme.$iconColor}]} />
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={['#58c487', 'rgba(112, 160, 214, 1)']}
        style={styles.header}
      >
        <Text style={[styles.nodeTitle, { color: theme.$iconColor }]}>{node.name}</Text>
      </LinearGradient>

      <View style={[styles.formContainer, { backgroundColor: theme.$standard }]}>
        <Text style={[styles.title, { color: theme.$textColor }]}>{t('control_blinds')}</Text>
        <Text style={[styles.infoText, { color: theme.$textColor }]}>
        {t('unicast_address')}: {node.unicastAddress}
        </Text>
        <Text style={[styles.infoText, { color: theme.$textColor }]}>
        {t('element_address')}: {node.getElementAddresses()[0]}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={blindPosition}
          minimumTrackTintColor={theme.$primaryColor}
          maximumTrackTintColor={theme.$secondaryColor}
          thumbTintColor={theme.$primaryColor}
          onValueChange={handleBlindChange}
        />
        <Text style={[styles.value, { color: theme.$textColor }]}>{t('position')}: {blindPosition}%</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: isUpEnabled ? '#58c487' : '#cccccc' }]}
            onPress={handleUpPress}
            disabled={!isUpEnabled}
          >
            <FontAwesome5 name="arrow-up" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: isStopEnabled ? 'red' : '#cccccc' }]}
            onPress={handleStopPress}
            disabled={!isStopEnabled}
          >
            <Text style={styles.stopText}>{t('stop')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: isDownEnabled ? 'rgba(112, 160, 214, 1)' : '#cccccc' }]}
            onPress={handleDownPress}
            disabled={!isDownEnabled}
          >
            <FontAwesome5 name="arrow-down" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    borderBottomEndRadius: 35,
    borderBottomStartRadius: 35,
    height: 70,
    marginBottom: 15,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#58c487',
    height: 90,
  },
  icon: {
    width: 24,
    height: 24,
  },
  backButton: {
    marginRight: 10,
  },
  nodeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: '600',
  },
  slider: {
    height: 40,
    marginVertical: 10,
  },
  formContainer: {
    padding: 16,
    borderRadius: 25,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  value: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
});