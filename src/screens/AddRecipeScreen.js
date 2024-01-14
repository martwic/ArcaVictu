import 'react-native-url-polyfill/auto'
import React, { useState, useEffect, useContext } from 'react'
import { Alert, Pressable, StyleSheet, View,  TextInput, FlatList, Modal, ScrollView} from 'react-native'
import { supabase } from '../constants'
import { Button, Input, Text} from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { PageContext } from '../constants/pageContext'
import InputSpinner from 'react-native-input-spinner'
import MultiSelect from 'react-native-multiple-select';
import { SearchBar } from '@rneui/themed';
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import SearchableDropdown from 'react-native-searchable-dropdown';
//import { ScrollView } from 'react-native-virtualized-view'

export default function AddRecipe() {
  
  const navigation = useNavigation();
  const [userId] = useContext(PageContext);
  const [products, setProducts] = useState('')
  const [productsList, setProductsList] = useState('')
  const [recipeName, setRecipeName] = useState('')
  const [recipePrepTime, setRecipePrepTime] = useState('0')
  const [recipeWaitTime, setRecipeWaitTime] = useState('0')
  const [recipeDurability, setRecipeDurability] = useState('1')
  const [recipeDirections, setRecipeDirections] = useState('')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [open, setOpen] = useState(false)
  let ingredientsToDatabase = [];
  useEffect(() => {
    getProducts()
  }, []);
  async function addRecipe() {
    setLoading(true)
    const { data, error } = await supabase.from('recipes').insert({ 
        name: recipeName,
        preparationTime: recipePrepTime,
        waitingTime: recipeWaitTime,
        durability: recipeDurability,
        directions: recipeDirections,
        account_id: userId,
    }).select().single()
    if (error) Alert.alert(error.message)
    else{
      ingredients.forEach((val) => {
        ingredientsToDatabase.push({recipe_id: data.id,  product_id:val.id, weight: parseFloat(val.weight), amount:parseFloat(val.amount), measure:val.measure});
          });
      }
      console.log(ingredientsToDatabase)
      const { error2 } = await supabase.from('ingredients').insert(
        ingredientsToDatabase
      )
    if (error2) Alert.alert(error.message)
    else{
   navigation.navigate('Recipes');
    }
    setLoading(false)
  }
  async function getProducts() {
    try {
      let query = supabase.from('products').select(`id, name`)          
      const { data, error, status } = await query

      if (error && status !== 406) {
        throw error
      }
      if (data) {
        setProducts(data)
        setProductsList(data)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } 
  }


  //state = {
  // selectedItems : []
  //};
 
  
  onSelectedItemsChange = selectedItems => {
    setSelected(selectedItems);
  };
  //arrayProducts = Object.keys(products).map(function(k) {
  //  return products[k];
  //});
  
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
        <Text className="font-bold text-[#7F8D9A] p-3" style={{fontSize:hp(2)}}>Czas przygotowania</Text>
        <InputSpinner height={hp(4)} width={wp(90)} inputStyle={{fontSize:hp(2)}} 
            color='#FFC6AC'
            max={600}
            min={0}
            step={5}
            value={recipePrepTime}
            onChange={(num) => {
              setRecipePrepTime(num);
            }}
            />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text className="font-bold text-[#7F8D9A] p-3" style={{fontSize:hp(2)}}>Czas oczekiwania</Text>
        <InputSpinner height={hp(4)} width={wp(90)} inputStyle={{fontSize:hp(2)}} 
            color='#FFC6AC'
            max={600}
            min={0}
            step={5}
            value={recipeWaitTime}
            onChange={(num) => {
              setRecipeWaitTime(num);
            }}
            />
      </View>  
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text className="font-bold text-[#7F8D9A] p-3" style={{fontSize:hp(2)}}>Trwałość w dniach</Text>
        <InputSpinner height={hp(4)} width={wp(90)} inputStyle={{fontSize:hp(2)}} 
            color='#FFC6AC'
            max={14}
            min={1}
            step={1}
            value={recipeDurability}
            onChange={(num) => {
              setRecipeDurability(num);
            }}
            />
      </View>  
      <View style={[styles.verticallySpaced, styles.mt20]}>
      <Text className="font-bold text-[#7F8D9A] p-3" style={{fontSize:hp(2)}}>Opis</Text>
      <TextInput 
        editable
        multiline
        numberOfLines={4}
        maxLength={2000}
        onChangeText={text => setRecipeDirections(text)}
        value={recipeDirections}
        style={{padding: 10, backgroundColor:'white'}}
      />
      </View> 
      <View style={{paddingBottom:hp(2), alignSelf:'stretch'}}>
      <Text className="font-bold text-[#7F8D9A] p-3" style={{fontSize:hp(2)}}>Składniki:</Text>
</View>
      <FlatList
            scrollEnabled={false}
            data={ingredients.sort((a, b) => a.id-b.id )}
            keyExtractor={item => item.id} 
            renderItem={({item}) => 
            <View style={{marginTop:hp(1), width: wp(90)}}>
              <Text style={{fontSize:hp(2.3),padding:hp(1), fontWeight:'bold'}}>{item.name}</Text>
              <View className="flex-column">
                <View className="flex-row justify-end right-1/4 items-center p-1">
                <Text style={{marginRight:wp(3)}}>Waga w gramach: </Text>
              <TextInput 
                maxLength={6}
                value={item.weight}
                keyboardType='numeric'
                style={{backgroundColor:'white', width:wp(20), textAlign:'center', fontSize:hp(2)}}
                onChangeText={(text) => {
                  let tempArray = [...ingredients]
                  tempArray=tempArray.filter(t => t.id !== item.id)
                  tempArray.push({id: item.id, name: item.name, weight: text, amount: item.amount, measure:item.measure})
                  setIngredients(tempArray)
              }}
              /></View>
                <View className="flex-row justify-end right-1/4 items-center p-1">
                <Text style={{marginRight:wp(3)}}>Ilość: </Text>
              <TextInput 
                maxLength={6}
                value={item.amount}
                keyboardType='numeric'
                style={{backgroundColor:'white', width:wp(20), textAlign:'center', fontSize:hp(2)}}
                onChangeText={(text) => {
                  let tempArray = [...ingredients]
                  tempArray=tempArray.filter(t => t.id !== item.id)
                  tempArray.push({id: item.id, name: item.name, weight: item.weight, amount: text, measure:item.measure})
                  setIngredients(tempArray)
              }}
              /></View>
              <View className="flex-row justify-end right-1/4 items-center p-1">
                <Text style={{marginRight:wp(3)}}>Miara: </Text>
              <TextInput 
                maxLength={25}
                value={item.measure}
                style={{backgroundColor:'white', width:wp(20), textAlign:'center', fontSize:hp(2)}}
                onChangeText={(text) => {
                  let tempArray = [...ingredients]
                  tempArray=tempArray.filter(t => t.id !== item.id)
                  tempArray.push({id: item.id, name: item.name, weight: item.weight, amount: item.amount, measure:text})
                  setIngredients(tempArray)
              }}
              />

              </View>
              </View>
              </View>}
  />
                <View className="flex-row justify-end items-center" style={{paddingTop:wp(3), paddingBottom:wp(3)}}>
              <Button  titleStyle={{color:'#7F8D9A'}} buttonStyle={{backgroundColor: '#FFC6AC', borderRadius:25, width:wp(80)}} title="Dodaj składnik" onPress={() => setOpen(!open)}/>
              </View>
      </View>
      </ScrollView>
      <Modal visible={open}>
          <>
          <View className="flex-1 bg-[#FFF6DC]">
          <View className="items-center">
                <SearchBar  onChangeText={
                  (text) => {setSearch(text)
                    let filtered = products.filter((product)=>product.name.toLowerCase().includes(text.toLowerCase()))
                    setProductsList(filtered)
                    }} value={search} round containerStyle={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(90), height:hp(5)}}/>
            </View>
          <FlatList
            scrollEnabled
            data={productsList}
            keyExtractor={item => item.id} 
            renderItem={({item}) => 
            <View style={{backgroundColor:'white', marginTop:hp(1), width: wp(90), alignSelf:'center'}}>
              <Text style={{fontSize:hp(2.3),padding:hp(0.5), textAlign:'center'}} 
              onPress={()=> {
                setOpen(!open)
                var ingredient = {id: item.id, name: item.name, weight: '0', amount: '0', measure:'g'}
                setIngredients(ingredients => [...ingredients, ingredient])
                }}>
                {item.name}
                </Text>
              </View>}
  />
          </View>
          <Button buttonStyle={{    backgroundColor: '#b1ae95',width: wp(100),}} onPress={()=> setOpen(!open)} title='Anuluj' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
          </>
      </Modal>
      <View className="flex-row items-center">
        <Button buttonStyle={styles.button} onPress={()=> navigation.navigate('Recipes')} title='Wróć' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
        <View className="bg-black" style={{width:0.2}}></View>
        <Button title="Zapisz" buttonStyle={styles.button} disabled={loading} onPress={() => addRecipe()} />
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
    width: wp(49.9),
  },
})