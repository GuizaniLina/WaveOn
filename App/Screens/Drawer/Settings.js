import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const Settings = () => {
    const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
     
     <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>{"< Back"}</Text>
      </TouchableOpacity>
      <View style={styles.content}>
    
        <Text style={styles.noDataText}>AUCUN GROUPE CONFIGURÉ</Text>
       
        </View>
     
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
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
 
 
 
 
 
});

export default Settings;