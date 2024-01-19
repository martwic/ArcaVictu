import React, {useContext, useEffect, useState} from 'react';
import { View, Text, ScrollView, BackHandler, FlatList, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { PageContext } from '../constants/pageContext';
import { supabase } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { Button} from 'react-native-elements'
import { Feather } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

export default function HomeScreen(){
    const navigation = useNavigation();
    const[dishesList, setDishes]=useState('');
    const[mealsList, setMeals]=useState('');
    const[cooking, setCooking]=useState('');
    const[time, setTime]=useState('0');
    const[maxTime, setMaxTime]=useState('0');
    const[ingredientsList, setIngredientsList]=useState([]);
    const[openCook, setOpenCook]=useState(false);
    const [userId] = useContext(PageContext);
    const [todaysRecipes, setTodaysRecipes] = useState([])
    var todaysProducts=[];
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          getMeals()
          getDishes()
          getTodaysCooking()
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

  const getTodaysCooking = async ()=>{
    try {
      const { data, error} = await supabase.from('cookingview')
      .select(`productid, servings, recipename, productname, preparationTime,waitingTime, directions, account_id, preparation_date, weight`)
      .eq('preparation_date',getCurrentDateDatabase())
      .eq('account_id',userId)
      if (error && status !== 406) {
        throw error
      }
      if (data) {
        setCooking(Object.values(data))
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } 
  }

    const getMeals = async ()=>{
        try {
            const { data, error, status } = await supabase.from('meals')
            .select(`id, dishes!inner(account_id, recipe_id, recipes(name)), consumption_date, servings`)
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
    const mapProducts = ()=>{
      cooking.reduce(function(res, value) {
        if (!res[value.productid]) {
          res[value.productid] = { productid: value.productid, productname: value.productname, weight: 0 };
          todaysProducts.push(res[value.productid])
        }
        res[value.productid].weight += parseFloat(value.weight)*parseFloat(value.servings);
        return res;
      }, {});
      setIngredientsList(todaysProducts)
      var temp = 0
      var tempMax = 0
      Object.values(dishesList).forEach((val) => {
        temp = temp+parseFloat(val.preparationTime)
        tempMax=((tempMax>parseFloat(val.waitingTime)) ? tempMax : parseFloat(val.waitingTime))
        setTime(temp)
        setMaxTime(tempMax)
        })
      setIngredientsList(todaysProducts)
    }
    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-[#FFF6DC]">
                <View className="bg-[#FFC6AC] w-full p-2 items-center">
                    <Text className="font-['Gothic']" style={{fontSize:hp(5)}}>{getCurrentDate()} {day}</Text>
                </View>
                <View className="flex-1 p-2" >
                    <Text className="font-['Gothic'] font-bold p-3" style={{fontSize:hp(3), textAlign:'center'}}>Jadłospis</Text>
                    <View className="flex-1 p-2" style={{width:wp(100)}}>
                    <FlatList
                        ListEmptyComponent={null}
                        scrollEnabled
                        data={mealsList}
                        keyExtractor={item => item.id} 
                        renderItem={({item}) => 
                        <>
                        <View className="p-2 m-1 bg-white flex-row" style={{borderRadius:10, justifyContent:'space-between'}}>
                            <Text style={{fontSize:hp(2.7), padding:hp(0.5)}}>
                            {item.dishes.recipes.name}
                            </Text>
                            <Text style={{fontSize:hp(2.5),padding:hp(0.5)}}>|  <MaterialCommunityIcons name="bowl-mix-outline" size={20} color="black" />: {item.servings}</Text>
                        </View></>
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
                        keyExtractor={item => item.name} 
                        renderItem={({item}) => 
                        <>
                        <View className="p-2 m-1 bg-white" style={{borderRadius:10}}>
                            <Text style={{fontSize:hp(2.7),padding:hp(0.5)}}>
                            {item.name}
                            </Text>
                            <View className="flex-row justify-end" style={{}}>
                            <Text style={{fontSize:hp(2.5),padding:hp(1)}}>|  <MaterialCommunityIcons name="bowl-mix-outline" size={20} color="black" />: {item.sum}</Text>
                            <Text style={{fontSize:hp(2.5),padding:hp(1)}}>|</Text>
                            <Text style={{fontSize:hp(2.5), padding:hp(1)}}><Feather name="clock" size={20} color="black" />: {item.preparationTime}' 
                            {(item.waitingTime>0) &&
                            <>+ {item.waitingTime}'</>}
                            </Text>
                            </View>
                            </View>
                        </>
                        }
                    />          
                                </View>
                </View>
                {!dishesList &&
                <View className="flex-row items-center">
                <Button buttonStyle={styles.button} 
                onPress={()=>{
                  mapProducts()
                  setOpenCook(!openCook)
                }} 
                title='Gotuj' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
            </View>}
            <Modal visible={openCook}>
          <>
          <View className="flex-1 bg-[#FFF6DC]">
            <Text className="p-3">
            <Text className="font-['Gothic'] font-bold" style={{fontSize:hp(3)}}>Przewidywany czas przygotowywania posiłków: </Text>
            <Text style={{fontSize:hp(3)}} >{time}'</Text>
            </Text>
            { maxTime>0 &&
            <Text className="p-3">
            <Text className="font-['Gothic'] font-bold" style={{fontSize:hp(3)}}>Najdłuższy czas oczekiwania: </Text>
            <Text style={{fontSize:hp(3)}} >{maxTime}'</Text>
            </Text>}
            <Text className="font-['Gothic'] font-bold p-3" style={{fontSize:hp(3)}}>Składniki na dziś:</Text>
            <View className="px-3">
            <FlatList
                        ListEmptyComponent={null}
                        scrollEnabled
                        data={ingredientsList.sort((a, b) =>a.weight>b.weight ? -1 : 1)}
                        keyExtractor={item => item.productid} 
                        renderItem={({item}) => 
                        <>
                        <View className="flex-row" style={{padding:hp(0.2)}} >
                          <Entypo name="dot-single" size={24} color="black" />
                          <Text style={{fontSize:hp(2.5)}}>{item.productname} - {item.weight} g</Text>
                        </View>
                        </>
                        }
                    /></View>  
            <View>
              <FlatList
                ListEmptyComponent={null}
                scrollEnabled
                data={ingredientsList.sort((a, b) =>a.weight>b.weight ? -1 : 1)}
                                      keyExtractor={item => item.productid} 
              
              />
            </View>
            </View>
          <Button buttonStyle={{    backgroundColor: '#b1ae95',width: wp(100),}} onPress={()=> setOpenCook(!openCook)} title='Zamknij' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
          </>
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