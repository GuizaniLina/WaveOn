import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RoomDetails = ({ route }) => {
  const { roomId, roomName } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>{"< Back"}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{roomName}</Text>
      <Text style={styles.text}>Room ID: {roomId}</Text>
      {/* Ajoutez ici le code pour afficher les détails et les dispositifs de la salle */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    marginTop: 10,
  },
});

export default RoomDetails;