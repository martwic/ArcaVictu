import React from 'react';
import { View, Text, ScrollView, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {CalendarDaysIcon} from 'react-native-heroicons/outline';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function HomeScreen(){
    BackHandler.addEventListener("hardwareBackPress", ()=>true)
    var date = new Date;
    var days = ['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota'];
    var day = days[date.getDay()]
    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-[#FFF6DC]">
                <View className="bg-[#FFC6AC] w-full p-2 items-center">
                    <Text className="font-['Gothic']" style={{fontSize:hp(5)}}>{date.getDay()}.{date.getMonth()}  {day}</Text>
                </View>
                <View className="flex-1">
                    <Text className="font-['Gothic'] font-bold" style={{fontSize:hp(3)}}>Gotowanie</Text>
                    <View>

                    </View>
                </View>
                <View className="border-b-2 border-[#FFC6AC] w-4/5"/>
                <View className="flex-1 p-2">
                    <Text className="font-['Gothic'] font-bold" style={{fontSize:hp(3)}}>Jadłospis</Text>
                    <View></View>
                </View>
            </SafeAreaView>
    )
}