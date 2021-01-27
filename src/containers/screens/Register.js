import React from 'react';
import {Text, View, Image, TextInput, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import DeviceInfo from 'react-native-device-info';
import Button from '../../components/atoms/Button/index';
import TextForm from '../../components/atoms/TextForm';
import Header from '../../containers/templates/Header';

export default class Register extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            uniqueId:'',
            nik: '',
            email: '',
            password: '',
            confirm_password: '',
            secureTextEntry: true,
            confirm_secureTextEntry: true };
    }

    componentDidMount() {
        this.getUniqueId();
    }

    getUniqueId = () => {
        let uniqId = DeviceInfo.getUniqueId();
        this.setState({uniqueId: uniqId});
    };

    textNIKChange = (val) => {
        this.setState({ nik: val });
    }

    textEmailChange = (val) => {
        this.setState({ email: val });
    }

    handlePasswordChange = (val) => {
        this.setState({ password: val });
    }

    handleConfirmPasswordChange = (val) => {
        this.setState({ confirm_password: val });
    }

    updateSecureTextEntry = () => {        
        this.setState({ secureTextEntry: !this.state.secureTextEntry });
    }

    updateConfirmSecureTextEntry = () => {        
        this.setState({ confirm_secureTextEntry: !this.state.confirm_secureTextEntry });
    }

    render(){
        return(
            <View style={{backgroundColor:"#FFF", height:"100%"}}>
                <Header/>

                <Text style={{alignSelf:'center'}}>{this.state.uniqueId}</Text>

                <TextForm placeholder="NIK" keyboardType="number-pad" onChangeText={(val) => this.textNIKChange(val)}/>

                <TextForm placeholder="Email" keyboardType="email-address" onChangeText={(val) => this.textEmailChange(val)}/>

                <TextForm placeholder="Password"
                    onChangeText={(val) => this.handlePasswordChange(val)}
                    secure={this.state.secureTextEntry ? true : false }
                    onPress={this.updateSecureTextEntry}
                    condition={this.state.secureTextEntry}
                    nameIcon1="eye"
                    nameIcon2="eye-off"/>

                <TextForm placeholder="Confirm Password"
                    onChangeText={(val) => this.handleConfirmPasswordChange(val)}
                    secure={this.state.confirm_secureTextEntry ? true : false }
                    onPress={this.updateConfirmSecureTextEntry}
                    condition={this.state.confirm_secureTextEntry}
                    nameIcon1="eye"
                    nameIcon2="eye-off"/>

                <TouchableOpacity>
                    <Button text='Register' bgColor='#00716F' textColor='#FFF'/>
                </TouchableOpacity>

            </View>
        )
    }
}