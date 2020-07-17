import React, { useRef, useCallback, useState, useEffect } from 'react';
import {Text, StyleSheet, ViewStyle, View, KeyboardAvoidingView, Platform,
     TouchableWithoutFeedback, Keyboard, ScrollView, Alert, ActivityIndicator} from "react-native";
import ContainerStyle from '../constants/ContainerStyle';
import Colors from '../constants/Colors';
import Button from '../components/Button';
import AuthContext from '../AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../App';
import { CreateGameBody } from '../constants/types';
import { StackNavigationProp } from '@react-navigation/stack';

export interface GameWelcomeScreenProps   {
    navigation : StackNavigationProp<any, 'GameScreen'>;
}
const GameWelcomeScreen: React.FC<GameWelcomeScreenProps> = props => {
    
    const {setIsInSession:setSession, isConnectedToServer }= React.useContext(AuthContext);
    
    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS == "ios" ? "padding" : "height"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{...(ContainerStyle as ViewStyle), ...styles.container}}>
                    <View>
                        <Text style={styles.title}>WORD BATTLE</Text>
                    </View>
                    {!isConnectedToServer?(
                        <>
                            <ActivityIndicator/>
                            <Text style={styles.text}>Attempting to connect to server</Text>
                        </>):null}
                    <View  style={styles.wrapper}>
                        <View  style={styles.button}>
                            <Button onPress={() =>props.navigation.navigate('CreateGameScreen')} backgroundColor={isConnectedToServer? '': 'gray'} disabled={!isConnectedToServer}>Create Game</Button>
                        </View>
                        <View  style={styles.button}>    
                            <Button onPress={() =>props.navigation.navigate('JoinGameScreen')} style={{width: '100&%', flex: 1}} backgroundColor={isConnectedToServer? '': 'gray'} disabled={!isConnectedToServer}>Join Game</Button>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: 
    {
        fontFamily: 'egorycastle',
        fontSize: 34,
        marginBottom: 30,
        color: Colors.primary,
    },
    wrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    button : {
        marginTop: 20
    },
    text: {
        color: Colors.light,
        textAlign: 'center',
        marginBottom: -6,
        fontSize: 14
    }
    
})

export default GameWelcomeScreen;