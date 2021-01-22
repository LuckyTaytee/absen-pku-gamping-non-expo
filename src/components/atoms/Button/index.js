import React from 'react';
import {Text, View, Image, TextInput} from 'react-native';

const Button = props => {
    return (
        <View style={{
            marginHorizontal:55,
            alignItems:"center",
            justifyContent:"center",
            marginTop:20,
            backgroundColor:props.bgColor,
            paddingVertical:8,
            borderRadius:23}}>
                <Text style={{fontFamily:"Mont-Bold", color:props.textColor}}>
                    {props.text}
                </Text>
        </View>
    )
}

export default Button;