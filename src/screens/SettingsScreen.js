import React from 'react';
import { View, Text, ScrollView, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function RecipesScreen(){
    return (
        <SafeAreaView  className="flex-1 justify-center items-center bg-[#FFF6DC]">
        <View className="bg-[#FFC6AC] w-full p-2 items-center">
            <Text className="font-['Gothic']" style={{fontSize:hp(5)}}>Preferencje</Text>
        </View>
        <View className="flex-1 items-center justify-center">

        </View>
    </SafeAreaView>
    )
}