import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Login from '../../containers/screens/Login';
import Register from '../../containers/screens/Register';
import Home from '../../containers/screens/Home';
import History from '../../containers/screens/History';

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