import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View, Text, ImageBackground, StyleSheet, ActivityIndicator, Dimensions, Alert } from 'react-native';
import TableStack from '../../components/molecules/TableStack';
import Button from '../../components/atoms/Button';
import moment from 'moment';

import Geolocation from 'react-native-geolocation-service';
import DistanceLatLon from '../../config/geolocations/DistanceLatLon';
import AsyncStore from '../../config/async-storage/AsyncStorage'

const baseURL = "http://103.247.120.115/apieabsen/api/absen/";
const width = Dimensions.get('window').width;

export default class Home extends React.Component {
    constructor() {
        super();
        this.state = { 
            isLoading: true,
            isAbsenSuccess: false,
            currentTime: moment().format("LTS"),
            absenTime: null 
        }
    }

    componentDidMount = () => {
        this.getUserPosition();                                                 // Get user position via GPS Location
        this._getAbsensi();                                                     // Get function to fill table
    }

    _getAbsensi = async() => {
        this.setState({
            tableHead: ['Jadwal', 'Acuan', 'Jam', 'Terlambat'],
            tableData: [ ['Masuk', '-', '-', '-'], ['Keluar', '-', '-', '-'] ] 
        })

        fetch(baseURL + "getabsensi?" + new URLSearchParams({ FS_KD_PEG: await AsyncStore.getAsync('asyncNIK') }), {
            headers: { apikey: 'eabsenpku' }
        })
            .then(response => response.json())
            .then(json => {
                this.setState({
                    isLoading: false,
                    isButtonLoading: false,
                    data: json.data
                }, () => this._setAbsensi());

                console.log(this.state.data.status)

                if( this.state.data.status.masuk[0].MASUK == 0 &&
                    this.state.data.status.selesai[0].SELESAI == 0 &&
                    this.state.data.status.tdk_absen_masuk[0].TDKMASUK == 0 ) {
                    this.setState({absenType: "Absen Masuk"})
                    return
                }

                if( this.state.data.status.keluar[0].KELUAR == 1 && this.state.data.status.selesai[0].SELESAI == 0 ) {
                    this.setState({absenType: "Absen Keluar"})
                    if( this.state.isAbsenSuccess == true) {
                        alert("Absen Masuk berhasil.")
                    }
                    return
                }
                
                if( this.state.data.status.selesai[0].SELESAI == 1 && this.state.data.status.keluar[0].KELUAR == 1 ) {
                    this.setState({distance: 0, distanceFeedback: "Anda sudah absen hari ini."})
                    if( this.state.isAbsenSuccess == true) {
                        alert("Absen Keluar berhasil.")
                    }
                    return
                }

                if( this.state.data.status.selesai[0].SELESAI == 1 && this.state.data.status.keluar[0].KELUAR == 0 ) {
                    this.setState({distance: 0, distanceFeedback: "Cek kembali jadwal Anda."})
                    if( this.state.isAbsenSuccess == true) {
                        alert("Absen tidak sesuai jadwal. Cek kembali jadwal Anda.")
                    }
                    return
                }

                if( this.state.data.status.tdk_absen_masuk[0].TDKMASUK == 1 ) {
                    this.setState({distance: 0, distanceFeedback: "Data absen masuk tidak ditemukan."})
                    if( this.state.isAbsenSuccess == true) {
                        alert("Data absen masuk tidak ditemukan.")
                    }
                    return
                }
                this.setState({ isButtonLoading: false });
            })
            .catch((error) => alert(error));
    }

    _setAbsensi = () => {
        let newArray = this.state.tableData;                                                    // Set local array
        if( this.state.data.shift != 0) {
            this.setState({shift: this.state.data.shift[0].FS_KD_SHIFT_KERJA})                  // Set shift for Shift Employee
        } else {
            this.setState({shift: this.state.data.absen[0].FS_KD_SHIFT_KERJA})                  // Set shift for Non-Shift Employee
        }
        newArray[0][1] = [this.state.data.absen[0].FD_JADWAL_MASUK.substring(11, 19)]           // Set 'Jadwal Masuk'
        newArray[1][1] = [this.state.data.absen[0].FD_JADWAL_KELUAR.substring(11, 19)]          // Set 'Jadwal Keluar'
        newArray[0][2] = [this.state.data.absen[0].FD_TRS_MASUK.substring(11, 19)]              // Set 'Absen Masuk'
        newArray[1][2] = [this.state.data.absen[0].FD_TRS_KELUAR.substring(11, 19)]             // Set 'Absen Keluar'
        if( this.state.data.absen[0].FN_TELAT_MASUK != 0) {
            newArray[0][3] = [this.state.data.absen[0].FN_TELAT_MASUK + " menit"] }             // Set 'Masuk' Late
        if( this.state.data.absen[0].FN_DULU_KELUAR != 0) { 
            newArray[1][3] = [this.state.data.absen[0].FN_DULU_KELUAR + " menit"] }             // Set 'Keluar' Late
        this.setState({nama: this.state.data.details[0].FS_NM_PEG, tableData: newArray})        // Set employee name and new filled array
    }

