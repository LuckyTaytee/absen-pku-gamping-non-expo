import React from 'react';
import {Text, View, BackHandler, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Button from '../../components/atoms/Button/index';
import TextForm from '../../components/atoms/TextForm';
import Header from '../../containers/templates/Header';

const userInfo = {nik: '12345', password: '12345'};

export default class Login extends React.Component{
    
    constructor() {
        super();
        this.state = { 
            nik: '',
            password: '',
            secureTextEntry: true }
    }

    updateSecureTextEntry = () => {        
        this.setState({ secureTextEntry: !this.state.secureTextEntry });
    }

    _login = async() => {
        if(userInfo.nik === this.state.nik && userInfo.password === this.state.password) {
            await AsyncStorage.setItem('isLoggedIn', '1');
            this.props.navigation.navigate('Home')
        } else {
            alert('NIK atau Password salah')
        }
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
    
      componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          this.backAction
        );
      }
    
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
                value={this.state.nik}/>

                <TextForm placeholder="Password"
                    onChangeText={(password)=>this.setState({password})}
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