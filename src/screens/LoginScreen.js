import 'react-native-url-polyfill/auto'
import React, { useState, useEffect, useContext } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { supabase } from '../constants'
import { Button, Input, Text } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
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
    supabase.auth.onAuthStateChange((_event, session) => {
      if(session != null){
      setSession(session)
      setUserId(session.user.id)}
      if (session != null && session.user != null) {
        navigation.navigate('App');
      }
    })

  }, [])
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setEmail('')
      setPassword('')
    });
    return unsubscribe;
  }, [navigation]);
  async function signInWithEmail() {
    if (password.length < 1 || email.length < 1) {
      Alert.alert("Wprowadź dane")
    }
    else {
      if (!email.includes("@")) {
        Alert.alert("Niepoprawny format adresu email")
      }
      else {
        if (password.length < 6) {
          Alert.alert("Wprowadzone hasło jest za krótkie")
        }
        else {
          setLoading(true)
          const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          })
          if (error) {
            if (error.message == "Invalid login credentials")
              Alert.alert("Nieprawidłowe dane logowania")
          }

          setLoading(false)
        }
      }
    }
  }

  const resetPassword = async () => {
    if (!email.includes("@")) {
      Alert.alert("Brak adresu","Wprowadź adres email do wysłania linku w pole do wysłania linku, a następnie zatwierdź.")
    }
    const resetPasswordURL = Linking.createURL("https://arcavictu-password-reset.vercel.app/resetpassword");

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetPasswordURL,
    });
    if(!error){
      Alert.alert("Wysłano link do resetu hasła.")
    }
    else{
      Alert.alert(error.message)
    }
  };
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-[#FFF6DC]">
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
          <Text style={{ fontSize: hp(2) }}>Nie masz konta?</Text>
          <Text className='font-bold' style={{ fontSize: hp(2.5) }} onPress={() => navigation.navigate('Register')}>Zarejestruj się</Text>
        </View>
        <View>
          <Text className='font-bold' style={{ fontSize: hp(2.2) }} onPress={() => resetPassword()}>Nie pamiętam hasła</Text>
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