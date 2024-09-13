import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Switch ,Animated} from 'react-native';
import { ThemeContext } from '../../ThemeProvider';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';


const SwitchContainer = ({ title, icon, infoIcons, onLongPress, onDelete, switchState, onSwitchToggle }) => {
  const { theme } = useContext(ThemeContext);

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
      <TouchableOpacity onLongPress={onLongPress} style={[styles.deviceContainer, { backgroundColor: theme.$standard, borderColor: theme.$standard }]}>
        <View style={styles.cercle}>
          <Image source={icon} style={styles.icon} />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.deviceTitle, { color: theme.$textColor }]}>{title}</Text>

          <View style={styles.switchContainer}>
            <Text style={[styles.stateText, { color: theme.$textColor }]}>
              State: {switchState ? 'On' : 'Off'}
            </Text>

            <Switch
              trackColor={{ false: theme.$standard, true: '#81b0ff' }}
              thumbColor={switchState ? theme.$primaryColor : '#58c487'}
              onValueChange={onSwitchToggle} // Trigger the update here
              value={switchState}
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
    </Swipeable>
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

export default SwitchContainer;