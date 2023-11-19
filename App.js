import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './src/navigation';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { Platform } from 'react-native'
import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import schema from './model/schema'
import migrations from './model/migrations';
import { FoodCategories } from './model/FoodCategories';
import { Ingredients } from './model/Ingredients';
import { Products } from './model/Products';
import { Recipes } from './model/Recipes';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const adapter = new SQLiteAdapter({
    schema,
    migrations,
    //jsi: true, /* Platform.OS === 'ios' */
    onSetUpError: error => {
    }
  })
  
  // Then, make a Watermelon database from it!
  const database = new Database({
    adapter,
    modelClasses: [
      FoodCategories,
      Ingredients,
      Products,
      Recipes,
    ],
  })
  const [fontsLoaded, fontError] = useFonts({
    'Gothic': require('./assets/fonts/CenturyGothic.otf'),
    'GothicBold': require('./assets/fonts/CenturyGothicBold.otf'),
  });
  
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return <AppLoading/>
  }
  return (
    <>
      <Navigation/>
    </>
  );
}
