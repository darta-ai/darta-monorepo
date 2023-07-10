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
  createdAt: null,
  updatedAt: null,
  artworkId: '',
};

export const newExhibitionShell: Exhibition = {
  exhibitionTitle: {value: ''},
  exhibitionPressRelease: {value: ''},
  exhibitionPrimaryImage: {value: ''},
  exhibitionLocation: {
    isPrivate: false,
  },
  mediumsUsed: [],
  artists: [],
  exhibitionImages: [],
  artworks: {'05124124-1512412142-152412412': {...newArtworkShell}},
  published: false,
  slug: {value: ''},
  exhibitionId: '',
  exhibitionStartDate: {value: null, isOngoing: false},
  exhibitionEndDate: {value: null, isOngoing: false},
  receptionStartTime: {value: null},
  receptionEndTime: {value: null},
  hasReception: false,
};

export const currencyConverter: CurrencyConverterType = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};
