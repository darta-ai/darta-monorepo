import {
  StyleSheet,
} from 'react-native';

export const galleryStyles = StyleSheet.create({
  container: {
    // alignItems: 'center',
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
  rotateScreenButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    top: '10%',
  },
  interactionButtonsContainer: {
    display: 'flex',
    gap: 30,
    flexDirection: 'row',
    bottom: '5%',
    marginLeft: 25,
  },
  interactionButton: {
    opacity: 0.8,
    flex: 1,
    alignContent: 'center',
    backgroundColor: '#FFF',
    borderColor: '#262626',
  },
});
