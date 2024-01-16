import 'react-native-url-polyfill/auto'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { Alert, Pressable, StyleSheet, View,  TextInput, FlatList, Modal, ScrollView, TouchableOpacity} from 'react-native'
import { supabase } from '../constants'
import { Button, Input, Text} from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { PageContext } from '../constants/pageContext'
import InputSpinner from 'react-native-input-spinner'
import { SearchBar } from '@rneui/themed';
import Dropdown from 'react-native-input-select'
import { Feather } from '@expo/vector-icons';

export default function EditRecipeScreen({route}) {
  const { recipe, ingredientsList} = route.params;
  const navigation = useNavigation();
  const [userId] = useContext(PageContext);
  const [products, setProducts] = useState('')
  const [productsList, setProductsList] = useState('')
  const [recipeName, setRecipeName] = useState(recipe.name)
  const [recipePrepTime, setRecipePrepTime] = useState(recipe.preparationTime.toString())
  const [recipeWaitTime, setRecipeWaitTime] = useState(recipe.waitingTime.toString())
  const [recipeDurability, setRecipeDurability] = useState(recipe.durability.toString())
  const [recipeDirections, setRecipeDirections] = useState(recipe.directions)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [categories, setCategories] = useState([])
  const [productName, setProductName] = useState('')
  const [productCategory, setProductCategory] = useState(7)
  const [productKcal, setProductKcal] = useState('')
  const [productProtein, setProductProtein] = useState('')
  const [productCarbo, setProductCarbo] = useState('')
  const [productFats, setProductFats] = useState('')
  const [openM, setOpen] = useState(false)
  const [openProduct, setOpenProduct] = useState(false)
  let ingredientsToIngredients = [];
  let ingredientsToDatabase = [];
  useEffect(() => {
    getProducts()
    getCategories()
    ingredientsList.forEach((val) => {
        ingredientsToIngredients.push({name: val.products.name,  id:val.product_id, weight: val.weight.toString(), amount:val.amount.toString(), measure:val.measure});
          });
          setIngredients(ingredientsToIngredients)
  }, []);
  
  async function addRecipe() {
    if(!recipeName)
    Alert.alert("Niewypełnione pola","Aby zapisać przepis, obowiązkowe jest podanie jego nazwy.")
    else{
    setLoading(true)
    const { data, error } = await supabase.from('recipes').update({ 
        name: recipeName,
        preparationTime: recipePrepTime,
        waitingTime: recipeWaitTime,
        durability: recipeDurability,
        directions: recipeDirections,
    }).eq('id',recipe.id)
    if (error) Alert.alert(error.message)
    else{
      ingredients.forEach((val) => {
        ingredientsToDatabase.push({recipe_id: recipe.id,  product_id:val.id, weight: parseFloat(val.weight), amount:parseFloat(val.amount), measure:val.measure});
          });
      }
      const { error2 } = await supabase.from('ingredients').delete().eq('recipe_id',recipe.id)
      const { error3 } = await supabase.from('ingredients').insert(
        ingredientsToDatabase
      )
    if (error2 || error3) Alert.alert(error.message)
    else{
   navigation.navigate('Recipes');
    }
    setLoading(false)
  }}

  async function addProduct() {
    if(!productName | !productCategory | !productKcal| !productCarbo| !productFats| !productProtein)
    Alert.alert("Niewypełnione pola","Aby zapisać produkt, obowiązkowe jest wypełnienie wszystkich pól.")
    else{
    setOpenProduct(!openProduct)
    setLoading(true)
    const { error } = await supabase.from('products').insert({ 
        name: productName,
        category_id: productCategory,
        calories: productKcal,
        carbohydrates: productCarbo,
        fats: productFats,
        proteins: productProtein
    })
    if (error) Alert.alert(error.message)
    else{
      setOpenProduct(!openProduct)
      setProductName('')
      setProductCategory(7)
      setProductKcal('')
      setProductCarbo('')
      setProductFats('')
      setProductProtein('')
      getProducts()
    }
    setLoading(false)
  }}

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
  async function getCategories() {
    try {
      let query = supabase.from('foodCategories').select(`id, name`)          
      const { data, error, status } = await query

      if (error && status !== 406) {
        throw error
      }
      if (data) {
        setCategories(Object.values(data))
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } 
  }

  const deleteIngredient = id => {
    let tempArray = [...ingredients]
    tempArray=tempArray.filter(t => t.id !== id) 
    setIngredients(tempArray)
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
              <Text style={{fontSize:hp(2.3),padding:hp(1), fontWeight:'bold'}}>
                <TouchableOpacity
                  onPress={()=>deleteIngredient(item.id) }>
                <Feather name="minus-circle" size={20} color="black" /></TouchableOpacity>  {item.name} </Text>
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
                  tempArray.push({id: item.id, name: item.name, weight: text.replace(/[^0-9]/g, ''), amount: item.amount, measure:item.measure})
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
                  tempArray.push({id: item.id, name: item.name, weight: item.weight, amount: text.replace(/[^0-9]/g, ''), measure:item.measure})
                  setIngredients(tempArray)
              }}
              /></View>
              <View className="flex-row justify-end right-1/4 items-center p-1">
                <Text style={{marginRight:wp(3)}}>Miara: </Text>
              <TextInput 
                maxLength={25}
                autoCapitalize='none'
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
              <Button  titleStyle={{color:'#7F8D9A'}} buttonStyle={{backgroundColor: '#FFC6AC', borderRadius:25, width:wp(80)}} title="Dodaj składnik" onPress={() => setOpen(!openM)}/>
              </View>
      </View>
      </ScrollView>
      <Modal visible={openM}>
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
                setOpen(!openM)
                setSearch('')
                var ingredient = {id: item.id, name: item.name, weight: '0', amount: '0', measure:'g'}
                setIngredients(ingredients => [...ingredients, ingredient])
                setProductsList(productsList.filter(i => i.id !== item.id))
                }}>
                {item.name}
                </Text>
              </View>}
  />
          <View className="flex items-center" style={{paddingTop:wp(3), paddingBottom:wp(3)}}>
              <Button  titleStyle={{color:'#7F8D9A'}} buttonStyle={{backgroundColor: '#FFC6AC', borderRadius:25, width:wp(80)}} title="Dodaj produkt" onPress={() => setOpenProduct(!openProduct)}/>
              </View>
          </View>
          <Button buttonStyle={{    backgroundColor: '#b1ae95',width: wp(100),}} 
          onPress={()=> {
            setOpen(!openM) 
            setSearch('')}} 
            title='Anuluj' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
          </>
      </Modal>
      <Modal visible={openProduct}>
          <>
          <View className="flex-1 bg-[#FFF6DC]">
          <View className="flex-column">
                <View className="flex items-center p-1">
              <Input 
              label='Nazwa produktu'
                maxLength={50}
                value={productName}
                style={{width:wp(70), fontSize:hp(2)}}
                onChangeText={(text) => { setProductName(text)
              }}
              />
              <View>
              <Dropdown
      label="Kategoria"
      placeholder="Wybierz kategorię"
       options={categories.map(({ id, name }) => {
        return { label: name, value: id }
      })}
      selectedValue={productCategory}
      onValueChange={(value) =>  {setProductCategory(value)}}
      dropdownStyle={{
        borderWidth: 0, 
        width:wp(50),
        backgroundColor:'white',
      }}
    />
              </View>
              </View>
                              <View className="flex-row justify-end right-1/4 items-center p-1">
                <Text style={{marginRight:wp(3)}}>Kalorie </Text>
              <TextInput 
                maxLength={6}
                value={productKcal}
                keyboardType='numeric'
                style={{backgroundColor:'white', width:wp(20), textAlign:'center', fontSize:hp(2)}}
                onChangeText={(text) => { setProductKcal(text.replace(/[^0-9]/g, ''))
              }}
              /></View>
              <View className="flex-row justify-end right-1/4 items-center p-1">
                <Text style={{marginRight:wp(3)}}>Węglowodany </Text>
              <TextInput 
                maxLength={6}
                value={productCarbo}
                keyboardType='numeric'
                style={{backgroundColor:'white', width:wp(20), textAlign:'center', fontSize:hp(2)}}
                onChangeText={(text) => { setProductCarbo(text.replace(/[^0-9]/g, ''))
              }}
              /></View>
              <View className="flex-row justify-end right-1/4 items-center p-1">
                <Text style={{marginRight:wp(3)}}>Tłuszcze </Text>
              <TextInput 
                maxLength={6}
                value={productFats}
                keyboardType='numeric'
                style={{backgroundColor:'white', width:wp(20), textAlign:'center', fontSize:hp(2)}}
                onChangeText={(text) => { setProductFats(text.replace(/[^0-9]/g, ''))
              }}
              /></View>
              <View className="flex-row justify-end right-1/4 items-center p-1">
                <Text style={{marginRight:wp(3)}}>Białka </Text>
              <TextInput 
                maxLength={6}
                value={productProtein}
                keyboardType='numeric'
                style={{backgroundColor:'white', width:wp(20), textAlign:'center', fontSize:hp(2)}}
                onChangeText={(text) => { setProductProtein(text.replace(/[^0-9]/g, ''))
              }}
              /></View>
              </View>
          <View className="flex-row justify-center items-center" style={{paddingTop:wp(3), paddingBottom:wp(3)}}>
              <Button  titleStyle={{color:'#7F8D9A'}} buttonStyle={{backgroundColor: '#FFC6AC', borderRadius:25, width:wp(80), margin:wp(10)}} title="Dodaj produkt" 
              onPress={() => {
                addProduct()
                }}/>
              </View>
          </View>
          <Button buttonStyle={{    backgroundColor: '#b1ae95',width: wp(100),}} onPress={()=> setOpenProduct(!openProduct)} title='Anuluj' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
          </>
      </Modal>
      <View className="flex-row items-center">
        <Button buttonStyle={styles.button} onPress={()=> navigation.navigate('RecipeDetail', {...recipe})} title='Wróć' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
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