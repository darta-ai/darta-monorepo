import {
  StyleSheet,
} from 'react-native';

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

export const navigationArtStyles = StyleSheet.create({
  navigateContainerPortrait: {
    position: 'absolute',
    bottom: '0%',
    height: '100%',
    width: '80%',
  },
  navigateContainerLandscape: {
    position: 'absolute',
    bottom: '0%',
    left: '1%',
    height: '100%',
    width: '80%',
  },
  navigateRight: {
    position: 'absolute',
    bottom: '5%',
    left: '0%',
    borderRadius: 30,
    opacity: 0.8,
    backgroundColor: '#FFF',
  },
  navigateLeft: {
    backgroundColor: '#FFF',
    opacity: 0.9,
  },
  animatedNavigationContainer: {
    position: 'absolute',
    top: '50%',
    width: '100%',
    height: '35%',
    flex: 1,
    paddingLeft: '1%',
    paddingBottom: '5%',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
});

export const artRatingButtonStyles = StyleSheet.create({
  ratingContainerPortrait: {
    position: 'absolute',
    bottom: '5%',
    right: '0%',
    borderRadius: 30,
    opacity: 0.8,
    backgroundColor: '#FFF',
  },
  ratingContainerLandscape: {
    top: '80%',
    borderRadius: 30,
    opacity: 0.85,
    backgroundColor: '#FFF',
  },
  animatedRatingsContainer: {
    position: 'absolute',
    top: '50%',
    left: '85%',
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
  ratedContainer: {
    position: 'absolute',
    top: '75%',
    left: '80%',
    width: '10%',
    height: '35%',
    paddingBottom: '15%',
    marginRight: '5%',
  },
  ratingButtonStyle: {
    backgroundColor: '#FFF',
    opacity: 0.9,
  },
  ratingsSnackBar: {
    alignContent: 'center',
    flex: 1,
  },
});

export const rotateButtonStyles = StyleSheet.create({
  rotateScreenContainerPortrait: {
    position: 'absolute',
    backgroundColor: '#FFF',
    top: '0%',
    right: '0%',
    opacity: 1,
  },
  rotateScreenContainerLandscape: {
    position: 'absolute',
    bottom: '0%',
    left: '90%',
    alignSelf: 'center',
    backgroundColor: '#FFF',
    opacity: 1,
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
    left: '1=0%',
    alignSelf: 'center',
    backgroundColor: '#FFF',
    opacity: 1,
  },
});
