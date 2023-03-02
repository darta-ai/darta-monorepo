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
  backgroundImageDimensionsPixels: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 2,
  },
});

export const galleryStyles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  frameStyle: {
    shadowOpacity: 0.5,
    shadowRadius: 4,
    borderColor: 'grey',
    width: '100%',
    height: '100%',
    shadowOffset: { width: -2, height: 4 },
    paddingBottom: 0.3,
    paddingLeft: 0.3,
  },
});

export const galleryInteractionStyles = StyleSheet.create({
  containerPortrait: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  containerLandscape: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  containerPortraitFlex: {
    flex: 1,
    flexDirection: 'column-reverse',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  containerLandscapeFlex: {
    flex: 1,
    flexDirection: 'column-reverse',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  mainButtonPortrait: {
    borderRadius: 30,
    opacity: 0.9,
    backgroundColor: '#fff',
  },
  mainButtonLandscape: {
    borderRadius: 30,
    opacity: 0.9,
    backgroundColor: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    color: '#666666',
    opacity: 0.9,
  },
  animatedContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    flexDirection: 'column-reverse',
  },
  textLabelsStyle: {
    fontSize: 11,
    alignSelf: 'center',
    opacity: 0.7,
    textAlign: 'center',
  },
});

export const viewOptionsStyles = StyleSheet.create({
  rotateScreenContainerPortrait: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    zIndex: 1,
    opacity: 1,
  },
  rotateScreenContainerLandscape: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    zIndex: 1,
    opacity: 1,
  },
  buttons: {
    backgroundColor: '#fff',
    opacity: 0.9,
  },
  mainButtonLandScape: {
    backgroundColor: '#fff',
    opacity: 0.9,
  },
  viewOptionsContainer: {
    position: 'absolute',
    borderColor: 'red',
    left: '20%',
    width: '10%',
    height: '35%',
    paddingRight: '5%',
    flex: 1,
    paddingBottom: '15%',
    marginRight: '5%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  viewOptionsButtonStyle: {
    backgroundColor: '#fff',
    opacity: 0.9,
  },
});

export const artworkRatingStyles = StyleSheet.create({
  artworkRatingPortrait: {
    position: 'absolute',
    backgroundColor: '#FFF',
    top: '0%',
    left: '0%',
    opacity: 1,
  },
  artworkRatingLandscape: {
    position: 'absolute',
    top: '0%',
    left: '10%',
    alignSelf: 'center',
    backgroundColor: '#FFF',
    opacity: 1,
  },
});
