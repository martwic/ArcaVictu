import 'react-native-url-polyfill/auto'
import React, { useState, useEffect, useContext } from 'react'
import { Alert, Pressable, StyleSheet, View } from 'react-native'
import { supabase } from '../constants'
import { Button, Input, Text } from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { PageContext } from '../constants/pageContext'
import * as Linking from "expo-linking";

export default function Login() {
  const [userId, setUserId] = useContext(PageContext);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState(null)
  const navigation = useNavigation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUserId(session.user.id)
      //if(session!=null && session.user!=null){
        //navigation.navigate('App');
    //}
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUserId(session.user.id)
      if(session!=null && session.user!=null){
        navigation.navigate('App');
    }
    })

  }, [])
  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  const resetPassword = async () => {
    const resetPasswordURL = Linking.createURL("/ResetPassword");
  
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetPasswordURL,
    });
  
    return { data, error };
  };
  return (
<SafeAreaView  className="flex-1 justify-center items-center bg-[#FFF6DC]">
    <View className=" w-full p-2 items-center">
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Hasło"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Hasło"
          autoCapitalize={'none'}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Zaloguj" buttonStyle={styles.button} disabled={loading} onPress={() => signInWithEmail()} />
      </View>
      <View>
      <Text style={{fontSize:hp(2)}}>Nie masz konta?</Text>
      <Text className='font-bold' style={{fontSize:hp(2.5)}} onPress={() => navigation.navigate('Register')}>Zarejestruj się</Text>
      </View>
      <View>
      <Text className='font-bold' style={{fontSize:hp(2.2)}} onPress={() => resetPassword()}>Nie pamiętam hasła</Text>
      </View>
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#b1ae95',
  },
})