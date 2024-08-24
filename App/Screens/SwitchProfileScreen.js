import React, { useState,useContext, useEffect } from 'react';
import { View, Text, FlatList,Alert, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { startPeriodicPing } from '../services/pingManager'; 
import LoginService from '../services/LoginService';
import downloadFile from '../services/downloadFileService';
import { ThemeContext } from '../ThemeProvider';

const SwitchProfileScreen = () => {
  const [profiles, setProfiles] = useState([]);
  const { theme, setTheme } = useContext(ThemeContext);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const navigation = useNavigation();
  const [profileChanged, setProfileChanged] = useState(false);

  useEffect(() => {
    // Fetch all profiles from AsyncStorage
    const fetchProfiles = async () => {
      const keys = await AsyncStorage.getAllKeys();
      console.log('Keys from AsyncStorage:', keys);
      const profileKeys = keys.filter(key => key.startsWith('profile_'));
      const profilesData = await AsyncStorage.multiGet(profileKeys);

      // Load the current selected profile
      const currentProfile = await AsyncStorage.getItem('user');
      setSelectedProfile(currentProfile ? JSON.parse(currentProfile).idclient : null);

      setProfiles(profilesData.map(profile => JSON.parse(profile[1])));
      console.log('Parsed Profiles:', profiles); 
    };

    fetchProfiles();
  }, []);

  const handleProfileSelect = async (profile) => {
        try {
      
          const password=  await AsyncStorage.getItem(`password_${profile.idclient}`);
          const response = await LoginService.login(profile.email,password);
          const { idclient, iduser, token } = response;
          await downloadFile(idclient, iduser, token); 
          startPeriodicPing(idclient, iduser, token);
          await AsyncStorage.setItem('user', JSON.stringify(profile));
          setSelectedProfile(idclient);
          setProfileChanged(prev => !prev);
           navigation.navigate('HomeScreen', { profile: { idclient, iduser, token } });
        } catch (error) {
          Alert.alert('Error', 'Failed to login. Please check your credentials.');
          console.error('Login error:', error);
        }
    };

  return (
    <View style={[styles.container , { backgroundColor: theme.$backgroundColor }]}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={24} color={theme.$iconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Image source={require('../../assets/icons/notification.png')} style={[styles.icon , {tintColor:theme.$iconColor}]} />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Switch Profile</Text>
      </View>

      <FlatList
        data={profiles}
        keyExtractor={item => item.idclient.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.profileItem, item.idclient === selectedProfile && styles.selectedProfile]} 
            onPress={() => handleProfileSelect(item)}
          >
            <Image source={require('../../assets/icons/profil.png')} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{item.clientname}</Text>
              <Text style={styles.profileText}>{item.email}</Text>
            </View>
            {item.idclient === selectedProfile && (
              <Icon name="check-circle" size={24} color="#2b5c94" style={styles.selectedIcon} />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
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
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  selectedProfile: {
    backgroundColor: '#d0e8f2',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  profileText: {
    fontSize: 13,
    color: '#000',
  },
  selectedIcon: {
    marginLeft: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SwitchProfileScreen;