import React from 'react';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {View, Text, ImageBackground, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import TableStack from '../templates/TableStack';
import Button from '../../components/atoms/Button';
import moment from 'moment';

const baseURL = "http://192.168.5.91/apieabsen/api/absen/getabsensi?";

export default class Home extends React.Component {
    constructor() {
        super();
        this.state = { 
            isLoading: true,
            currentTime: moment().format("LTS"),
            nama: '',
            shift: '',
            absenTime: null,
            absenType:'Absen Masuk',
            data: [],
            details: [],
            tableHead: ['Jadwal', 'Acuan', 'Jam', 'Status'],
            tableData: [
              ['Masuk', '-', '-', '-'],
              ['Keluar', '-', '-', '-']
            ]  
        }
    }

    componentDidMount() {
        fetch(baseURL + new URLSearchParams({ FS_KD_PEG: 1999 }))
            .then(response => response.json())
            .then(json => {
                this.setState({
                    isLoading: false,
                    data: json.data,
                    details: json.details,
                });
                let newArray = this.state.tableData;
                newArray[0][1] = [this.state.data[0].FD_JADWAL_MASUK.substring(11, 19)];
                newArray[1][1] = [this.state.data[0].FD_JADWAL_KELUAR.substring(11, 19)];
                newArray[0][2] = [this.state.data[0].FD_TRS_MASUK.substring(11, 19)];
                newArray[1][2] = [this.state.data[0].FD_TRS_KELUAR.substring(11, 19)];
                if(newArray[0][1] > newArray[0][2]) { newArray[0][3] = 'Tepat'} else { newArray[0][3] = 'Terlambat'};
                if(newArray[1][1] < newArray[1][2]) { newArray[1][3] = 'Tepat'} else { newArray[1][3] = 'Terlambat'};
                this.setState({nama: this.state.details[0].FS_NM_PEG, shift: this.state.data[0].FS_KD_SHIFT_KERJA, tableData: newArray})
            })
            .catch((error) => alert(error));
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
                            <Text style={{fontFamily:"Mont-Bold"}}>{'\t'}{state.shift}</Text>
                             :
                        </Text>
    
                        <TableStack dataHead={state.tableHead} dataTable={state.tableData}/>
    
                        <TouchableOpacity onPress={this.getAbsenTime}>
                            <Button text={this.state.absenType} bgColor='#FFF' textColor='#00716F'/>
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
        await AsyncStorage.setItem('isLoggedIn', '0');
        this.props.navigation.navigate('Login')
    }
}

const styles = StyleSheet.create(
    {
      timeText: {
        paddingHorizontal:25,
        fontFamily:'Mont-Bold',
        fontSize: 50,
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
        fontSize:18,
        color:'white',
        paddingHorizontal:25,
        marginTop:25
      },

      container: {
          flex:1,
          justifyContent: 'center',
          alignItems:'center'
      }

    });