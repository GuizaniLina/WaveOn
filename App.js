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
import Profil from './App/Screens/Drawer/Profil';
import Settings from './App/Screens/Drawer/Settings';
import ManageUsers from './App/Screens/Drawer/ManageUsers';
import Networks from './App/Screens/Drawer/Networks';
import Proxy from './App/Screens/Drawer/Proxy';
import test from './App/Screens/test';
import AutomationFormScreen from './App/Screens/AutomationFormScreen';




const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='WelcomeScreen' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="AutomationFormScreen" component={AutomationFormScreen} />
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
      <Stack.Screen name="ManegeUsers" component={ManageUsers} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Profil" component={Profil} />
      <Stack.Screen name="Networks" component={Networks} />
      <Stack.Screen name="proxy" component={Proxy} />
      
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
          drawerStyle={{ backgroundColor: '#333', width: 240 }}
        >
          <Drawer.Screen name="Rooms" component={StackNavigator}/>
          <Drawer.Screen name="Profil" component={Profil} />
          <Drawer.Screen name="Settings" component={Settings} />
          <Drawer.Screen name="Proxy Filter" component={Proxy} />
          <Drawer.Screen name="Networks" component={Networks} />
         <Drawer.Screen name="Manage Users " component={ManageUsers} />
        </Drawer.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}