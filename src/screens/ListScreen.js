import React, {useState, useContext, useEffect} from 'react';
import { View, Text,  Modal, TouchableOpacity, TextInput, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Button} from 'react-native-elements'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { PageContext } from '../constants/pageContext';
import { supabase } from '../constants';
import Checkbox from 'expo-checkbox';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ListScreen(){
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
    const [categorizedList, setCategorizedList] = useState([]);
    //const [categorizedList, setCategorizedList] = useState([]);
    const [list, setList] = useState()
    useEffect(() => {
      getCategorizedList()  
      getDateFrom()
      getDateTo() 
        //getList()
      }, []);
      var groupList=[];

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

        const now=()=>{
 
          var day = new Date().getDate();
          var month = new Date().getMonth() + 1;
          var year = new Date().getFullYear();
          var hours = new Date().getHours();
          var minutes = new Date().getMinutes();
          var seconds = new Date().getSeconds();
          var miliseconds = new Date().getMilliseconds();
          return( year+month+day+hours+minutes+seconds+miliseconds);
      }

        const storeCategorizedList  = async (value) => {
          try {
            await AsyncStorage.setItem('list', JSON.stringify(value));
          } catch (e) {}
        };

        const getCategorizedList = async () => {
          try {
            const value = await AsyncStorage.getItem('list');
            if (value !== null) {
              setCategorizedList(JSON.parse(value))
            }
          } catch (e) {
            // error reading value
          }
        };

        const storeDateFrom  = async (value) => {
          try {
            await AsyncStorage.setItem('datefrom', value);
          } catch (e) {
          }
        };

        const getDateFrom = async () => {
          try {
            const value = await AsyncStorage.getItem('datefrom');
            if (value !== null) {
              setDateFrom(value)
            }
          } catch (e) {
          }
        };

        const storeDateTo  = async (value) => {
          try {
            await AsyncStorage.setItem('dateto', value);
          } catch (e) {
          }
        };

        const getDateTo = async () => {
          try {
            const value = await AsyncStorage.getItem('dateto');
            if (value !== null) {
              setDateTo(value)
            }
          } catch (e) {
          }
        };

        const getList = async ()=>{
            try {
                const { data, error, status } = await supabase.from('list')
                .select(`id, name, preparation_date, weight, account_id, category, category_id`)
                .eq('account_id',userId)
                .lte('preparation_date', dateTo)
                .gte('preparation_date', dateFrom)
                if (error && status !== 406) {
                  throw error
                }
                if (data) {
                  setList(Object.values(data))
                  var temp=[]
                  temp=Object.values(data)
                  temp.reduce(function(res, value) {
                    if (!res[value.id]) {
                      res[value.id] = { id: value.id, name: value.name, weight: 0, category: value.category, category_id:value.category_id };
                      groupList.push(res[value.id])
                    }
                    res[value.id].weight += parseFloat(value.weight);
                    return res;
                  }, {});
                  var i=0
                  var tempS=[]
                  groupList.sort((a, b) =>a.category_id-b.category_id).map((item, index) => {
                    var temp = {id:i, isActive:false, val: `${item.name} - ${item.weight} g `}
                    tempS.push(temp)
                    i++
                    return temp;
                  })
                  setCategorizedList(tempS)
                  storeCategorizedList(tempS)
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
                        storeDateFrom(day.dateString);
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
                        storeDateTo(day.dateString);
                        setMaxDate(day.dateString);
                        setOpenTo(!openTo);
                        getList()
                    }}
                    /></View>
                 </Modal>
                 <View className="flex-auto" >
                 <FlatList className="flex-1"
                 removeClippedSubviews={false}
                    ListEmptyComponent={null}
                    data={categorizedList.sort((a, b) =>a.id-b.id)}
                    keyExtractor={(item) => {
                    return item.id;
                    }}
                    renderItem={({item}) => 
                        <View className="px-3 flex-1 flex-row items-center">
                            <Checkbox
                              disabled={false}
                              color={item.isActive ? '#b1ae95' : undefined}
                              value={item.isActive}
                              onValueChange={(newValue) => {
                                let tempArray = [...categorizedList]
                                tempArray=tempArray.filter(t => t.id !== item.id)
                                tempArray.push({id: item.id, isActive:newValue, val: item.val})
                                setCategorizedList(tempArray)
                                storeCategorizedList(tempArray)
                              }
                            }
                            />
                            <TextInput 
                              value={item.val}
                              editable={!item.isActive}
                              style={[styles.textInput,  item.isActive ? styles.isActive : styles.isNotActive]}
                              onChangeText={(text) => {  
                              let tempArray = [...categorizedList]
                              tempArray=tempArray.filter(t => t.id !== item.id)
                              tempArray.push({id: item.id, isActive: item.isActive, val: text})
                              setCategorizedList(tempArray)
                              storeCategorizedList(tempArray)
                            }}
                          />
                          <TouchableOpacity onPress={()=>{
                            let tempArray = [...categorizedList]
                            tempArray=tempArray.filter(t => t.id !== item.id)
                            setCategorizedList(tempArray)
                            storeCategorizedList(tempArray)
                          }}>
                            <AntDesign name="delete" size={24} color="black" />
                          </TouchableOpacity>
                        </View>
                    }
                    /></View>
                    <Button  titleStyle={{color:'#7F8D9A'}} buttonStyle={{backgroundColor: '#FFC6AC', borderRadius:25, width:wp(80), marginTop:hp(1)}} title="Dodaj kolejny punkt" 
                    onPress={() => {
                      let tempArray = [...categorizedList]
                      tempArray.push({id: now(), isActive: false, val: ''})
                      setCategorizedList(tempArray)
                      storeCategorizedList(tempArray)
                    }}/>
        </View>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  textInput: {
    backgroundColor:'white',
    width:wp(70),
    fontSize:hp(2.3),
    padding:wp(1),
    paddingLeft:hp(3),
    margin:wp(1),
    borderRadius:5
  },
  isActive:{
    textDecorationLine:'line-through'
  },
  isNotActive:{
    textDecorationLine:'none'
  },
})                            
                            