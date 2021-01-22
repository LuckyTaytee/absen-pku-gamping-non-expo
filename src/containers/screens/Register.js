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
        this.state = {uniqueId:''};
    }

    componentDidMount() {
        this.getUniqueId();
    }

    getUniqueId = () => {
        let uniqId = DeviceInfo.getUniqueId();
        this.setState({uniqueId: uniqId});
    };

    render(){
        return(
            <View style={{backgroundColor:"#FFF", height:"100%"}}>
                <Header/>

                <Text style={{alignSelf:'center'}}>{this.state.uniqueId}</Text>

                <TextForm placeholder="NIK" keyboardType="number-pad"/>

                <TextForm placeholder="Email" keyboardType="email-address"/>

                <TextForm placeholder="Password" secure={true}/>

                <TextForm placeholder="Confirm Password" secure={true}/>

                <TouchableOpacity>
                    <Button text='Register' bgColor='#00716F' textColor='#FFF'/>
                </TouchableOpacity>

            </View>
        )
    }
}