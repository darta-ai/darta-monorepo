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
