import {Artwork, CurrencyConverterType, Exhibition} from 'darta/globalTypes';

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
    height: {
      value: '',
    },
    text: {
      value: '',
    },
    width: {
      value: '',
    },
    depth: {
      value: '',
    },
    unit: {
      value: 'in',
    },
  },
  artworkCreatedYear: {
    value: '',
  },
};

export const newExhibitionShell: Exhibition = {
  exhibitionTitle: {value: 'edit to continue'},
  pressRelease: {value: 'edit to continue'},
  mediumsUsed: [],
  artists: [],
  exhibitionImages: [],
  artworks: {'05124124-1512412142-152412412': 'undefined'},
  published: false,
  slug: {value: ''},
  exhibitionId: '',
  startDate: {value: null, isOngoing: false},
  endDate: {value: null, isOngoing: false},
  openingDate: {value: null, isOngoing: false},
};

export const currencyConverter: CurrencyConverterType = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};
