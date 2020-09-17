import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import {StyleSheet, View, Platform, ActivityIndicator, TouchableWithoutFeedback, Vibration, Alert, ViewStyle, TouchableOpacity, Animated } from "react-native";
import Card from '../components/card';
import Input from '../components/Input';
import Button from '../components/Button';
import Text from '../components/Text';
import Colors from '../constants/Colors';
import WordCard from '../components/WordCard';
import {Ionicons} from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import {sendWord, shuffleAction, setWordAction, dropWordAction, resetGameAction} from '../store/action/game';
import { RootState } from 'App';
import { GameState, SessionState, UserState } from '../store/types';
import { StackScreenProps } from '@react-navigation/stack';
import ContainerStyle from '../constants/ContainerStyle';
import { GameScore, leaveGameBody } from '../constants/types';
import { updateScores, resetScores } from '../store/action/user';
import AuthContext from '../AuthContext';
import { resetSession } from '../store/action/session';

function pad(val: number) {
    var valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
}

function fromArrayToString(array: string[]) {
    return array.join().replace(/,/g, '');
}

export interface GameScreenProps {
    [key: string] : any
}

const GameScreen: React.FC<StackScreenProps<GameScreenProps>> = props => {
    
    const slideUpAmin = useRef(new Animated.Value(-40)).current;
    
    const slideUp = () => {
        Animated.timing(slideUpAmin, {
          toValue: 10,
          duration: 300
        }).start();
    };

    const slideDown = () => {
        Animated.timing(slideUpAmin, {
          toValue: -40,
          duration: 300
        }).start();
    };

    props.navigation.setOptions({
        headerRight: (props) => (
        <TouchableOpacity onPress={goBack}
            style={{padding: 8, backgroundColor: Colors.primary, marginRight: 10, borderRadius: 5}}>
            <Text style={{fontSize: 15}}>EXIT</Text>
            </TouchableOpacity>)
    });
    
    const {setIsInSession:setSession, isConnectedToServer, socket }= React.useContext(AuthContext);
    
    const [word, setWord] = useState<string>();

    const [currentWord, setCurrentWord] = useState<string[]>([]);
    
    const [suggestedLetters, setSuggestedLetters] = useState<string[]>([]);

    const [seconds, setSeconds] = useState<string>('00');
    const [minutes, setMinutes] = useState<string>('00');
    
    const canSet = useRef<boolean[]>([]);

    const totalSeconds  = useRef<number>(0);
    const setTimeOutId  = useRef<number>();

    const [isLoading, setIsLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const [isCorrect, setIsCorrect] = useState(true);
    const [notCorrectText, setNotCorrectText] = useState('');

    const  [you, setYou] = useState({score: '0', name: ''});
    const [opponent, setOpponent] = useState({score: '0', name: ''});
    
    const dispatch = useDispatch();

    const gameState = useSelector<RootState>(state => state.game) as GameState;
    const session = useSelector<RootState>(state => state.session) as SessionState;
    const user = useSelector<RootState>(state => state.user) as UserState;

    const removeToast = () => {
        setIsError(false);
        setErrorMessage('');
        slideDown();
        setTimeOutId.current = undefined; 
    }

    useEffect(()=> {
        if(session.canGenerateWord && !gameState.word) {
            socket.emit('generateWord', {roomId: session.roomId, userId: session.userId});
        }
    }, []);

    useEffect(() => {
        socket.on('word', async (data: any) => {
            setIsLoading(false);
            await dispatch(await sendWord(data));
        });

        socket.on('score', (scores: GameScore) => {
            dispatch(updateScores(scores))
        });

        socket.on('exception', function(data: any) {
            setIsLoading(false);
            setIsCancelling(false)
            if(!isError && data.status === -1) {
                setIsError(true);
                Alert.alert('', data.message, [{
                    text: 'Ok',
                    onPress: () => {
                        setIsError(false);
                        setSession(false);
                        socket.emit('fatalError', {roomId: session.roomId, userId: session.userId});
                        dispatch(resetGameAction());
                        dispatch(resetScores());
                        dispatch(resetSession());
                    }
                }]);
            } else {
                setErrorMessage(data.message);
                slideUp();
                setTimeOutId.current = setTimeout(() => {
                    removeToast();
                }, 2000);
            }
        });

        socket.on('fatalError', function(data: any) {
            setIsLoading(false);
            setIsCancelling(false)
            if(!isError) {
                setIsError(true);
                Alert.alert('', data.message, [{
                    text: 'Ok',
                    onPress: () => {
                        setIsError(false);
                        setSession(false);
                        dispatch(resetGameAction());
                        dispatch(resetScores());
                        dispatch(resetSession());
                    }
                }]);
            } 
        });

        socket.on('announceWinner', (winner: {userId: string; score: number}, winnerUsername: string )=> {

            props.navigation.replace('WinnerScreen', {
                winner,
                winnerUsername
            });
        });

        socket.on('over', (message: string, winner: {userId: string; score: number}, winnerUsername: string, cancelerId: string ) => {
            if(cancelerId && (cancelerId === session.userId)) {
                props.navigation.replace('WinnerScreen', {
                    winner,
                    winnerUsername
                });
            } else {
                Alert.alert('Game End', message, [{text: 'Ok', onPress: () => {
                    props.navigation.replace('WinnerScreen', {
                        winner,
                        winnerUsername
                    });
                }}]);
            }
        });

        socket.on('reconnect', () => {
            (socket as SocketIOClient.Socket).emit('rejoinRoom', { 
                roomId: session.roomId,
                userId: session.userId
            });
        });

        return () => {
            socket.removeListener('announceWinner');
            socket.removeListener('over');
            socket.removeListener('reconnect');
            socket.removeListener('word');
            socket.removeListener('score');
            socket.removeListener('exception');
            socket.removeListener('fatalError');
            if(setTimeOutId)
                clearTimeout(setTimeOutId.current);
                slideDown();
        }
    }, [socket]);


    useEffect(() =>  {
        const keys =  Object.keys(user);
        const opponentKey = keys.find(key => key !== session.userId) as string;
        setYou(currentWord => {
            const data = user[session.userId];
            return {
                score: data.score,
                name: 'You'
            }
        });
        setOpponent(currentWord => {
            const data = user[opponentKey];
            return {
                score: data.score,
                name: data.username
            }
        });
    }, [user]);

    useEffect(() => {
        if(!isCorrect) {
            setNotCorrectText('Word doesn\'t match suggested word');
        } else {
            setNotCorrectText('');
        }
    }, [isCorrect]);

    useEffect(() => {
        const allWords = (gameState as GameState);
        canSet.current = allWords.canSetSpot;
        setCurrentWord(allWords.fillingLetter);
        setSuggestedLetters(allWords.scrambledWord);
        setWord(allWords.word);
    }, [gameState]);

    useEffect(() => {
        let intervalId = setInterval(() => {
            ++totalSeconds.current;
            setSeconds(pad(totalSeconds.current % 60));
            setMinutes(pad(parseInt((totalSeconds.current / 60).toString())));
        }, 1000);
        return () => {
            totalSeconds.current = 0;
            clearInterval(intervalId);
        }
    }, [word]);

    const submitWord = useCallback(async () => {
        setIsAlertVisible(false)
        setIsError(false)
        setIsLoading(true);
        setIsCorrect(true);
        setIsAlertVisible(false);
        try{
            socket.emit('submit', {roomId: session.roomId, secs: totalSeconds.current, userId: session.userId, word: word, round: gameState.played})
        } catch (err) {
            setIsError(true)
            setIsLoading(false);
            if(!isAlertVisible) {
                setIsAlertVisible(true);
                Alert.alert('Network Error', err.message? err.message.split[0] : err, [
                    {onPress: () =>submitWord(), text: 'Retry'}
                ])
            }
        }
    }, [isAlertVisible, session, totalSeconds.current, word]);

    const verifyWord = useCallback(async () => { 
            if(word === fromArrayToString(currentWord)) { 
                submitWord()
            } else {
                Vibration.vibrate(1000);
                setIsCorrect(false);
            }
    }, [word, currentWord, submitWord]);

    const shuffleButtonHandler = useCallback(() => {
        dispatch(shuffleAction(suggestedLetters));
        const shuffledWord = (gameState as GameState).scrambledWord;
        setSuggestedLetters(shuffledWord);
    }, [suggestedLetters]);

    const fillWordHandler = useCallback((letter: string, letterIndex: number) => {
        if(!isCorrect) {
            setIsCorrect(true);
        }
        const indexCanFill = currentWord.findIndex((value, index) => value.length <= 0 && canSet.current[index] === true);
        if(indexCanFill >= 0)  {
            dispatch(setWordAction(letter, letterIndex, indexCanFill));
        }
    }, [currentWord, isCorrect, notCorrectText]);

    const dropWordHandler = useCallback((letterToDrop: string, letterToDropIndex: number) => {
        if(!isCorrect) {
            setIsCorrect(true);
        }
        dispatch(dropWordAction(letterToDrop, letterToDropIndex));
    }, [currentWord, isCorrect, notCorrectText]);

    const goBack = useCallback(()=> {
      
        setIsCancelling(true);
        const leave: leaveGameBody = {
            roomId: session.roomId,
            userId: session.userId
        }
        socket.emit('cancel',leave, () => {
            setIsCancelling(false);
        })
    }, [socket, session.roomId, session.userId]);

      
    return (
    <View style={{...(ContainerStyle as ViewStyle), ...styles.container}}>
        {!isCancelling?
            <>
                <View style={{flexDirection: 'row', width: '100%', paddingHorizontal: 10, marginBottom: 20, justifyContent: 'space-between'}}>
                    {/* Player */}
                    <View style={{flex: 1}}>
                        <Text style={styles.user}>{you.name}: <Text style={styles.score}>{you.score}</Text></Text>
                    </View>

                    {/* Rounds */}
                    <View style={{flex: 1}}>
                        <Text style={{textAlign: 'center', color: Colors.primary}}>rounds</Text>
                        <Text style={{...styles.rounds, textAlign: 'center'}}>{gameState.played} / {gameState.gameLength}</Text>
                    </View>

                    {/* Opponent */}
                    <View style={{flex: 1}}>
                        <Text style={{...styles.user, textAlign: 'right'}}>{opponent.name}: <Text style={styles.score}>{opponent.score}</Text></Text>
                    </View>
                </View>

                {/* TIME CARD */}
                <View style={styles.timeContainer}>
                    {/* <Text style={styles.timeIndicator}>Time : </Text> */}
                    <Card style={{...styles.timeCard}}>
                        <Input style={{...styles.inputs, ...styles.time}} editable={false} value={minutes}/>
                    </Card>
                    <Text style={styles.timeIndicator}> : </Text>
                    <Card style={{borderRadius: 5}}>
                        <Input style={{...styles.inputs, ...styles.time}} editable={false} value={seconds} />
                    </Card>
                </View>

                {/* TEXT FILL */}
                <View style={{...styles.wordContainer}}>
                    {
                        currentWord.map((word, index) => {
                        return (
                            <TouchableWithoutFeedback onPress={()=> {
                                if(canSet.current[index] && word.length > 0) {
                                    dropWordHandler(word, index);
                                }
                            }} key={index} >
                                <Card style={{...styles.timeCard, flex: 1, maxWidth: 55, ...(canSet.current[index]?styles.canFillIndicator : null)}} onStartShouldSetResponderCapture= {(event) => true} >
                                    <Input autoCapitalize="characters" maxLength={1} editable={false} value={word} style={{...styles.inputs,  textTransform:'uppercase'}}/>
                                </Card>
                            </TouchableWithoutFeedback>
                        )
                    })
                    }
                </View>

                {/* ERROR TEXT */}
                <Card style={{width: notCorrectText? '100%' : 0}}>
                    <Text style={{color: Colors.danger, fontSize: 16, textAlign: 'center'}}>{notCorrectText}</Text>
                </Card>

                {/* SUGGESTED WORDS */}
                <View style={styles.wordContainer}>
                    {
                        suggestedLetters.map((word, index) => <WordCard text= {word} key={index} style={{flex: 1}} 
                        onPress={() =>fillWordHandler(word, index)}/>)
                    }
                </View>

                {/* BUTTONS */}
                <View style={styles.buttonContainer}>
                    <Button onPress={verifyWord} innerStyle={{width: 100, textAlign: 'center', textAlignVertical: 'center'}} 
                    backgroundColor={!isLoading? '': 'gray'} disabled={isLoading}>
                        {isLoading?
                        <ActivityIndicator color={Colors.light} style={{...(Platform.OS === 'android' ? styles.androidActivityIndicatorFix : null)}}/> :
                        <Text>Send</Text>
                        }
                    </Button>
                    <View style={styles.circularButton} >
                        <Button onPress={() => shuffleButtonHandler()} style={{height: 42, width: 42}} disabled={isLoading} backgroundColor={!isLoading? '': 'gray'}>
                            <Ionicons name={Platform.OS === 'android'?"md-shuffle" : "ios-shuffle"} size={32}/>
                        </Button>
                    </View>
                </View>  
            </> :
            <ActivityIndicator color={Colors.light} /> 

        }
       <Animated.View style={[styles.toast, {bottom: slideUpAmin}]}>
                <TouchableOpacity style={{width: '100%', height: '100%'}} onPress={removeToast}>
                    <Text style={{color: Colors.light, textAlign: 'center', fontSize: 16}}>{errorMessage}</Text>
                </TouchableOpacity>
        </Animated.View>
        

    </View>
  );
}

const styles = StyleSheet.create({

    container: 
    {
        
    },

    inputs: 
    {
        fontSize: 28, 
        maxWidth: 55, 
        height: 55,
        textAlign: 'center', 
        borderRadius: 5, 
        color: Colors.secondary,
        fontWeight: 'bold',
        fontFamily: 'raleway-medium',
    },

    canFillIndicator: 
    {
        borderColor: Colors.green,
        borderWidth: 2,
        borderStyle: 'solid',
    },
    score: {
        fontWeight: 'bold'
    },
    rounds: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.blue
    },
    user: {
        color: Colors.primary,
        fontSize: 22,
        fontWeight: '500'
    },
    timeContainer: 
    {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },

    timeIndicator: 
    {
        fontSize: 20,
    },

    timeCard: 
    {
        borderRadius: 5,
        margin: 5
    },

    time: 
    {
        width: 60, 
        height: 40,
        fontSize: 20,
        color: Colors.danger
    },

    wordContainer: 
    {
        flexDirection: 'row',
        margin: 30,
        width: '100%',
        justifyContent: 'center',
        fontFamily: 'raleway-medium',
        textTransform: 'uppercase'
    },

    buttonContainer: 
    {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
    },
    androidActivityIndicatorFix: {
        height: 10,
        width: 89
    },
    circularButton: 
    {
        marginLeft: 10,
        borderRadius: 21,
        overflow: 'hidden'
    },
    toast: {
        position: 'absolute',
        width: '90%',
        minHeight: 36,
        backgroundColor: Colors.red,
        borderRadius: 10,
        padding: 5
    }

});

export default GameScreen;
