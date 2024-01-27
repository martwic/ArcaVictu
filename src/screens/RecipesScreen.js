import React, {useContext, useState, useEffect} from 'react';
import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity, Modal} from 'react-native';
import { Image, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ButtonGroup, SearchBar } from '@rneui/themed';
import { supabase } from '../constants';
import { PageContext } from '../constants/pageContext';
import { AntDesign } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';

export default function RecipesScreen(){

  const navigation = useNavigation();
  const [userId] = useContext(PageContext);
  const [recipes, setRecipes] = useState('')
  const [recipesList, setRecipesList] = useState('')
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [restrictedMeat, setRestrictedMeat] = useState([])
  const [restrictedDairy, setRestrictedDairy] = useState([])
  const [restrictedGrains, setRestrictedGrains] = useState([])
  const [openFilter, setOpenFilter] = useState(false)
  const [meat, setMeat] = useState(false)
  const [dairy, setDairy] = useState(false)
  const [grains, setGrains] = useState(false)
    useEffect(() => {
      const fetchData = async () => {
        try {
          await getRecipes();
          await getRestrictedMeat();
          await getRestrictedDairy();
          await getRestrictedGrains();
          await getPreferences();
        } catch (error) {
          console.error('Wystąpił błąd:', error);
        }
      };
    
      fetchData();
    }, []); 
    useEffect(() => {
      if (recipes !== '') {
      filter(selectedIndex, search, meat, dairy, grains)}
    }, [selectedIndex, search, meat, dairy, grains, recipes]); 
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        getRecipes()
      });
      return unsubscribe;
    }, [navigation]);
    async function getRestrictedMeat(){
      const { data} = await supabase.rpc('get_recipes_ids_by_category', {category:3})
      var temp = []
      Object.values(data).forEach((val) => {
        temp.push(val.id)
        })
        setRestrictedMeat(temp)
    }
    async function getPreferences(){
      const { data, error } = await supabase
        .from('profiles')
        .select('eatMeat,eatDairy,eatGrains')
        .eq('id', userId).single()
        if(error){
          Alert.alert(error.message);
        }
        if(data){
          setMeat((data.eatMeat)?false:true)
          setDairy((data.eatDairy)?false:true)
          setGrains((data.eatGrains)?false:true)
        }
    }
    async function getRestrictedDairy(){
      const { data} = await supabase.rpc('get_recipes_ids_by_category', {category:4})
      var temp = []
      Object.values(data).forEach((val) => {
        temp.push(val.id)
        })
        setRestrictedDairy(temp)
    }
    async function getRestrictedGrains(){
      const { data} = await supabase.rpc('get_recipes_ids_by_category', {category:1})
      var temp = []
      Object.values(data).forEach((val) => {
        temp.push(val.id)
        })
        setRestrictedGrains(temp)
    }


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

const filter = (index, search, meat, dairy, grains)=>{
  var restricted = []
  if(meat) restricted = [...restricted, ...restrictedMeat]
  if(dairy) restricted = [...restricted, ...restrictedDairy]
  if(grains) restricted = [...restricted, ...restrictedGrains]
  let filtered = recipes
  if(search.length>2){
    filtered = filtered.filter((recipe)=>recipe.name.toLowerCase().includes(search.toLowerCase()))
  }
  if(index==1){
    filtered = filtered.filter((recipe)=>recipe.account_id==userId)
  }
  else{
    filtered = filtered.filter((recipe)=>(recipe.account_id==userId || recipe.account_id==null))
  }
  filtered= filtered.filter((recipe)=>!restricted.includes(recipe.id))
  setRecipesList(filtered)
}

    return (
        <SafeAreaView  className="flex-1 justify-center items-center bg-[#FFF6DC]">
        <View className="bg-[#FFC6AC] w-full p-2 items-center">
            <Text className="font-['Gothic']" style={{fontSize:hp(5)}}>Przepisy</Text>
        </View>
        <View className="items-center justify-center">
        <View className="flex-row items-center">
                <SearchBar  onChangeText={
                  (text) => {setSearch(text)
                    filter(selectedIndex, text, meat, dairy, grains)
                    }} value={search} round containerStyle={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
              <TouchableOpacity onPress={()=>setOpenFilter(!openFilter)}><AntDesign name="filter" size={24} color={"grey"} /></TouchableOpacity>
            </View>
            <ButtonGroup 
            buttons={['Wszystkie',  'Własne']}
            selectedIndex={selectedIndex}
            selectedButtonStyle={{backgroundColor:'#b1ae95'}}
            onPress={(value) => {
              setSelectedIndex(value);
              filter(value, search, meat, dairy, grains);
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
        <Modal transparent={true} visible={openFilter}>
            <View className="bg-white w-1/2 h-1/3 self-end mt-16 p-3" style={{borderColor:'#b1ae95', borderWidth:wp(0.2)}}>
              <TouchableOpacity onPress={()=>setOpenFilter(!openFilter)} className="self-end p-2">
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
              <Text style={{fontSize:hp(2.5), padding:hp(2)}}>Eliminuj: </Text>
              <View className="p-2 flex-row">
                <Checkbox
                  disabled={false}
                  color={meat ? '#b1ae95' : undefined}
                  value={meat}
                  onValueChange={(val) => {
                  setMeat(!meat)
                  filter(selectedIndex, search, val,dairy, grains)
                  }}/>
                <Text className="pl-2">Mięso</Text>
              </View>
              <View className="p-2 flex-row">
                <Checkbox
                  disabled={false}
                  color={dairy ? '#b1ae95' : undefined}
                  value={dairy}
                  onValueChange={(val) => {
                  setDairy(!dairy)
                  filter(selectedIndex, search, meat, val, grains)
                  }}/>
                <Text className="pl-2">Nabiał</Text>
              </View>
              <View className="p-2 flex-row">
                <Checkbox
                  disabled={false}
                  color={grains ? '#b1ae95' : undefined}
                  value={grains}
                  onValueChange={(val) => {
                  setGrains(!grains)
                  filter(selectedIndex, search, meat,dairy, val)
                  }}/>
                <Text className="pl-2">Zboża</Text>
              </View>

            </View>
        </Modal>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#b1ae95',
    width: wp(100),
  },
})