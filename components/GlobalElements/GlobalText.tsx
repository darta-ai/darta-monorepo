/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import {Text} from 'react-native';

export function GlobalText(props: any) {
  return (
    <Text style={{fontFamily: 'Avenir Next'}} {...props}>
      {props.children}
    </Text>
  );
}
