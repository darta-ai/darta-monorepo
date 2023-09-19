"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currencyConverter = exports.newExhibitionShell = exports.newArtworkShell = void 0;
exports.newArtworkShell = {
    artworkId: crypto.randomUUID(),
    exhibitionId: null,
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
    exhibitionOrder: 0,
};
exports.newExhibitionShell = {
    exhibitionTitle: { value: '' },
    exhibitionPressRelease: { value: '' },
    exhibitionPrimaryImage: { value: '' },
    exhibitionLocation: {
        locationString: { value: '', isPrivate: false },
        isPrivate: false,
    },
    mediumsUsed: [],
    artists: [],
    exhibitionImages: [],
    artworks: {},
    published: false,
    slug: { value: '' },
    exhibitionId: '',
    exhibitionDates: {
        exhibitionDuration: { value: 'Temporary' },
        exhibitionStartDate: { value: null, isOngoing: false },
        exhibitionEndDate: { value: null, isOngoing: false },
    },
    receptionDates: {
        receptionStartTime: { value: null },
        receptionEndTime: { value: null },
        hasReception: { value: 'Yes' },
    },
    createdAt: null,
    updatedAt: null,
};
exports.currencyConverter = {
    USD: '$',
    EUR: '€',
    GBP: '£',
};
