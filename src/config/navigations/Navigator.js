import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import React, { Component } from 'react';
import { View, ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Login from '../../containers/screens/Login';
import Register from '../../containers/screens/Register';
import Home from '../../containers/screens/Home';
import History from '../../containers/screens/History';

const stackNavigatorOptions = {
    headerShown : false
}

const AppNavigator = createStackNavigator({
    Home:{screen:Home},
    History:{screen:History}
},
{
    defaultNavigationOptions : stackNavigatorOptions
}
);

const AuthStack = createStackNavigator({
    Login: Login,
    Register: Register},
{
        defaultNavigationOptions : stackNavigatorOptions
}
);

class AuthLoadingScreen extends Component {
    constructor(props){
        super(props);
        this._loadData();
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator/>
                <StatusBar barStyle="default"/>
            </View>
        )
    }

    _loadData = async() => {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        this.props.navigation.navigate(isLoggedIn !== '1' ? 'Auth' : 'App')
    }
}

const AppContainer = createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: AppNavigator,
        Auth: AuthStack
    },
    {
        initialRouteName: 'AuthLoading'
    }
)

export default createAppContainer(AppContainer);

const styles = StyleSheet.create(
    {
      container: {
          flex:1,
          justifyContent: 'center',
          alignItems:'center'
      }

    });