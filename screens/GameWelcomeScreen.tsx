import React, { useRef, useCallback, useState } from 'react';
import {Text, StyleSheet, ViewStyle, View, KeyboardAvoidingView, Platform,
     TouchableWithoutFeedback, Keyboard, ScrollView, Alert} from "react-native";
import { NavigationProp } from '@react-navigation/native';
import ContainerStyle from '../constants/ContainerStyle';
import Colors from '../constants/Colors';
import Button from '../components/Button';
import AuthContext from '../AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../App';
import {socket} from '../socket';
import { RoomDetails, CreateGameBody } from '../constants/types';
import * as sessionAction from '../store/action/session';
import Input from '../components/Input';

export interface GameWelcomeScreenProps    {
    [key: string] : any
}
const GameWelcomeScreen: React.FC<NavigationProp<GameWelcomeScreenProps>> = props => {
    
    const setSession = React.useContext(AuthContext);
    const  [username, setUsername] = useState<string>('');
    const  [gameLength, setGameLength] = useState<string>("10");
    const gameData = useRef<CreateGameBody>({maxLength: 10, username: ''});
    const [isValid, setIsValid] = useState(false);
    const [showCreateInput, setShowCreateInput] = useState(false);


    const dispatch = useDispatch();
    const session = useSelector<RootState>(state => state.session)
    const createSession = useCallback(() => {
        socket.emit('createRoom', gameData.current, (roomDetails: RoomDetails) => {
            console.log(roomDetails.canGenerateWord);
            // setSession(true)
        })
    }, [gameData]);
    const callAlert = useCallback((message: string) => {
        Alert.alert('Error', message, [{text: 'Ok'}])
    }, [])
    const gameLengthHandler = useCallback((length: string) => {
        if(+length > 20) {
            callAlert('The maximum game length is 20');
            length = '20';
        }
        setGameLength(current => length);
    }, [gameData]);

    const usernameHandler = useCallback((username: string) => {
        if(username.length > 10) {
            callAlert('The maximum character is 10');
        } else {
            setUsername(current => username);
        }
    }, [gameData]);

    const validateForm = useCallback(() => {
        if(gameLength && username) {
            setIsValid(true);
            gameData.current.maxLength = +gameLength;
            gameData.current.username = username;
        } else {
            setIsValid(false)
        }
    }, [gameLength, username])
    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS == "ios" ? "padding" : "height"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{...(ContainerStyle as ViewStyle), ...styles.container}}>
                        <View>
                            <Text style={styles.title}>WORD BATTLE</Text>
                        </View>
                    <ScrollView style={{ width: '100%'}} >
                        <View  style={styles.wrapper}>
                            <View  style={styles.button}>
                                <Button onPress={() =>setShowCreateInput(true)}>Create Game</Button>
                            </View>
                            <View  style={styles.button}>    
                                <Button onPress={() =>console.log('Clicked')} style={{width: '100&%', flex: 1}} >Join Game</Button>
                            </View>
                        </View>
                        <View style={styles.wrapper}>
                            <Text style={styles.label}>enter username</Text>
                            <Input value={username} style={{...styles.input, width: '80%'}} placeholder={"Enter Your username"} onBlur={validateForm}
                            spellCheck={false} autoCorrect={false} maxLength={10} autoFocus={true} clearTextOnFocus={false} onChangeText={usernameHandler}/>
                            <Text style={styles.label}>enter number of rounds</Text>
                            <Input value={gameLength} style={{...styles.input, width: '20%'}} placeholder={"Enter Game Length"}
                            keyboardType="numeric" spellCheck={false} autoCorrect={false} onChangeText={gameLengthHandler} onBlur={validateForm}/>
                            <View  style={styles.button}>
                                <Button onPress={() =>createSession()} disabled={!isValid}>Submit</Button>
                            </View>
                            <View  style={styles.button}>
                                <Button onPress={() =>setShowCreateInput(false)}>Cancel</Button>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>)
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
    label: {
        color: Colors.light,
        textAlign: 'left',
        marginBottom: -6
    },
    input: {
        height: 50,
        backgroundColor: 'white',
        marginVertical: 10,
        borderRadius: 10,
        textAlign: 'center'
    }
    
})

export default GameWelcomeScreen;