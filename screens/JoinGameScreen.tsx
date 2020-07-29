import React, { useState, useRef, useCallback, useEffect } from 'react';
import {StyleSheet, View, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Alert, Platform, Keyboard, ViewStyle, ActivityIndicator} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import Colors from '../constants/Colors';
import Button from '../components/Button';
import Input from '../components/Input';
import Text from '../components/Text';

import ContainerStyle from '../constants/ContainerStyle';
import { RoomDetails, JoinGameBody, GameScore, UserNames } from '../constants/types';

import AuthContext from '../AuthContext';
import { RootState } from '../App';
import * as sessionAction from '../store/action/session';
import { StackNavigationProp } from '@react-navigation/stack';
import ActiveStyle from '../constants/ActiveStyle';
import { storeUser } from '../store/action/user';

export interface JoinGameScreenProps {
    navigation: StackNavigationProp<any, 'JoinGameScreen'>
};

const JoinGameScreen: React.FC<JoinGameScreenProps> = props => {
    const {setIsInSession:setSession, isConnectedToServer, socket }= React.useContext(AuthContext);

    const  [username, setUsername] = useState<string>('');
    const  [gameCode, setGameCode] = useState<string>('');

    const [usernameInputIsActive, setUsernameInputIsActive] = useState(false);
    const [gameCodeInputIsActive, setGameCodeInputIsActive] = useState(false);

    const gameData = useRef<JoinGameBody>({roomId: '', username: ''});
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);


    const dispatch = useDispatch();
    const session = useSelector<RootState>(state => state.session)


    const validateForm = useCallback(() => {
        if(gameCode && username) {
            setIsValid(true);
            gameData.current.roomId = gameCode;
            gameData.current.username = username;
        } else {
            setIsValid(false)
        }
    }, [gameCode, username]);

    useEffect(() => {
        validateForm();
    }, [gameCode, username]);

    useEffect(() => {
        socket.on('startGame',(scores: GameScore, usernames: UserNames) => {
            dispatch(storeUser(usernames, scores))
            setSession(true);
        });

        socket.on('exception', function(data: any) {
            setIsLoading(false);
            setIsLoading(false);
            if(!isError) {
                setIsError(true);
                Alert.alert('', data.message, [{
                    text: 'Ok',
                    onPress: () => setIsError(false)
                }]);
            }
        });


        return () => {
           socket.removeListener('startGame');
           socket.removeListener('exception');
        }
    }, [socket])
    
    const joinSession = useCallback(() => {
        setIsLoading(true);
        socket.emit('joinRoom', gameData.current, (roomDetails: RoomDetails) => {
            dispatch(sessionAction.generateSession(roomDetails.roomId, roomDetails.canGenerateWord, roomDetails.userId));
            setIsLoading(false);
        })
    }, [gameData, socket]);

    const callAlert = useCallback((message: string) => {
        Alert.alert('Error', message, [{text: 'Ok'}])
    }, [])

    const gameCodeHandler = useCallback((gameCode: string) => {
        setGameCode(current => gameCode);
        
    }, [gameData]);

    const usernameHandler = useCallback((username: string) => {
        if(username.length > 10) {
            callAlert('The maximum character is 10');
        } else {
            setUsername(current => username);
        }
    }, [gameData]);

    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS == "ios" ? "padding" : "height"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{...(ContainerStyle as ViewStyle), ...styles.container}}>
                    <View>
                        <Text style={styles.title}>WORD BATTLE</Text>
                    </View>
  
                    <ScrollView style={{width: '100%'}} contentContainerStyle={{flex: 1, justifyContent: 'center'}}>
                        <View style={styles.wrapper}>
                            <View style={styles.textLabelWrapper}>
                                <Text style={styles.label}>enter username</Text>
                                <Input value={username} style={{...styles.input,  ...(usernameInputIsActive? ActiveStyle : null) as ViewStyle}} placeholder={"Enter Your username"} onBlur={() => {
                                    validateForm()
                                    setUsernameInputIsActive(false)
                                }}
                                onFocus={() => setUsernameInputIsActive(true)} autoCompleteType="off"
                                spellCheck={false} autoCorrect={false} maxLength={10} autoFocus={true} clearTextOnFocus={false} onChangeText={usernameHandler}/>
                            </View>
                            <View style={styles.textLabelWrapper}>
                            <Text style={styles.label}>enter game code</Text>
                                <Input value={gameCode} style={{...styles.input,  ...(gameCodeInputIsActive? ActiveStyle : null) as ViewStyle}} placeholder={"Enter Game code"} onBlur={() => {
                                    validateForm()
                                    setGameCodeInputIsActive(false)
                                }}
                                onFocus={() => setGameCodeInputIsActive(true)}
                                spellCheck={false} autoCorrect={false} maxLength={10}  clearTextOnFocus={false} onChangeText={gameCodeHandler}/>
                            </View>
                            <View  style={styles.button}>
                                <Button onPress={() =>joinSession()} disabled={!isValid  || isLoading}  backgroundColor={isValid? '': 'gray'}>
                                {isLoading?
                                    <ActivityIndicator color={Colors.light} style={{...(Platform.OS === 'android' ? styles.androidActivityIndicatorFix: null)}}/> :
                                    <Text>Submit</Text>}
                                </Button>
                            </View>
                            {
                                !isLoading? 
                                    <View  style={styles.button}>
                                        <Button onPress={() =>props.navigation.goBack()}>Cancel</Button>
                                    </View>
                                : <></>
                            }
                        </View>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )

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
        marginTop: 20,
        minWidth: 89
    },
    buttonInnerStyle: {
        textAlign: 'center'
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
        textAlign: 'center',
        width: '80%'
    },
    textLabelWrapper: {
        width: '100%',
        alignItems: 'center'
    },
    androidActivityIndicatorFix: {
        height: 10,
        width: 89
    }
});

export default JoinGameScreen;