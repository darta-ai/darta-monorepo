import {StyleSheet} from 'react-native';

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
