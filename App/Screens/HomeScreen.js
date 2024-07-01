import React, { useState, useEffect }from 'react';
import { View,Animated,Platform, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Security from './Security';
import Automation from './Automation';
import Devices from './Devices';
import Home from './Home';
import Groups from './Groups';
import { useRef } from 'react';
import moment from 'moment';
const Tab = createMaterialBottomTabNavigator();


const Accueil = ({ navigation }) => {
  const [isSearchActive, setSearchActive] = useState(false);

  const [weather, setWeather] = useState(null);
  const [dateTime, setDateTime] = useState({
    date: moment().format('LL'),
    time: moment().format('LTS'),
  });
  const handleSearchIconClick = () => {
    setSearchActive(!isSearchActive);
  };

  useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(() => {
      setDateTime({
        date: moment().format('LL'),
        time: moment().format('LTS'),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeatherData = async () => {
    try {
      console.log("hiii");
      const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=London&appid=8072e7f755e170def1ad5ee79c3aa0dd&units=metric');
      console.log("hiii");
      const data = await response.json();
      console.log("hiii");
      if (data && data.main && data.weather && data.weather.length > 0) {
        setWeather({
          temp: `${Math.round(data.main.temp)}°C`,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          description: data.weather[0].description,
        });
        
      } else {
        console.error('Unexpected API response:', data);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };


  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image source={require('../../assets/icons/menu.png')} style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateText}>{dateTime.date}</Text>
          <Text style={styles.timeText}>{dateTime.time}</Text>
        </View>
        {weather ? (
          <View style={styles.weatherContainer}>
            <Image source={{ uri: weather.icon }} style={styles.weatherIcon} />
            <View style={{flexDirection:'column'}}>
            <Text style={styles.weatherText}>{weather.temp}</Text>
            <Text style={styles.weatherDescription}>{weather.description}</Text>
            </View>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', }}>
          <Image style={styles.meteoIcon} source={require('../../assets/icons/soleil.png')} />
          <Text style={styles.headerTitle}>Loading...</Text>
          </View>
        )}
        <TouchableOpacity onPress={handleSearchIconClick}>
          <Image source={require('../../assets/icons/search.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <Tab.Navigator
      initialRouteName="Home"
        barStyle={{ backgroundColor: '#58c487', height: 85 }}
        activeColor={'#2a6ebd'}
        inactiveColor={'white'}
        
      >
        <Tab.Screen name="Devices" component={Devices} options={{
          tabBarIcon: () => <Image style={styles.image} source={require('../../assets/icons/devices.png')} />,
        }} />
        <Tab.Screen name="Groups" component={Groups} options={{
          tabBarIcon: () => <Image style={styles.image} source={require('../../assets/icons/groups.png')} />,
        }} />
        <Tab.Screen name="Home" component={Home} options={{
          tabBarIcon: () => (
            
            <View style={styles.homeIconWrapper}>
             <Image style={styles.image} source={require('../../assets/icons/home.png')} />
       
            </View>
          
          ),
          tabBarLabel: '',
        }} />
        <Tab.Screen name="Security" component={Security} options={{
          tabBarIcon: () => <Image style={styles.image} source={require('../../assets/icons/security.png')} />,
        }} />
        <Tab.Screen name="Automation" component={Automation} options={{
          tabBarIcon: () => <Image style={styles.image} source={require('../../assets/icons/automation.png')} />,
        }} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#58c487',
    height: 90, // Adjust the height as needed
  },
  icon: {
    width: 25,
    height: 25,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
  },
  image: {
    width: 20,
    height: 20,
  },
  dateTimeContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  dateText: {
    color: 'white',
    fontSize: 12,
  },
  timeText: {
    color: 'white',
    fontSize: 13,
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    width: 25,
    height: 25,
    marginRight: 5,
  },
  weatherText: {
    color: 'yellow',
    fontSize: 14,
    marginRight: 5,
  },
  weatherDescription: {
    color: 'white',
    fontWeight:'bold',
    fontSize: 10,
  },
  homeIconWrapper: {
    position: 'absolute',
    bottom: -30, // Adjust to position the central button higher
    left: '50%',
    transform: [{ translateX: -35 }], // Center align
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 5,
  },
  homeIcon: {
    width: 20,
    height: 25,
  },
  meteoIcon : {
    width: 30,
    height: 30,
    marginRight: 5,
  }
});

export default Accueil;