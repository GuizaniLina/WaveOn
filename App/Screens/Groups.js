import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import LottieView from 'lottie-react-native';
import { ThemeContext } from '../ThemeProvider';
import { useTranslation } from 'react-i18next';

const Groups = () => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation(); // Hook for translation

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.$backgroundColor }]}>
      <View style={styles.content}>
        <LottieView
          source={require('../../assets/lottiefile/nodata.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={[styles.noDataText, { color: theme.$textColor }]}>
          {t('no_group_configured')}
        </Text>
        <Text style={[styles.noDataDescription, { color: theme.$textColor }]}>
          {t('create_group_description')}
        </Text>
      </View>
      {/* Animation Lottie pour l'ajout */}
      <View style={styles.addButtonContainer}>
        <LottieView
          source={require('../../assets/lottiefile/Add.json')}
          autoPlay
          loop
          style={styles.lottieAdd}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  lottie: {
    width: 150,
    height: 150,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 60,
    height: 60,
  },
  lottieAdd: {
    width: 70,
    height: 70,
  },
  noDataText: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: 'bold',
  },
  noDataDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Groups;