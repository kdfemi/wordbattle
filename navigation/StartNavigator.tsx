import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import DefaultOption from '../constants/NavigatorDefaultOption'
import GameWelcomeScreen from '../screens/GameWelcomeScreen';
import CreateGameScreen from '../screens/CreateGameScreen';
import JoinGameScreen from '../screens/JoinGameScreen';



const Stack = createStackNavigator();
export interface StartNavigatorProps {
}
const StartNavigator: React.FC<StartNavigatorProps> = (_props) => {
    
    return (
        <Stack.Navigator initialRouteName="Start">
            <Stack.Screen name="Start" options={{title: '', ...DefaultOption}}>
                {props => <GameWelcomeScreen {...props}/>}
            </Stack.Screen>
            <Stack.Screen component={CreateGameScreen} name="CreateGameScreen" options={{title: '', ...DefaultOption}}/>
            <Stack.Screen component={JoinGameScreen} name="JoinGameScreen" options={{title: '', ...DefaultOption}}/>
        </Stack.Navigator>
    )


}


export default StartNavigator;