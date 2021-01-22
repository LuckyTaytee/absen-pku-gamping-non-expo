import React from 'react';
import {Text, View, Image, TextInput, StyleSheet} from 'react-native';

const Header = props => {
    return (
        <View>
            <Image style = {{width:125, height:125, alignSelf:'center', marginTop:35}}
                    source = {require('../../../assets/images/logo.jpg')} />

            <Text style = {{alignSelf:"center", color:"#00716F", fontSize:35, fontFamily:"Mont-Bold" }}>
                E-Absen</Text>
                
            <Text style = {{alignSelf:"center", color:"#00716F", fontSize:20, fontFamily:"Mont-Regular", marginBottom:20 }}>
                PKU Gamping</Text>
        </View>
    )
}

export default Header;