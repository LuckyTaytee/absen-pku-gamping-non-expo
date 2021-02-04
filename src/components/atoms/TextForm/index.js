import React from 'react';
import {Text, View, Image, TextInput} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';

const TextForm = props => {
    return (
        <View style={{
            flexDirection:"row",
            alignItems:"center",
            marginHorizontal:55,
            borderWidth:2,
            paddingHorizontal:20,
            borderColor:"#00716F",
            borderRadius:20}}>
                <TextInput style={{flex:1, color:'#00716F'}}
                    placeholder={props.placeholder}
                    placeholderTextColor="#00716F"
                    keyboardType={props.keyboardType}
                    onChangeText={props.onChangeText}
                    secureTextEntry={props.secure}
                    maxLength={props.maxLength}
                    autoCapitalize='none'/>
                <TouchableOpacity onPress={props.onPress}>
                    {props.condition ? <Feather name={props.nameIcon1} color="#00716F" size={20}/> : <Feather name={props.nameIcon2} color="#00716F" size={20}/>}
                </TouchableOpacity>
        </View>
    )
}

export default TextForm;