import React, { useState,useEffect } from 'react';
import roomGetService from '../services/securityGetService';
import { View, Text,ImageBackground, StyleSheet, Switch,Alert, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import securityGetService from '../services/securityGetService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

const Security = ({ navigation }) => {

  const [securityOptions, setSecurityOptions] = useState([]);

  useEffect(() => {
    const fetchSecurity = async () => {
      try {
        // Exemple d'identifiants; ajustez selon vos besoins
        const idclient = await AsyncStorage.getItem('idclient');
        const iduser = await AsyncStorage.getItem('iduser');
        const idNetwork = 1;
        const token = await AsyncStorage.getItem('token');
       

        const securityResponse = await securityGetService(idclient, iduser, idNetwork, token);
        console.log('Security data:', securityResponse);
        setSecurityOptions(securityResponse.securityOption);
      }catch(error){
        console.error('Erreur lors du parsing des données des securités:', error);
            Alert.alert('Erreur', 'Erreur lors de la récupération des données des securités');
      }}; fetchSecurity();
    }, []);
    const handleToggle = async (option) => {
      try {
        // Mettre à jour l'état localement
        const updatedOptions = securityOptions.map(item => 
          item.idSecurityOption === option.idSecurityOption
            ? { ...item, enable: !item.enable }
            : item
        );
        setSecurityOptions(updatedOptions);
        await AsyncStorage.setItem('securityOption', JSON.stringify(updatedOptions));
        console.log(`Option ${option.name} changée à ${!option.enable}`);
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'option:', error);
      }
    };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
    
      <Text style={styles.headerTitle}>Security</Text>
        </View>
        {securityOptions.map(option => (
        <View style={styles.optionContainer} key={option.idSecurityOption}>
           <Image 
            source={getIcon(option.name)} 
            style={styles.optionIcon} 
          />
          <Text style={styles.optionText}>{option.name}</Text>
          <Switch
            value={option.enable}
            onValueChange={() => handleToggle(option)}
            trackColor={{ false: '#333', true: 'rgba(153, 222, 160, 0.74)' }}
            thumbColor={option.enable ? '#333' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
      ))}
       {/* Animation Lottie pour l'ajout */}
       <View style={styles.addButtonContainer}>
        <LottieView
          source={require('../../assets/lottiefile/Add.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
        </View>
    </SafeAreaView>
  );
};

const getIcon = (name) => {
  switch(name) {
    case 'Send Notification':
        return require('../../assets/icons/notification.png');
      case 'Send Email':
        return require('../../assets/icons/email.png');
      case 'Send SMS':
        return require('../../assets/icons/sms.png');
      case 'Alarm':
        return require('../../assets/icons/feu.png');
      default:
        return require('../../assets/icons/lampe1.png');
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    padding: 16,
  },
  header: {
    backgroundColor : '#58c487',
    alignItems: 'center',
    borderBottomEndRadius: 35,
    borderBottomStartRadius: 35,
    height : 120,
    marginBottom :20
    
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#FFF',
  },
 
  connectText: {
    fontSize: 16,
    color: '#FFF',
  },
  headerTitle: {
    fontSize: 35,
    color: '#FFF',
    marginTop: 40,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    padding: 16,
    borderRadius: 25,
    marginBottom: 16,
  },
  optionIcon: {
    width: 30,
    height: 30,
    marginRight: 20,
    tintColor: '#FFF',
  },
  background:{
    resizeMode: 'cover',
  },
  optionText: {
    fontSize: 18,
    color: '#FFF',
    flex: 1,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 60,
    height: 60,
  },
  lottie: {
    width: 70,
    height: 70,
  },
});

export default Security;