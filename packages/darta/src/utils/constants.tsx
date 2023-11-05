import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {GalleryLandingPage, Icons} from '../typing/types';

export const galleryDimensionsPortrait = {
  height: hp('70%'),
  width: wp('100%'),
};

export const galleryDimensionsLandscape = {
  width: hp('80%'),
  height: wp('100%'),
};


export const USER_UID_KEY = 'DARTA_USER_UID';

export const HAS_ONBOARD_DARTA = 'HAS_ONBOARD_DARTA';

export const DEFAULT_Gallery_Image =
  'https://lh3.googleusercontent.com/pw/AMWts8A127Q1kjVXhb88Fmm8APNKph27xdQ_chFVbh42T5PClwoMztq0EIj6fMpBoAAgM9TfjIQPCrfbYOqFTLqE8XhmLWhbLEWyq1vy77WqexLXo7Ehq2mhfpXZ3L3OKQra96wrOju1sj8chqzAY3-qr_QDTA=w1778-h998-s-no';

export const DEFAULT_GALLERY_IMAGE = require('../assets/backgroundImage.jpeg')

export const CONTENT_SPACING = 15;


export const icons: Icons = {
  back: 'arrow-left',
  cancel: 'cancel',
  menu: 'menu',
  like: 'thumb-up-outline',
  dislike: 'thumb-down-outline',
  save: 'heart-circle-outline',
  minus: 'minus',
  screenRotation: 'screen-rotation',
  navigateLeft: 'pan-left',
  navigateRight: 'pan-right',
  thinking: 'lightbulb-outline',
  viewSettings: 'eye-settings-outline',
  downWardsNavigation: 'down',
  learnMore: 'information',
  inquire: 'bell-circle-outline',
  cog: 'cog-outline',
  thumbsUpDown: 'thumbs-up-down-outline',
  saveSettings: 'content-save',
  brokenHeart: 'heart-broken',
  removeRating: 'close-circle-outline',
  information: 'information-outline',

  // other
  instagram: 'instagram',
  phone: 'phone',
  email: 'email',
  website: 'web',
};

export const buttonSizes = {
  extraSmall: 15,
  small: 20,
  mediumSmall: 25,
  medium: 30,
  large: 40,
};

export const duration = 250;

export const images1 = [
  '4d8b94774eb68a1b2c002a78',
  '57e59a54cd530e44a60001ee',
  '565de2309acc8a7721000086',
  '50be685e5d3885e229000f9a',
  '52da700d139b21128d0001a6',
  '5c4cd3477cda7f02e87f8adc',
  '5408bb247261694c85c50100',
  '5423431772616939790c0000',
  '55846e6f72616943da0000b0',
  '56e8952f9c18db74180001a2',
  '55f2ffcc72616966bd0000f4',
  '55846ebd7261690c170000d9',
  '55a3bb6a7261694214000580',
  '55f2ffc97261696610000113',
  '57ea0527275b2405a700031b',
  '57f662f3a09a67387f000937',
  '580e62df8b3b817eba0000e0',
  '58a72bafa09a676b405edf32',
  '5a287782a09a67123d2210db',
  '5a4e9010c9dc2406f90b6341',
  '5a628f7d139b210c2f2c03ea',
];

export const image1Preview = {
  0: {
    id: '4d8b92c64eb68a1b2c00051f',
    image:
      'https://d32dm0rphc51dk.cloudfront.net/AJp-r4WDs4Mpvaj5koBmvQ/larger.jpg',
    dimensionsInches: {height: 13.625, width: 12.825},
  },
  1: {
    id: '57e59a54cd530e44a60001ee',
    image:
      'https://d32dm0rphc51dk.cloudfront.net/M-4i_FVEf18UvZNXoiJXtQ/larger.jpg',
    dimensionsInches: {height: 12, width: 9},
  },
  2: {
    id: '565de2309acc8a7721000086',
    image:
      'https://d32dm0rphc51dk.cloudfront.net/hy7UuwOCMHTTt6gAdT-Dow/larger.jpg',
    dimensionsInches: {height: 48, width: 37.5},
  },
};

