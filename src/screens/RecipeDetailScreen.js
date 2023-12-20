import React from 'react';
import { View, Text, ScrollView, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ButtonGroup, SearchBar } from '@rneui/themed';
import { AntDesign } from '@expo/vector-icons';
import Products from '../../model/Products';
import { databaseWatermelon } from '../../model/database';
import { useDatabase } from '@nozbe/watermelondb/react'
import { FlatList } from 'react-native';
import { supabase } from '../constants';
import { useState } from 'react';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-elements';

export default function RecipeDetailScreen(props) {
    let item = props.route.params;
    const navigation = useNavigation();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        getRecipeData(item.id);
    },[])
    const getRecipeData = async ()=>{
        try {
            const { data, error, status } = await supabase.from('ingredients')
            .select(`recipes(name, preparationTime, directions),products(name), weight`)
            .eq('recipe_id',item.id)
            if (error && status !== 406) {
              throw error
            }
            if (data) {
              setRecipe(data)
            }
          } catch (error) {
            if (error instanceof Error) {
              Alert.alert(error.message)
            }
          } 
    }

    //Alert.alert(JSON.stringify(recipe));
    //const productsCollection = await supabase.from('products').select('*')
    return (
        <SafeAreaView  className="flex-1 justify-center items-center bg-[#FFF6DC]">
        <View className="bg-[#FFC6AC] w-full p-2 items-center">
            <Text className="font-['Gothic']" style={{fontSize:hp(5)}}>Przepisy</Text>
        </View>
        <View className="items-center justify-center">
        <View className="flex-row items-center">
                <Button onPress={()=> navigation.navigate('Recipes')} title='Wróć' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
            </View>
        </View>
        <View className="flex-1">
            <View>
            <Text className="font-['Gothic'] font-bold" style={{fontSize:hp(3)}}>{item.name}</Text>
            <Text>Czas przygotowania: {item.preparationTime}'</Text>
            <Text className="font-['Gothic'] font-bold" style={{fontSize:hp(2)}}>Składniki:</Text>
            <FlatList
            data={recipe}
            keyExtractor={item => item.id} 
            renderItem={({item}) => <Text>{item.products.name}</Text>}
            />
            <Text className="font-['Gothic'] font-bold" style={{fontSize:hp(2)}}>Opis:</Text>
            <Text>{item.directions}</Text>
            </View>

        </View>
    </SafeAreaView>
    )
}