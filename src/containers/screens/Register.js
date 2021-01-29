import React from 'react';
import {Text, View, BackHandler, Alert, TouchableHighlightBase} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import DeviceInfo from 'react-native-device-info';
import Button from '../../components/atoms/Button/index';
import TextForm from '../../components/atoms/TextForm';
import Header from '../../containers/templates/Header';

const baseURL = "http://192.168.5.91/apieabsen/api/absen/registerPegawai";

export default class Register extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            uniqueId:'',
            nik: '',
            email: '',
            password: '',
            confirm_password: '',
            response: '',
            secureTextEntry: true,
            confirm_secureTextEntry: true };
    }

    componentDidMount() {
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

    updateSecureTextEntry = () => {        
        this.setState({ secureTextEntry: !this.state.secureTextEntry });
    }

    updateConfirmSecureTextEntry = () => {        
        this.setState({ confirm_secureTextEntry: !this.state.confirm_secureTextEntry });
    }

    _register = async() => {

        if ( this.state.nik == 0 || this.state.email == 0 || this.state.password == 0) {
            Alert.alert('Data Belum Lengkap', 'Isi semua data yang diperlukan', [
                {text: 'OK'}
            ]);
            return;
        }

        if ( this.state.password != this.state.confirm_password) {
            Alert.alert('Registrasi gagal', 'Konfirmasi password belum sesuai', [
                {text: 'OK'}
            ]);
            return;
        }

        let dataRegister = new FormData();
        dataRegister.append("FS_KD_DEVICE_ID", this.state.uniqueId);
        dataRegister.append("FS_KD_PEG", this.state.nik);
        dataRegister.append("FS_NM_EMAIL", this.state.email);
        dataRegister.append("FS_KD_PASSWORD", this.state.password);
        fetch(baseURL, {
            method:"POST",
            body: dataRegister,
        })
            .then(response => response.json())
            .then(json => {
                this.setState({
                    response: json.code,
                });
                if ( this.state.response === 200) {
                    Alert.alert('Registrasi berhasil', 'Dapatkan approval dari tim IT terlebih dahulu agar dapat mengakses Login E-Absen')
                    this.props.navigation.navigate('Login');
                } else {
                    Alert.alert('Registrasi belum berhasil', 'Data belum terdaftar pada sistem, silahkan coba lagi')
                }
            })
    }

    backAction = () => {
        this.props.navigation.navigate('Login');
        return true;
    };
    
    componentWillUnmount() {
        this.backHandler.remove();
    }

    render(){
        const {navigate} = this.props.navigation;
        return(
            <View style={{backgroundColor:"#FFF", height:"100%"}}>
                <Header/>

                <TextForm placeholder="NIK" keyboardType="number-pad" onChangeText={(nik)=>this.setState({nik})}/>

                <TextForm placeholder="Email" keyboardType="email-address" onChangeText={(email)=>this.setState({email})}/>

                <TextForm placeholder="Password"
                    onChangeText={(password)=>this.setState({password})}
                    secure={this.state.secureTextEntry ? true : false }
                    onPress={this.updateSecureTextEntry}
                    condition={this.state.secureTextEntry}
                    nameIcon1="eye"
                    nameIcon2="eye-off"/>

                <TextForm placeholder="Konfirmasi Password"
                    onChangeText={(confirm_password)=>this.setState({confirm_password})}
                    secure={this.state.confirm_secureTextEntry ? true : false }
                    onPress={this.updateConfirmSecureTextEntry}
                    condition={this.state.confirm_secureTextEntry}
                    nameIcon1="eye"
                    nameIcon2="eye-off"/>

                <View style={{marginBottom:20}}></View>

                <TouchableOpacity onPress={this._register}>
                    <Button text='Register' bgColor='#00716F' textColor='#FFF'/>
                </TouchableOpacity>

                <View style={{marginBottom:20}}></View>

                <TouchableOpacity onPress={()=>navigate('Login')}>
                    <Button text='Kembali untuk Login' bgColor='#FFF' textColor='#00716F'></Button>
                </TouchableOpacity>

            </View>
        )
    }
}