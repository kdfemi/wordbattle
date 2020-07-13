import React from 'react';
import { View, StyleSheet, ViewStyle, ViewProps } from 'react-native';
import Colors from '../constants/Colors';

export interface CardProps extends ViewProps {

}
const Card: React.FC<CardProps> = props => {
    return (
    <View {...props} style={{...styles.card, ...(props.style as ViewStyle)}}>
        {props.children}
    </View>)

}

const styles = StyleSheet.create({
    card: {
        shadowColor: Colors.dark,
        shadowOffset: {height: 3, width: 3},
        shadowRadius: 7,
        shadowOpacity: 0.5,
        elevation: 3,
        backgroundColor: Colors.light,
    }
})

export default Card;