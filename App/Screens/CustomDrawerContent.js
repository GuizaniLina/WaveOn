import React ,{useContext}from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../ThemeProvider';

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  const confirmLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, Logout',
          onPress: handleLogout,
        },
      ],
      { cancelable: true }
    );
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user', 'idclient', 'iduser', 'user_email', 'user_passwordMQTT', 'user_isadmin', 'user_isgateway']);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
    navigation.navigate('Login');
  };

  return (
    <View style={[styles.container , {backgroundColor :theme.$backgroundColor}]}>
      <View style={styles.drawerHeader}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.profileIcon}
        />
        <Text style={styles.profileName}>WaveOn</Text>
        <Text style={styles.profileName}>www.alphatechnology.tn</Text>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Profil')} style={styles.item}>
        <Icon name="user" size={24} color={theme.$textColor} style={styles.itemIcon} />
        <Text style={[styles.itemText, {color : theme.$textColor}]}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.item}>
        <Icon name="cogs" size={24} color={theme.$textColor} style={styles.itemIcon} />
        <Text style={[styles.itemText, {color : theme.$textColor}]}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity  style={styles.item}>
        <Icon name="users" size={24} color={theme.$textColor} style={styles.itemIcon} />
        <Text style={[styles.itemText, {color : theme.$textColor}]}>Manage Users</Text>
      </TouchableOpacity>
      <TouchableOpacity  style={styles.item}>
        <Icon name="wifi" size={24} color={theme.$textColor} style={styles.itemIcon} />
        <Text style={[styles.itemText, {color : theme.$textColor}]}>Networks</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Icon name="shield" size={24} color={theme.$textColor} style={styles.itemIcon} />
        <Text style={[styles.itemText, {color : theme.$textColor}]}>Proxy Filter</Text>
      </TouchableOpacity>
      <TouchableOpacity  style={styles.item}>
        <Icon name="map" size={24} color={theme.$textColor} style={styles.itemIcon} />
        <Text style={[styles.itemText, {color : theme.$textColor}]}>House Localisation</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.switchProfileButton ,{ backgroundColor:theme.$standard}]} onPress={() => navigation.navigate('SwitchProfile')}>
        <Icon name="exchange" size={24} color={theme.$textColor} style={styles.switchProfileIcon} />
        <Text style={[styles.switchProfileText , {color : theme.$textColor}]}>Switch Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.logoutButton,{ backgroundColor:theme.$standard}]} onPress={confirmLogout}>
        <Icon name="power-off" size={24} color="#58c487" style={styles.switchProfileIcon} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  drawerHeader: {
    height: 160,
    backgroundColor: '#58c487',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    color: '#fff',
    fontSize: 18,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop: 20,
    backgroundColor: '#444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logoutText: {
    color: '#58c487',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop: 20,
    backgroundColor: '#444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  switchProfileIcon: {
    marginRight: 10,
  },
  switchProfileText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  itemIcon: {
    marginRight: 15,
  },
  itemText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CustomDrawerContent;