import 'react-native-url-polyfill/auto'
import React, { useState, useEffect } from 'react'
import { Alert, StyleSheet, View,Pressable } from 'react-native'
import { supabase } from '../constants'
import { Button, Input, Text } from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState(null)
  const navigation = useNavigation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }
  return (
    <SafeAreaView  className="flex-1 justify-center items-center bg-[#FFF6DC]">
    <View className="w-full p-2 items-center">
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
        <Button  buttonStyle={styles.button} title="Zarejestruj" disabled={loading} onPress={() => signUpWithEmail()}/>
      </View>
      <Text style={{fontSize:hp(2)}}>Masz konto?</Text>
      <Text className='font-bold' style={{fontSize:hp(2.5)}} onPress={() =>  navigation.navigate('Login')}>Zaloguj się</Text>
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