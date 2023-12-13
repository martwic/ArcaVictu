import React from 'react';
import { View, Text, ScrollView, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ButtonGroup, SearchBar } from '@rneui/themed';
import { AntDesign } from '@expo/vector-icons';
import Products from '../../model/Products';
//import { databaseWatermelon } from '../../model/database';
import { useDatabase } from '@nozbe/watermelondb/react'
import { FlatList } from 'react-native';
import { supabase } from '../constants';

export default function RecipesScreen(){
    const database = useDatabase()
    //const productsCollection = database.read('products')
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
            buttons={['Wszystkie', 'Ulubione', 'Własne']}
            />
            
        </View>
        <View className="flex-1 items-center justify-center">
        <View>

            </View>
        </View>
    </SafeAreaView>
    )
}