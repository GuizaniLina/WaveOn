import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const colorAnim = useRef(new Animated.Value(0)).current;

 /* useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [colorAnim]);

  const textColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#007bff', '#28a745'], // Light theme: blue and green
  });*/

  const handlePress = () => {
    navigation.navigate('Start');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <ImageBackground source={require('../../assets/back2.jpg')} style={styles.background} blurRadius={10}>
        <View style={styles.innerContainer}>
        <LottieView
        source={require('../../assets/lottiefile/robot.json')} // Path to your Lottie animation file
        autoPlay
        loop
        style={styles.animation}
      />
        {/* <Animated.Text style={{ ...styles.text, color: textColor, fontSize: 64 }}>Hi!</Animated.Text> */}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
  animation: {
    width: 200,
    height: 200,
  },
});

export default WelcomeScreen;
