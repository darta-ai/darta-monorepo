import * as Colors from '@darta-styles';

import {Dimensions, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
const baseText = {fontFamily: 'DMSans_400Regular', color: Colors.PRIMARY_950};

export const DIMENSION_WIDTH = Dimensions.get('window').width;
export const DIMENSION_HEIGHT = Dimensions.get('window').height;

export const globalTextStyles = StyleSheet.create({
  baseText: {
    ...baseText,
  },
  italicTitleText: {
    ...baseText,
    fontFamily: 'DMSans_400Regular_Italic',
  },
  boldTitleText: {
    ...baseText,
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
  },
  sectionHeaderTitle: {
    ...baseText,
    fontFamily: 'DMSans_700Bold',
    fontSize: 24,
  },
  subHeaderTitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    color: Colors.PRIMARY_400,
  },
  subHeaderInformation: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 20,
    color: Colors.PRIMARY_950,
  },
  subHeaderInformationSize14: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 14,
    color: Colors.PRIMARY_950,
  },
  subHeaderInformationSize16: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 16,
    color: Colors.PRIMARY_950,
  },
  paragraphTextSize14: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    textAlign: 'left',
    color: Colors.PRIMARY_900,
  },
  paragraphTextSize14NoHeight: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    textAlign: 'left',
    color: Colors.PRIMARY_900,
  },
  paragraphText: {
    ...baseText,
    fontSize: 16,
    textAlign: 'left',
    lineHeight: 22,
    color: Colors.PRIMARY_900,
  },
  boldTitleCenteredText: {
    fontFamily: 'DMSans_700Bold',
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
    fontFamily: 'DMSans_700Bold',
    fontSize: 17,
    color: Colors.PRIMARY_950,
    marginLeft: 10,
  },
  headerBackTitleStyle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.PRIMARY_900
  },
  headerBackTitle: "",
  headerStyle: {
    backgroundColor: Colors.PRIMARY_50,
  },
  headerTitleAlign: 'left' as 'left', 
  headerMode: 'screen' as 'screen',
  headerShadowVisible: false,
};

export const modalHeaderOptions = {
  headerTitle: 'darta',
  headerTitleStyle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    color: Colors.PRIMARY_950,
  },
  headerBackTitleStyle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    color: Colors.PRIMARY_900,
  },
  headerStyle: {
    backgroundColor: Colors.PRIMARY_50,

  },
}

export const footerOptions = {
  headerTitle: 'darta',
  tabBarLabelStyle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    color: Colors.PRIMARY_900,
  },
  tabBarStyle: {
    backgroundColor: Colors.PRIMARY_200,
  },
};
export const footerColors = {
  focused: Colors.PRIMARY_950,
  notFocused: Colors.PRIMARY_600,
};


