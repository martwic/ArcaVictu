import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen'
import LoginScreen from '../screens/LoginScreen'
import PlannerScreen from '../screens/PlannerScreen';
import RecipesScreen from '../screens/RecipesScreen';
import ListScreen from '../screens/ListScreen';
import SettingsScreen from '../screens/SettingsScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import { MaterialCommunityIcons, FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons'; 


const Stack = createNativeStackNavigator();
const Tab=createBottomTabNavigator();

function RecipeNavigator(){
return(
  <Stack.Navigator initialRouteName='Recipes' screenOptions={{headerShown:false}}>
    <Stack.Screen name="Recipes" component={RecipesScreen} />
    <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
  </Stack.Navigator>
)
}

function TabNavigator(){
{       
  return(
    <Tab.Navigator initialRouteName='Home'  screenOptions={{
      headerShown:false,
      tabBarInactiveBackgroundColor:'#C4C1A4',
      tabBarActiveBackgroundColor:'#B8B492',
      tabBarActiveTintColor:'black',
      }}>
    <Tab.Screen name="Home" component={HomeScreen} options={{
      tabBarShowLabel: false,
      tabBarIcon: ({ color, size }) => (
        <Ionicons name='home-outline' color={color} size={size} />
      )
    }}/>
    <Tab.Screen name="Planner" component={PlannerScreen} options={{
      tabBarShowLabel: false,
      tabBarIcon: ({ color, size }) => (
        <Ionicons name='calendar-sharp' color={color} size={size} />
      )
    }}/>
    <Tab.Screen name="RecipeNavigator" component={RecipeNavigator} options={{
      tabBarShowLabel: false,
      tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="pot-steam-outline" size={size} color={color} />
      )
    }}/>
    <Tab.Screen name="List" component={ListScreen} options={{
      tabBarShowLabel: false,
      tabBarIcon: ({ color, size }) => (
        <FontAwesome5 name="list" size={size} color={color} />
      )
    }}/>
    <Tab.Screen name="Settings" component={SettingsScreen} options={{
      tabBarShowLabel: false,
      tabBarIcon: ({ color, size }) => (
        <MaterialIcons name="settings" size={size} color={color} />
      )
    }}/>
  </Tab.Navigator> 
  )}
}

export default function Navigation(){
    return (
        <NavigationContainer>
        <Stack.Navigator initialRouteName='Welcome' screenOptions={{headerShown:false}}>
          <Stack.Screen name="Welcome" component={WelcomeScreen}/>
          <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="App" component={TabNavigator} />
        </Stack.Navigator>

      </NavigationContainer> 
    )
}