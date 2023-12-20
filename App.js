import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './src/navigation';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { supabase } from './src/constants';
import 'react-native-url-polyfill/auto'
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import syncProvider from './providers/SyncProvider';
import { databaseWatermelon } from './model/database';
import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import { DatabaseProvider } from '@nozbe/watermelondb/react'
import schema from "./model/schema";
import migrations from "./model/migrations";
import { FoodCategories } from "./model/FoodCategories";
import { Ingredients } from "./model/Ingredients";
import Products from './model/Products';
import { Recipes } from "./model/Recipes";
/*const adapter = new SQLiteAdapter({
    dbName:'ArcaVictu',
    schema,
    migrations,
    //jsi: true,  Platform.OS === 'ios' 
    //onSetUpError: error => {
    //}
  })

  const databaseWatermelon = new Database({
    adapter,
    modelClasses: [
      //FoodCategories,
      //Ingredients,
      Products,
      //Recipes,
    ],

    actionsEnabled:true,
  })*/
SplashScreen.preventAutoHideAsync();

export default function App() {
  mySync();

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
      
      <DatabaseProvider database={databaseWatermelon}>
        <Navigation/>
        </DatabaseProvider>
    </>
  );
}

async function mySync(){
  //syncProvider();
}