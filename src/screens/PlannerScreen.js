import React, {useState} from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {CalendarDaysIcon} from 'react-native-heroicons/outline';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LocaleConfig, Agenda } from 'react-native-calendars';

export default function CalendarScreen(){
    const [selectedIndex, setSelectedIndex] = useState(0)
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
    const background="#FFF6DC"
    const primary="#b1ae95"
    return (
            <SafeAreaView  className="flex-1 justify-center bg-[#FFF6DC]">
                <View className="bg-[#FFC6AC] w-full p-2 items-center">
                    <Text className="font-['Gothic']" style={{fontSize:hp(5)}}>Planner</Text>
                </View>
                <Agenda
                theme={{
                    "stylesheet.agenda.main": {
                        reservations: {
                          backgroundColor: background,
                        },
                  },
                    calendarBackground: '#f8eabe', //agenda background
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
                    dotColor: "white", // dots
                    //textDisabledColor: "red"
                }}
        selected="2022-12-01"
        items={{
          '2022-12-01': [{name: 'Cycling'}, {name: 'Walking'}, {name: 'Running'}],
          '2022-12-02': [{name: 'Writing'}]
        }}
        renderItem={(item, isFirst) => (
          <TouchableOpacity>
            <Text>{item.name}</Text>
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
      //borderRadius: 5,
      //padding: 10,
      //marginRight: 10,
      //marginTop: 17,
      width:wp(100),
    },
    itemText: {
      color: '#888',
      fontSize: 16,
    }
  });