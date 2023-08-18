import {Artwork, CurrencyConverterType, Exhibition} from '../../globalTypes';

export const newArtworkShell: Artwork = {
  artworkTitle: {
    value: '',
  },
  published: false,
  artistName: {
    value: '',
  },
  artworkImage: {
    value: '',
  },
  artworkImagesArray: [],
  artworkMedium: {
    value: '',
  },
  artworkPrice: {
    value: '',
    isPrivate: false,
  },
  artworkCurrency: {
    value: 'USD',
  },
  canInquire: {
    value: '',
  },
  artworkDescription: {
    value: '',
  },
  slug: {
    value: '',
  },
  artworkDimensions: {
    heightCm: {
      value: '',
    },
    heightIn: {
      value: '',
    },
    text: {
      value: '',
    },
    widthCm: {
      value: '',
    },
    widthIn: {
      value: '',
    },
    depthCm: {
      value: '',
    },
    displayUnit: {
      value: 'in',
    },
  },
  artworkCreatedYear: {
    value: '',
  },
  createdAt: '',
  updatedAt: '',
  artworkId: '',
  exhibitionOrder: 0,
};

export const newExhibitionShell: Exhibition = {
  exhibitionTitle: {value: ''},
  exhibitionPressRelease: {value: ''},
  exhibitionPrimaryImage: {value: ''},
  exhibitionLocation: {
    locationString: {value: '', isPrivate: false},
    isPrivate: false,
  },
  mediumsUsed: [],
  artists: [],
  exhibitionImages: [],
  artworks: {},
  published: false,
  slug: {value: ''},
  exhibitionId: '',
  exhibitionDates: {
    exhibitionDuration: {value: 'Temporary'},
    exhibitionStartDate: {value: null, isOngoing: false},
    exhibitionEndDate: {value: null, isOngoing: false},
  },
  receptionDates: {
    receptionStartTime: {value: null},
    receptionEndTime: {value: null},
    hasReception: {value: 'Yes'},
  },
  createdAt: null,
  updatedAt: null,
};

export const currencyConverter: CurrencyConverterType = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};
