import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
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

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='WelcomeScreen' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="RoomDetails" component={RoomDetails} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Start" component={Start} />
      <Stack.Screen name="Profile" component={Devices} />
      <Stack.Screen name="Security" component={Security} />
      <Stack.Screen name="Automation" component={Automation} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Emailverification" component={Emailverification} />
      <Stack.Screen name="Groups" component={Groups} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider themeType={"dark"}>
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={props => <CustomDrawerContent {...props}  />}
          screenOptions={{ headerShown: false }}
          drawerStyle={{ backgroundColor: '#c6cbef', width: 240 }}
        >
          <Drawer.Screen name="Accueil" component={StackNavigator} />
          <Drawer.Screen name="Devices" component={Devices} />
          <Drawer.Screen name="Groups" component={Groups} />
          <Drawer.Screen name="Home" component={Home} />
          <Drawer.Screen name="Security" component={Security} />
          <Drawer.Screen name="Automation" component={Automation} />
        </Drawer.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}