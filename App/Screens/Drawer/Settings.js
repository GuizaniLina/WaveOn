import React, { useContext, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Switch, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../ThemeProvider';
import EStyleSheet from 'react-native-extended-stylesheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const navigation = useNavigation();
  const { theme, setTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const toggleTheme = (value) => {
    const newThemeType = value ? 'dark' : 'light';
    setTheme(newThemeType);
  };

  const changeLanguage = async (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    await AsyncStorage.setItem('language', lang);
    // Re-render the component to reflect language changes
  };

/*  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
        setLanguage(savedLanguage);
      }
    };
    loadLanguage();
  }, []);
*/
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.$backgroundColor }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.backButtonText, { color: theme.$textColor }]}>{"< " + t('back')}</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.switchContainer}>
          <Text style={[styles.themeText, { color: theme.$textColor }]}>Dark Theme</Text>
          <Switch
            value={theme.$backgroundColor === '#333'}
            onValueChange={toggleTheme}
          />
        </View>
        <View style={styles.languageContainer}>
          <Text style={[styles.languageText, { color: theme.$textColor }]}>Language</Text>
          <Button title="English" onPress={() => changeLanguage('en')} />
          <Button title="Français" onPress={() => changeLanguage('fr')} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$backgroundColor',
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
    color: '$textColor',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '1.25rem',
  },
  themeText: {
    color: '$textColor',
    fontSize: '1rem',
    marginRight: '1rem',
  },
  languageContainer: {
    marginTop: 30,
  },
  languageText: {
    color: '$textColor',
    fontSize: '1rem',
    marginBottom: 10,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 100,
  },
});

export default Settings;