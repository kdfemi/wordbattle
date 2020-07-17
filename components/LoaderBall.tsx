import React, { useRef, useEffect } from 'react';
import { Animated, Text, View, ViewProps, ViewStyle, StyleSheet, Easing } from 'react-native';
import Colors from '../constants/Colors';

export interface FadeInViewProps extends ViewProps {
    delay?: number;
    start: number;
    end: number;
    duration?: number;
}
const FadeInView: React.FC<FadeInViewProps> = (props) => {
  const translateAnim = useRef(new Animated.Value(props.start)).current  // Initial value for opacity: 0

  React.useEffect(() => {
      Animated.loop(
          Animated.sequence([
            Animated.timing(
                translateAnim,
                {
                  toValue: props.end,
                  duration: props.duration || 10000,
                  delay: props.delay || 0,
                  easing: Easing.bounce
            }),
            Animated.timing(
                translateAnim,
                {
                  toValue: props.start,
                  duration: props.duration || 10000,
                  delay: props.delay || 0,
                  easing: Easing.bounce
            })
          ]), {}).start();
  }, [translateAnim])

  return (
    <Animated.View                 // Special animatable View
      style={{
          ...styles.loading,
        ...(props.style) as ViewStyle,
        transform: [{
            translateY: translateAnim
        }]
      }}
    >
      {props.children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
    loading: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
 
    }
})

export default FadeInView;