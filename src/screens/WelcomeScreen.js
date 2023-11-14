import { useNavigation } from '@react-navigation/native';
import React, { useEffect }  from 'react';
import { View, Text, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function WelcomeScreen(){
    const navigation = useNavigation();
    useEffect(()=>{
        setTimeout(()=>navigation.navigate('App'), 2500)
    },[])
    return (
            <View  className="flex-1 justify-center items-center bg-[#FFF6DC]">
                <Text className="font-['Gothic']" style={{fontSize:hp(7)}}>ARCA VICTU</Text>
                <View className="bg-yellow-400/20" style={{borderRadius:hp(7), padding:hp(3)}}>
                <View className="bg-orange-400/20" style={{borderRadius:hp(7), padding:hp(2.5)}}>
                    <View className="bg-red-400/20" style={{borderRadius:hp(7), padding:hp(1)}}>
                        <Image source={require('../../assets/images/logo_kolor.png')} style={{width:hp(25), height:hp(25)}}/>
                    </View>
                </View>
                </View>
                
            </View>
    )
}