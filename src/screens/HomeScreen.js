import React from 'react';
import { View, Text, ScrollView, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {CalendarDaysIcon} from 'react-native-heroicons/outline';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function HomeScreen(){
    BackHandler.addEventListener("hardwareBackPress", ()=>true)
    return (
            <View  className="flex-1 justify-center items-center bg-[#FFF6DC]">
                
                <Text>HomeScreen</Text>
            </View>
    )
}