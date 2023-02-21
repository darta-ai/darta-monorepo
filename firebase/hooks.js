import firestore from '@react-native-firebase/firestore';

const ImageCollection = firestore().collection('Images');

export { ImageCollection };
