import React, {useContext} from 'react';
import { View, Text, NativeModules, Alert, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState, useEffect } from 'react'
import { supabase } from '../constants';
import { Button, Input} from 'react-native-elements'
import { PageContext } from '../constants/pageContext';
import { ButtonGroup} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Fontisto } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen(){
  const navigation = useNavigation()
  const [session, setSession] = useState(null)
  const [userId, setUserId] = useContext(PageContext);
  const [userEmail, setUserEmail] = useState('')
  const [ifMeat, setIfMeat] = useState(0)
  const [ifDairy, setIfDairy] = useState(0)
  const [ifGrains, setIfGrains] = useState(0)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [openDrop, setOpenDrop] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session.user.id)
      setUserEmail(session.user.email)
      getPreferences()
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if(session!=null){
        //setUserId(session.user.id)
      }
      else{
        navigation.navigate('Login');
      }

    })
  }, [])
  async function signOut(){
    await supabase.auth.signOut()
    
    try {
      await AsyncStorage.setItem('list', '')
  } catch(e) {
      console.log(e);
  }
  navigation.navigate('Login');
  }
  async function getPreferences(){
    const { data, error } = await supabase
      .from('profiles')
      .select('eatMeat,eatDairy,eatGrains,full_name')
      .eq('id', userId).single()
      if(error){
        Alert.alert(error.message);
      }
      if(data){
        setIfMeat((data.eatMeat)?0:1)
        setIfDairy((data.eatDairy)?0:1)
        setIfGrains((data.eatGrains)?0:1)
        setName(data.full_name)
      }
      
  }

  async function setPreferencesMeat(val){
    var  meat = val==0 ? true:false;
    const { error } = await supabase
      .from('profiles')
      .update({ eatMeat: meat})
      .eq('id', userId)
      if(error){
        Alert.alert(error.message);
      }
  }
  async function setPreferencesDairy(val){
    var  dairy = val==0 ? true:false;
    const { error } = await supabase
      .from('profiles')
      .update({ eatDairy: dairy})
      .eq('id', userId)
      if(error){
        Alert.alert(error.message);
      }
  }
  async function setPreferencesGrains(val){
    var  grains = val==0 ? true:false;
    const { error } = await supabase
      .from('profiles')
      .update({ eatGrains: grains})
      .eq('id', userId)
      if(error){
        Alert.alert(error.message);
      }
  }

  async function deleteAccount(){
    const { data, error } = await supabase.rpc('check_user_password', {current_plain_password:password})
    if(data){
      const { error } = await supabase.rpc('drop_user_account')
      signOut();
    }
    if(error){
      Alert.alert(error.message);
    }
  }
  async function editPassword(){
      const { data, error } = await supabase.rpc('change_user_password', {current_plain_password:password,new_plain_password:newPassword})
      if(error){
        Alert.alert(error.message);
      }
      else{
        setOpenEdit(!openEdit)
      }
      setPassword('')
      setNewPassword('')
      navigation.navigate('Settings')
  }
    
    return (
        <SafeAreaView  className="flex-1 justify-center items-center bg-[#FFF6DC]">
        <View className="bg-[#FFC6AC] w-full p-2 items-center">
            <Text className="font-['Gothic']" style={{fontSize:hp(5)}}>Konto</Text>
        </View>
        <View className="flex-1" style={{width:wp(100)}}>

        <Text className="font-['Gothic'] font-bold pt-3 pl-3" style={{fontSize:hp(4.5)}}>Cześć, {name}!</Text>
        <View className="flex-row items-center pl-3">
        <Text style={{fontSize:hp(2.2)}}><Fontisto name="email" size={20} color="black" /> </Text>
        <Text style={{fontSize:hp(2.2)}}>{userEmail}</Text>
        </View>
        <Text className="font-['Gothic'] font-bold pt-7 pb-5 pl-3" style={{fontSize:hp(3)}}>Preferencje dotyczące diety:</Text>
        <ButtonGroup 
            buttons={['Jem mięso',  'Nie jem mięsa']}
            selectedIndex={ifMeat}
            selectedButtonStyle={{backgroundColor:'#b1ae95'}}
            onPress={(value) => {
              setIfMeat(value)
              setPreferencesMeat(value);
            }}/>                       
                <ButtonGroup 
            buttons={['Jem nabiał',  'Nie jem nabiału']}
            selectedIndex={ifDairy}
            selectedButtonStyle={{backgroundColor:'#b1ae95'}}
            onPress={(value) => {
              setIfDairy(value)
              setPreferencesDairy(value);
            }}/>
                <ButtonGroup 
            buttons={['Jem produkty zbożowe',  'Nie jem produktów zbożowych']}
            selectedIndex={ifGrains}
            selectedButtonStyle={{backgroundColor:'#b1ae95'}}
            onPress={(value) => {
              setIfGrains(value)
              setPreferencesGrains(value);
            }}/>
        </View>
        <Button title="Zmień hasło" buttonStyle={styles.button} onPress={()=>setOpenEdit(!openEdit)}/>
        <View className="border-b-2 border-[#FFF6DC] w-4/5"/>
        <Button title="Usuń konto" buttonStyle={styles.button} onPress={()=>setOpenDrop(!openDrop)}/>
        <View className="border-b-2 border-[#FFF6DC] w-4/5"/>
        <Button title="Wyloguj" buttonStyle={styles.button} onPress={()=>signOut()}/>
        <Modal visible={openDrop}>
              <View className="flex-1 justify-center bg-[#FFF6DC]" >
              <Text className="font-bold p-3" style={{fontSize:hp(5), textAlign:'center'}}>Czy na pewno chcesz usunąć konto? </Text>
              <Text className="pt-3" style={{fontSize:hp(3), textAlign:'center'}}>Ta operacja jest nieodwracalna.</Text>
              <Text className="pb-3" style={{fontSize:hp(2.5), textAlign:'center'}}>Aby zatwierdzić wpisz swoje hasło.</Text>
              <View style={styles.verticallySpaced}>
              <Input
                label="Hasło"
                leftIcon={{ type: 'font-awesome', name: 'lock' }}
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={true}
                placeholder="Hasło"
                autoCapitalize={'none'}
              />
            </View>
              <View className="flex items-center" style={{paddingTop:wp(10), paddingBottom:wp(3)}}>
              <Button  titleStyle={{color:'#7F8D9A'}} buttonStyle={{backgroundColor: '#FFC6AC', borderRadius:25, width:wp(80), padding:wp(5)}} title="USUŃ" onPress={() => deleteAccount()}/>
              </View>
              </View>
            <Button titleStyle={{fontSize:hp(5)}} buttonStyle={{backgroundColor: '#b1ae95',width: wp(100), height:hp(30)}} 
            onPress={()=> {
              setOpenDrop(!openDrop)
              setPassword('');
            }} 
            title='Anuluj' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
            </Modal>
            <Modal visible={openEdit}>
              <View className="flex-1 justify-center bg-[#FFF6DC]" >
              <View style={styles.verticallySpaced}>
              <Input
                label="Stere hasło"
                leftIcon={{ type: 'font-awesome', name: 'lock' }}
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={true}
                placeholder=""
                autoCapitalize={'none'}
              />
                            <Input
                label="Nowe hasło"
                leftIcon={{ type: 'font-awesome', name: 'lock' }}
                onChangeText={(text) => setNewPassword(text)}
                value={newPassword}
                secureTextEntry={true}
                placeholder=""
                autoCapitalize={'none'}
              />
            </View>
              <View className="flex items-center" style={{paddingTop:wp(10), paddingBottom:wp(3)}}>
              <Button  titleStyle={{color:'#7F8D9A'}} buttonStyle={{backgroundColor: '#FFC6AC', borderRadius:25, width:wp(80), padding:wp(5)}} title="ZMIEŃ" onPress={() => editPassword()}/>
              </View>
              </View>
            <Button titleStyle={{fontSize:hp(5)}} buttonStyle={{backgroundColor: '#b1ae95',width: wp(100), height:hp(10)}} 
            onPress={()=> {
              setOpenEdit(!openEdit)
              setPassword('');
              setNewPassword('');
            }} 
            title='Anuluj' style={{backgroundColor:'transparent', borderColor:'transparent'}} inputContainerStyle={{backgroundColor:'white', width:wp(80), height:hp(3)}}/>
            </Modal>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#b1ae95',
    width:wp(100),
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})