import React, {useContext, useState, useEffect} from 'react';
import { View, Text, StyleSheet, Alert, FlatList  } from 'react-native';
import { Input, Image, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ButtonGroup, SearchBar } from '@rneui/themed';
import { AntDesign } from '@expo/vector-icons';
import { supabase } from '../constants';
import { PageContext } from '../constants/pageContext';


export default function RecipesScreen(){

  const navigation = useNavigation();
  //const [session, setSession] = useState(null)
  //const [userId, setUserId] = useState(null)
  const [userId] = useContext(PageContext);
  const [recipes, setRecipes] = useState('')
  const [recipesList, setRecipesList] = useState('')
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
    useEffect(() => {
      setSelectedIndex(0)
      getRecipes()
    }, []); 
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        getRecipes()
      });
      return unsubscribe;
    }, [navigation]);

    async function getRecipes() {
        try {
          let query = supabase.from('recipes')
          .select(`id, name, preparationTime, waitingTime, durability, directions, account_id`)
          .or('account_id.eq.'+userId+',account_id.is.null')
          .order('id')        
          const { data, error, status } = await query

          if (error && status !== 406) {
            throw error
          }
          if (data) {
            setRecipes(data)
            setRecipesList(data)
          }
        } catch (error) {
          if (error instanceof Error) {
            Alert.alert(error.message)
          }
        } 
      }

      const filterOwns = (item) => {
        if(item==1){
          let filtered = recipes.filter((recipe)=>recipe.account_id==userId)
          setRecipesList(filtered)
          //setRecipesList(null)
        }
        else{
          let filtered = recipes.filter((recipe)=>(recipe.account_id==userId || recipe.account_id==null))
          setRecipesList(filtered)
        }
      }
      const filterData = (item) => {
        if(item.length>2){
          let filtered = recipes.filter((recipe)=>recipe.name.toLowerCase().includes(item.toLowerCase()))
          setRecipesList(filtered)
        }
        else{
          setRecipesList(recipes)
        }
      }

    //Alert.alert(JSON.stringify(productsCollection));
    //const productsCollection = await supabase.from('products').select('*')
    //<AntDesign name="filter" color={"grey"} size={hp(3.5)}/>
    return (
        <SafeAreaView  className="flex-1 justify-center items-center bg-[#FFF6DC]">
        <View className="bg-[#FFC6AC] w-full p-2 items-center">
            <Text className="font-['Gothic']" style={{fontSize:hp(5)}}>Przepisy</Text>
        </View>
        <View className="items-center justify-center">
        <View className="flex-row items-center">
                <SearchBar  onChangeText={
                  (text) => {setSearch(text)
                    filterData(text)
                    }} value={search} round containerStyle={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
            </View>
            <ButtonGroup 
            buttons={['Wszystkie',  'Własne']}
            selectedIndex={selectedIndex}
            selectedButtonStyle={{backgroundColor:'#b1ae95'}}
            onPress={(value) => {
              setSelectedIndex(value);
              filterOwns(value);
            }}
            //buttons={['Wszystkie', 'Ulubione', 'Własne']}<Image style={{height:hp(20)}} onPress={()=> navigation.navigate('RecipeDetail', {...item})} source={{uri: `https://gqslyondgncsrrryejpi.supabase.co/storage/v1/render/image/public/recipes/`+item.id+`.jpg`}}/>
            />
            
        </View>
        <View className="flex-1 items-center justify-center">
        <FlatList
            numColumns={2}
            scrollEnabled
            data={recipesList}
            keyExtractor={item => item.id} 
            renderItem={({item}) => 
            <View style={{backgroundColor:'white', margin:hp(1), width: wp(43)}}>
              
              <Image style={{height:hp(20)}} onPress={()=> navigation.navigate('RecipeDetail', {...item})} source={{uri: `https://gqslyondgncsrrryejpi.supabase.co/storage/v1/object/public/recipes/`+item.id+`.jpg`}}/>
              <Text style={{fontSize:hp(2.3),padding:hp(0.5), textAlign:'center'}} onPress={()=> navigation.navigate('RecipeDetail', {...item})}>
                {item.name}
                </Text>
              </View>}
  />
          <View className="flex-row items-center">
                <Button buttonStyle={styles.button} onPress={()=> navigation.navigate('AddRecipe')} title='Dodaj przepis' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
            </View>
        </View>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#b1ae95',
    width: wp(100),
  },
})