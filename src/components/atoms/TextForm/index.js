import React from 'react';
import {Text, View, Image, TextInput} from 'react-native';

const TextForm = props => {
    return (
        <View style={{
            flexDirection:"row",
            alignContent:"center",
            marginHorizontal:55,
            borderWidth:2,
            marginTop:10,
            paddingHorizontal:10,
            borderColor:"#00716F",
            borderRadius:20}}>
                <TextInput style={{paddingHorizontal:10}}
                    placeholder={props.placeholder}
                    placeholderTextColor="#00716F"
                    keyboardType={props.keyboardType}
                    secureTextEntry={props.secure}/>
        </View>
    )
}

export default TextForm;