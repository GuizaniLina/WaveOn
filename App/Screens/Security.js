import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Switch, Alert, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import securityGetService from '../services/securityGetService';
import securityUpdateService from '../services/securityUpdateService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../ThemeProvider';
import { useTranslation } from 'react-i18next';

const Security = ({ navigation }) => {
  const [securityOptions, setSecurityOptions] = useState([]);
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();  // Hook for translation
  const [isAdmin, setIsAdmin] = useState(null);
  const [isGateway, setIsGateway] = useState(null);

  const fetchSecurity = async () => {
    try {
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const idNetwork = 1;
      const token = await AsyncStorage.getItem('token');
      setIsAdmin(await AsyncStorage.getItem('user_isadmin'));
      setIsGateway(await AsyncStorage.getItem('user_isgateway'));

      const securityResponse = await securityGetService(idclient, iduser, idNetwork, token);
      console.log('Security data:', securityResponse);
      setSecurityOptions(securityResponse.securityOption);

    } catch (error) {
      console.error(t('fetch_security_error'), error);
      Alert.alert(t('error'), t('fetch_security_error'));
    }
  };

  useEffect(() => {
    fetchSecurity();
  }, []);

  useEffect(() => {
    const checkProfileChange = async () => {
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const token = await AsyncStorage.getItem('token');
  console.log('iconn',getIcon('Alarm'));
      if (idclient && iduser && token) {
        fetchSecurity();
      }
    };

    const unsubscribe = navigation.addListener('focus', checkProfileChange);
    return unsubscribe;
  }, [navigation]);

  const handleToggle = async (option) => {
    try {
      const updatedOptions = securityOptions.map(item =>
        item.idSecurityOption === option.idSecurityOption
          ? { ...item, enable: !item.enable }
          : item
      );
      setSecurityOptions(updatedOptions);
      await AsyncStorage.setItem('securityOption', JSON.stringify(updatedOptions));
      console.log(`${t('option')} ${option.name} ${t('changed')} ${!option.enable}`);

      // Get the updated config from AsyncStorage
      const storedConfig = await AsyncStorage.getItem('securityConfig');
      const securityConfig = storedConfig ? JSON.parse(storedConfig) : {};

      // Update the security options on the server
      const idclient = await AsyncStorage.getItem('idclient');
      const iduser = await AsyncStorage.getItem('iduser');
      const idNetwork = 1;
      const token = await AsyncStorage.getItem('token');

      await securityUpdateService(idclient, iduser, idNetwork, token, updatedOptions, securityConfig, []);
      console.log('Security options updated successfully on the server');
    } catch (error) {
      console.error(t('update_option_error'), error);
      Alert.alert(t('error'), t('update_option_error'));
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.$backgroundColor }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('security')}</Text>
        <TouchableOpacity style={styles.paramButton} onPress={() => navigation.navigate('SecurityConfig')}>
          <Image source={require('../../assets/icons/default.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      {securityOptions.map(option => (
        <View style={[styles.optionContainer, { backgroundColor: theme.$standard }]} key={option.idSecurityOption}>
          <Image
            source={getIcon(option.name)}
            style={[styles.optionIcon, { tintColor: theme.$textColor }]}
          />
          <Text style={[styles.optionText, { color: theme.$textColor }]}>{t(option.name.toLowerCase().replace(/ /g, '_'))}</Text>
          <Switch
            value={option.enable}
            onValueChange={() => handleToggle(option)}
            trackColor={{ false: theme.$standard, true: 'rgba(153, 222, 160, 0.74)' }}
            thumbColor={option.enable ? theme.$standard : ' rgba(153, 222, 160, 0.74)'}
          />
        </View>
      ))}
    </SafeAreaView>
  );
};

const getIcon = (name) => {
  switch (name) {
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
  },
  header: {
    backgroundColor: '#58c487',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderBottomEndRadius: 35,
    borderBottomStartRadius: 35,
    height: 120,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 35,
    color: '#FFF',
    marginTop: 40,
    marginLeft: '33%',
  },
  paramButton: {
    marginTop: 40,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#FFF',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    padding: 16,
    borderRadius: 25,
    marginBottom: 16,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  optionIcon: {
    width: 30,
    height: 30,
    marginRight: 20,
    tintColor: '#FFF',
  },
  optionText: {
    fontSize: 18,
    color: '#FFF',
    flex: 1,
  },
});

export default Security;