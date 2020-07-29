import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, ViewStyle, Image, Platform} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../App';
import ContainerStyle from '../constants/ContainerStyle';
import Text from '../components/Text';
import { SessionState, UserState } from '../store/types';
import Button from '../components/Button';
import AuthContext from '../AuthContext';
import Colors from '../constants/Colors';
import { resetGameAction } from '../store/action/game';
import { resetScores } from '../store/action/user';
import { resetSession } from '../store/action/session';

export interface WinnerScreenProps {
    navigation: StackNavigationProp<WinnerScreenParams, 'WinnerScreen'>;
    route: any
}
const WinnerScreen: React.FC<WinnerScreenProps> = (props) => {

    const session = useSelector<RootState>(state => state.session) as SessionState;
    const user = useSelector<RootState>(state => state.user) as UserState;
    const {setIsInSession:setSession, isConnectedToServer }= React.useContext(AuthContext);
    const winner: {userId: string; score: number} = props.route.params['winner'];
    const winnerUsername: string = props.route.params['winnerUsername']
    const [youWon, setYouWon] = useState<string>();
    
    const dispatch = useDispatch();

    const closeGame = useCallback(()=> {
        dispatch(resetGameAction());
        dispatch(resetScores());
        dispatch(resetSession());
        setSession(false);
    }, [])

    useEffect(() => {
        if(winner) {
            setYouWon(current =>  winner.userId === session.userId ? '1' :  winner.userId === 'tie' ? 'tie' : '2');
        }

    }, [])
    
    return (
        <View style={{...styles.container,...(ContainerStyle as ViewStyle) }}>
            {youWon === '1'? 
                <View style={styles.announceWrapper}>
                    <Image source={require('../assets/winner.png')} style={styles.img}/>
                    <Text style={styles.winnerText}>You are the word champion, I crown you Dictionary master.</Text>
                    <Text style={{...styles.winnerText, ...styles.winnerSubText}}>You won with <Text style={{color: Colors.primary}}>{winner.score}</Text> point(s).</Text>
                </View> : 
                youWon === '2'?
                <View style={styles.announceWrapper}>
                    <Image source={require('../assets/loser.png')} style={styles.img}/>
                    <Text style={styles.winnerText}>You are such a big loser.</Text>
                    <Text style={{...styles.winnerText, ...styles.winnerSubText}}> <Text style={{color: Colors.primary}}>{winnerUsername}</Text> won with <Text style={{color: Colors.primary}}>{winner.score}</Text> point(s).</Text>
                </View> :
                youWon === 'tie'?
                <View style={styles.announceWrapper}>
                    <Image source={require('../assets/draw.png')} style={styles.img}/>
                    <Text style={styles.winnerText}>An earthquake just happened because two champions clashed.</Text>
                    <Text style={{...styles.winnerText, ...styles.winnerSubText}}>game ended in a tie with <Text style={{color: Colors.primary}}>{winner.score}</Text> point(s).</Text>
                </View> : 
                <View></View>
            }
            <Button innerStyle={{minWidth: '100%', textAlign: 'center'}} onPress={() => closeGame()}>Close</Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    announceWrapper: {
        flex: 1,
        alignItems:'center',
        justifyContent: 'center'
    },
    img: {
        height: 100,
        width: 100
    },
    winnerText: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 20,
    },
    winnerSubText: {
        marginTop: 0,

    }
});

export default WinnerScreen;

export interface WinnerScreenParams {
    [key: string]: any ;
    winner: {userId: string; score: number} | true;
    winnerUsername: string
}