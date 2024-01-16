import React, { useState, useEffect, useContext } from 'react';
import { View, Text,  BackHandler, StyleSheet, Alert, FlatList, TouchableOpacity, Modal} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ButtonGroup, SearchBar } from '@rneui/themed';
import { supabase } from '../constants';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import InputSpinner from "react-native-input-spinner";
import { ScrollView } from 'react-native-virtualized-view'
import { PageContext } from '../constants/pageContext';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

export default function RecipeDetailScreen(props) {
    let item = props.route.params;
    const [userId] = useContext(PageContext);
    const navigation = useNavigation();
    const [ingredients, setIngredients] = useState(null);
    const [open, setOpen] = useState(false);
    const [portions, setPortions] = useState(4)
    useEffect(()=>{
        getRecipeData(item.id);
    },[])
    const getRecipeData = async ()=>{
        try {
            const { data, error, status } = await supabase.from('ingredients')
            .select(`id, recipes(name, preparationTime, directions, account_id), product_id, products(name),weight, amount, measure`)
            .eq('recipe_id',item.id)
            if (error && status !== 406) {
              throw error
            }
            if (data) {
              setIngredients(data)
            }
          } catch (error) {
            if (error instanceof Error) {
              Alert.alert(error.message)
            }
          } 
    }
    const deleteRecipe = async ()=>{
      try {
          const { error} = await supabase.from('recipes')
          .delete()
          .eq('id',item.id)
          if (error) {
            throw error
          }
          else{
            try {
              const { error2} = await supabase.from('ingredients')
              .delete()
              .eq('recipe_id',item.id)
              if (error2) {
                throw error2
              }
              else{
                setOpen(!open)
                navigation.navigate('Recipes')
              }
            } catch (error2) {
              if (error instanceof Error) {
                Alert.alert(error.message)
                setOpen(false)
              }
            } 
          }
        } catch (error) {
          if (error instanceof Error) {
            Alert.alert(error.message)
            setOpen(false)
          }
        } 
  }
    return (
        <SafeAreaView  className="flex-1 justify-center items-center bg-[#FFF6DC]">
        <View className="bg-[#FFC6AC] w-full p-2 items-center">
            <Text className="font-['Gothic']" style={{fontSize:hp(5)}}>{item.name}</Text>
        </View>
        <ScrollView className="flex-1 p-2">

            <View className="items-center justify-center flex-row">
            <Text style={{fontSize:hp(2.5), padding:hp(2.5)}}><Feather name="clock" size={24} color="black" /> {item.preparationTime}' + {item.waitingTime}'</Text>
            <Text style={{fontSize:hp(2.5), padding:hp(2.5)}}>
            <InputSpinner height={hp(5)}  inputStyle={{fontSize:hp(2.5)}} 
            color='#FFC6AC'
            max={50}
            min={1}
            step={1}
            value={portions}
            onChange={(num) => {
              setPortions(num);
            }}
            /></Text>
            { (item.account_id==userId) && 
            <>
            <TouchableOpacity onPress={()=> navigation.navigate('EditRecipe', {recipe: item, ingredientsList:ingredients})}><Text style={{fontSize:hp(2.5), padding:hp(2.5)}}><Feather name="edit" size={24} color="black" /></Text></TouchableOpacity>
            <TouchableOpacity onPress={()=> setOpen(!open)}><Text style={{fontSize:hp(2.5), padding:hp(2.5)}}><AntDesign name="delete" size={24} color="black" /></Text></TouchableOpacity>
            </>}
            </View>
            <View>
            <Text className="font-['Gothic'] font-bold" style={{fontSize:hp(3), padding:hp(1)}}>Składniki:</Text>
            <FlatList
            ListEmptyComponent={null}
            data={ingredients}
            keyExtractor={(item, index) => {
              return item.id;
            }}
            renderItem={({item}) => <View className="flex-row"><Entypo name="dot-single" size={24} color="black" /><Text style={{fontSize:hp(2.2)}}>{item.products.name} - {item.amount*portions} {item.measure=='ml' || item.measure=='g'? '': "x "}{item.measure}</Text></View>}
            />
            <Text className="font-['Gothic'] font-bold" style={{fontSize:hp(3), padding:hp(1)}}>Opis:</Text>
            <Text style={{fontSize:hp(2.2), padding:hp(1),paddingBottom:hp(4), textAlign:'justify'}}>{item.directions}</Text>
            </View>
        </ScrollView>
        <View className="flex-row items-center">
                <Button buttonStyle={styles.button} onPress={()=> navigation.navigate('Recipes')} title='Wróć' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
                <View className="bg-black" style={{width:0.2}}></View>
                <Button buttonStyle={styles.button} onPress={()=> navigation.navigate('AddToPlanner',{recipeId: item.id})} title={'Dodaj do planera'} />
            </View>
            <Modal visible={open}>
              <View className="flex-1 justify-center bg-[#FFF6DC]" >
              <Text className="font-bold p-3" style={{fontSize:hp(5), textAlign:'center'}}>Czy na pewno chcesz usunąć przepis? </Text>
              <Text className="p-3" style={{fontSize:hp(3), textAlign:'center'}}>Ta operacja jest nieodwracalna.</Text>
              <View className="flex items-center" style={{paddingTop:wp(10), paddingBottom:wp(3)}}>
              <Button  titleStyle={{color:'#7F8D9A'}} buttonStyle={{backgroundColor: '#FFC6AC', borderRadius:25, width:wp(80), padding:wp(5)}} title="USUŃ" onPress={() => deleteRecipe()}/>
              </View>
              </View>
            <Button titleStyle={{fontSize:hp(5)}} buttonStyle={{backgroundColor: '#b1ae95',width: wp(100), height:hp(30)}} onPress={()=> setOpen(!open)} title='Anuluj' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
            </Modal>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#b1ae95',
    width: wp(49.9),
  },
})