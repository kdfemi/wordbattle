import React from "react";
import { Text, StyleSheet, ViewStyle, TextProperties } from "react-native";
import Colors from "../constants/Colors";

export interface TextProps extends TextProperties {
  
}
const TextElement: React.FC<TextProps> = (props) => {
  return (
    <Text {...props} style={{...styles.text, ...(props.style as ViewStyle)}}>
      {props.children}
    </Text>
  );
};
const styles = StyleSheet.create({
  text: {
    color: Colors.light,
  },
});
export default TextElement;
