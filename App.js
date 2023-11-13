import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './src/navigation';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';

SplashScreen.preventAutoHideAsync();

export default function App() {
  
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
