import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {DARK_GREY, LIGHT_GREY, MILK} from '../../assets/styles';

export const galleryPreviewStyles = StyleSheet.create({
  previewContainerPortrait: {
    height: hp('25%'),
  },
});
export const galleryComponentStyles = StyleSheet.create({
  interactionContainerPortrait: {
    position: 'absolute',
    alignSelf: 'center',
    width: wp('90%'),
    height: hp('12%'),
    top: hp('67%'),
    marginLeft: 1,
  },
  interactionContainerLandscape: {
    position: 'absolute',
    alignSelf: 'center',
    height: wp('20%'),
    width: hp('60%'),
    top: wp('80%'),
  },
  viewContainerPortrait: {
    position: 'absolute',
    width: wp('15%'),
    left: wp('80%'),
    height: hp('5%'),
    top: hp('1%'),
  },
  viewContainerLandscape: {
    position: 'absolute',
    width: hp('10%'),
    height: wp('15%'),
    left: hp('68%'),
    top: wp('1%'),
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
    shadowOffset: {width: -2, height: 4},
    paddingBottom: 0.3,
    paddingLeft: 0.3,
  },
});

export const galleryInteractionStyles = StyleSheet.create({
  containerPortrait: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    maxHeight: hp('15%'),
  },
  containerLandscape: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
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
    color: 'black',
    opacity: 0.9,
  },
  secondaryButtonBlackButton: {
    backgroundColor: MILK,
    borderColor: LIGHT_GREY,
    borderWidth: 0.5,
    color: MILK,
    opacity: 0.9,
  },
  animatedContainer: {
    flexDirection: 'row',
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
