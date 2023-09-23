import {StyleSheet} from 'react-native';

import {PRIMARY_BLUE, PRIMARY_LIGHTBLUE, PRIMARY_MILK} from '../assets/styles';

const baseText = {fontFamily: 'Avenir Next'};

export const globalTextStyles = StyleSheet.create({
  baseText: {
    ...baseText,
  },
  italicTitleText: {
    fontFamily: 'AvenirNext-Italic',
  },
  boldTitleText: {
    fontFamily: 'AvenirNext-Bold',
    fontSize: 15,
  },
  boldTitleCenteredText: {
    fontFamily: 'AvenirNext-Bold',
    fontSize: 15,
    textAlign: 'center',
  },
  titleText: {
    ...baseText,
    fontSize: 20,
  },
  centeredText: {
    ...baseText,
    textAlign: 'center',
  },
});

export const headerOptions = {
  headerTitle: 'darta',
  headerTitleStyle: {
    fontFamily: 'Nunito Sans',
    fontSize: 18,
    color: PRIMARY_MILK,
  },
  headerBackTitleStyle: {
    fontFamily: 'Nunito Sans',
    fontSize: 15,
  },
  headerStyle: {
    backgroundColor: PRIMARY_BLUE,
  },
};

export const footerOptions = {
  headerTitle: 'darta',
  tabBarLabelStyle: {
    fontFamily: 'Nunito Sans',
    fontSize: 15,
    color: PRIMARY_MILK,
  },
  tabBarStyle: {
    backgroundColor: PRIMARY_BLUE,
  },
};
export const footerColors = {
  focused: PRIMARY_MILK,
  notFocused: PRIMARY_LIGHTBLUE,
};
