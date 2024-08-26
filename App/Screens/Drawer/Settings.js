import React, { useContext, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Switch, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../ThemeProvider';
import EStyleSheet from 'react-native-extended-stylesheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { FontAwesome5 } from '@expo/vector-icons';

const Settings = () => {
  const navigation = useNavigation();
  const { theme, setTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [isDarkTheme, setIsDarkTheme] = useState(theme.$backgroundColor === '#333');

  const toggleTheme = (value) => {
    const newThemeType = value ? 'dark' : 'light';
    setTheme(newThemeType);
    setIsDarkTheme(value);
  };

  const changeLanguage = async (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    await AsyncStorage.setItem('language', lang);
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
          <Image source={require('../../../assets/icons/notification.png')} style={[styles.icon, { tintColor: theme.$iconColor }]} />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('settings')}</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.section, { backgroundColor: theme.$standard }]}>
          <Text style={[styles.sectionTitle, { color: theme.$textColor }]}>{t('theme')}</Text>
          <View style={styles.switchContainer}>
            <View style={styles.themeIconContainer}>
              <FontAwesome5 
                name="sun" 
                size={isDarkTheme ? 20 : 35} 
                color={isDarkTheme ? '#ccc' : '#f0ee9d'} 
              />
            </View>
            <Switch
              value={isDarkTheme}
              onValueChange={toggleTheme}
              thumbColor={'#58c487'}
              trackColor={{ false: '#ccc', true: '#ccc' }}
            />
            <View style={styles.themeIconContainer}>
              <FontAwesome5 
                name="moon" 
                size={isDarkTheme ? 35 : 20} 
                color={isDarkTheme ? '#89b1cc' : '#000'} 
              />
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.$standard }]}>
          <Text style={[styles.sectionTitle, { color: theme.$textColor }]}>{t('language')}</Text>
          <View style={styles.languageButtons}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'en' && styles.languageButtonActive,
              ]}
              onPress={() => changeLanguage('en')}
            >
              <Text style={[
                styles.languageButtonText,
                language === 'en' && styles.languageButtonTextActive,
              ]}>
                {t('english')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'fr' && styles.languageButtonActive,
              ]}
              onPress={() => changeLanguage('fr')}
            >
              <Text style={[
                styles.languageButtonText,
                language === 'fr' && styles.languageButtonTextActive,
              ]}>
                {t('french')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = EStyleSheet.create({
  container: {
    flex: 1,
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
  content: {
    marginTop: 100,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  section: {
    marginBottom: 30,
    padding: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeIconContainer: {
    flex: 1,
    alignItems: 'center',
  },
  languageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#58c487',
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageButtonActive: {
    backgroundColor: '#58c487',
  },
  languageButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  languageButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Settings;