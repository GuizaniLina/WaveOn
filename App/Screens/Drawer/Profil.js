import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profil = ({ navigation }) => {
  const [isAdminChecked, setAdminChecked] = useState(false);
  const [isGatewayChecked, setGatewayChecked] = useState(false);
  const [isBluetoothChecked, setBluetoothChecked] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [lastUpdate , setLastUpdate] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLastUpdate(await AsyncStorage.getItem('lastUpdate'));
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          setUserInfo(parsedUser);
          setAdminChecked(parsedUser.isadmin === 1);
          setGatewayChecked(parsedUser.isgateway === 1);
        }
      } catch (error) {
        console.error('Failed to fetch user info from AsyncStorage', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleAdminToggle = () => {
    Alert.alert(
      'Demande de confirmation',
      'Vous devez envoyer un e-mail à l\'administrateur pour faire de vous un administrateur. Voulez-vous continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Envoyer', onPress: () => sendAdminRequestEmail() }
      ]
    );
  };

  const handleGatewayToggle = () => {
    Alert.alert(
      'Demande de confirmation',
      'Vous devez envoyer un e-mail à l\'administrateur pour faire de vous une passerelle. Voulez-vous continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Envoyer', onPress: () => sendGatewayRequestEmail() }
      ]
    );
  };

  const sendAdminRequestEmail = () => {
    // Logic to send email request to the real administrator
    console.log('Admin request email sent');
  };

  const sendGatewayRequestEmail = () => {
    // Logic to send email request to the real administrator
    console.log('Gateway request email sent');
  };

  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    
    <View style={styles.container}>
      <View style={styles.topBar}>
      <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome5 name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
        <TouchableOpacity onPress={''}>
          <Image source={require('../../../assets/icons/notification.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>
      <Text style={styles.sectionTitle}>
        <FontAwesome5 name="info-circle" size={16} color="black" /> Informations de compte
      </Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <FontAwesome5 name="user" size={20} color="white" />
          <View style={styles.rowText}>
            <Text style={styles.label}>{userInfo.clientname}</Text>
            <Text style={styles.info}>{userInfo.email}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <FontAwesome5 name="server" size={20} color="#fff" />
          <View style={styles.rowText}>
            <Text style={styles.label}>Connexion au Serveur</Text>
            <Text style={styles.info}>Connecté</Text>
          </View>
        </View>
        <View style={styles.row}>
          <FontAwesome5 name="plug" size={20} color="white" />
          <View style={styles.rowText}>
            <Text style={styles.label}>État du Gateway</Text>
            <Text style={styles.info}>{userInfo.isgateway ? 'Connecté' : 'Déconnecté'}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <FontAwesome5 name="clock" size={20} color="white" />
          <View style={styles.rowText}>
            <Text style={styles.label}>Dernière mise à jour du Réseau</Text>
            <Text style={styles.info}>{lastUpdate || 'N/A'}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.sectionTitle}>
        <FontAwesome5 name="cogs" size={16} color="black" /> Configuration
      </Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <FontAwesome5 name="user-shield" size={20} color="white" />
          <View style={styles.rowText}>
            <Text style={styles.label}>Administrateur</Text>
            <Text style={styles.info}>
              L'activation de cette fonction fait de votre téléphone l'administrateur de votre réseau.
            </Text>
          </View>
          <Switch
            value={isAdminChecked}
            onValueChange={handleAdminToggle}
            thumbColor={isAdminChecked ? '#fff' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#58c487' }}
          />
        </View>
        <View style={styles.row}>
          <FontAwesome5 name="network-wired" size={20} color="white" />
          <View style={styles.rowText}>
            <Text style={styles.label}>Gateway</Text>
            <Text style={styles.info}>
              L'activation de cette fonction fait de votre téléphone la passerelle vers le cloud.
            </Text>
          </View>
          <Switch
            value={isGatewayChecked}
            onValueChange={handleGatewayToggle}
            thumbColor={isGatewayChecked ? '#fff' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#58c487' }}
          />
        </View>
        <View style={styles.row}>
          <FontAwesome5 name="bluetooth" size={20} color="white" />
          <View style={styles.rowText}>
            <Text style={styles.label}>Connexion Bluetooth automatique</Text>
            <Text style={styles.info}>
              Activez cette fonctionnalité si vous souhaitez utiliser la connexion Bluetooth locale.
            </Text>
          </View>
          <Switch
            value={isBluetoothChecked}
            onValueChange={setBluetoothChecked}
            thumbColor={isBluetoothChecked ? '#fff' : '#fff'}
            trackColor={{ false: '#767577', true: '#58c487' }}
          />
        </View>
      </View>
   </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  section: {
    marginBottom: 10,
    marginHorizontal: 15,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#58c487',
    height: 90, // Adjust the height as needed
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    color: 'black',
    backgroundColor: 'grey',
  },
  icon: {
    width: 25,
    height: 25,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  rowText: {
    flex: 1,
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  info: {
    marginLeft: 10,
    fontSize: 14,
    color: 'white',
  },
 
  headerTitle: {
    fontSize: 35,
    color: '#FFF',
    marginTop: 10,
  },
  header: {
    backgroundColor: '#58c487',
    alignItems: 'center',
    borderBottomEndRadius: 35,
    borderBottomStartRadius: 35,
    height: 70,
    marginBottom:15,
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
  },
  backButton: {
    marginRight: 10,
  },
});

export default Profil;