    doAbsen = async() => {
        this.setState({ isButtonLoading: true });
        await this._absen();
    }

    _absen = async() => {
        let dataAbsen = new FormData();
        dataAbsen.append("FS_KD_PEG", await AsyncStore.getAsync('asyncNIK'));
        
        fetch(baseURL + "nowabsen", {
            method: "POST",
            body: dataAbsen,
            headers: { apikey: 'eabsenpku' }
            })
            .then(response => response.json())
            .then(json => {
                this.setState({
                    response: json.code,
                });
                if ( this.state.response != 200) {
                    alert('Absen Gagal');
                } else {
                    this.setState({isAbsenSuccess: true},
                    () => setTimeout(this._getAbsensi, 1000)
                    )
                }           
            })
    }

    getUserPosition = () => {
        Geolocation.getCurrentPosition(
            this.geoSuccess,                                                    // Success Callback
            error => {this.setState({                                           // Error Callback
                error: error.message,
                distanceFeedback : 'Lokasi Anda belum terdeteksi, pastikan GPS Anda aktif.' })},
            { enableHighAccuracy: true, timeOut: 20000, maximumAge: 1000 }      // Geo Options
        );
    }

    geoSuccess = (position) => {
        console.log(position);
        if (position.mocked != false) {
            this.setState({ distanceFeedback: 'HP anda terdeteksi menggunakan aplikasi Fake GPS. Harap menghapus aplikasi tersebut terlebih dahulu.'})
        } else {
            this.setState({lat: position.coords.latitude, lon: position.coords.longitude})                  // Get User Lat & Lon
            let distancee = DistanceLatLon(-7.8003602, 110.317859, this.state.lat, this.state.lon)          // Calculate Distance
            var r = Math.round((distancee + Number.EPSILON) * 100) / 100                                    // Rounding to two decimal numbers
            console.log(r)
            this.setState({distance: r})                                                                    // Set Distance
            if ( r > 0.5) {this.setState({distanceFeedback: 'Anda berada diluar zona RS PKU Gamping.'})}    // Handle if user too far from location
        }
    }

    _logout = async() => {                                                  // Log Out Handler
        AsyncStore.setAsync('isLoggedIn', '0');                             // Remove Async Log In                    
        AsyncStore.setAsync('asyncNIK', '');                                // Remove Async NIK
        this.props.navigation.navigate('Login')
    }

    render(){
        setTimeout(() => {
            this.setState({
                currentTime: moment().format("LTS")                                     // Set clock, refreshes every second
            })
        }, 1000)

        const state = this.state;
        const {navigate} = this.props.navigation

        if (state.isLoading) {                                                          // Loading Handle
            return(                                                                     // Display Loading Screen
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#ff" animating={true} />
                </View>
            )
        } else {
            return(                                                                     // Display Home Screen
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
    
                        <TableStack dataHead={state.tableHead} dataTable={state.tableData} fontSize={0.035*width}/>

                        {this.state.distance < 0.2 && this.state.distance != 0 ? 
                            <Text style={[styles.text, { fontFamily:"Mont-Regular", textAlign: 'center' }]}>
                            Lokasi anda berada, {this.state.distance} km dari RS PKU Gamping.</Text>
                            : 
                            <Text style={[styles.text, { fontFamily:"Mont-Regular", textAlign: 'center', fontSize:16 }]}>
                            {this.state.distanceFeedback}</Text>
                        }

                        <View style={{marginBottom:20}}></View>

                        <TouchableOpacity onPress={this.doAbsen}>
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

                        {this.state.isButtonLoading &&
                            <View style={styles.loading}>
                                <ActivityIndicator size='large' color="#00ff00" animating={true} />
                            </View>
                        }
                    
                    </View>
                </ImageBackground>
            );
        }
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
      },

      loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,            
        opacity: 0.5,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
      }

    });