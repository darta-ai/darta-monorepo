import {
  StyleSheet,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const galleryComponentStyles = StyleSheet.create({
  interactionContainerPortrait: {
    position: 'absolute',
    width: wp('95%'),
    height: hp('40%'),
    top: hp('35%'),
  },
  interactionContainerLandscape: {
    position: 'absolute',
    width: hp('80%'),
    height: wp('45%'),
    top: wp('50%'),
  },
  viewContainerPortrait: {
    position: 'absolute',
    width: wp('50%'),
    left: wp('45%'),
    height: hp('30%'),
    top: hp('2%'),
  },
  viewContainerLandscape: {
    position: 'absolute',
    width: hp('50%'),
    height: wp('30%'),
    left: wp('60%'),
    top: wp('2%'),
  },
});

const baseText = { fontFamily: 'Avenir Next' };

export const globalTextStyles = StyleSheet.create({
  baseText: {
    ...baseText,
  },
  italicTitleText: {
    fontFamily: 'AvenirNext-Italic',
    fontSize: 20,
  },
  boldTitleText: {
    fontFamily: 'AvenirNext-Bold',
    fontSize: 20,
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
