import React, {useContext, useEffect, useState} from 'react';
import { View, Text, ScrollView, BackHandler, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { PageContext } from '../constants/pageContext';
import { supabase } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { Button} from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen(){
    const navigation = useNavigation();
    const[dishesList, setDishes]=useState('');
    const[mealsList, setMeals]=useState('');
    const[openIngredients, setOpenIngredients]=useState(false);
    const[openCook, setOpenCook]=useState(false);
    const [userId] = useContext(PageContext);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          getMeals()
          getDishes()
        });
        return unsubscribe;
      }, [navigation]);
    BackHandler.addEventListener("hardwareBackPress", ()=>true)
    var date = new Date;
    var days = ['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota'];
    var day = days[date.getDay()]

    const getCurrentDate=()=>{
 
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        return(month>9 ? date + '.' + month : date + '.0' + month );
  }
  
  const getCurrentDateDatabase=()=>{
 
    var day = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    month = month>9 ? month : '0' + month;
    day = day>9 ? day : '0' + day;
    return( year+'-'+month+'-'+day);
}
    const getMeals = async ()=>{
        try {
            const { data, error, status } = await supabase.from('meals')
            .select(`id, dishes(account_id, recipe_id, recipes(name)), consumption_date, servings`)
            .eq('consumption_date',getCurrentDateDatabase())
            .eq('dishes.account_id',userId)
            if (error && status !== 406) {
              throw error
            }
            if (data) {
              setMeals(data)
            }
          } catch (error) {
            if (error instanceof Error) {
              Alert.alert(error.message)
            }
          } 
    }
    const getDishes = async ()=>{
        try {
            const { data, error, status } = await supabase.from('dishesview')
            .select('name, preparation_date, sum, account_id, preparationTime, waitingTime')
            .eq('preparation_date',getCurrentDateDatabase())
            .eq('account_id',userId)
            if (error && status !== 406) {
              throw error
            }
            if (data) {
              setDishes(data)
            }
          } catch (error) {
            if (error instanceof Error) {
              Alert.alert(error.message)
            }
          } 
    }
    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-[#FFF6DC]">
                <View className="bg-[#FFC6AC] w-full p-2 items-center">
                    <Text className="font-['Gothic']" style={{fontSize:hp(5)}}>{getCurrentDate()} {day}</Text>
                </View>
                <View className="flex-1 p-2">
                    <Text className="font-['Gothic'] font-bold p-3" style={{fontSize:hp(3), textAlign:'center'}}>Jadłospis</Text>
                    <View>
                    <FlatList
                        ListEmptyComponent={null}
                        scrollEnabled
                        data={mealsList}
                        keyExtractor={item => item.id} 
                        renderItem={({item}) => 
                        <>
                            <Text style={{fontSize:hp(2.7), padding:hp(0.5), textAlign:'center'}} onPress={()=> navigation.navigate('RecipeDetail', {...item})}>
                            {item.dishes.recipes.name}
                            </Text>
                            <Text style={{fontSize:hp(2.5), fontStyle:'italic',padding:hp(0.5), textAlign:'center'}}><MaterialCommunityIcons name="bowl-mix-outline" size={24} color="black" />: {item.servings}</Text>
                        </>//id, dishes(recipes(id, name), account_id), consumption_date, servings
                        }
                    />
                    </View>
                </View>
                                <View className="border-b-2 border-[#FFC6AC] w-4/5"/>
                <View className="flex-1">
                    <Text className="font-['Gothic'] font-bold p-3" style={{fontSize:hp(3), textAlign:'center'}}>Gotowanie</Text>
                    <View className="flex-1 p-2" style={{width:wp(100)}}>
                    <FlatList
                        ListEmptyComponent={null}
                        scrollEnabled
                        data={dishesList}
                        keyExtractor={item => item.id} 
                        renderItem={({item}) => 
                        <>
                        <View className="p-3">
                            <Text style={{fontSize:hp(2.7),padding:hp(0.5),textAlign:'center'}} onPress={()=> navigation.navigate('RecipeDetail', {...item})}>
                            {item.name}
                            </Text>
                            <View className="flex-row justify-center">
                            <Text style={{fontSize:hp(2.5),padding:hp(1.5), textAlign:'center'}}><MaterialCommunityIcons name="bowl-mix-outline" size={24} color="black" />: {item.sum}</Text>
                            <Text style={{fontSize:hp(2.5), padding:hp(1.5),textAlign:'center'}}><Ionicons name="md-timer-outline" size={24} color="black" />: {item.preparationTime}' + {item.waitingTime}'</Text>
                            </View>
                            </View>
                        </>//id, dishes(recipes(id, name), account_id), consumption_date, servings
                        }
                    />          
                                </View>
                </View>
                <View className="flex-row items-center">
                <Button buttonStyle={styles.button} onPress={()=>setOpenCook(!openCook)} title='Gotuj' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
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