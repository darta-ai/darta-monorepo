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
  exhibitionTitle: {value: 'edit to continue'},
  pressRelease: {value: 'edit to continue'},
  mediumsUsed: [],
  artists: [],
  exhibitionImages: [],
  artworks: {'05124124-1512412142-152412412': {...newArtworkShell}},
  published: false,
  slug: {value: ''},
  exhibitionId: '',
  startDate: {value: null, isOngoing: false},
  endDate: {value: null, isOngoing: false},
  openingDate: {value: null, isOngoing: false},
  exhibitionPrimaryImage: {value: ''},
  pressReleaseImages: [],
};

export const currencyConverter: CurrencyConverterType = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};
