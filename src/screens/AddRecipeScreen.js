import 'react-native-url-polyfill/auto'
import React, { useState, useEffect, useContext } from 'react'
import { Alert, Pressable, StyleSheet, View, ScrollView } from 'react-native'
import { supabase } from '../constants'
import { Button, Input, Text } from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { PageContext } from '../constants/pageContext'

export default function Login() {
  const navigation = useNavigation();

  //const [session, setSession] = useState(null)
  //const [userId, setUserId] = useState(null)
  const [userId] = useContext(PageContext);
  const [recipeName, setRecipeName] = useState('')
  const [recipePrepTime, setRecipePrepTime] = useState('0')
  const [recipeWaitTime, setRecipeWaitTime] = useState('0')
  const [recipeDurability, setRecipeDurability] = useState('1')
  const [recipeDirections, setRecipeDirections] = useState('')
  const [ingredientWeight, setIngredientWeight] = useState('0')
  const [ingredientAmount, setIngredientAmount] = useState(ingredientWeight)
  const [ingredientMeasure, setIngredientMeasure] = useState('g')
  const [loading, setLoading] = useState(false)
/*  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUserId(session.user.id)
    })
  }, []) */
  async function addRecipe() {
    setLoading(true)
    const { error } = await supabase.from('recipes').insert({ 
        name: recipeName,
        preparationTime: recipePrepTime,
        waitingTime: recipeWaitTime,
        durability: recipeDurability,
        directions: recipeDirections,
        account_id: userId,
    })
    if (error) Alert.alert(error.message)
    else{
   navigation.navigate('Recipes');
    }
    setLoading(false)
  }

  return (
<SafeAreaView  className="flex-1 justify-center items-center bg-[#FFF6DC]">
  <ScrollView className="flex-1 p-2">
    <View className=" w-full p-2 items-center">
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Nazwa"
          disabled={loading}
          onChangeText={(text) => setRecipeName(text)}
          value={recipeName}
          autoCapitalize={'none'}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Czas przygotowania"
          disabled={loading}
          onChangeText={(text) => setRecipePrepTime(text)}
          value={recipePrepTime}
          keyboardType="numeric"
        />
      </View>  
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Czas oczekiwania"
          disabled={loading}
          onChangeText={(text) => setRecipeWaitTime(text)}
          value={recipeWaitTime}
          keyboardType="numeric"
        />
      </View>  
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Trwałość"
          disabled={loading}
          onChangeText={(text) => setRecipeDurability(text)}
          value={recipeDurability}
          keyboardType="numeric"
        />
      </View>  
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Opis"
          disabled={loading}
          //leftIcon={{ type: 'font-awesome', name: 'home' }}
          onChangeText={(text) => setRecipeDirections(text)}
          value={recipeDirections}
        />
      </View>  
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Dodaj" buttonStyle={styles.button} disabled={loading} onPress={() => addRecipe()} />
      </View>
      </View>
      </ScrollView>
      <View className="flex-row items-center">
                <Button  buttonStyle={styles.button} onPress={()=> navigation.navigate('Recipes')} title='Wróć' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
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
    width: wp(100),
  },
})