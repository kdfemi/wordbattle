import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ButtonProperties, TouchableOpacityProps, TextStyle } from "react-native";
import Colors from '../constants/Colors';

export interface ButtonProps extends TouchableOpacityProps {
  type?: 'outline' | 'fill' | 'clear',
  innerStyle?: TextStyle,
  color?: string,
  backgroundColor?: string
}
const Button: React.FC<ButtonProps> = props => {
    return  <TouchableOpacity activeOpacity={0.5} {...props} style={{...styles.button, 
     
      ...(props.backgroundColor)?{backgroundColor: props.backgroundColor} :  
      (props.type === 'clear')? styles.clear : (props.type === 'outline')? styles.outline : styles.fill,
    }} onPress={props.onPress} >
    <Text style={{...styles.text,
   ...(props.color)?{color: props.color} : 
   (props.type === 'clear')? styles.textClear : (props.type === 'outline')? styles.textOutline : styles.textFill,
    ...props.innerStyle
    }}> {props.children} </Text>
  </TouchableOpacity>
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 10
    },
    clear: {
      backgroundColor: Colors.light,
    },
    fill: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
      borderWidth: 1,
      borderStyle: 'solid'
    },
    outline: {
      backgroundColor: Colors.light,
      borderColor: Colors.primary,
      borderWidth: 1,
      borderStyle: 'solid'
    },
    text: {
      fontSize: 18
    },
    textClear: {
      color: Colors.primary
    },
    textFill: {
      color: Colors.light
    },
    textOutline: {
      color: Colors.primary
    }
})

export default Button;