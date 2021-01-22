import React from 'react';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {View, Text, ImageBackground, Button, StyleSheet, Platform, FlatList, Dimensions } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

export default class Home extends React.Component {
    constructor() {
        super();
        this.state = { currentTime: null, absenTime: null, absenType:'Absen Masuk',
            tableHead: ['Jadwal', 'Acuan', 'Jam', 'Status'],
            tableData: [
              ['Masuk', '07.00', '-', 'Terlambat'],
              ['Keluar', '14.00', '-', 'Tepat']
            ]  
        }
    }
    
    componentDidMount() {
        this.getCurrentTime();
    }
    
    getCurrentTime = () => {
        let hour = new Date().getHours();
        let minutes = new Date().getMinutes();
        let seconds = new Date().getSeconds();
    
        if (hour < 10) {
            hour = '0' +  hour;
        }

        if (minutes < 10) {
          minutes = '0' + minutes;
        }
    
        if (seconds < 10) {
          seconds = '0' + seconds;
        }
    
        this.setState({ currentTime: hour + ':' + minutes + ':' + seconds});
        this.setState({ absenTime: hour + ':' + minutes});
    }

    getAbsenTime = () => {        
        if (this.state.absenType === "Absen Masuk") {
            let newArray = this.state.tableData;
            newArray[0][2] = [this.state.absenTime];
            alert("Anda Masuk pukul " + newArray[0][2]);
            this.setState({tableData: newArray});
            this.state.absenType = "Absen Keluar"
        } else {
            let newArray = this.state.tableData;
            newArray[1][2] = [this.state.absenTime];
            alert("Anda Keluar pukul " + newArray[1][2]);
            this.setState({tableData: newArray});
            this.state.absenType = "Absen Masuk"
        }
    }
    
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    
    componentDidMount() {
        this.timer = setInterval(() => {
          this.getCurrentTime();
        }, 1000);
    }

    render(){
        const state = this.state;
        const {navigate} = this.props.navigation
        return(
            <ImageBackground
            source={require('../images/bg-home.jpg')}
            style={{width:"100%", height:'100%'}}>

                <View style={{width:'100%', alignSelf:'center', flex:1 }}>    
                    <Text style={[styles.text, { fontFamily:"Mont-Bold", marginTop:35 }]}>
                        Selamat datang,
                        <Text>{'\t'}{'\t'}[Nama]</Text>
                    </Text>

                    <Text style={[styles.text, { fontFamily:"Mont-Regular" }]}>
                        Waktu saat ini :</Text>
                    
                    <Text style={styles.timeText}>
                        {this.state.currentTime}</Text>

                    <Text style={[styles.text, { fontFamily:"Mont-Regular" }]}>
                        Saat ini Anda terjadwal,
                        <Text>{'\t'}{'\t'}[Shift] :</Text>
                    </Text>
                    
                    <View style={styles.container}>
                        <Table borderStyle={{borderWidth: 2, borderColor: '#6B9080'}}>
                            <Row data={state.tableHead} style={styles.tableHead} textStyle={styles.tableText}/>
                            <Rows data={state.tableData} style={styles.tableBody} textStyle={styles.tableText}/>
                        </Table>
                    </View>

                    <TouchableOpacity onPress={this.getAbsenTime}>
                        <View style={[styles.button, {backgroundColor:'white'}]}>
                                <Text style={{fontFamily:"Mont-Bold", color:"#00716F"}}>
                                    {this.state.absenType}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>navigate('History')}>
                        <View style={[styles.button, {backgroundColor:'#06C7C4', marginBottom:25}]}>             
                            <Text id='buttonabsen' style={{fontFamily:"Mont-Bold", color:"#00716F"}}>
                                Riwayat Absen</Text>
                        </View>
                    </TouchableOpacity>
                
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create(
    {
      timeText: {
        marginTop: (Platform.OS === 'ios') ? 0 : 0,
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

      container: { flex: 1, padding: 25},
      tableHead: { height: 40, backgroundColor: '#A4C3B2' },
      tableText: { margin: 6 },
      tableBody: { height: 40, backgroundColor: '#fff' }
  
    });