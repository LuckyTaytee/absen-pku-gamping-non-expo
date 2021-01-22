import React, { Component } from 'react';
import {View, Text, ImageBackground, StyleSheet, Platform, FlatList, Dimensions } from 'react-native';
import TableStack from '../templates/TableStack';

export default class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          tableHead: ['Tanggal', 'Acuan Masuk', 'Acuan Keluar', 'Absen Masuk', 'Absen Keluar'],
          tableData: [
            ['01/01', '07.00', '14.00', '07.05', '14.05'],
            ['01/01', '07.00', '14.00', '07.05', '14.05'],
            ['01/01', '07.00', '14.00', '07.05', '14.05']
            ]          
        }
    }

    render(){
        const state = this.state;
        return(
            <ImageBackground
            source={require('../../assets/images/bg-home.jpg')}
            style={{width:"100%", height:'100%'}}>

                <View style={{paddingHorizontal:25, marginTop:50}}>
                    <Text style={{
                        fontFamily:'Mont-Bold',
                        fontSize:20,
                        color:'white',
                    }}>
                        Riwayat Absen (3 terakhir)
                    </Text>
                </View>

                <TableStack dataHead={state.tableHead} dataTable={state.tableData}/>

            </ImageBackground>
        );
    }
}