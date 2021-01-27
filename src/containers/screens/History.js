import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, Platform, FlatList, Dimensions } from 'react-native';
import TableStack from '../templates/TableStack';

const baseURL = "http://192.168.5.91/apieabsen/api/absen/getdata?";

export default function History() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(baseURL + new URLSearchParams({ FS_KD_PEG: 2000 }))
            .then(response => response.json())
            .then(json => {
                setData(json.data);
            })
            .catch((error) => alert(error));
    }, []);


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
                    Riwayat Absen (3 terakhir)
                </Text>
            </View>

            <View style={{ flex: 1, marginHorizontal: 25, marginTop: 10 }}>
                <View style={[styles.listWrapper, {backgroundColor:'#A4C3B2'}]}>
                    <Text style={styles.movie}>Tanggal</Text>
                    <Text style={styles.movie}>Acuan Masuk</Text>
                    <Text style={styles.movie}>Acuan Keluar</Text>
                    <Text style={styles.movie}>Absen Masuk</Text>
                    <Text style={styles.movie}>Absen Keluar</Text>
                </View>
                <FlatList data={data}
                    keyExtractor={({ id }, index) => id}
                    renderItem={({ item }) => (
                        <View style={[styles.listWrapper, {backgroundColor:'#FFF'}]}>
                            <Text style={styles.movie}>{item.FD_JADWAL_MASUK.substring(5, 10).split("-").reverse().join("/")}</Text>
                            <Text style={styles.movie}>{item.FD_JADWAL_MASUK.substring(11, 16)}</Text>
                            <Text style={styles.movie}>{item.FD_JADWAL_KELUAR.substring(11, 16)}</Text>
                            <Text style={styles.movie}>{item.FD_TRS_MASUK.substring(11, 16)}</Text>
                            <Text style={styles.movie}>{item.FD_TRS_KELUAR.substring(11, 16)}</Text>
                        </View>
                    )}
                />
            </View>

        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        marginTop: 24
    },
    movie: {
        flex: 1,
        alignSelf: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: "bold"
    },
    description: {
        textAlign: "center",
        marginBottom: 18,
        fontWeight: "200",
        color: "green",
    },
    listWrapper: {
        padding: 10, flexDirection: 'row', borderWidth: 1, borderColor: "#6B9080"
    }
});