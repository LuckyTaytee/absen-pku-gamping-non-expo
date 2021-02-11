import React from 'react';
import { View, Text, ImageBackground, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import AsyncStore from '../../config/async-storage/AsyncStorage';

import Button from '../../components/atoms/Button'

const baseURL = "http://103.247.120.115/apieabsen/api/absen/getdata?";

export default class History extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            data: [] 
        }
    }

    componentDidMount = async() => {
        fetch(baseURL + new URLSearchParams({ FS_KD_PEG: await AsyncStore.getAsync('asyncNIK') }), {
            headers: { apikey: 'eabsenpku' }
        })
            .then(response => response.json())
            .then(json => {
                this.setState({
                    isLoading:  false,
                    data: json.data                 // Set Data from API
                });
            })
            .catch((error) => alert(error));
           
    }

    render(){
        const navigate = this.props.navigation

        if (this.state.isLoading) {                                                        
            return(   
                <ImageBackground
                source={require('../../assets/images/bg-home.jpg')}
                style={{ width: "100%", height: '100%' }}>
                    <View style={styles.container}>
                        <ActivityIndicator size="large" color="#ffff" animating={true}/>
                    </View>
                </ImageBackground>   
            )
        } else {
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
    
                        <TouchableOpacity onPress={()=>navigate.goBack()}>
                            <Button text='Kembali' bgColor='#06C7C4' textColor='#00716F'/>
                        </TouchableOpacity>
    
                        <View style={{marginBottom:40}}></View>
                    </View>
        
                </ImageBackground>
            );
        }
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
    },
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems:'center'
    }
});