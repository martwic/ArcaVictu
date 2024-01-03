import React from 'react';
import { View, Text, ScrollView, BackHandler, NativeModules } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState, useEffect } from 'react'
import { supabase } from '../constants';
import { StyleSheet, Alert } from 'react-native'
import { Button, Input } from 'react-native-elements'

export default function SettingsScreen(){
  const [session, setSession] = useState(null)
  const [userId, setUserId] = useState(null)
  const [userEmail, setUserEmail] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUserId(session.user.id)
      setUserEmail(session.user.email)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if(session!=null){
        setUserId(session.user.id)
      }
      else{
        setUserId(null)
      }

    })
    if(session!=null && session.user!=null){
      navigation.navigate('App');
  }
  }, [])
  async function signOut(){
    await supabase.auth.signOut()
    NativeModules.DevSettings.reload();

  }
    /*useEffect(() => {
        if (session) getProfile()
      }, [session])
    
      async function getProfile() {
        try {
          setLoading(true)
          if (!session?.user) throw new Error('No user on the session!')
    
          const { data, error, status } = await supabase
            .from('profiles')
            .select(`username, website, avatar_url`)
            .eq('id', session?.user.id)
            .single()
          if (error && status !== 406) {
            throw error
          }
    
          if (data) {
            setUsername(data.username)
            setWebsite(data.website)
            setAvatarUrl(data.avatar_url)
          }
        } catch (error) {
          if (error instanceof Error) {
            Alert.alert(error.message)
          }
        } finally {
          setLoading(false)
        }
      }*/
    
    return (
        <SafeAreaView  className="flex-1 justify-center items-center bg-[#FFF6DC]">
        <View className="bg-[#FFC6AC] w-full p-2 items-center">
            <Text className="font-['Gothic']" style={{fontSize:hp(5)}}>Preferencje</Text>
        </View>
        <View className="flex-1 items-center justify-center">
        
        <Text>{userEmail}</Text>
        <Text>{userId}</Text>

        <Button title="Wyloguj" buttonStyle={styles.button} onPress={()=>signOut()}/>
        </View>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#b1ae95',
  },
})