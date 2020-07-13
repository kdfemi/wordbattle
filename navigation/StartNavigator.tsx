import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import DefaultOption from '../constants/NavigatorDefaultOption'
import GameWelcomeScreen from '../screens/GameWelcomeScreen';



const Stack = createStackNavigator();
const StartNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen component={GameWelcomeScreen} name="start" options={{title: '', ...DefaultOption}}></Stack.Screen>
        </Stack.Navigator>
    )


}


export default StartNavigator;