export default StyleSheet.create({
  // COMPONENT - CARD ITEM
  matchesCardItem: {
    marginTop: -35,
    backgroundColor: Colors.PRIMARY_COLOR,
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  matchesTextCardItem: {
    color: Colors.WHITE,
  },
  descriptionCardItem: {
    color: Colors.GRAY,
    textAlign: 'center',
  },
  status: {
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: Colors.GRAY,
    fontSize: 12,
  },
  actionsCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.WHITE,
    marginHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowColor: Colors.LIGHT_GREY,
    shadowOffset: {height: 10, width: 0},
  },
  miniButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: Colors.WHITE,
    marginHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowColor: Colors.DARK_GRAY,
    shadowOffset: {height: 10, width: 0},
  },

  // COMPONENT - CITY
  city: {
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 20,
    width: 100,
    elevation: 1,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowColor: Colors.BLACK,
    shadowOffset: {height: 0, width: 0},
  },
  cityText: {
    color: Colors.LIGHT_GREY,
    fontSize: 13,
    textAlign: 'center',
  },

  // COMPONENT - MESSAGE
  containerMessage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: 10,
    width: DIMENSION_WIDTH - 100,
  },
  avatar: {
    borderRadius: 30,
    width: 60,
    height: 60,
    marginRight: 20,
    marginVertical: 15,
  },
  message: {
    color: Colors.GRAY,
    fontSize: 12,
    paddingTop: 5,
  },

  // COMPONENT - PROFILE ITEM
  containerProfileItem: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10,
    paddingBottom: 25,
    margin: 20,
    borderRadius: 8,
    marginTop: -65,
    elevation: 1,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowColor: Colors.BLACK,
    shadowOffset: {height: 0, width: 0},
  },
  matchesProfileItem: {
    width: 135,
    marginTop: -15,
    backgroundColor: Colors.PRIMARY_COLOR,
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
  },
  matchesTextProfileItem: {
    color: Colors.WHITE,
    textAlign: 'center',
  },
  name: {
    paddingTop: 25,
    paddingBottom: 5,
    color: Colors.LIGHT_GREY,
    fontSize: 15,
    textAlign: 'center',
  },
  descriptionProfileItem: {
    color: Colors.GRAY,
    textAlign: 'center',
    paddingBottom: 20,
    fontSize: 13,
  },
  info: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconProfile: {
    fontSize: 12,
    color: Colors.LIGHT_GREY,
    paddingHorizontal: 10,
  },
  infoContent: {
    color: Colors.GRAY,
    fontSize: 13,
  },

  // CONTAINER - GENERAL
  bg: {
    flex: 1,
    width: DIMENSION_WIDTH,
    height: DIMENSION_HEIGHT,
  },
  top: {
    paddingTop: 50,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {paddingBottom: 10, fontSize: 22, color: Colors.LIGHT_GREY},

  // CONTAINER - HOME
  containerHome: {
    marginHorizontal: 10,
  },

  // CONTAINER - MATCHES
  containerMatches: {
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: 10,
  },

  // CONTAINER - MESSAGES
  containerMessages: {
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: 10,
  },

  // CONTAINER - PROFILE
  containerProfile: {marginHorizontal: 0},
  photo: {
    width: DIMENSION_WIDTH,
    height: 450,
  },
  topIconLeft: {
    paddingLeft: 20,
  },
  topIconRight: {
    paddingRight: 20,
  },
  actionsProfile: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textButton: {
    fontSize: 15,
    color: Colors.WHITE,
    paddingLeft: 5,
  },
  circledButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  roundedButton: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.SECONDARY_COLOR,
    paddingHorizontal: 20,
  },

  // MENU
  tabButtonText: {
    textTransform: 'uppercase',
  },
  iconMenu: {
    alignItems: 'center',
  },
});


export const galleryPreviewStyles = StyleSheet.create({
  previewContainerPortrait: {
    height: hp('25%'),
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
export const galleryComponentStyles = StyleSheet.create({
  viewContainerPortrait: {
    position: 'absolute',
    width: wp('15%'),
    left: wp('80%'),
    height: hp('5%'),
    top: hp('3%'),
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
    backgroundColor: 'none',
    width: '100%',
    height: '100%',
    // backgroundColor: Colors.PRIMARY_100,
    shadowColor: Colors.PRIMARY_600,
    shadowOffset: {width: -1, height: 4},
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
    backgroundColor: Colors.PRIMARY_50,
  },
  mainButtonLandscape: {
    borderRadius: 30,
    opacity: 0.9,
    backgroundColor: Colors.PRIMARY_50,
  },
  secondaryButton: {
    backgroundColor: Colors.PRIMARY_50,
    color: 'black',
    opacity: 0.9,
  },
  secondaryButtonBlackButton: {
    backgroundColor: Colors.MILK,
    borderColor: Colors.LIGHT_GREY,
    borderWidth: 0.5,
    color: Colors.MILK,
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
    backgroundColor: Colors.PRIMARY_50,
    opacity: 0.9,
    height: 24,
    width: 24,
    marginRight: 24,
    borderRadius: 0
  },
});



export const SSDartaHome = StyleSheet.create({
    container: {
      backgroundColor: Colors.PRIMARY_MILK,
      height: hp('85%'),
      flexDirection: 'column',
      justifyContent: 'space-evenly',
    },
  });

  export const touchableOpacity = StyleSheet.create({
    touchableOpacityButtonStyling: {
      backgroundColor: Colors.PRIMARY_50, // Green color for the button
      borderRadius: 5, // Rounded corners
      alignItems: 'center', // To center the text inside the button
      justifyContent: 'center', 
      elevation: 2, // For Android shadow
      shadowColor: "#000", // For iOS shadow
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
  });
  

export const backButtonStyles = StyleSheet.create({ 
    backButton: {
      marginLeft: 24,
      marginTop: 10, 
      marginBottom: 10
    }
  });