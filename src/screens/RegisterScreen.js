import 'react-native-url-polyfill/auto'
import React, { useState, useEffect } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { supabase } from '../constants'
import { Button, Input, Text } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
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
      options:{
        data:{
          full_name: name
        }
      }
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Aktywuj konto','Na podany adres mailowy została wysłana wiadomość z linkiem weryfikacyjnym.')
    setLoading(false)
    navigation.navigate('Login')
  }
  const validatePass = (val)=>{
    if(val.length<6 || !email.includes("@") || name.length<2){
      setLoading(true);
    }
    else{
      setLoading(false)
    }
  }
  const validateEmail = (val)=>{
    if(!val.includes("@") || password.length<6 || name.length<2){
      setLoading(true);
    }
    else{
      setLoading(false)
    }
  }
  const validateName = (val)=>{
    if(val.length<2 || !email.includes("@") || password.length<6){
      setLoading(true);
    }
    else{
      setLoading(false)
    }
  }

  return (
    <SafeAreaView  className="flex-1 justify-center items-center bg-[#FFF6DC]">
    <View className="w-full p-2 items-center">
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Imię"
          leftIcon={{ type: 'font-awesome', name: 'user' }}
          onChangeText={(text) => {
            setName(text)
            validateName(text)
          }}
          value={name}
          placeholder="Imię"
          autoCapitalize='none'
        />
                {  name.length<2 && <Text className="text-center text-red-500">Imię musi zawierać minimum 2 znaki.</Text>}
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => {
            setEmail(text)
            validateEmail(text)
          }}
          value={email}
          placeholder="email@address.com"
          autoCapitalize='none'
        />
                {  !email.includes("@") && <Text className="text-center text-red-500">Email musi zawierać znak @.</Text>}
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Hasło"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => {
            setPassword(text)
            validatePass(text)
          }}
          value={password}
          secureTextEntry={true}
          placeholder="Hasło"
          autoCapitalize={'none'}
        />
        {  password.length<6 && <Text className="text-center text-red-500">Hasło musi mieć minimum 6 znaków.</Text>}
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