import React, {useState} from 'react';
import { View, Text, ScrollView, BackHandler, StyleSheet, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import InputSpinner from "react-native-input-spinner";

export default function AddToPlannerScreen(){
    BackHandler.addEventListener("hardwareBackPress", ()=>true)
    const navigation = useNavigation();

    const[openMultiple, setOpenMultiple] = useState(false)
    const [open, setOpen] = useState(false);
    
    const [selected, setSelected] = useState([]);
    const [dishDate, setDishDate] = useState(undefined)
    const [meals, setMeals] = useState([])
    let dates = {};
    selected.forEach((val) => {
        dates[val] = {selected: true, disableTouchEvent: true, selectedColor:'#FFC6AC'};
        });

    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-[#FFF6DC]">
            <ScrollView className="flex-1 p-2">
                <Text className="font-['Gothic'] font-bold" style={{fontSize:hp(4)}}>Wybierz daty dla gotowania i posiłków</Text>
                <Button  buttonStyle={styles.button} onPress={()=> setOpen(!open)} title='Wybierz datę spożywania' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
                <Modal className="bg-[#FFF6DC]"
                //animationType='slide'
                //transparent={true}
                visible={open}
                >
                    <Text className="font-['Gothic'] font-bold" style={{fontSize:hp(4)}}>Wybierz datę gotowania</Text>
                    <Calendar
                    theme={{todayTextColor:'black', backgroundColor:'#FFF6DC'}}
                    onDayPress={day => {
                        setDishDate(day.dateString);
                        setOpen(!open);
                        setOpenMultiple(!openMultiple);
                    }}
                    />
                    <Button  buttonStyle={styles.button} onPress={()=> setOpen(!open)} title='Anuluj' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
                </Modal>
                <Modal
                //transparent={true}
                visible={openMultiple}
                >
                    <Text className="font-['Gothic'] font-bold" style={{fontSize:hp(4)}}>Wybierz daty spożywania posiłków</Text>
                    <Calendar

                    minDate={dishDate}
                    onDayPress={day => {
                        var meal = {date: day.dateString, portions: 0}
                        setMeals(meals => [...meals, meal])
                        setSelected(selected => [...selected, day.dateString])
                        console.log('selected', selected);
                    }}
                    markedDates={dates}
                    />
                    <FlatList
                    ListEmptyComponent={null}
                    data={meals.sort((a, b) =>a.date>b.date ? 1 : -1)}
                    keyExtractor={(item) => {
                    return item.date;
                    }}
                    renderItem={({item}) => 
                        <View>
                            <Text //onPress={(mealsDates) => mealsDates.filter((_, dateString) => dateString !== item.dateString)} 
                            style={{fontSize:hp(3)}}>{item.date}</Text>
                            <InputSpinner height={hp(5)}  inputStyle={{fontSize:hp(2.5)}} 
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
                    <Button  buttonStyle={styles.button} onPress={()=> setOpenMultiple(!openMultiple)} title='Zamknij' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
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