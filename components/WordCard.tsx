import React from 'react';
import { TouchableWithoutFeedbackProps, TouchableWithoutFeedback, StyleSheet, ViewStyle} from 'react-native';

import Card, { CardProps } from './card';
import Colors from '../constants/Colors';
import Text from '../components/Text';


export interface WordCardProps extends CardProps {
    text: string,
    onPress?: () => any | void
}
const WordCard: React.FC<WordCardProps> = props => {
    return <TouchableWithoutFeedback onPress={()=> {if(props.onPress) props.onPress()}}>
        <Card {...props} style={{...styles.card, ...(props.style as ViewStyle)}} >
            <Text style={styles.text}>{props.text}</Text>
        </Card>
    </TouchableWithoutFeedback>
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 5,
        margin: 5,
        maxWidth: 55, 
        height: 55,
        justifyContent: 'center',
        backgroundColor: Colors.primary
    },
    text: {
        fontSize: 28, 
        textAlign: 'center', 
        borderRadius: 5, 
        color: Colors.light, 
        textTransform: 'uppercase'
    }
});
export default WordCard;