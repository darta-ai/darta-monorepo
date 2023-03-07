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

export const images1 = [
  '4d8b94774eb68a1b2c002a78',
  '50be685e5d3885e229000f9a',
  '52da700d139b21128d0001a6',
  '5c4cd3477cda7f02e87f8adc',
  '5408bb247261694c85c50100',
  '5423431772616939790c0000',
  '544949e072616938d3531400',
  '544949e37261692d60ec0200',
  '55846e6f72616943da0000b0',
  '56e8952f9c18db74180001a2',
  '565de2309acc8a7721000086',
  '55f2ffcc72616966bd0000f4',
  // '55846ebd7261690c170000d9',
  // '55846ec572616918230000b8',
  // '55a3bb6a7261694214000580',
  // '55ad4d3772616972f1000027',
  '55f2ffc97261696610000113',
  '57e59a54cd530e44a60001ee',
  // '57ea0527275b2405a700031b',
  // '57f662f3a09a67387f000937',
  // '580e62df8b3b817eba0000e0',
  '58a72baf7622dd1b4ec98f7a',
  // '58a72bafa09a676b405edf32',
  // '5a287782a09a67123d2210db',
  // '5a4e9010c9dc2406f90b6341',
  '5a628f7d139b210c2f2c03ea',
];

export const images2 = [
  '55f2ffcc72616966bd0000f4',
  '55f87d667261691783000109',
  '55f87d697261690f2d0000ee',
  '55f87d6a72616905100000f0',
  '55f87d6b72616950010000bc',
  '5628e6ec72616978130004d6',
  '563b882772616952c8000501',
  '5650bf66258faf48f300057f',
  '565de2309acc8a7721000086',
  '56e8952f9c18db74180001a2',
  '57609fda139b2169c700028d',
  '5762cd33cd530e65e9000487',
];

export const timWilson = [
  '62ffee2872d832000b40b4b6',
  '6309247c3701ae000bc661d4',
  '635c35a11787ad000b3e364e',
  '635c35a37b79fa000d14594a',
  '635c35a6147afd000c0fa46d',
  '635c35a6b41398000b690a11',
  '635c35a937c616000bca3f37',
  '635c35ad231ef4000baed001',
  '635c35b0b007ca000bb2015f',
  '635c35b3b41398000b690a20',
  '635c35b4fa2797000cf00893',
  '635c35ba219e18000e4177ac',
  '635c35bb1787ad000b3e3668',
  '635c35bc1fa2bf000d1cb9ae',
];