export const images2 = [
  '5f6294bb9c4bc2000d71925e',
  '55f2ffcc72616966bd0000f4',
  '55f87d667261691783000109',
  '55f87d697261690f2d0000ee',
  // '55f87d6a72616905100000f0',
  // '55f87d6b72616950010000bc',
  // '5628e6ec72616978130004d6',
  // '563b882772616952c8000501',
  // '5650bf66258faf48f300057f',
  // '565de2309acc8a7721000086',
  // '56e8952f9c18db74180001a2',
  // '57609fda139b2169c700028d',
  // '5762cd33cd530e65e9000487',
];

export const image2Preview = {
  0: {
    id: '4d90d196dcdd5f44a50000cb',
    image:
      'https://d32dm0rphc51dk.cloudfront.net/5SdcJI5ZujL0gWSbgCuFtQ/larger.jpg',
    dimensionsInches: {height: 32, width: 28},
  },
  1: {
    id: '55884922726169561d0007e0',
    image:
      'https://d32dm0rphc51dk.cloudfront.net/M0MQ8KVCSFZDeWSE3AtONA/larger.jpg',
    dimensionsInches: {height: 20, width: 16},
  },
  2: {
    id: '5f6294bb9c4bc2000d71925e',
    image:
      'https://d32dm0rphc51dk.cloudfront.net/FPjgCJxN5dpXalMB2bvZxQ/larger.jpg',
    dimensionsInches: {height: 34, width: 24},
  },
};

export const images3 = [
  '5bdc7d4858dd23002b45a04a',
  '5bdc7f54c875ba7fba5706d4',
  '5bdc817e7ffd4170a19174ca',
  '5bdc86fc5ce68326a130d022',
  '5bdc87cba9c50f2e3f925982',
  '5bdc885ea9c50f2e3f9259bd',
  '5bdc88f13cc37034b824af5d',
  '5beb75673051a8002c6aa871',
  '5bef01b78f6c3d0791834aa2',
];

