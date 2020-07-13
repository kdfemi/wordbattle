import React from 'react';
import { StyleSheet, TextInput, TextInputProps, ViewStyle } from 'react-native';
import Colors from '../constants/Colors';

export interface InputProps extends TextInputProps {

}

const Input: React.FC<InputProps> = props => {
    return (<TextInput {...props} style={{...styles.input, ...(props.style as ViewStyle)}} caretHidden={true} />)
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 10
    }
});

export default Input;