import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet , Animated } from 'react-native';
import Slider from '@react-native-community/slider';
import { ThemeContext } from '../../ThemeProvider';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const DeviceContainer = ({ title, icon, sliderValues, infoIcons, onLongPress, onPress, onSliderChange,onDelete }) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [sliderValue, setSliderValue] = useState(sliderValues.initial);
  const [isIncreasing, setIsIncreasing] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.7],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity onPress={onDelete}>
        <View style={styles.deleteButton}>
          <Animated.View style={{ transform: [{ scale }] }}>
            <Ionicons name="trash" size={30} color="#FFF" />
          </Animated.View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleSliderChange = (value) => {
    setSliderValue(value);
    if (onSliderChange) {
      onSliderChange(value);
    }
  };

  const handleStopPress = () => {
    if (isIncreasing) {
      clearInterval(intervalId);
      setIntervalId(null);
    } else {
      const id = setInterval(() => {
        setSliderValue((prevValue) => {
          const newValue = Math.min(prevValue + 1, sliderValues.max);
          if (newValue === sliderValues.max) {
            clearInterval(id);
            setIntervalId(null);
            setIsIncreasing(false);
          }
          if (onSliderChange) {
            onSliderChange(newValue);
          }
          return newValue;
        });
      }, 100); // Adjust the speed of increment here
      setIntervalId(id);
    }
    setIsIncreasing(!isIncreasing);
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <Swipeable renderRightActions={renderRightActions} style={styles.swip} >
    <TouchableOpacity 
      onPress={onPress} 
      onLongPress={onLongPress} 
      style={[styles.deviceContainer, { backgroundColor: theme.$standard, borderColor: theme.$standard }]}
    >
      <View style={styles.cercle}>
        <TouchableOpacity>
          <Image source={icon} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.deviceTitle, { color: theme.$textColor }]}>{title}</Text>
        <Text style={[styles.bodyinfo , {color : theme.$textColor}]}>{t('Level')}: {`${sliderValue}%`} </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.stopButton} onPress={handleStopPress}>
            {isIncreasing ? (
              <FontAwesome5 name="pause" size={12} color="#FFF" />
            ) : (
              <FontAwesome5 name="play" size={12} color="#FFF" />
            )}
          </TouchableOpacity>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={sliderValues.min}
              maximumValue={sliderValues.max}
              step={1}
              value={sliderValue}
              minimumTrackTintColor={theme.$primaryColor}
              maximumTrackTintColor={theme.$secondaryColor}
              thumbTintColor={theme.$primaryColor}
              onValueChange={handleSliderChange}
            />
          </View>
        </View>
      </View>

      <View style={styles.iconContainer}>
        {infoIcons.map((info, index) => (
          <View key={index} style={styles.infoContainer}>
            <Image source={info.icon} style={[styles.infoIcon, { tintColor: info.color }]} />
            <Text style={[styles.value ,{ color: theme.$textColor }]}>{info.value}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
     </Swipeable>
  );
};

const styles = StyleSheet.create({
  deviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: 'grey',
    borderRadius: 35,
    padding: 7,
    margin : 5,
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
  bodyinfo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333'
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
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
  buttonContainer: {
    flexDirection: 'row',
    paddingTop: 10,
  },
  sliderContainer: {
    alignItems: 'center',
    flex: 1,
  },
  slider: {
    width: '100%',
    height: 35,
  },
  stopButton: {
    width: 28,
    height: 28,
    borderRadius: 25,
    backgroundColor: 'rgba(112, 160, 214, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginRight: 5,
  },
  stopIcon: {
    width: 10,
    height: 10,
    backgroundColor: '#FFF',
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
    marginBottom: 8,
  },
  value: {
    paddingTop: 2,
    fontSize: 11,
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 55,
    borderRadius: 25,
    height: 120,
    margin : 5
  },
});

export default DeviceContainer;