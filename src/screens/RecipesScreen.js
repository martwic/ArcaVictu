import React from 'react';
import { View, Text, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ButtonGroup, SearchBar } from '@rneui/themed';
import { AntDesign } from '@expo/vector-icons';
import Products from '../../model/Products';
//import { databaseWatermelon } from '../../model/database';
//import { useDatabase } from '@nozbe/watermelondb/react'
import { FlatList } from 'react-native';
import { supabase } from '../constants';
import { useState } from 'react';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { Input, Image } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-virtualized-view'

export default function RecipesScreen(){
  const navigation = useNavigation();
  const [session, setSession] = useState(null)
  const [userId, setUserId] = useState(null)
  const [recipes, setRecipes] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        setUserId(session.user.id)
      })
      getProducts()
      })

    async function getProducts() {
        try {
          let query = supabase.from('recipes').select(`*`)
          if(selectedIndex==1){
            query=query.eq('account_id', userId)
          }
          
          const { data, error, status } = await query

          if (error && status !== 406) {
            throw error
          }
          if (data) {
            setRecipes(data)
          }
        } catch (error) {
          if (error instanceof Error) {
            Alert.alert(error.message)
          }
        } 
      }

    //Alert.alert(JSON.stringify(productsCollection));
    //const productsCollection = await supabase.from('products').select('*')
    return (
        <SafeAreaView  className="flex-1 justify-center items-center bg-[#FFF6DC]">
        <View className="bg-[#FFC6AC] w-full p-2 items-center">
            <Text className="font-['Gothic']" style={{fontSize:hp(5)}}>Przepisy</Text>
        </View>
        <View className="items-center justify-center">
        <View className="flex-row items-center">
                <SearchBar round containerStyle={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
                <AntDesign name="filter" color={"grey"} size={hp(3.5)}/>
            </View>
            <ButtonGroup 
            buttons={['Wszystkie',  'Własne']}
            selectedIndex={selectedIndex}
            onPress={(value) => {
              setSelectedIndex(value);
              getProducts()
            }}
            //buttons={['Wszystkie', 'Ulubione', 'Własne']}
            />
            
        </View>
        <View className="flex-1 items-center justify-center">
        <FlatList
            numColumns={2}
            scrollEnabled
            data={recipes}
            keyExtractor={item => item.id} 
            renderItem={({item}) => 
            <View style={{backgroundColor:'white', margin:hp(1), width: wp(43)}}>
              <Image style={{height:hp(20)}} onPress={()=> navigation.navigate('RecipeDetail', {...item})} source={{uri: `https://gqslyondgncsrrryejpi.supabase.co/storage/v1/render/image/public/recipes/`+item.id+`.jpg`}}/>
              <Text style={{fontSize:hp(2.3),padding:hp(0.5), textAlign:'center'}} onPress={()=> navigation.navigate('RecipeDetail', {...item})}>
                {item.name}
                </Text>
              </View>}
  />
        </View>
    </SafeAreaView>
    )
}