import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Platform, FlatList, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const baseURL = "http://192.168.5.91/apieabsen/api/absen/getdata?";

export default class History extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [] 
        }
    }

    componentDidMount = async() => {
        fetch(baseURL + new URLSearchParams({ FS_KD_PEG: await AsyncStorage.getItem('asyncNIK') }), {
            headers: { apikey: 'eabsenpku' }
        })
            .then(response => response.json())
            .then(json => {
                this.setState({
                    data: json.data
                });
            })
            .catch((error) => alert(error));
           
    }

    render(){
        return (
            <ImageBackground
                source={require('../../assets/images/bg-home.jpg')}
                style={{ width: "100%", height: '100%' }}>
    
                <View style={{ paddingHorizontal: 25, marginTop: 30 }}>
                    <Text style={{
                        fontFamily: 'Mont-Bold',
                        fontSize: 20,
                        color: 'white',
                    }}>
                        Riwayat Absen (5 terakhir)
                    </Text>
                </View>
    
                <View style={{ flex: 1, marginHorizontal: 25, marginTop: 10 }}>
                    <View style={[styles.listWrapper, {backgroundColor:'#A4C3B2'}]}>
                        <Text style={styles.textTable}>Tanggal</Text>
                        <Text style={styles.textTable}>Acuan Masuk</Text>
                        <Text style={styles.textTable}>Acuan Keluar</Text>
                        <Text style={styles.textTable}>Absen Masuk</Text>
                        <Text style={styles.textTable}>Absen Keluar</Text>
                    </View>
                    <FlatList data={this.state.data}
                        keyExtractor={({ id }, index) => id}
                        renderItem={({ item }) => (
                            <View style={[styles.listWrapper, {backgroundColor:'#FFF'}]}>
                                <Text style={styles.textTable}>{item.FD_JADWAL_MASUK.substring(5, 10).split("-").reverse().join("/")}</Text>
                                <Text style={styles.textTable}>{item.FD_JADWAL_MASUK.substring(11, 16)}</Text>
                                <Text style={styles.textTable}>{item.FD_JADWAL_KELUAR.substring(11, 16)}</Text>
                                <Text style={styles.textTable}>{item.FD_TRS_MASUK.substring(11, 16)}</Text>
                                <Text style={styles.textTable}>{item.FD_TRS_KELUAR.substring(11, 16)}</Text>
                            </View>
                        )}
                    />
                </View>
    
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    textTable: {
        flex: 1,
        alignSelf: 'center',
    },
    description: {
        textAlign: "center",
        marginBottom: 18,
        fontWeight: "200",
        color: "green",
    },
    listWrapper: {
        padding: 10, flexDirection: 'row', borderWidth: 1.1, borderColor: "#6B9080"
    }
});