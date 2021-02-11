import React from 'react';
import {Text, View, BackHandler, Alert, ScrollView, KeyboardAvoidingView} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import DeviceInfo from 'react-native-device-info';
import Button from '../../components/atoms/Button/index';
import TextForm from '../../components/atoms/TextForm';
import Header from '../../components/molecules/Header';

const baseURL = "http://103.247.120.115/apieabsen/api/auth/registerPegawai";

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
            confirm_secureTextEntry: true
        };
    }

    componentDidMount() {
        this.setState({ uniqueId: DeviceInfo.getUniqueId()})
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
          );
    }

    _register = async() => {

        let dataRegister = new FormData();
        dataRegister.append("FS_KD_DEVICE_ID", this.state.uniqueId);
        dataRegister.append("FS_KD_PEG", this.state.nik);
        dataRegister.append("FS_NM_EMAIL", this.state.email);
        dataRegister.append("FS_KD_PASSWORD", this.state.password);

        fetch(baseURL, {
            method:"POST",
            body: dataRegister,
            headers: { apikey: 'eabsenpku' }
        })
            .then(response => response.json())
            .then(json => {
                this.setState({
                    response: json.code,
                });
                switch (this.state.response) {
                    case 200:
                        Alert.alert('Registrasi berhasil', 'Silahkan Login E-Absen dengan NIK yang sudah didaftarkan')      // Success Handler
                        this.props.navigation.navigate('Login');
                        break;
                    case 400:
                        Alert.alert('Registrasi gagal', 'Perangkat Anda sudah pernah diregistrasi')                                                 // Duplicate Attempt Handler
                      break;
                    default:
                        Alert.alert('Registrasi belum berhasil', 'Data belum terdaftar pada sistem, silahkan coba lagi')                            // Error Handler
                }
            })
    }

    backAction = () => {
        this.props.navigation.goBack();
        return true;
    };
    
    componentWillUnmount() {
        this.backHandler.remove();
    }

    handleEmailChange = (val) => {
        console.log(val);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(val) === false) {
            this.setState({ 
                email: val,
                isValidEmail: false
            })
            return false;
        }
        else {
            this.setState({ 
                email: val,
                isValidEmail: true
            })
        }
    }

    handlePasswordChange = (val) => {       // Handle Password Input
        if( val.trim().length >= 4 ) {      // Handle Password if valid                                                    
            this.setState({
                password: val,
                isValidPassword: true 
            })
        } else {                            // Handle Password if not valid
            this.setState({
                password: val,
                isValidPassword: false
            })
        }
    }

    updateSecureTextEntry = () => {        
        this.setState({ secureTextEntry: !this.state.secureTextEntry });                    // Password Visibilty
    }

    updateConfirmSecureTextEntry = () => {        
        this.setState({ confirm_secureTextEntry: !this.state.confirm_secureTextEntry });    // Confirm Password Visibility
    }

    render(){
        const navigate = this.props.navigation;
        return(
            <KeyboardAvoidingView style={{flex: 1, backgroundColor:"#FFF"}} behavior="height" >
                <ScrollView>
                    <Header/>

                    <TextForm placeholder="NIK"
                        keyboardType="number-pad"
                        maxLength={4}
                        onChangeText={(nik)=>this.setState({nik})}/>

                    <View style={{marginBottom:17}}></View>

                    <TextForm placeholder="Email"
                        keyboardType="email-address"
                        onChangeText={(val) => this.handleEmailChange(val)}
                        value={this.state.email}/>

                    { this.state.email == '' ?
                        <Text style={{marginHorizontal:70, color:'white'}}></Text> :
                            this.state.isValidEmail != true ?
                                <Text style={{marginHorizontal:70, color:'grey'}}>Email belum valid</Text> :
                                <Text style={{marginHorizontal:70, color:'white'}}></Text> }
                
                    <TextForm placeholder="Password"
                        onChangeText={(val) => this.handlePasswordChange(val)}
                        maxLength={20}
                        secure={this.state.secureTextEntry ? true : false }
                        onPress={this.updateSecureTextEntry}
                        condition={this.state.secureTextEntry}
                        nameIcon1="eye"
                        nameIcon2="eye-off">
                        </TextForm>

                    { this.state.password == '' ?
                        <Text style={{marginHorizontal:70, color:'white'}}></Text> :
                        this.state.isValidPassword != true ?
                        <Text style={{marginHorizontal:70, color:'grey'}}>Password minimal 4 karakter</Text> :
                        <Text style={{marginHorizontal:70, color:'white'}}></Text>
                        }

                    <TextForm placeholder="Konfirmasi Password"
                        onChangeText={(confirm_password)=>this.setState({confirm_password})}
                        maxLength={20}
                        secure={this.state.confirm_secureTextEntry ? true : false }
                        onPress={this.updateConfirmSecureTextEntry}
                        condition={this.state.confirm_secureTextEntry}
                        nameIcon1="eye"
                        nameIcon2="eye-off"/>

                    { this.state.confirm_password == '' ?
                        <Text style={{marginHorizontal:70, color:'white'}}></Text> :
                            this.state.password != this.state.confirm_password ?
                                <Text style={{marginHorizontal:70, color:'grey'}}>Konfirmasi password belum cocok</Text> :
                                <Text style={{marginHorizontal:70, color:'white'}}></Text> }

                    <View style={{marginBottom:17}}></View>

                    { this.state.nik == '' ||
                        this.state.isValidEmail == false ||
                        this.state.isValidPassword == false ||
                        this.state.password != this.state.confirm_password ?
                        <Button text='Register' bgColor='grey' textColor='#FFF'/> :
                        <TouchableOpacity onPress={this._register}>
                            <Button text='Register' bgColor='#00716F' textColor='#FFF'/>
                        </TouchableOpacity> }

                    <View style={{marginBottom:20}}></View>

                    <TouchableOpacity onPress={()=>navigate.goBack()}>
                        <Button text='Kembali untuk Login' bgColor='#FFF' textColor='#00716F'></Button>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}