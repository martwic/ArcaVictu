import React, {useState, useContext} from 'react';
import { View, Text, ScrollView, BackHandler, StyleSheet, Modal, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import InputSpinner from "react-native-input-spinner";
import { PageContext } from '../constants/pageContext';
import { supabase } from '../constants';

export default function AddToPlannerScreen({route}){
    BackHandler.addEventListener("hardwareBackPress", ()=>true)
    const { recipeId} = route.params;
    const [userId] = useContext(PageContext);
    const navigation = useNavigation();
    const[openMultiple, setOpenMultiple] = useState(false)
    const [open, setOpen] = useState(true);
    const [selected, setSelected] = useState([]);
    const [dishDate, setDishDate] = useState(undefined)
    const [meals, setMeals] = useState([])
    let dates = {};
    let mealsToDatabase = [];
    selected.forEach((val) => {
        dates[val] = {selected: true,  selectedColor:'#FFC6AC'};
        });
//disableTouchEvent: true,
        LocaleConfig.locales.en = LocaleConfig.locales[''];
        LocaleConfig.locales.pl = {
          monthNames: [
            'Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień',
          ],
          dayNames: [
            'Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota','Niedziela',
          ],
          dayNamesShort: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'],
        };
        LocaleConfig.defaultLocale = 'pl';


        async function addDishAndMeals() {
            const { data, error } = await supabase.from('dishes').insert({ 
                recipe_id:recipeId,
                preparation_date:dishDate,
                account_id: userId,
            }).select().single()
            if (error) Alert.alert(error.message)
            else{
                meals.forEach((val) => {
                    mealsToDatabase.push({dish_id:data.id,  consumption_date:val.date, servings:val.portions});
                    });
                }
                const { error2 } = await supabase.from('meals').insert(
                    mealsToDatabase
                )
if (error2) Alert.alert(error.message)
else{
    Alert.alert("Dodano pomyślnie")
navigation.navigate('Recipes');
}
          }
    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-[#FFF6DC]">
            <ScrollView className="flex-1 p-2">
                <Text className="font-['Gothic'] font-bold" style={{fontSize:hp(4)}}>Wybierz daty dla gotowania i posiłków</Text>
                <Button  buttonStyle={styles.button} onPress={()=> setOpen(!open)} title='Wybierz datę spożywania' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
                <Modal 
                //animationType='slide'
                //transparent={true}
                visible={open}
                >
                    <View className="flex-1 bg-[#FFF6DC]">
                    <Text className="font-['Gothic'] font-bold p-5" style={{fontSize:hp(4)}}>Wybierz datę gotowania</Text>
                    <Calendar
                    theme={{calendarBackground: 'transparent', todayTextColor:'#b1ae95', arrowColor:'#b1ae95'}}
                    onDayPress={day => {
                        setDishDate(day.dateString);
                        setOpen(!open);
                        setOpenMultiple(!openMultiple);
                    }}
                    />
                    <Button  buttonStyle={styles.button} onPress={()=> setOpen(!open)} title='Anuluj' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
               
                    </View>
                 </Modal>
                <Modal
                //transparent={true}
                visible={openMultiple}
                >
                    <View className="flex-1 bg-[#FFF6DC]">
                    <Text className="font-['Gothic'] font-bold p-5" style={{fontSize:hp(4)}}>Wybierz daty spożywania posiłków</Text>
                    <Calendar
                    theme={{todayTextColor:'#FFC6AC', calendarBackground:'#FFF6DC',arrowColor:'#b1ae95'}}
                    minDate={dishDate}
                    onDayPress={day => {
                        if(meals.some(item => day.dateString===item.date)){
                            setMeals(meals.filter(item => item.date !== day.dateString))
                            setSelected(selected.filter(item => item !== day.dateString))
                        }
                        else{
                        //mealsDates.filter((_, dateString) => dateString !== item.dateString)
                        var meal = {date: day.dateString, portions: 1}
                        setMeals(meals => [...meals, meal])
                        setSelected(selected => [...selected, day.dateString])}
                    }}
                    markedDates={dates}
                    />
                    <FlatList className=""
                    ListEmptyComponent={null}
                    data={meals.sort((a, b) =>a.date>b.date ? 1 : -1)}
                    keyExtractor={(item) => {
                    return item.date;
                    }}
                    renderItem={({item}) => 
                        <View className="p-3">
                            <Text //onPress={(mealsDates) => mealsDates.filter((_, dateString) => dateString !== item.dateString)} 
                            className="font-bold"
                            style={{fontSize:hp(2.5), textAlign:'center'}}>{item.date}</Text>
                            <InputSpinner height={hp(4)}  inputStyle={{fontSize:hp(2.2)}} 
                            color='#FFC6AC'
                            max={50}
                            min={1}
                            step={1}
                            value={item.portions}
                            onChange={(num) => {
                                let tempArray = [...meals]
                                tempArray=tempArray.filter(t => t.date !== item.date)
                                tempArray.push({date: item.date, portions: num})
                                setMeals(tempArray)
                            }}
                            />
                        </View>
                    }
                    />
                          <View className="items-center p-5">
                    <Button  buttonStyle={{backgroundColor: '#b1ae95', width:wp(80)}} onPress={addDishAndMeals} title='Dodaj' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
                    </View>
                    <Button  buttonStyle={styles.button} onPress={()=> setOpenMultiple(!openMultiple)} title='Zamknij' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
                    </View>
                </Modal>
            </ScrollView>
            <View className="flex-row items-center">
                <Button  buttonStyle={styles.button} onPress={()=> navigation.navigate('Recipes')} title='Wróć' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
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