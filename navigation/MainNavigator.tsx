import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import GameScreen from '../screens/GameScreen';
import DefaultOption from '../constants/NavigatorDefaultOption';
import WinnerScreen from '../screens/WinnerScreen';


const Stack = createStackNavigator();
const MainNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen component={GameScreen} name="GameScreen" options={{title: '', ...DefaultOption}}/>
            <Stack.Screen name="WinnerScreen" component={WinnerScreen} options={{title: '', ...DefaultOption}} initialParams={{
                winner: {userId: '', score: 0},
                winnerUsername: ''
            }}/>
        </Stack.Navigator>
    )


}

export default MainNavigator;