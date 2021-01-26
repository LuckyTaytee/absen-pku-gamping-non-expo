import React from 'react';
import {Text, View, Image, TextInput} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Button from '../../components/atoms/Button/index';
import TextForm from '../../components/atoms/TextForm';
import Header from '../../containers/templates/Header';

export default class Login extends React.Component{
    constructor() {
        super();
        this.state = { secureTextEntry: true }
    }

    updateSecureTextEntry = () => {        
        this.setState({ secureTextEntry: !this.state.secureTextEntry });
    }

    render(){
        const {navigate} = this.props.navigation
        return(
            <View style={{backgroundColor:'#FFF', height:'100%'}}>
                <Header/>

                <TextForm placeholder="NIK" keyboardType="number-pad"/>

                <TextForm placeholder="Password"
                    secure={this.state.secureTextEntry ? true : false }
                    onPress={this.updateSecureTextEntry}
                    condition={this.state.secureTextEntry}
                    nameIcon1="eye"
                    nameIcon2="eye-off"/>
 
                <TouchableOpacity onPress={()=>navigate('Home')}>
                    <Button text='Login' bgColor='#00716F' textColor='#FFF'/>
                </TouchableOpacity>
                    
                <TouchableOpacity onPress={()=>navigate('Register')}>
                    <Button text='Register' bgColor='#FFF' textColor='#00716F'></Button>
                </TouchableOpacity>
            </View>
        )
    }
}