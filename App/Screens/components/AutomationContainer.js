import React ,{useContext}from 'react';
import { View, Text, Switch, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../ThemeProvider';

const AutomationContainer = ({ icon, text, isEnabled, onToggle, onDelete  , onPress}) => {
  const { theme, setTheme } = useContext(ThemeContext);
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
      <TouchableOpacity style={ [styles.optionContainer , {backgroundColor :theme.$standard}] } onPress={onPress}>
        <View style={[styles.cercle , {backgroundColor :theme.$standard , borderColor :theme.$textColor }] }>
          <Image source={icon} style={[styles.optionIcon , {tintColor :theme.$textColor} ]} />
        </View>
        <Text style={[styles.optionText , {color : theme.$textColor}]}>{text}</Text>
        <Switch
          value={isEnabled}
          onValueChange={onToggle}
          trackColor={{ false: theme.$standard, true: 'rgba(153, 222, 160, 0.74)' }}
          thumbColor={isEnabled ? theme.$standard : ' rgba(153, 222, 160, 0.74)' }
          //ios_backgroundColor="#3e3e3e"
        />
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
 
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 25,
    marginBottom: 16,
    marginHorizontal :10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
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
    fontWeight:'bold'
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