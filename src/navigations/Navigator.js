import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Home from '../screens/Home';
import History from '../screens/History';

const stackNavigatorOptions = {
    headerShown : false
}

const AppNavigator = createStackNavigator({
    Login:{screen:Login},
    Register:{screen:Register},
    Home:{screen:Home},
    History:{screen:History}
},
{
    defaultNavigationOptions : stackNavigatorOptions
}
);

export default createAppContainer(AppNavigator);