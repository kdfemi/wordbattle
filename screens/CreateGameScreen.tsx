import React, { useState, useRef, useCallback, useEffect } from 'react';
import {StyleSheet, View, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Alert, Platform, Keyboard, ViewStyle, ActivityIndicator, Modal, SafeAreaView} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Colors from '../constants/Colors';
import Button from '../components/Button';
import Input from '../components/Input';
import Text from '../components/Text';
import Loader from '../components/LoaderBall';

import ContainerStyle from '../constants/ContainerStyle';
import { RoomDetails, CreateGameBody, GameScore, leaveGameBody, UserNames } from '../constants/types';
import ActiveStyle from '../constants/ActiveStyle';

import AuthContext from '../AuthContext';
import { RootState } from '../App';
import {socket} from '../socket';
import * as sessionAction from '../store/action/session';
import { StackNavigationProp } from '@react-navigation/stack';
import { SessionState } from '../store/types';

import Constants from 'expo-constants';

export interface CreateGameScreenProps {
    navigation: StackNavigationProp<any, 'CreateGameScreen'>
};

const CreateGameScreen: React.FC<CreateGameScreenProps> = props => {
    const {setIsInSession:setSession, isConnectedToServer }= React.useContext(AuthContext);
    
    const  [username, setUsername] = useState<string>('');
    const  [gameLength, setGameLength] = useState<string>("10");
    const [usernameInputIsActive, setUsernameInputIsActive] = useState(false);
    const [lengthInputIsActive, setLengthInputIsActive] = useState(false);

    const gameData = useRef<CreateGameBody>({maxLength: 10, username: ''});
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const dispatch = useDispatch();
    const session = useSelector<RootState>(state => state.session) as SessionState

    const validateForm = useCallback(() => {
        if(gameLength && username) {
            setIsValid(true);
            gameData.current.maxLength = +gameLength;
            gameData.current.username = username;
        } else {
            setIsValid(false)
        }
    }, [gameLength, username]);

    useEffect(() => {
        validateForm();
    }, [gameLength, username]);

    useEffect(() => {
        socket.on('startGame',(scores: GameScore, usernames: UserNames) => {
            setSession(true);
        });
        socket.on('exception', function(data: any) {
            setIsLoading(false);
            callAlert(data.message)
        });
        return () => {
           socket.removeListener('startGame');
           socket.removeListener('exception');
        }
    }, [])
    
    const createSession = useCallback(() => {
        setIsLoading(true);
        socket.emit('createRoom', gameData.current, (roomDetails: RoomDetails) => {
            dispatch(sessionAction.generateSession(roomDetails.roomId, roomDetails.canGenerateWord, roomDetails.userId));
            setShowModal(true)
            setIsLoading(false);
        })
    }, [gameData]);

    const goBack = useCallback(()=> {
        if(showModal) {
            const leave: leaveGameBody = {
                roomId: session.roomId,
                userId: session.userId
            }
            socket.emit('leave',leave, () => {
                setShowModal(false);
            })
        } else {
            props.navigation.goBack();
        }
    }, [showModal]);

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
    if(showModal) {
        return (
            <Modal animationType="slide">
                <SafeAreaView style={styles.modalContainerWrapper}>
                    <View style={styles.customLoader}>
                        <Loader delay={100} start={0} end={-20} duration={100} style={{backgroundColor: Colors.red}}/>
                        <Loader delay={100} start={0} end={-20} duration={150} style={{backgroundColor: Colors.green}}/>
                        <Loader delay={100} start={0} end={-20} duration={200} style={{backgroundColor: Colors.blue}}/>
                    </View>
                    <Text style={{color: Colors.light, fontSize: 16, marginVertical: 20}}>Waiting for opponent to Join</Text>
                    <Text style={{color: Colors.light, fontSize: 16}}>Game Code: {session.roomId}</Text>
                    <View  style={styles.button}>
                        <Button onPress={() =>goBack()}>Cancel</Button>
                    </View>
                </SafeAreaView>
            </Modal>
        )
    }
  
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
                                <Input value={username} style={{...styles.input, width: '80%', ...(usernameInputIsActive? ActiveStyle : null) as ViewStyle}} placeholder={"Enter Your username"} onBlur={() => {
                                    validateForm()
                                    setUsernameInputIsActive(false)
                                }}
                                onFocus={() => setUsernameInputIsActive(true)}
                                spellCheck={false} autoCorrect={false} maxLength={10} autoFocus={true} clearTextOnFocus={false} onChangeText={usernameHandler} />
                            </View>
                            <View style={styles.textLabelWrapper}>
                                <Text style={styles.label}>enter number of rounds</Text>
                                <Input value={gameLength} style={{...styles.input, width: '20%', ...(lengthInputIsActive? ActiveStyle : null) as ViewStyle}} placeholder={"Enter Game Length"}
                                keyboardType="numeric" spellCheck={false} autoCorrect={false} onChangeText={gameLengthHandler} onBlur={() => {
                                    validateForm()
                                    setLengthInputIsActive(false)
                                }} onFocus={() => setLengthInputIsActive(true)}/>
                            </View>
                            <View  style={styles.button}>
                                <Button onPress={() =>createSession()} disabled={!isValid || isLoading}  backgroundColor={isValid? '': 'gray'}
                                innerStyle={styles.buttonInnerStyle}>
                                        {isLoading?
                                        <ActivityIndicator color={Colors.light} style={{...(Platform.OS === 'android' ? styles.androidActivityIndicatorFix: null)}}/> 
                                        :
                                        <Text>Submit</Text>
                                        }
                                </Button>
                            </View>
                            <View  style={styles.button}>
                                <Button onPress={() =>goBack()}>Cancel</Button>
                            </View>
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
        textAlign: 'center'
    },
    textLabelWrapper: {
        width: '100%',
        alignItems: 'center'
    },
    androidActivityIndicatorFix: {
        height: 10,
        width: 89
    },
    modalContainerWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.dark
    },
    customLoader: {
        flexDirection: 'row',
        width: '80%',
        height: 120,
        // borderBottomWidth: 1,
        // borderBottomColor: Colors.light,
        // borderStyle: 'solid',
        justifyContent: 'space-evenly',
        alignItems: 'flex-end'
    }
});

export default CreateGameScreen;