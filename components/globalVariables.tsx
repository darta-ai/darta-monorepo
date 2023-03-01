import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icons } from '../types';

export const galleryDimensionsPortrait = {
  height: hp('80%'),
  width: wp('95%'),
};

export const galleryDimensionsLandscape = {
  width: hp('80%'),
  height: wp('100%'),
};

export const icons: Icons = {
  back: 'arrow-left',
  menu: 'menu',
  like: 'thumb-up-outline',
  dislike: 'thumb-down-outline',
  save: 'heart',
  minus: 'minus',
  screenRotation: 'screen-rotation',
  navigateLeft: 'pan-left',
  navigateRight: 'pan-right',
  thinking: 'lightbulb-outline',
  viewSettings: 'eye-settings-outline',
  downWardsNavigation: 'down',
  learnMore: 'bookshelf',
};

// export const getButtonSize = (wp:number, size: string) => {

// };

export const buttonSizes = {
  extraSmall: 15,
  small: 20,
  medium: 30,
  large: 40,
};

export const duration = 250;
