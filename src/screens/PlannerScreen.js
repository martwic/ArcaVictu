import React, {useState, useContext, useEffect} from 'react';
import { View, Text,  TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LocaleConfig, Agenda } from 'react-native-calendars';
import { PageContext } from '../constants/pageContext';
import { supabase } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons} from '@expo/vector-icons';

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
        var temp = {id:val.date+val.recipe_id+val.dish,name: val.name, dish:val.dish, servings: val.servings, preparationTime: val.preparationTime}
        var temp2 = days[val.date] ?  days[val.date] : []
        temp2.push(temp) 
        days[val.date] = temp2;
        });


    const getCalendar = async ()=>{
      try {
          const { data, error, status } = await supabase.from('calendar')
          .select('name, date, servings, account_id, recipe_id, dish, preparationTime')
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
  const getCurrentDateDatabase=()=>{
 
    var day = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    month = month>9 ? month : '0' + month;
    day = day>9 ? day : '0' + day;
    return( year+'-'+month+'-'+day);
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
                    <Text className="font-['Gothic']" style={{fontSize:hp(5)}}>Planer</Text>
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
        selected={getCurrentDateDatabase()}
        //items={{'2024-01-13': [{name: 'Cycling'}, {name: 'Walking'}, {name: 'Running'}],'2024-01-14': [{name: 'Writing'}],}}
        items={days}
        renderItem={(item, index) => (
          <View style={styles.item}>
            <View className="flex-row items-center">  
  {item.dish==1 && <MaterialCommunityIcons name="pot-steam-outline" size={hp(4)} color="#888"/> }
  {item.dish==0 && <MaterialCommunityIcons name="bowl-mix-outline" size={hp(4)} color="#888" />  }
  <View style={{borderRightWidth:wp(0.5),paddingLeft:wp(3), height:hp(7), borderRightColor:"#888"}}></View>
  <View className="flex">
  <Text  style={styles.itemText}>
  {item.name} </Text>
  <Text style={styles.itemTextPortions}>
    {item.servings} {(parseFloat(item.servings)==1 && "porcja")||(parseFloat(item.servings)>4 && "porcji")||(parseFloat(item.servings)>1 && "porcje")}{item.dish==1 && "  |  "+item.preparationTime+"'"} 
</Text></View></View>
</View>
        )}
      />
            </SafeAreaView>
    )
}
//<TouchableOpacity onPress={()=>        console.log('ok')}  style={styles.item} >
//<Text  style={styles.itemText}>{item.name}  {item.dish}{item.dish==1 && "- gotowanie"}</Text>
//<Text  style={styles.itemText}>{JSON.stringify(item)}</Text>
//</TouchableOpacity>
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
      width:wp(80),
      height:hp(10)
    },
    itemText: {
      //color: '#777',
      color: '#555',
      fontSize: 16,
      paddingLeft:wp(3)
    },
    itemTextPortions: {
      //color: '#777',
      color: '#555',
      fontSize: 14,
      paddingLeft:wp(4)
    }
  });