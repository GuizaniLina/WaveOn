import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { publishMQTT } from '../services/mqttService';
import Slider from '@react-native-community/slider';
import { ThemeContext } from '../ThemeProvider';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function TwoLampsControlScreen({ route, navigation }) {
  const { node } = route.params;
  const { theme } = useContext(ThemeContext);
  const [lamp1Brightness, setLamp1Brightness] = useState(node.getElementStates()[0] || 0);
  const [lamp2Brightness, setLamp2Brightness] = useState(node.getElementStates()[1] || 0);

  const handleLamp1Change = async (value) => {
    setLamp1Brightness(value);
    await publishMQTT(node.unicastAddress, node.getElementAddresses()[0], value,'LightLevel');
  };

  const handleLamp2Change = async (value) => {
    setLamp2Brightness(value);
    await publishMQTT(node.unicastAddress, node.getElementAddresses()[1], value,'LightLevel');
  };

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
        <Text style={[styles.title, { color: theme.$textColor }]}>Control Lamp A</Text>
        <Text style={[styles.infoText, { color: theme.$textColor }]}>
          Unicast Address: {node.unicastAddress}
        </Text>
        <Text style={[styles.infoText, { color: theme.$textColor }]}>
          Element Address: {node.getElementAddresses()[0]}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={lamp1Brightness}
          minimumTrackTintColor={theme.$primaryColor}
          maximumTrackTintColor={theme.$secondaryColor}
          thumbTintColor={theme.$primaryColor}
          onValueChange={handleLamp1Change}
        />
        <Text style={[styles.value, { color: theme.$textColor }]}>Brightness: {lamp1Brightness}%</Text>

        <Text style={[styles.title, { color: theme.$textColor }]}>Control Lamp B</Text>
        <Text style={[styles.infoText, { color: theme.$textColor }]}>
          Unicast Address: {node.unicastAddress}
        </Text>
        <Text style={[styles.infoText, { color: theme.$textColor }]}>
          Element Address: {node.getElementAddresses()[1]}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={lamp2Brightness}
          minimumTrackTintColor={theme.$primaryColor}
          maximumTrackTintColor={theme.$secondaryColor}
          thumbTintColor={theme.$primaryColor}
          onValueChange={handleLamp2Change}
        />
        <Text style={[styles.value, { color: theme.$textColor }]}>Brightness: {lamp2Brightness}%</Text>
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
});