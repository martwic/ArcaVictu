import React, {useState, useContext, useEffect} from 'react';
import { View, Text, ScrollView, Modal, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Button, Input} from 'react-native-elements'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { PageContext } from '../constants/pageContext';
import { supabase } from '../constants';

export default function RecipesScreen(){
    const getCurrentDate=()=>{
 
        var day = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        month = month>9 ? month : '0' + month;
        day = day>9 ? day : '0' + day;
        return( year+'-'+month+'-'+day);
    }
    const [userId] = useContext(PageContext);
    const [dateFrom, setDateFrom] = useState(getCurrentDate())
    const [openFrom, setOpenFrom] = useState(false)
    const [openTo, setOpenTo] = useState(false)
    const [dateTo, setDateTo] = useState(getCurrentDate())
    const [minDate, setMinDate] = useState(getCurrentDate())
    const [maxDate, setMaxDate] = useState()
    const [list, setList] = useState()
    useEffect(() => {
          getList()
      }, []);
    
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

        const getList = async ()=>{
            try {
                const { data, error, status } = await supabase.from('list')
                .select(`id, name, preparation_date, weight, account_id`)
                .eq('account_id',userId)
                .lte('preparation_date', dateTo)
                .gte('preparation_date', dateFrom)
                if (error && status !== 406) {
                  throw error
                }
                if (data) {
                  setList(data)
                }
              } catch (error) {
                if (error instanceof Error) {
                  Alert.alert(error.message)
                }
              } 
        }
    return (
        <SafeAreaView  className="flex-1 justify-center items-center bg-[#FFF6DC]">
        <View className="bg-[#FFC6AC] w-full p-2 items-center">
            <Text className="font-['Gothic']" style={{fontSize:hp(5)}}>Lista zakupów</Text>
        </View>
        <View className="flex-1 items-center" style={{padding:wp(5)}}>
            <View className="items-center justify-center flex-row">
            <View className="p-3">
            <Button  buttonStyle={{backgroundColor:'#b1ae95', width:wp(40)}}title={dateFrom} onPress={() => setOpenFrom(!openFrom)} />
            </View>
            <View className="p-3">
            <Button buttonStyle={{backgroundColor:'#b1ae95', width:wp(40)}} title={dateTo} onPress={() => setOpenTo(!openTo)} />
            </View>
            </View>
            <Modal 
                visible={openFrom}
                >
                    <View className="flex-1 bg-[#FFF6DC]">
                    <Calendar
                    markedDates={{[dateFrom]: {selected:true, selectedColor:'#b1ae95'}}}
                    minDate={getCurrentDate()}
                    maxDate={maxDate}
                    theme={{calendarBackground: 'transparent', todayTextColor:'#b1ae95', arrowColor:'#b1ae95'}}
                    onDayPress={day => {
                        setDateFrom(day.dateString);
                        setMinDate(day.dateString);
                        setOpenFrom(!openFrom);
                        getList()
                    }}
                    /></View>
                 </Modal>
                 <Modal 
                visible={openTo}
                >
                    <View className="flex-1 bg-[#FFF6DC]">
                    <Calendar
                    markedDates={{[dateTo]: {selected:true, selectedColor:'#b1ae95'}}}
                    minDate={minDate}
                    theme={{calendarBackground: 'transparent', todayTextColor:'#b1ae95', arrowColor:'#b1ae95'}}
                    onDayPress={day => {
                        setDateTo(day.dateString);
                        setMaxDate(day.dateString);
                        setOpenTo(!openTo);
                        getList()
                    }}
                    /></View>
                 </Modal>

                 <FlatList className=""
                    ListEmptyComponent={null}
                    data={list}
                    keyExtractor={(item) => {
                    return item.id;
                    }}
                    renderItem={({item}) => 
                        <View className="p-3">
                            <Text 
                            style={{fontSize:hp(2.5)}}>{item.name} - {item.weight} g</Text>
                        </View>
                    }
                    />

        </View>
    </SafeAreaView>
    )
}