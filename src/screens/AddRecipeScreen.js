import 'react-native-url-polyfill/auto'
import React, { useState, useEffect, useContext } from 'react'
import { Alert, Pressable, StyleSheet, View,  TextInput, FlatList, ScrollView  } from 'react-native'
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

export default function AddRecipe() {
  const navigation = useNavigation();

  const [userId] = useContext(PageContext);
  const [selected, setSelected] = useState([])
  const [products, setProducts] = useState('')
  const [productsList, setProductsList] = useState('')
  const [selectedProducts, setSelectedProducts] = useState('')
  const [recipeName, setRecipeName] = useState('')
  const [recipePrepTime, setRecipePrepTime] = useState('0')
  const [recipeWaitTime, setRecipeWaitTime] = useState('0')
  const [recipeDurability, setRecipeDurability] = useState('1')
  const [recipeDirections, setRecipeDirections] = useState('')
  const [ingredientWeight, setIngredientWeight] = useState('0')
  const [ingredientAmount, setIngredientAmount] = useState(ingredientWeight)
  const [ingredientMeasure, setIngredientMeasure] = useState('g')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  useEffect(() => {
    getProducts()
  }, []);
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
  async function getProducts() {
    try {
      let query = supabase.from('products').select(`id, name`)          
      const { data, error, status } = await query

      if (error && status !== 406) {
        throw error
      }
      if (data) {
        setProducts(data)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } 
  }
  const filterData = (item) => {
    if(item.length>2){
      let filtered = products.filter((product)=>product.name.toLowerCase().includes(item.toLowerCase()))
      setProductsList(filtered)
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
  const items = [
    {key:'1', value:'Mobiles', disabled:true},
    {key:'2', value:'Appliances'},
    {key:'3', value:'Cameras'},
    {key:'4', value:'Computers', disabled:true},
    {key:'5', value:'Vegetables'},
    {key:'6', value:'Diary Products'},
    {key:'7', value:'Drinks'},
]
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
        <Text className="font-bold text-[#7F8D9A] p-3" style={{fontSize:hp(2)}}>Czas oczekiwania</Text>
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
 <MultipleSelectList 
        setSelected={(val) => setSelected(val)} 
        data={Object.keys(products).map(function(k) {
          return products[k].name;
        })} 
        save="key"
        onSelect={() => alert(selected)} 
        label="Categories"
    />


      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Dodaj" buttonStyle={{backgroundColor: '#b1ae95'}} disabled={loading} onPress={() => addRecipe()} />
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