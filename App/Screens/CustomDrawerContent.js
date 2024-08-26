import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../ThemeProvider';
import { useTranslation } from 'react-i18next'; // Import translation hook

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation(); // Initialize translation function

  const confirmLogout = () => {
    Alert.alert(
      t('confirm_logout'),
      t('confirm_logout_message'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('yes_logout'),
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
    <View style={[styles.container, { backgroundColor: theme.$backgroundColor }]}>
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
        <Text style={[styles.itemText, { color: theme.$textColor }]}>{t('profile')}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.item}>
        <Icon name="cogs" size={24} color={theme.$textColor} style={styles.itemIcon} />
        <Text style={[styles.itemText, { color: theme.$textColor }]}>{t('settings')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Icon name="wifi" size={24} color={theme.$textColor} style={styles.itemIcon} />
        <Text style={[styles.itemText, { color: theme.$textColor }]}>{t('networks')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Icon name="shield" size={24} color={theme.$textColor} style={styles.itemIcon} />
        <Text style={[styles.itemText, { color: theme.$textColor }]}>{t('proxy_filter')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Icon name="map" size={24} color={theme.$textColor} style={styles.itemIcon} />
        <Text style={[styles.itemText, { color: theme.$textColor }]}>{t('house_localisation')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.switchProfileButton, { backgroundColor: theme.$standard }]} onPress={() => navigation.navigate('SwitchProfile')}>
        <Icon name="exchange" size={24} color={theme.$textColor} style={styles.switchProfileIcon} />
        <Text style={[styles.switchProfileText, { color: theme.$textColor }]}>{t('switch_profile')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.$standard }]} onPress={confirmLogout}>
        <Icon name="power-off" size={24} color="#58c487" style={styles.switchProfileIcon} />
        <Text style={styles.logoutText}>{t('logout')}</Text>
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