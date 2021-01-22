import React, { Component } from 'react';
import {View, Text, ImageBackground, StyleSheet, Platform, FlatList, Dimensions } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component'

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
            source={require('../images/bg-home.jpg')}
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

                <View style={styles.container}>
                    <Table borderStyle={{borderWidth: 2, borderColor: '#6B9080'}}>
                        <Row data={state.tableHead} style={styles.head} textStyle={styles.text}/>
                        <Rows data={state.tableData} style={styles.body} textStyle={styles.text}/>
                    </Table>
                </View>

            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create(
    {
      container: { flex: 1, padding: 25},
      head: { height: 40, backgroundColor: '#A4C3B2' },
      text: { margin: 6 },
      body: { height: 40, backgroundColor: '#fff' }
    }
);