import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LocaleConfig, Agenda, Calendar } from 'react-native-calendars';
import { PageContext } from '../constants/pageContext';
import { supabase } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Button } from 'react-native-elements';
import InputSpinner from "react-native-input-spinner";

export default function CalendarScreen() {
  const navigation = useNavigation()
  const [events, setEvents] = useState([])
  const [userId] = useContext(PageContext);
  const [openMultiple, setOpenMultiple] = useState(false)
  const [open, setOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState(false);
  const [selected, setSelected] = useState([]);
  const [disabledDishes, setDisabledDishes] = useState([]);
  const [disabledMeals, setDisabledMeals] = useState([]);
  const [dishDate, setDishDate] = useState(undefined)
  const [meals, setMeals] = useState([])
  const [oldMeals, setOldMeals] = useState([])
  const [dishesList, setDishesList] = useState()
  const [mealsList, setMealsList] = useState()
  const [recipeId, setRecipeId] = useState('')
  const [dishId, setDishId] = useState('')

  let datesDishes = {};
  let datesMeals = {};
  let dates = {};
  let mealsToDatabase = [];
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getCalendar()
    });
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    if (dishId !== '') {
    getDisabledDishes()
    getDisabledMeals()
  }
  }, [recipeId, dishId]);
  let days = {};
  events.forEach((val) => {
    var temp = { id: val.date + val.id, date: val.date, name: val.name, dish: val.dish, servings: val.servings, preparationTime: val.preparationTime, dishId: val.id, recipeId: val.recipe_id }
    var temp2 = days[val.date] ? days[val.date] : []
    temp2.push(temp)
    days[val.date] = temp2;
  });

  async function editDishAndMeals() {
    const { data, error } = await supabase.from('dishes').update({
      preparation_date: dishDate,
    }).eq('id', dishId)
    if (error) Alert.alert(error.message)
    else {
      const { error3 } = await supabase.from('meals')
      .delete()
      .eq('dish_id', dishId)
      meals.forEach((val) => {
        mealsToDatabase.push({ dish_id: dishId, consumption_date: val.date, servings: val.portions });
      });
    }
    const { error2 } = await supabase.from('meals').insert(
      mealsToDatabase
    )
    if (error2) Alert.alert(error2.message)
    else {
      await getCalendar()
      setOpenMultiple(false)
    }
  }

  const getCalendar = async () => {
    try {
      const { data, error, status } = await supabase.from('calendar')
        .select('name, date, servings, account_id, recipe_id, dish, preparationTime, id')
        .eq('account_id', userId)
      if (error && status !== 406) {
        throw error
      }
      if (data) {
        setEvents(Object.values(data))
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    }
  }
  const getCurrentDate = () => {

    var day = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    month = month > 9 ? month : '0' + month;
    day = day > 9 ? day : '0' + day;
    return (year + '-' + month + '-' + day);
  }


  LocaleConfig.locales.en = LocaleConfig.locales[''];
  LocaleConfig.locales.pl = {
    monthNames: [
      'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
    ],
    dayNames: [
      'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota',
    ],
    dayNamesShort: ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'],
  };
  LocaleConfig.defaultLocale = 'pl';

  const getDisabledDishes = async () => {
    try {
      const { data, error, status } = await supabase.from('dishes')
        .select('id, preparation_date, recipe_id, account_id')
        .eq('recipe_id,', recipeId)
        .eq('account_id', userId)
        //.neq('id', dishId)
      if (error && status !== 406) {
        throw error
      }
      if (data) {
        setDisabledDishes(Object.values(data))
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    }
  }
  const getDisabledMeals = async () => {
    try {
      const { data, error, status } = await supabase.from('meals')
        .select('id, consumption_date, dishes!inner(account_id, recipe_id)')
        .eq('dishes.recipe_id,', recipeId)
        .eq('dishes.account_id', userId)
        //.neq('dishes.id', dishId)
      if (error && status !== 406) {
        throw error
      }
      if (data) {
        setDisabledMeals(Object.values(data))
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    }
  }
  selected.forEach((val) => {
    dates[val] = { selected: true, selectedColor: '#FFC6AC' };
  });

  const deleteDish = async () => {
    try {
      const { error } = await supabase.from('dishes')
        .delete()
        .eq('id', dishId)
        await getCalendar()
        setOpenDrop(false)
        setOpen(false)
      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
        setOpenDrop(false)
        setOpen(false)
      }
    }
  }

  const setDisabled = () => {
    disabledDishes.forEach((val) => {
      datesDishes[val.preparation_date] = { disabled: true, disableTouchEvent: true }
    })
    setDishesList(datesDishes)
    disabledMeals.forEach((val) => {
      datesMeals[val.consumption_date] = { disabled: true, disableTouchEvent: true }
    })
    setMealsList(datesMeals)
  }
  const background = "#FFF6DC"
  const primary = "#b1ae95"
  const secondary = "#FFC6AC"
  return (
    <SafeAreaView className="flex-1 justify-center bg-[#FFF6DC]">
      <View className="bg-[#FFC6AC] w-full p-2 items-center">
        <Text className="font-['Gothic']" style={{ fontSize: hp(5) }}>Planer</Text>
      </View>
      <Agenda
        firstDay={1}
        theme={{
          "stylesheet.agenda.main": {
            reservations: {
              backgroundColor: background,
              paddingTop: hp(15),

            },
          },
          calendarBackground: '#FFFAEB', //agenda background
          agendaKnobColor: primary, // knob color
          backgroundColor: background, // background color below agenda
          agendaDayTextColor: primary, // day name
          agendaDayNumColor: primary, // day number
          agendaTodayColor: primary, // today in list
          monthTextColor: primary, // name in calendar
          //textDefaultColor: "red",
          todayBackgroundColor: primary,
          textSectionTitleColor: primary,
          selectedDayBackgroundColor: primary, // calendar sel date
          dayTextColor: primary, // calendar day
          dotColor: primary, // dots
          textDisabledColor: primary,
          todayTextColor: primary,
          todayBackgroundColor: "transparent"
        }}
        selected={getCurrentDate()}
        items={days}
        renderItem={(item, index) => (
          <View style={styles.item}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                {item.dish == 1 && <MaterialCommunityIcons name="pot-steam-outline" size={hp(4)} color="#888" />}
                {item.dish == 0 && <MaterialCommunityIcons name="bowl-mix-outline" size={hp(4)} color="#888" />}
                <View style={{ borderRightWidth: wp(0.5), paddingLeft: wp(3), height: hp(7), borderRightColor: "#888" }}></View>
                <View className="flex">
                  <Text style={styles.itemText}>
                    {item.name} </Text>
                  <Text style={styles.itemTextPortions}>
                    {item.servings} {(parseFloat(item.servings) == 1 && "porcja") || (parseFloat(item.servings) > 4 && "porcji") || (parseFloat(item.servings) > 1 && "porcje")}{item.dish == 1 && "  |  " + item.preparationTime + "'"}
                  </Text>
                </View></View>
              {item.dish == 1 && item.date >= getCurrentDate() &&
                <TouchableOpacity
                  style={{ alignItems: 'flex-end' }}
                  onPress={async () => {
                    setDishId(item.dishId)
                    setRecipeId(item.recipeId)
                    setOpen(!open)  
                  }}>
                  <Text style={{ textAlign: 'right' }}><Feather name="edit" size={hp(3)} color="#888" /></Text>

                </TouchableOpacity>}

            </View>
          </View>)} />
      <Modal visible={open}>
        <View className="flex-1 bg-[#FFF6DC]">
          <Text className="font-['Gothic'] font-bold p-5" style={{ fontSize: hp(4) }}>Wybierz datę gotowania</Text>
          <Calendar
            minDate={getCurrentDate()}
            theme={{ calendarBackground: 'transparent', todayTextColor: '#b1ae95', arrowColor: '#b1ae95' }}
            markedDates={dishesList}
            onDayPress={day => {
              setDishDate(day.dateString);
              setOpen(!open);
              setOpenMultiple(!openMultiple);
            }}

          />
        </View>
        <Button buttonStyle={styles.buttonfull} onPress={() => setOpenDrop(!openDrop)} title='Usuń danie i powiązane posiłki' style={{ backgroundColor: 'transparent', borderColor: 'transparent' }} inputContainerStyle={{ backgroundColor: 'white', width: wp(80), height: hp(3) }} />
        <View className="border-b-2 border-[#FFF6DC] w-4/5"/>
        <Button buttonStyle={styles.buttonfull} onPress={() => setOpen(!open)} title='Anuluj' style={{ backgroundColor: 'transparent', borderColor: 'transparent' }} inputContainerStyle={{ backgroundColor: 'white', width: wp(80), height: hp(3) }} />
      </Modal>
      <Modal
        //transparent={true}
        visible={openMultiple}
      >
        <View className="flex-1 bg-[#FFF6DC]">
          <Text className="font-['Gothic'] font-bold p-5" style={{ fontSize: hp(4) }}>Wybierz daty spożywania posiłków</Text>
          <Calendar
            theme={{ todayTextColor: '#FFC6AC', calendarBackground: '#FFF6DC', arrowColor: '#b1ae95' }}
            minDate={dishDate}
            markedDates={Object.assign(dates, mealsList)}
            onDayPress={day => {
              if (meals.some(item => day.dateString === item.date)) {
                setMeals(meals.filter(item => item.date !== day.dateString))
                setSelected(selected.filter(item => item !== day.dateString))
              }
              else {
                var meal = { date: day.dateString, portions: 1 }
                setMeals(meals => [...meals, meal])
                setSelected(selected => [...selected, day.dateString])
              }
            }}
          />
          <FlatList className=""
            ListEmptyComponent={null}
            data={meals.sort((a, b) => a.date > b.date ? 1 : -1)}
            keyExtractor={(item) => {
              return item.date;
            }}
            renderItem={({ item }) =>
              <View className="p-3">
                <Text //onPress={(mealsDates) => mealsDates.filter((_, dateString) => dateString !== item.dateString)} 
                  className="font-bold"
                  style={{ fontSize: hp(2.5), textAlign: 'center' }}>{item.date}</Text>
                <InputSpinner height={hp(4)} inputStyle={{ fontSize: hp(2.2) }}
                  color='#FFC6AC'
                  max={50}
                  min={1}
                  step={1}
                  value={item.portions}
                  onChange={(num) => {
                    let tempArray = [...meals]
                    tempArray = tempArray.filter(t => t.date !== item.date)
                    tempArray.push({ date: item.date, portions: num })
                    setMeals(tempArray)
                  }}
                />
              </View>
            }
          />
          <View className="items-center p-5">
          </View>
          <View className="flex-row">
            <Button buttonStyle={styles.button} onPress={() => setOpenMultiple(!openMultiple)} title='Zamknij' style={{ backgroundColor: 'transparent', borderColor: 'transparent' }} inputContainerStyle={{ backgroundColor: 'white', width: wp(80), height: hp(3) }} />
            <Button buttonStyle={styles.button} onPress={editDishAndMeals} title='Dodaj' style={{ backgroundColor: 'transparent', borderColor: 'transparent' }} inputContainerStyle={{ backgroundColor: 'white', width: wp(80), height: hp(3) }} />
          </View></View>
      </Modal>
      <Modal visible={openDrop}>
        <View className="flex-1 justify-center bg-[#FFF6DC]" >
          <Text className="font-bold p-3" style={{ fontSize: hp(5), textAlign: 'center' }}>Czy na pewno chcesz usunąć danie i powiązane posiłki? </Text>
          <Text className="p-3" style={{ fontSize: hp(3), textAlign: 'center' }}>Ta operacja jest nieodwracalna.</Text>
          <View className="flex items-center" style={{ paddingTop: wp(10), paddingBottom: wp(3) }}>
            <Button titleStyle={{ color: '#7F8D9A' }} buttonStyle={{ backgroundColor: '#FFC6AC', borderRadius: 25, width: wp(80), padding: wp(5) }} 
            title="USUŃ" 
            onPress={() => {
              deleteDish()
              }} />
          </View>
        </View>
        <Button titleStyle={{ fontSize: hp(5) }} buttonStyle={{ backgroundColor: '#b1ae95', width: wp(100), height: hp(30) }} onPress={() => setOpenDrop(!openDrop)} title='Anuluj' style={{ backgroundColor: 'transparent', borderColor: 'transparent' }} inputContainerStyle={{ backgroundColor: 'white', width: wp(80), height: hp(3) }} />
      </Modal>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: wp(100),
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    width: wp(80),
    height: hp(10)
  },
  itemText: {
    //color: '#777',
    color: '#555',
    fontSize: 16,
    paddingLeft: wp(3)
  },
  itemTextPortions: {
    //color: '#777',
    color: '#555',
    fontSize: 14,
    paddingLeft: wp(4)
  },
  button: {
    backgroundColor: '#b1ae95',
    width: wp(49.9),
  },
  buttonfull: {
    backgroundColor: '#b1ae95',
    width: wp(100),
  },
})