export const timWilson = [
  '62cf1d7f62225b000be802c2',
  '62ed758894df06000cfb27e5',
  '635c35a37b79fa000d14594a',
  '62ffee2872d832000b40b4b6',
  '6309247c3701ae000bc661d4',
  '635c35a11787ad000b3e364e',
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

export const timWilsonPreview = {
  0: {
    id: '62cf1d7f62225b000be802c2',
    image:
      'https://d32dm0rphc51dk.cloudfront.net/NTwfXxEswLgn_tcznK9XJw/larger.jpg',
    dimensionsInches: {height: 18, width: 22.5},
  },
  1: {
    id: '62ed758894df06000cfb27e5',
    image:
      'https://d32dm0rphc51dk.cloudfront.net/UgMq9Jp7ok9W4V0-a78dtg/larger.jpg',
    dimensionsInches: {height: 16, width: 11},
  },
  2: {
    id: '635c35a37b79fa000d14594a',
    image:
      'https://d32dm0rphc51dk.cloudfront.net/30pHFzA-GsM_1Hjv2bfFmA/larger.jpg',
    dimensionsInches: {height: 12.5, width: 9},
  },
};

export const cathleenClark = [
  '5fc79929a2b682000e6b0bb0',
  '5fc79934a2b6820012bd4854',
  '6140f87bb86c11000c3b2949',
  '6140f882c2bf92000b4fb1e6',
  '6140f883c2bf92000d54483d',
  '6140f88574009b000c83085f',
  '61449a4a6f235e000ce5636e',
  '6345699c7144f7000e2e33ff',
  '63517abef325ef000b593164',
  '63517c8cd5b1c8000bee440d',
  '63517d2a3004ca000c6f9a30',
  '63517db46ea025000d01a521',
  '63517e203004ca000c6f9b43',
  '63517e20484408000bc94aee',
];

export const cathleenClarkPreview = {
  0: {
    id: '5fc79929a2b682000e6b0bb0',
    image:
      'https://d32dm0rphc51dk.cloudfront.net/iE7tBe76SRAxu2dPm0LeJA/larger.jpg',
    dimensionsInches: {height: 24, width: 18},
  },
  1: {
    id: '63517d2a3004ca000c6f9a30',
    image:
      'https://d32dm0rphc51dk.cloudfront.net/GpYI0yMppN-Cej2apLD7Yg/larger.jpg',
    dimensionsInches: {height: 36, width: 36},
  },
  2: {
    id: '63517e20d7f7b6000dcf6b98',
    image:
      'https://d32dm0rphc51dk.cloudfront.net/tppydTz_gNSxdcl_QJh0Aw/larger.jpg',
    dimensionsInches: {height: 30, width: 24},
  },
};

export const darbyMilbrath = [
  '5f553ad7ba960c000e2cf5d8',
  '607d4df05692f00012685538',
  '6131223005e7f8000bb582f1',
  '613122305e1e46000da8f824',
  '62379871fdb5a6000d0b67d1',
  '623798831c6953000ca446e8',
  '62379899f40db8000baa2cce',
  '633f3c4ec84fca000cbc88e5',
  '6362b0c45beb58000c736727',
  '6362b0c5409d67000e261e64',
];

export const darbyMilbrathPreview = {
  0: {
    id: '5f553ad7ba960c000e2cf5d8',
    image:
      'https://d32dm0rphc51dk.cloudfront.net/vYIXji1F1PZ7JlR2lGKY-g/larger.jpg',
    dimensionsInches: {height: 40, width: 30},
  },
  1: {
    id: '607d4df05692f00012685538',
    image:
      'https://d32dm0rphc51dk.cloudfront.net/GzeVDVMXGkMFazAbzA2VZQ/larger.jpg',
    dimensionsInches: {height: 14, width: 12},
  },
  2: {
    id: '6131223005e7f8000bb582f1',
    image:
      'https://d32dm0rphc51dk.cloudfront.net/hdWA5Lf9ES_4aUK7sEYoDg/larger.jpg',
    dimensionsInches: {height: 76, width: 64},
  },
};

export const today = new Date().getDay();
export const days = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export const galleryDummyData: GalleryLandingPage = {
  '01a5ac40-bc52-11ed-afa1-0242ac120002': {
    type: 'privateGallery',
    galleryId: '01a5ac40-bc52-11ed-afa1-0242ac120002',
    artworkIds: images1,
    preview: image1Preview,
    tombstone:
      'featuring works by contemporary artists Robert Bordo, Tahnee Lonsdale, and more',
    text: `${days[today]}'s opening`,
    body: 'curated by darta',
  },
  '1d2091ce-bc52-11ed-afa1-0242ac120002': {
    type: 'groupShow',
    galleryId: '1d2091ce-bc52-11ed-afa1-0242ac120002',
    artworkIds: images2,
    preview: image2Preview,
    text: 'Grouper',
    body: 'curated by Ana Delvey',
  },
  '645d3af4-565e-4edd-9d61-e7dd0c7a26ba': {
    type: 'galleryOpening',
    galleryId: '645d3af4-565e-4edd-9d61-e7dd0c7a26ba',
    artworkIds: timWilson,
    preview: timWilsonPreview,
    text: 'Tim Wilson',
    body: 'Meditations',
  },
  '870f8c2c-6cb6-4061-8acc-c7fc4ceb33fc': {
    type: 'galleryOpening',
    galleryId: '870f8c2c-6cb6-4061-8acc-c7fc4ceb33fc',
    artworkIds: cathleenClark,
    preview: cathleenClarkPreview,
    text: 'Cathleen Clarke',
    body: 'Hidden In Plain Sight',
  },
  'a28261e6-db56-441b-b65d-dbb540f61c10': {
    type: 'galleryOpening',
    galleryId: 'a28261e6-db56-441b-b65d-dbb540f61c10',
    artworkIds: darbyMilbrath,
    preview: darbyMilbrathPreview,
    text: 'Darby Milbrath',
    body: 'A Sudden Shift',
  },
};


export const traceNames = {
  SPLASH_SCREEN_LOAD: 'SplashScreenLoad',
  FETCH_NEW_GALLERY: 'FetchNewGallery',
}