import React, {useContext} from 'react';
import { View, Text, ScrollView, BackHandler, NativeModules } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState, useEffect } from 'react'
import { supabase } from '../constants';
import { StyleSheet, Alert } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { PageContext } from '../constants/pageContext';
import { ButtonGroup} from '@rneui/themed';

export default function SettingsScreen(){
  const [session, setSession] = useState(null)
  //const [userId, setUserId] = useState(null)
  const [userId, setUserId] = useContext(PageContext);
  const [userEmail, setUserEmail] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      //setSession(session)
      setUserId(session.user.id)
      setUserEmail(session.user.email)
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

  }
    
    return (
        <SafeAreaView  className="flex-1 justify-center items-center bg-[#FFF6DC]">
        <View className="bg-[#FFC6AC] w-full p-2 items-center">
            <Text className="font-['Gothic']" style={{fontSize:hp(5)}}>Preferencje</Text>
        </View>
        <View className="flex-1 items-center p-2">
        <ButtonGroup 
            buttons={['Jem mięso',  'Jestem wege']}
            selectedIndex={selectedIndex}
            selectedButtonStyle={{backgroundColor:'#b1ae95'}}
            onPress={(value) => {
              setSelectedIndex(value);
              //filterOwns(value);
            }}
            />
        <Text className="font-['Gothic'] font-bold p-3" style={{fontSize:hp(3), textAlign:'center'}}>Email:</Text>
        <Text className="font-['Gothic']p-3" style={{fontSize:hp(3), textAlign:'center'}}>{userEmail}</Text>
        

        
        </View>
        <Text className="p-4">{userId}</Text>
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