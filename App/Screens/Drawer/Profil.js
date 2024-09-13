import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Switch, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../../ThemeProvider';
import { useTranslation } from 'react-i18next';
import SetUserAsAdminRequestService from '../../services/SetUserAsAdminRequestService'; 
import SetUserAsGatewayRequestService from '../../services/SetUserAsGatewayRequestService';

const Profil = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [isAdminChecked, setAdminChecked] = useState(false);
  const [isGatewayChecked, setGatewayChecked] = useState(false);
  const [isBluetoothChecked, setBluetoothChecked] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

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
      t('confirmation_request'),
      t('admin_request_message'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('send'), onPress: () => sendAdminRequest() }
      ]
    );
  };

  const sendAdminRequest = async () => {
    try {
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const token = await AsyncStorage.getItem('token');
      
      const response = await SetUserAsAdminRequestService(idclient, iduser, token);
      
      if (response) {
        Alert.alert(t('success'), t('admin_request_sent'));
        setAdminChecked(true); // Mark admin switch as checked
      }
    } catch (error) {
      Alert.alert(t('error'), t('admin_request_failed'));
      console.error('Error sending admin request:', error);
    }
  };

  const handleGatewayToggle = () => {
    Alert.alert(
      t('confirmation_request'),
      t('gateway_request_message'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('send'), onPress: () => sendGatewayRequest() }
      ]
    );
  };

  const sendGatewayRequest = async () => {
    try {
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const token = await AsyncStorage.getItem('token');

      const response = await SetUserAsGatewayRequestService(idclient, iduser, token);

      if (response) {
        Alert.alert(t('success'), t('gateway_request_sent'));
        setGatewayChecked(true); // Mark gateway switch as checked
      }
    } catch (error) {
      Alert.alert(t('error'), t('gateway_request_failed'));
      console.error('Error sending gateway request:', error);
    }
  };

  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>{t('loading')}</Text>
      </View>
    );
  }

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
          <Image source={require('../../../assets/icons/notification.png')} style={[styles.icon, { tintColor: theme.$iconColor }]} />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile')}</Text>
      </View>
      <Text style={[styles.sectionTitle, { backgroundColor: theme.$standard, color: theme.$textColor }]}>
        <FontAwesome5 name="info-circle" size={16} color={theme.$textColor} /> {t('account_info')}
      </Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <FontAwesome5 name="user" size={20} color={theme.$textColor} />
          <View style={styles.rowText}>
            <Text style={[styles.label, { color: theme.$textColor }]}>{userInfo.clientname}</Text>
            <Text style={[styles.info, { color: theme.$textColor }]}>{userInfo.email}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <FontAwesome5 name="server" size={20} color={theme.$textColor} />
          <View style={styles.rowText}>
            <Text style={[styles.label, { color: theme.$textColor }]}>{t('server_connection')}</Text>
            <Text style={[styles.info, { color: theme.$textColor }]}>{t('connected')}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <FontAwesome5 name="plug" size={20} color={theme.$textColor} />
          <View style={styles.rowText}>
            <Text style={[styles.label, { color: theme.$textColor }]}>{t('gateway_status')}</Text>
            <Text style={[styles.info, { color: theme.$textColor }]}>{userInfo.isgateway ? t('connected') : t('disconnected')}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <FontAwesome5 name="clock" size={20} color={theme.$textColor} />
          <View style={styles.rowText}>
            <Text style={[styles.label, { color: theme.$textColor }]}>{t('last_network_update')}</Text>
            <Text style={[styles.info, { color: theme.$textColor }]}>{lastUpdate || t('not_available')}</Text>
          </View>
        </View>
      </View>
      <Text style={[styles.sectionTitle, { backgroundColor: theme.$standard, color: theme.$textColor }]}>
        <FontAwesome5 name="cogs" size={16} color={theme.$textColor} /> {t('configuration')}
      </Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <FontAwesome5 name="user-shield" size={20} color={theme.$textColor} />
          <View style={styles.rowText}>
            <Text style={[styles.label, { color: theme.$textColor }]}>{t('admin')}</Text>
            <Text style={[styles.info, { color: theme.$textColor }]}>{t('admin_description')}</Text>
          </View>
          <Switch
            value={isAdminChecked}
            onValueChange={handleAdminToggle}
            thumbColor={isAdminChecked ? '#fff' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#58c487' }}
          />
        </View>
        <View style={styles.row}>
          <FontAwesome5 name="network-wired" size={20} color={theme.$textColor} />
          <View style={styles.rowText}>
            <Text style={[styles.label, { color: theme.$textColor }]}>{t('gateway')}</Text>
            <Text style={[styles.info, { color: theme.$textColor }]}>{t('gateway_description')}</Text>
          </View>
          <Switch
            value={isGatewayChecked}
            onValueChange={handleGatewayToggle}
            thumbColor={isGatewayChecked ? '#fff' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#58c487' }}
          />
        </View>
        <View style={styles.row}>
          <FontAwesome5 name="bluetooth" size={20} color={theme.$textColor} />
          <View style={styles.rowText}>
            <Text style={[styles.label, { color: theme.$textColor }]}>{t('bluetooth_auto')}</Text>
            <Text style={[styles.info, { color: theme.$textColor }]}>{t('bluetooth_auto_description')}</Text>
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
    height: 90,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    color: 'black',
    backgroundColor: 'grey',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
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
    marginBottom: 15,
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