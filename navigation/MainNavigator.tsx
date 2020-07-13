import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import GameScreen from '../screens/GameScreen';
import DefaultOption from '../constants/NavigatorDefaultOption';


const Stack = createStackNavigator();
const MainNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen component={GameScreen} name="GameScreen" options={{title: '', ...DefaultOption}}/>
        </Stack.Navigator>
    )


}

export default MainNavigator;