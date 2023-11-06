/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { StyleSheet} from 'react-native';
import { Text } from 'react-native-paper';

import {globalTextStyles} from '../../styles/styles';
import {PRIMARY_950} from '@darta-styles';

const styles = StyleSheet.create({
  truncatedText: {
    textAlign: 'center',
    maxWidth: '100%', // Or another value you want
    lineHeight: 20,   // Adjust based on your design
  },
});

export function TextElement(props: any) {
  return (
    <Text style={{...globalTextStyles.baseText, ...styles.truncatedText, color: PRIMARY_950}} {...props}
    numberOfLines={2}
    ellipsizeMode='tail'>
      {props.children}
    </Text>
  );
}

export function TextElementOneLine(props: any) {
  return (
    <Text style={{...globalTextStyles.baseText, ...styles.truncatedText, color: PRIMARY_950}} {...props}
    numberOfLines={1}
    ellipsizeMode='tail'>
      {props.children}
    </Text>
  );
}

export function TextElementMultiLine(props: any) {
  return (
    <Text style={{...globalTextStyles.baseText, ...styles.truncatedText, color: PRIMARY_950}} {...props}
    ellipsizeMode='tail'>
      {props.children}
    </Text>
  );
}

