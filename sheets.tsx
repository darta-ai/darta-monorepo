import { registerSheet } from 'react-native-actions-sheet';
import { GalleryActionSheet } from './components/ActionSheets';

export const sheetTypes = {
  artFurtherInformation: 'art-further-information',
};

registerSheet(sheetTypes.artFurtherInformation, GalleryActionSheet);

export {};
