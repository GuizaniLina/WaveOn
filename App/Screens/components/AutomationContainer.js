import React from 'react';
import { View, Text, Switch, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const AutomationContainer = ({ icon, text, isEnabled, onToggle, onDelete }) => {

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

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.optionContainer}>
        <View style={styles.cercle}>
          <Image source={icon} style={styles.optionIcon} />
        </View>
        <Text style={styles.optionText}>{text}</Text>
        <Switch
          value={isEnabled}
          onValueChange={onToggle}
          trackColor={{ false: '#333', true: 'rgba(153, 222, 160, 0.74)' }}
          thumbColor={isEnabled ? '#333' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
        />
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    paddingVertical: 16,
    paddingHorizontal: 10,
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
    marginRight: 5,
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
  deleteButton: {
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    borderRadius: 25,
    height: 80
  },
});

export default AutomationContainer;