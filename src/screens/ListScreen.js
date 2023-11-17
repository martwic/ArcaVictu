import React from 'react';
import { View, Text, ScrollView, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { DatePickerInput } from 'react-native-paper-dates';


export default function RecipesScreen(){
    const [inputDate, setInputDate] = React.useState(undefined)
    return (
        <SafeAreaView  className="flex-1 justify-center items-center bg-[#FFF6DC]">
        <View className="bg-[#FFC6AC] w-full p-2 items-center">
            <Text className="font-['Gothic']" style={{fontSize:hp(5)}}>Lista zakupów</Text>
        </View>
        <View className="flex-1 items-center" style={{padding:wp(5)}}>
            <View className="flex-row">
                <DatePickerInput locale="pl" label={''} value={inputDate} inputMode='start' onChange={(d) => setInputDate(d)} mode='outlined'/>
                <Text>  </Text>
                <DatePickerInput locale="pl" label={''} value={inputDate} inputMode='start' onChange={(d) => setInputDate(d)} mode='outlined'/>
            </View>
        </View>
    </SafeAreaView>
    )
}