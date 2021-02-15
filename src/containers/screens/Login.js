import React from 'react';
import {Text, View, BackHandler, Alert, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Button from '../../components/atoms/Button/index';
import TextForm from '../../components/atoms/TextForm';
import Header from '../../components/molecules/Header';

import {Permission, PERMISSION_TYPE} from '../../config/permissions/AppPermission';
import AsyncStore from '../../config/async-storage/AsyncStorage'

const baseURL = "http://103.247.120.115/apieabsen/api/auth/loginpegawai"

export default class Login extends React.Component{
    
    constructor() {
        super();
        this.state = { 
            nik: '',
            password: '',
            secureTextEntry: true
        }
    }

    componentDidMount() {
        Permission.checkPermission(PERMISSION_TYPE.location, Platform.OS)       // Ask Permission to use GPS location on Android & IOS
        this.setState({ uniqueId: DeviceInfo.getUniqueId()})                    // Get Unique Device ID
        this.backHandler = BackHandler.addEventListener(                        
            "hardwareBackPress",                                                // Set Device Back Button Handler
            this.backAction
        );
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    _login = () => {
        
        if ( this.state.nik == 0 || this.state.password == 0) {
            Alert.alert('Data Belum Lengkap', 'Isi semua data yang diperlukan', [       // Empty Input Handler
                {text: 'OK'}
            ]);
            return;
        }

        let dataLogin = new FormData();
        dataLogin.append("FS_KD_DEVICE_ID", this.state.uniqueId);                       // Forming Body for Fetch
        dataLogin.append("FS_KD_PEG", this.state.nik);
        dataLogin.append("FS_KD_PASSWORD", this.state.password);

        fetch(baseURL, {
            method: "POST",
            body: dataLogin,
            headers: { apikey: 'eabsenpku' }
            })
            .then(response => response.json())
            .then(json => {
                this.setState({
                    response: json.code,                                                // Set response code
                });
                if ( this.state.response != 200) {
                    alert('DeviceID atau Password tidak cocok');                        // Wrong Input Handler
                } else {
                    AsyncStore.setAsync('isLoggedIn', '1');                             // Async Keep Logged In
                    this.props.navigation.navigate('Home');
                }           
            })
            .catch((error) => alert('Login gagal, pastikan Anda terhubung ke jaringan internet.'));
            AsyncStore.setAsync('asyncNIK', this.state.nik)
    }

    updateSecureTextEntry = () => {        
        this.setState({ secureTextEntry: !this.state.secureTextEntry });                // Set Visibility Password
    }

    backAction = () => {
        Alert.alert("Konfirmasi","Apakah Anda ingin keluar dari aplikasi?", [           // Set alert when back pressed
          {
            text: "TIDAK",
            onPress: () => null,
            style: "cancel"
          },
          { text: "YA", onPress: () => BackHandler.exitApp() }
        ]);
        return true;
    };
    
    render(){
        const {navigate} = this.props.navigation;
        return(
            <View style={{backgroundColor:'#FFF', height:'100%'}}>
                
                <Header/>

                <TextForm placeholder="NIK"
                    keyboardType="number-pad"
                    onChangeText={(nik)=>this.setState({nik})}
                    maxLength={4}
                    value={this.state.nik}/>

                <View style={{marginBottom:15}}></View>

                <TextForm placeholder="Password"
                    onChangeText={(password)=>this.setState({password})}
                    maxLength={20}
                    value={this.state.password}
                    secure={this.state.secureTextEntry ? true : false }
                    onPress={this.updateSecureTextEntry}
                    condition={this.state.secureTextEntry}
                    nameIcon1="eye"
                    nameIcon2="eye-off"/>
 
                <View style={{marginBottom:20}}></View>

                <TouchableOpacity onPress={this._login}>
                    <Button text='Login' bgColor='#00716F' textColor='#FFF'/>
                </TouchableOpacity>

                <Text style={{ alignSelf:"center", marginTop:20, fontFamily:'Mont-Regular'}}>Belum punya akun?</Text>
                    
                <TouchableOpacity onPress={()=>navigate('Register')}>
                    <Button text='Register' bgColor='#FFF' textColor='#00716F'></Button>
                </TouchableOpacity>

            </View>
        )
    }
}