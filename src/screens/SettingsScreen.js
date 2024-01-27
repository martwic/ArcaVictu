import React, {useContext} from 'react';
import { View, Text, NativeModules, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState, useEffect } from 'react'
import { supabase } from '../constants';
import { StyleSheet } from 'react-native'
import { Button} from 'react-native-elements'
import { PageContext } from '../constants/pageContext';
import { ButtonGroup} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Fontisto } from '@expo/vector-icons';

export default function SettingsScreen(){
  const [session, setSession] = useState(null)
  const [userId, setUserId] = useContext(PageContext);
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('Marta')
  const [ifMeat, setIfMeat] = useState(0)
  const [ifDairy, setIfDairy] = useState(0)
  const [ifGrains, setIfGrains] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session.user.id)
      setUserEmail(session.user.email)
      getPreferences()
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if(session!=null){
        //setUserId(session.user.id)
      }
      else{
        setUserId(null)
      }

    })
  }, [])
  async function signOut(){
    await supabase.auth.signOut()
    NativeModules.DevSettings.reload();
    try {
      await AsyncStorage.clear();
  } catch(e) {
      console.log(e);
  }
  }
  async function getPreferences(){
    const { data, error } = await supabase
      .from('profiles')
      .select('eatMeat,eatDairy,eatGrains')
      .eq('id', userId).single()
      if(error){
        Alert.alert(error.message);
      }
      if(data){
        setIfMeat((data.eatMeat)?0:1)
        setIfDairy((data.eatDairy)?0:1)
        setIfGrains((data.eatGrains)?0:1)
      }
      
  }

  async function setPreferencesMeat(val){
    var  meat = val==0 ? true:false;
    const { error } = await supabase
      .from('profiles')
      .update({ eatMeat: meat})
      .eq('id', userId)
      if(error){
        Alert.alert(error.message);
      }
  }
  async function setPreferencesDairy(val){
    var  dairy = val==0 ? true:false;
    const { error } = await supabase
      .from('profiles')
      .update({ eatDairy: dairy})
      .eq('id', userId)
      if(error){
      }
  }
  async function setPreferencesGrains(val){
    var  grains = val==0 ? true:false;
    const { error } = await supabase
      .from('profiles')
      .update({ eatGrains: grains})
      .eq('id', userId)
      if(error){
        Alert.alert(error.message);
      }
      Alert.alert(JSON.stringify(val));
  }
    
    return (
        <SafeAreaView  className="flex-1 justify-center items-center bg-[#FFF6DC]">
        <View className="bg-[#FFC6AC] w-full p-2 items-center">
            <Text className="font-['Gothic']" style={{fontSize:hp(5)}}>Konto</Text>
        </View>
        <View className="flex-1" style={{width:wp(100)}}>

        <Text className="font-['Gothic'] font-bold pt-3 pl-3" style={{fontSize:hp(4.5)}}>Cześć, {userName}!</Text>
        <View className="flex-row items-center pl-3">
        <Text style={{fontSize:hp(2.2)}}><Fontisto name="email" size={20} color="black" /> </Text>
        <Text style={{fontSize:hp(2.2)}}>{userEmail}</Text>
        </View>
        <Text className="font-['Gothic'] font-bold pt-7 pb-5 pl-3" style={{fontSize:hp(3)}}>Preferencje dotyczące diety:</Text>
        <ButtonGroup 
            buttons={['Jem mięso',  'Nie jem mięsa']}
            selectedIndex={ifMeat}
            selectedButtonStyle={{backgroundColor:'#b1ae95'}}
            onPress={(value) => {
              setIfMeat(value)
              setPreferencesMeat(value);
            }}/>                       
                <ButtonGroup 
            buttons={['Jem nabiał',  'Nie jem nabiału']}
            selectedIndex={ifDairy}
            selectedButtonStyle={{backgroundColor:'#b1ae95'}}
            onPress={(value) => {
              setIfDairy(value)
              setPreferencesDairy(value);
            }}/>
                <ButtonGroup 
            buttons={['Jem produkty zbożowe',  'Nie jem produktów zbożowych']}
            selectedIndex={ifGrains}
            selectedButtonStyle={{backgroundColor:'#b1ae95'}}
            onPress={(value) => {
              setIfGrains(value)
              setPreferencesGrains(value);
            }}/>
        </View>
        <Button title="Zmień hasło" buttonStyle={styles.button} onPress={()=>signOut()}/>
        <View className="border-b-2 border-[#FFF6DC] w-4/5"/>
        <Button title="Usuń konto" buttonStyle={styles.button} onPress={()=>signOut()}/>
        <View className="border-b-2 border-[#FFF6DC] w-4/5"/>
        <Button title="Wyloguj" buttonStyle={styles.button} onPress={()=>signOut()}/>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#b1ae95',
    width:wp(100),
  },
})