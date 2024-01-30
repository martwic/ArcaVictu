import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { supabase } from '../constants';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import InputSpinner from "react-native-input-spinner";
import { ScrollView } from 'react-native-virtualized-view'
import { PageContext } from '../constants/pageContext';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { LocaleConfig, Calendar } from 'react-native-calendars';

export default function RecipeDetailScreen(props) {
  let item = props.route.params;
  const recipeId = item.id;
  const [userId] = useContext(PageContext);
  const navigation = useNavigation();
  const [ingredients, setIngredients] = useState('');
  const [openDrop, setOpenDrop] = useState(false);
  const [portions, setPortions] = useState(4)
  const [openMultiple, setOpenMultiple] = useState(false)
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [disabledDishes, setDisabledDishes] = useState([]);
  const [disabledMeals, setDisabledMeals] = useState([]);
  const [dishDate, setDishDate] = useState(undefined)
  const [meals, setMeals] = useState([])
  const [dishesList, setDishesList] = useState()
  const [mealsList, setMealsList] = useState()
  const [kcal, setKcal] = useState(0)
  const [proteins, setProteins] = useState(0)
  const [carbs, setCarbs] = useState(0)
  const [fats, setFats] = useState(0)

  let datesDishes = {};
  let datesMeals = {};
  let dates = {};
  let mealsToDatabase = [];
  useEffect(() => {
    const fetchData = async () => {
      try {
        //await getRecipeData(recipeId);
        await getDisabledDishes();
        await getDisabledMeals();
      } catch (error) {
        console.error('Wystąpił błąd:', error);
      }
    };
    fetchData();
  }, [])
  useEffect(() => {
    if (recipeId !== null) {
      getRecipeData(recipeId);
    }
  }, [recipeId]);


  //disableTouchEvent: true,
  LocaleConfig.locales.en = LocaleConfig.locales[''];
  LocaleConfig.locales.pl = {
    monthNames: [
      'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
    ],
    dayNames: [
      'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela',
    ],
    dayNamesShort: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'],
  };
  LocaleConfig.defaultLocale = 'pl';
  const getCurrentDate = () => {

    var day = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    month = month > 9 ? month : '0' + month;
    day = day > 9 ? day : '0' + day;
    return (year + '-' + month + '-' + day);
  }
  const getDisabledDishes = async () => {
    try {
      const { data, error, status } = await supabase.from('dishes')
        .select('id, preparation_date, recipe_id, account_id')
        .eq('recipe_id,', recipeId)
        .eq('account_id', userId)
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
  const getRecipeData = async () => {
    try {
      const { data, error, status } = await supabase.from('ingredients')
        .select(`id, recipes!inner(name, preparationTime, directions, account_id), product_id, products!inner(name, calories, carbohydrates, fats, proteins),weight, amount, measure`)
        .eq('recipe_id', recipeId)
      if (error && status !== 406) {
        throw error
      }
      if (data) {
        setIngredients(data)
        var k = 0, p = 0, c = 0, f = 0
        Object.values(data).forEach((val) => {
          k += parseFloat(val.weight) * parseFloat(val.products.calories) / 100
          p += parseFloat(val.weight) * parseFloat(val.products.proteins) / 100
          c += parseFloat(val.weight) * parseFloat(val.products.carbohydrates) / 100
          f += parseFloat(val.weight) * parseFloat(val.products.fats) / 100
        })
        setKcal(k)
        setProteins(p)
        setCarbs(c)
        setFats(f)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    }
  }

  const deleteRecipe = async () => {
    try {
      const { error } = await supabase.from('recipes')
        .delete()
        .eq('id', recipeId)
      if (error) {
        throw error
      }
      else {
        try {
          const { error2 } = await supabase.from('ingredients')
            .delete()
            .eq('recipe_id', recipeId)
          if (error2) {
            throw error2
          }
          else {
            setOpenDrop(!openDrop)
            navigation.navigate('Recipes')
          }
        } catch (error2) {
          if (error instanceof Error) {
            Alert.alert(error.message)
            setOpenDrop(false)
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
        setOpen(false)
      }
    }
  }
  async function addDishAndMeals() {
    const { data, error } = await supabase.from('dishes').insert({
      recipe_id: recipeId,
      preparation_date: dishDate,
      account_id: userId,
    }).select().single()
    if (error) Alert.alert(error.message)
    else {
      meals.forEach((val) => {
        mealsToDatabase.push({ dish_id: data.id, consumption_date: val.date, servings: val.portions });
      });
    }
    const { error2 } = await supabase.from('meals').insert(
      mealsToDatabase
    )
    if (error2) Alert.alert(error.message)
    else {
      navigation.navigate('Recipes');
    }
  }

  //const setSelectedMeals = ()=>{
  selected.forEach((val) => {
    dates[val] = { selected: true, selectedColor: '#FFC6AC' };
  });

  //setMealsList(datesMeals)
  //}

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
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-[#FFF6DC]">
      <View className="bg-[#FFC6AC] w-full p-2 items-center">
        <Text className="font-['Gothic']" style={{ fontSize: hp(5) }}>{item.name}</Text>
      </View>
      <ScrollView className="flex-1 p-2">

        <View className="items-center justify-center flex-row pr-5">
          <Text style={{ fontSize: hp(2.5), padding: hp(2.5) }}><Feather name="clock" size={24} color="black" /> {item.preparationTime}' + {item.waitingTime}'</Text>
          <Text style={{ fontSize: hp(2.5), padding: hp(2.5) }}>
            <InputSpinner height={hp(5)} inputStyle={{ fontSize: hp(2.5) }}
              color='#FFC6AC'
              max={50}
              min={1}
              step={1}
              value={portions}
              onChange={(num) => {
                setPortions(num);
              }}
            /></Text>
          { (item.account_id==userId) && 
          <>
            <TouchableOpacity onPress={() => navigation.navigate('EditRecipe', { recipe: item, ingredientsList: ingredients })}><Text style={{ fontSize: hp(2.5), padding: hp(2.5) }}><Feather name="edit" size={24} color="black" /></Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setOpenDrop(!openDrop)}><Text style={{ fontSize: hp(2.5), padding: hp(2.5) }}><AntDesign name="delete" size={24} color="black" /></Text></TouchableOpacity>
          </>}
        </View>
        <View className="items-center justify-center flex-row">
          <Text>kcal: {kcal.toFixed(1)} | B: {proteins.toFixed(1)} | T: {fats.toFixed(1)} | W: {carbs.toFixed(1)}</Text>
        </View>
        <View>
          <Text className="font-['Gothic'] font-bold" style={{ fontSize: hp(3), padding: hp(1) }}>Składniki:</Text>
          <FlatList
            ListEmptyComponent={null}
            data={ingredients}
            keyExtractor={(item, index) => {
              return item.id;
            }}
            renderItem={({ item }) => <View className="flex-row"><Entypo name="dot-single" size={24} color="black" /><Text style={{ fontSize: hp(2.2) }}>{item.products.name} - {item.amount != 0 && item.amount * portions}{item.amount == 0 && item.weight * portions} {item.measure == 'ml' || item.measure == 'g' ? '' : "x "}{item.measure}</Text></View>}
          />
          <Text className="font-['Gothic'] font-bold" style={{ fontSize: hp(3), padding: hp(1) }}>Opis:</Text>
          <Text style={{ fontSize: hp(2.2), padding: hp(1), paddingBottom: hp(4), paddingRight: hp(5), textAlign: 'justify' }}>{item.directions}</Text>
        </View>
      </ScrollView>
      <View className="flex-row items-center">
        <Button buttonStyle={styles.button} onPress={() => navigation.navigate('Recipes')} title='Wróć' style={{ backgroundColor: 'transparent', borderColor: 'transparent' }} inputContainerStyle={{ backgroundColor: 'white', width: wp(80), height: hp(3) }} />
        <View className="bg-black" style={{ width: 0.2 }}></View>
        <Button buttonStyle={styles.button} onPress={() => {
          setOpen(!open)
          setDisabled()
        }}
          title={'Dodaj do planera'} />
      </View>
      <Modal visible={openDrop}>
        <View className="flex-1 justify-center bg-[#FFF6DC]" >
          <Text className="font-bold p-3" style={{ fontSize: hp(5), textAlign: 'center' }}>Czy na pewno chcesz usunąć przepis? </Text>
          <Text className="p-3" style={{ fontSize: hp(3), textAlign: 'center' }}>Ta operacja jest nieodwracalna.</Text>
          <View className="flex items-center" style={{ paddingTop: wp(10), paddingBottom: wp(3) }}>
            <Button titleStyle={{ color: '#7F8D9A' }} buttonStyle={{ backgroundColor: '#FFC6AC', borderRadius: 25, width: wp(80), padding: wp(5) }} title="USUŃ" onPress={() => deleteRecipe()} />
          </View>
        </View>
        <Button titleStyle={{ fontSize: hp(5) }} buttonStyle={{ backgroundColor: '#b1ae95', width: wp(100), height: hp(30) }} onPress={() => setOpenDrop(!openDrop)} title='Anuluj' style={{ backgroundColor: 'transparent', borderColor: 'transparent' }} inputContainerStyle={{ backgroundColor: 'white', width: wp(80), height: hp(3) }} />
      </Modal>
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
                //setSelectedMeals()
              }
              else {
                //mealsDates.filter((_, dateString) => dateString !== item.dateString)
                var meal = { date: day.dateString, portions: 1 }
                setMeals(meals => [...meals, meal])
                setSelected(selected => [...selected, day.dateString])
                //setSelectedMeals()

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
            <Button buttonStyle={styles.button} onPress={addDishAndMeals} title='Dodaj' style={{ backgroundColor: 'transparent', borderColor: 'transparent' }} inputContainerStyle={{ backgroundColor: 'white', width: wp(80), height: hp(3) }} />
          </View></View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#b1ae95',
    width: wp(49.9),
  },
  buttonfull: {
    backgroundColor: '#b1ae95',
    width: wp(100),
  },
})