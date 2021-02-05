import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {View, Text, ImageBackground, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import TableStack from '../../components/molecules/TableStack';
import Button from '../../components/atoms/Button';
import moment from 'moment';

import Geolocation from 'react-native-geolocation-service';
import DistanceLatLon from '../../config/geolocations/DistanceLatLon';
import AsyncStore from '../../config/async-storage/AsyncStorage'

const baseURL = "http://192.168.5.91/apieabsen/api/absen/getabsensi?";
const width = Dimensions.get('window').width;

export default class Home extends React.Component {
    constructor() {
        super();
        this.state = { 
            isLoading: true,
            currentTime: moment().format("LTS"),
            absenTime: null,
            absenType:'Absen Masuk',
            tableHead: ['Jadwal', 'Acuan', 'Jam', 'Status'],
            tableData: [ ['Masuk', '-', '-', '-'], ['Keluar', '-', '-', '-'] ]  
        }
    }

    componentDidMount = async() => {
        fetch(baseURL + new URLSearchParams({ FS_KD_PEG: await AsyncStore.getAsync('asyncNIK')}), {
            headers: { apikey: 'eabsenpku' }
        })
            .then(response => response.json())
            .then(json => {
                this.setState({
                    isLoading: false,
                    data: json.data
                });
                let newArray = this.state.tableData;
                if( this.state.data.shift != 0) {
                    this.setState({shift: this.state.data.shift[0].FS_KD_SHIFT_KERJA})
                    console.log(1)
                } else {
                    this.setState({shift: this.state.data.absen[0].FS_KD_SHIFT_KERJA})
                    console.log(2)
                }
                newArray[0][1] = [this.state.data.absen[0].FD_JADWAL_MASUK.substring(11, 19)];
                newArray[1][1] = [this.state.data.absen[0].FD_JADWAL_KELUAR.substring(11, 19)];
                newArray[0][2] = [this.state.data.absen[0].FD_TRS_MASUK.substring(11, 19)];
                newArray[1][2] = [this.state.data.absen[0].FD_TRS_KELUAR.substring(11, 19)];
                if( this.state.data.absen[0].FN_TELAT_MASUK != 0) { newArray[0][3] = 'Terlambat' } else { newArray[0][3] = 'Tepat'};
                if( this.state.data.absen[0].FN_DULU_KELUAR != 0 && newArray[1][2] != "00:00:00" ) { newArray[1][3] = 'Dulu Keluar'};
                if( this.state.data.absen[0].FN_DULU_KELUAR == 0 && newArray[1][2] != "00:00:00" ) { newArray[1][3] = 'Tepat'};
                this.setState({nama: this.state.data.details[0].FS_NM_PEG, tableData: newArray})
            })
            .catch((error) => alert(error));
        this.getUserPosition();
    }

    getUserPosition = () => {
        Geolocation.getCurrentPosition(
            this.geoSuccess,
            error => {this.setState({ 
                error: error.message,
                distanceFeedback : 'Akses Lokasi belum diberikan, keluar dari Aplikasi E-Absen lalu jalankan ulang.' })},
            { enableHighAccuracy: true, timeOut: 20000, maximumAge: 1000 }
        );
    }

    geoSuccess = (position) => {
        this.setState({lat: position.coords.latitude, lon: position.coords.longitude})
        let distancee = DistanceLatLon(-7.8003602, 110.317859, this.state.lat, this.state.lon)
        var r = Math.round((distancee + Number.EPSILON) * 100) / 100
        console.log(r)
        this.setState({distance: r})
        if ( r > 0.2) {this.setState({distanceFeedback: 'Anda berada diluar zona RS PKU Gamping.'})}
    }

    render(){
        setTimeout(() => {
            this.setState({
                currentTime: moment().format("LTS")
            })
        }, 1000)

        const state = this.state;
        const {navigate} = this.props.navigation

        if (state.isLoading) {
            return(
                <View style={styles.container}>
                    <ActivityIndicator size="large" animating/>
                </View>
            )
        } else {
            return(
                <ImageBackground
                source={require('../../assets/images/bg-home.jpg')}
                style={{width:"100%", height:'100%'}}>
    
                    <View style={{width:'100%', alignSelf:'center', flex:1, marginBottom:25 }}>    
                        <Text style={[styles.text, { fontFamily:"Mont-Regular", marginTop:35 }]}>
                            Selamat datang,</Text>

                        <Text style={[styles.text, { fontFamily:"Mont-Bold" }]}>
                            {state.nama}</Text>
    
                        <Text style={[styles.text, { fontFamily:"Mont-Regular" }]}>
                            Waktu saat ini :</Text>
                        
                        <Text style={styles.timeText}>
                            {this.state.currentTime}</Text>
    
                        <Text style={[styles.text, { fontFamily:"Mont-Regular" }]}>
                            Saat ini Anda terjadwal,
                            <Text style={{fontFamily:"Mont-Bold"}}>{'\t'}{'\t'}{state.shift}</Text>
                             :
                        </Text>
    
                        <TableStack dataHead={state.tableHead} dataTable={state.tableData}/>

                        {this.state.distance < 0.2 && this.state.distance != 0 ? 
                            <Text style={[styles.text, { fontFamily:"Mont-Regular", textAlign: 'center' }]}>
                            Lokasi anda berada, {this.state.distance} km dari RS PKU Gamping.</Text>
                            : 
                            <Text style={[styles.text, { fontFamily:"Mont-Regular", textAlign: 'center' }]}>
                            {this.state.distanceFeedback}</Text>
                        }

                        <View style={{marginBottom:20}}></View>

                        <TouchableOpacity onPress={this.getAbsenTime}>
                            {this.state.distance < 0.2 && this.state.distance != 0 ?
                                <Button text={this.state.absenType} bgColor='#FFF' textColor='#00716F'/> :
                                null }
                        </TouchableOpacity>

                        <View style={{marginBottom:20}}></View>
    
                        <TouchableOpacity onPress={()=>navigate('History')}>
                            <Button text='Riwayat Absen' bgColor='#06C7C4' textColor='#00716F'/>
                        </TouchableOpacity>

                        <View style={{marginBottom:20}}></View>

                        <TouchableOpacity onPress={this._logout}> 
                            <Button text='Log Out' bgColor='red' textColor='white'/>
                        </TouchableOpacity>
                    
                    </View>
                </ImageBackground>
            );
        }
    }

    _logout = async() => {
        AsyncStore.setAsync('isLoggedIn', '0');
        AsyncStore.setAsync('asyncNIK', '');
        this.props.navigation.navigate('Login')
    }
}

const styles = StyleSheet.create(
    {
      timeText: {
        paddingHorizontal:25,
        fontFamily:'Mont-Bold',
        fontSize: 0.1*width,
        color: 'white'
      },

      button: {
        marginHorizontal:55,
        alignItems:"center",
        justifyContent:"center",
        marginTop:20,
        paddingVertical:8,
        borderRadius:23
      },

      text: {
        fontSize:0.05*width,
        color:'white',
        paddingHorizontal:25,
        marginTop:10
      },

      container: {
          flex:1,
          justifyContent: 'center',
          alignItems:'center'
      }

    });