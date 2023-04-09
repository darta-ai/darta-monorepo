/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import {Text} from 'react-native';
import {globalTextStyles} from '../styles';

export function GlobalText(props: any) {
  return (
    <Text style={globalTextStyles.baseText} {...props}>
      {props.children}
    </Text>
  );
}
