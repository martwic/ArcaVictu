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

SplashScreen.preventAutoHideAsync();

export default function App() {
  const adapter = new SQLiteAdapter({
    schema,
    // (You might want to comment it out for development purposes -- see Migrations documentation)
    migrations,
    // (optional database name or file system path)
    // dbName: 'myapp',
    // (recommended option, should work flawlessly out of the box on iOS. On Android,
    // additional installation steps have to be taken - disable if you run into issues...)
    //jsi: true, /* Platform.OS === 'ios' */
    // (optional, but you should implement this method)
    onSetUpError: error => {
      // Database failed to load -- offer the user to reload the app or log out
    }
  })
  
  // Then, make a Watermelon database from it!
  const database = new Database({
    adapter,
    modelClasses: [
      // Post, // ⬅️ You'll add Models to Watermelon here
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
