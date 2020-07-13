import React, { useRef, useCallback, useEffect, useState } from 'react';
import {StyleSheet, View, Platform, ActivityIndicator, TouchableWithoutFeedback, Vibration, Alert, ViewStyle } from "react-native";
import Card from '../components/card';
import Input from '../components/Input';
import Button from '../components/Button';
import Text from '../components/Text';
import Colors from '../constants/Colors';
import WordCard from '../components/WordCard';
import {Ionicons} from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import {sendWord, shuffleAction, setWordAction, dropWordAction} from '../store/action/game';
import { RootState } from 'App';
import { GameState } from 'store/types';
import { StackScreenProps } from '@react-navigation/stack';
import ContainerStyle from '../constants/ContainerStyle';

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
    props.navigation.setOptions({

    });
    

    const [word, setWord] = useState<string>();

    const [currentWord, setCurrentWord] = useState<string[]>([]);
    
    const [suggestedLetters, setSuggestedLetters] = useState<string[]>([]);

    const [seconds, setSeconds] = useState<string>('00');
    const [minutes, setMinutes] = useState<string>('00');
    
    const canSet = useRef<boolean[]>([]);

    const totalSeconds  = useRef<number>(0);

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const [isCorrect, setIsCorrect] = useState(true);
    const [notCorrectText, setNotCorrectText] = useState('');
    
    const dispatch = useDispatch();
    
    const gameState = useSelector<RootState>(state => state.game);

    // socket.on('message',(text)=>{
    //     console.log(text);
    // });

    useEffect(() => {
        (async() => {
            try{
                setIsLoading(true);
                await dispatch(await sendWord());
                setIsLoading(false);
            } catch (err) {
                setIsError(true)
                if(!isAlertVisible) {
                    setIsAlertVisible(true);
                    Alert.alert('Network Error', err.message? err.message : err, [
                        {onPress: () =>loadWord(), text: 'Retry'}
                    ])
                }
            }
        })();
    }, []);

    const loadWord = useCallback(async () => {
        setIsAlertVisible(false)
        console.log("CALLED");
        setIsError(false)
        setIsLoading(true);
        setIsCorrect(true);
        setIsAlertVisible(false);
        try{
            await dispatch(await sendWord());
        } catch (err) {
            setIsError(true)
            if(!isAlertVisible) {
                setIsAlertVisible(true);
                Alert.alert('Network Error', err.message? err.message.split[0] : err, [
                    {onPress: () =>loadWord(), text: 'Retry'}
                ])
            }
        } finally {
            setIsLoading(false);
        }
    }, [gameState, isCorrect, isLoading, isAlertVisible, isError]);

    const verifyWord = useCallback(async () => { 
            if(word === fromArrayToString(currentWord)) { 
                loadWord()
            } else {
                Vibration.vibrate(1000);
                setIsCorrect(false);
                
            }
    }, [word, currentWord, loadWord]);

    useEffect(() => {
        if(!isCorrect) {
            setNotCorrectText('OOPs!!! that\'s is wrong');
        } else {
            setNotCorrectText('');
        }
    }, [isCorrect])

    useEffect(() => {
        const allWords = (gameState as GameState);
        canSet.current = allWords.canSetSpot;
        setCurrentWord(allWords.fillingLetter);
        setSuggestedLetters(allWords.scrambledWord);
        setWord(allWords.word)
        console.log(allWords.word, "server Words")
    }, [gameState])


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

    return (
    <View style={{...(ContainerStyle as ViewStyle), ...styles.container}}>
        {isLoading?
        <>
            <ActivityIndicator size="large" color={Colors.light}/>
        </> :
        !isError? 
        <>
            <Text style={styles.title}>WORD BATTLE</Text>

            {/* TIME CARD */}
            <View style={styles.timeContainer}>
                <Text style={styles.timeIndicator}>Time : </Text>
                <Card style={{...styles.timeCard}}>
                    <Input style={{...styles.inputs, ...styles.time}} editable={false} value={minutes}/>
                </Card>
                <Text style={styles.timeIndicator}> : </Text>
                <Card style={{borderRadius: 5}}>
                    <Input style={{...styles.inputs, ...styles.time}} editable={false} value={seconds}/>
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
                               <Input maxLength={1} editable={false} value={word} style={{...styles.inputs,  textTransform:'uppercase'}}/>
                            </Card>
                        </TouchableWithoutFeedback>
                    )
                })
                }
            </View>

            {/* ERROR TEXT */}
            <Card style={{width: notCorrectText? '100%' : 0}}>
                <Text style={{color: Colors.danger, fontSize: 25, textAlign: 'center'}}>{notCorrectText}</Text>
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
                <Button onPress={verifyWord}>Send</Button>
                <View style={styles.circularButton}>
                    <Button onPress={() => shuffleButtonHandler()} style={{height: 42, width: 42}}>
                        <Ionicons name={Platform.OS === 'android'?"md-shuffle" : "ios-shuffle"} size={32}/>
                    </Button>
                </View>
            </View>
        </> :
        <>
            <View>
                <Text>An Error Occurred</Text>
            </View>
        </>
        }
    </View>
  )
}

const styles = StyleSheet.create({

    container: 
    {
        
    },

    title: 
    {
        fontFamily: 'egorycastle',
        fontSize: 34,
        marginBottom: 30,
        color: Colors.primary,
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
    },

    canFillIndicator: 
    {
        borderColor: Colors.danger,
        borderWidth: 2,
        borderStyle: 'solid'
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
        margin: 40,
        width: '100%',
        justifyContent: 'center'
    },

    buttonContainer: 
    {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
    },

    circularButton: 
    {
        marginLeft: 10,
        borderRadius: 21,
        overflow: 'hidden'
    }

});

export default GameScreen;