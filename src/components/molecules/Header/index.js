import React from 'react';
import {Text, View, Image} from 'react-native';

const Header = () => {
    return (
        <View>
            <Image style = {{width:100, height:100, alignSelf:'center', marginTop:20}}
                source = {require('../../../assets/images/logo.jpg')} />

            <Text style = {{alignSelf:"center", color:"#00716F", fontSize:30, fontFamily:"Mont-Bold" }}>
                E-Absen</Text>
                
            <Text style = {{alignSelf:"center", color:"#00716F", fontSize:18, fontFamily:"Mont-Regular", marginBottom:20 }}>
                PKU Gamping</Text>
        </View>
    )
}

export default Header;