import React from 'react';
import {Text, View, Image, TextInput} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Button from '../../components/atoms/Button/index';
import TextForm from '../../components/atoms/TextForm';
import Header from '../../containers/templates/Header';

export default class Login extends React.Component{

    render(){
        const {navigate} = this.props.navigation
        return(
            <View style={{backgroundColor:'#FFF', height:'100%'}}>
                <Header/>

                <TextForm placeholder="NIK" keyboardType="number-pad"/>

                <TextForm placeholder="Password" secure={true}/>
 
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