
import 'intl-pluralrules';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from './App/ThemeProvider';
import CustomDrawerContent from './App/Screens/CustomDrawerContent';
import Login from './App/Screens/Auth/Login';
import Signup from './App/Screens/Auth/Signup';
import WelcomeScreen from './App/Screens/WelcomeScreen';
import Start from './App/Screens/Start';
import HomeScreen from './App/Screens/HomeScreen';
import Groups from './App/Screens/Groups';
import Security from './App/Screens/Security';
import Automation from './App/Screens/Automation';
import Emailverification from './App/Screens/Auth/Emailverification';
import Devices from './App/Screens/Devices';
import Home from './App/Screens/Home';
import RoomDetails from './App/Screens/RoomDetails';
import Profil from './App/Screens/Drawer/Profil';
import Settings from './App/Screens/Drawer/Settings';
import ManageUsers from './App/Screens/Drawer/ManageUsers';
import Networks from './App/Screens/Drawer/Networks';
import Proxy from './App/Screens/Drawer/Proxy';
import AutomationFormScreen from './App/Screens/AutomationFormScreen';
import RoomFormScreen from './App/Screens/RoomFormScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwitchProfileScreen from './App/Screens/SwitchProfileScreen';
import SecurityConfig from './App/Screens/SecurityConfig';
import HouseLocalisationScreen from './App/Screens/Drawer/HouseLocalisationScreen';
import EStyleSheet from 'react-native-extended-stylesheet';
import TwoLampsControlScreen from './App/Screens/TwoLampsControlScreen';
import BlindsControlScreen from './App/Screens/BlindsControlScreen';
import CreateGroupScreen from './App/Screens/CreateGroupScreen'
import './App/i18n'; // Import the i18n configuration
import { useTranslation } from 'react-i18next';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userToken = await AsyncStorage.getItem('token');
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage); // Use react-i18next to change language
      }
      setIsLoggedIn(!!userToken);
    };

    checkLoginStatus();
  }, []);

  // Conditionally set the initial route based on login status
  const initialRouteName = isLoggedIn ? 'HomeScreen' : 'WelcomeScreen';

  // Define StackNavigator inside the main component to access isLoggedIn
  const StackNavigator = () => (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="AutomationFormScreen" component={AutomationFormScreen} />
      <Stack.Screen name="RoomFormScreen" component={RoomFormScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="RoomDetails" component={RoomDetails} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Start" component={Start} />
      <Stack.Screen name="Profile" component={Devices} />
      <Stack.Screen name="Security" component={Security} />
      <Stack.Screen name="SecurityConfig" component={SecurityConfig} />
      <Stack.Screen name="Automation" component={Automation} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Emailverification" component={Emailverification} />
      <Stack.Screen name="Groups" component={Groups} />
      <Stack.Screen name="ManageUsers" component={ManageUsers} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Profil" component={Profil} />
      <Stack.Screen name="Networks" component={Networks} />
      <Stack.Screen name="Proxy" component={Proxy} />
      <Stack.Screen name="SwitchProfile" component={SwitchProfileScreen} />
      <Stack.Screen name="TwoLampsControl" component={TwoLampsControlScreen} />
      <Stack.Screen name="BlindsControl" component={BlindsControlScreen} />
      <Stack.Screen name="CreateGroupScreen" component={CreateGroupScreen} />
    </Stack.Navigator>
  );

  // Initialize the theme based on your preference
  const themeType = "light"; // or "dark"

  return (
    <ThemeProvider themeType={themeType}>
      <NavigationContainer>
        {isLoggedIn ? (
          <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{ headerShown: false }}
            drawerStyle={{ backgroundColor: '#333', width: 240 }}
          >
            <Drawer.Screen name="Rooms" component={StackNavigator} />
            <Drawer.Screen name="Profil" component={Profil} />
            <Drawer.Screen name="Settings" component={Settings} />
            <Drawer.Screen name="Proxy Filter" component={Proxy} />
            <Drawer.Screen name="Networks" component={Networks} />
            <Drawer.Screen name="Manage Users" component={ManageUsers} />
          </Drawer.Navigator>
        ) : (
          <StackNavigator />
        )}
      </NavigationContainer>
    </ThemeProvider>
  );
}