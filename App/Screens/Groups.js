import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';

const Groups = () => {
  return (
    <SafeAreaView style={styles.container}>
     
     
      <View style={styles.content}>
        <LottieView
          source={require('../../assets/lottiefile/nodata.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={styles.noDataText}>AUCUN GROUPE CONFIGURÉ</Text>
        <Text style={styles.noDataDescription}>
          Créez un groupe pour contrôler vos équipements. Tous les groupes montrés ici peuvent être abonnés à partir du menu configuration de dispositif.
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
    color: 'white',
    marginTop: 20,
    fontWeight: 'bold',
  },
  noDataDescription: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
  },
  
 
});

export default Groups;