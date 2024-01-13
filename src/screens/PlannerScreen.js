import React, {useState, useContext, useEffect} from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {CalendarDaysIcon} from 'react-native-heroicons/outline';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LocaleConfig, Agenda } from 'react-native-calendars';
import { PageContext } from '../constants/pageContext';
import { supabase } from '../constants';
import { useNavigation } from '@react-navigation/native';

export default function CalendarScreen(){
    const navigation = useNavigation()
    const [events, setEvents] = useState([])
    const [userId] = useContext(PageContext);
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        getCalendar()
      });
      return unsubscribe;
    }, [navigation]);
    let days = {};
    //          '2022-12-02': [{name: 'test'}]
    events.forEach((val) => {
        var temp = [{name: val.name}]
        days[val.date] = temp;
        });


    const getCalendar = async ()=>{
      try {
          const { data, error, status } = await supabase.from('calendar')
          .select('name, date, servings, account_id, recipe_id, dish')
          .eq('account_id',userId)
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


    LocaleConfig.locales.en = LocaleConfig.locales[''];
    LocaleConfig.locales.pl = {
      monthNames: [
        'Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień',
      ],
      dayNames: [
        'Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota',
      ],
      dayNamesShort: ['Nd','Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'],
    };
    LocaleConfig.defaultLocale = 'pl';
    const background="#FFF6DC"
    const primary="#b1ae95"
    const secondary="#FFC6AC"
    return (
            <SafeAreaView  className="flex-1 justify-center bg-[#FFF6DC]">
                <View className="bg-[#FFC6AC] w-full p-2 items-center">
                    <Text className="font-['Gothic']" style={{fontSize:hp(5)}}>Planner</Text>
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
                    todayTextColor:primary,
                    todayBackgroundColor:"transparent"
                }}
        selected="2024-01-13"
        //items={{'2024-01-13': [{name: 'Cycling'}, {name: 'Walking'}, {name: 'Running'}],'2024-01-14': [{name: 'Writing'}],}}
        items={days}
        renderItem={(item, isFirst) => (
          <TouchableOpacity onPress={()=>        console.log('ok')}  style={styles.item} >
            <Text  style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
            </SafeAreaView>
    )
}
//theme={{calendarBackground: 'transparent', todayTextColor:'#b1ae95', arrowColor:'#b1ae95'}}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      width:wp(100),
    },
    item: {
      backgroundColor: 'white',
      flex: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      marginTop: 17,
      width:wp(100),
    },
    itemText: {
      color: '#888',
      fontSize: 16,
    }
  });