import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen'
import CalendarScreen from '../screens/CalendarScreen';

const Stack = createNativeStackNavigator();
const Tab=createBottomTabNavigator();

export default function Navigation(){
    return (
        <NavigationContainer>
        <Stack.Navigator initialRouteName='Welcome' screenOptions={{headerShown:false}}>
          <Stack.Screen name="Welcome" component={WelcomeScreen}/>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
{/*         <Tab.Navigator initialRouteName='Welcome' screenOptions={{headerShown:false}}>
           <Tab.Screen name="Welcome" component={WelcomeScreen} />
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Calendar" component={CalendarScreen} />
        </Tab.Navigator> */}
      </NavigationContainer> 
    )
}