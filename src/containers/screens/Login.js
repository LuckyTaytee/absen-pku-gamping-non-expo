import React from 'react';
import {Text, View, BackHandler, Alert, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Button from '../../components/atoms/Button/index';
import TextForm from '../../components/atoms/TextForm';
import Header from '../../containers/templates/Header';

import {Permission, PERMISSION_TYPE} from '../../config/permissions/AppPermission'

const baseURL = "http://192.168.5.91/apieabsen/api/auth/loginpegawai"

export default class Login extends React.Component{
    
    constructor() {
        super();
        this.state = { 
            uniqueId: '',
            nik: '',
            password: '',
            response: '',
            secureTextEntry: true
        }
    }

    componentDidMount() {
        Permission.checkPermission(PERMISSION_TYPE.location, Platform.OS)
        this.getUniqueId();
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
    }

    getUniqueId = () => {
        let uniqId = DeviceInfo.getUniqueId();
        this.setState({uniqueId: uniqId});
    };

    storeAsync = async() => {
        await AsyncStorage.setItem('isLoggedIn', '1');
    }

    _login = () => {
        
        if ( this.state.nik == 0 || this.state.password == 0) {
            Alert.alert('Data Belum Lengkap', 'Isi semua data yang diperlukan', [
                {text: 'OK'}
            ]);
            return;
        }

        let dataLogin = new FormData();
        dataLogin.append("FS_KD_DEVICE_ID", this.state.uniqueId);
        dataLogin.append("FS_KD_PEG", this.state.nik);
        dataLogin.append("FS_KD_PASSWORD", this.state.password);

        fetch(baseURL, {
            method:"POST",
            body: dataLogin,
            headers: { apikey: 'eabsenpku' }
            })
            .then(response => response.json())
            .then(json => {
                this.setState({
                    response: json.code,
                });
                if ( this.state.response === 200) {
                    this.storeAsync();
                    this.props.navigation.navigate('Home')
                } else {
                    alert('DeviceID atau Password tidak cocok')
                }
            })

    }

    updateSecureTextEntry = () => {        
        this.setState({ secureTextEntry: !this.state.secureTextEntry });
    }

    backAction = () => {
        Alert.alert("Konfirmasi","Apakah Anda ingin keluar dari aplikasi?", [
          {
            text: "TIDAK",
            onPress: () => null,
            style: "cancel"
          },
          { text: "YA", onPress: () => BackHandler.exitApp() }
        ]);
        return true;
    };

    componentWillUnmount() {
        this.backHandler.remove();
    }
    
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