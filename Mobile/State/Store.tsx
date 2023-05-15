import _ from 'lodash';
import React, {createContext, ReactNode, useReducer} from 'react';

import {DataT, RatingEnum} from '../../types';
import {
  days,
  image1Preview,
  image2Preview,
  images1,
  images2,
  images3,
  today,
} from '../globalVariables';

export interface IUserArtworkRatings {
  [id: string]: {
    like?: boolean;
    save?: boolean;
    dislike?: boolean;
    unrated?: boolean;
  };
}

export type PatUserData = {
  profilePicture: string;
  userName: string;
  legalName: string;
  email: string;
  phone: string;
  uniqueId?: string;
};

const rawDataUserData: PatUserData = {
  profilePicture:
    'https://www.shutterstock.com/image-photo/closeup-photo-amazing-short-hairdo-260nw-1617540484.jpg',
  userName: 'user name 10000',
  legalName: 'firstName lastName',
  email: 'email@gmail.com',
  phone: '(123) 123-4567',
};

// here is the test.

const fetchRawUserData = async (): Promise<PatUserData> => {
  let data;
  try {
    const result = await fetch('http://localhost:1160/user');
    data = await result.json();
  } catch (e) {}
  return data;
};

export type PatUserSavedArtworkData = {
  [key: string]: {
    type: string;
    galleryId: string;
    artworkIds: string[];
    tombstone?: string;
    preview?: {
      [key: string]: {
        id: string;
        image: string;
        dimensionsInches: {
          height: number;
          width: number;
        };
      };
    };
    text: string;
    body: string;
  };
};


export type GalleryData = {
  type: string;
  galleryId: string;
  artworkIds: string[];
  tombstone?: string;
  preview?: {
    [key: string]: {
      id: string;
      image: string;
      dimensionsInches: {
        height: number;
        width: number;
      };
    };
  };
  text: string;
  body: string;
};

export type PatArtworkData = {
  darta: GalleryData;
  savedArtwork: GalleryData;
  inquiredArtwork: GalleryData;
  [key: string]: GalleryData;
}
export type PatArtworkData = {
  [key: string]: {
    type: string;
    galleryId: string;
    artworkIds: string[];
    tombstone?: string;
    preview?: {
      [key: string]: {
        id: string;
        image: string;
        dimensionsInches: {
          height: number;
          width: number;
        };
      };
    };
    text: string;
    body: string;
  };
};

const rawArtworkData: PatArtworkData = {
  darta: {
    type: 'privateGallery',
    galleryId: 'darta',
    artworkIds: images1,
    preview: image1Preview,
    tombstone:
      'featuring works by contemporary artists Robert Bordo, Tahnee Lonsdale, and more',
    text: `${days[today]}'s opening`,
    body: 'curated by darta',
  },
  savedArtwork: {
    type: 'savedGallery',
    galleryId: 'saved',
    artworkIds: images2,
    preview: image2Preview,
    tombstone:
      'featuring works by contemporary artists Robert Bordo, Tahnee Lonsdale, and more',
    text: `${days[today]}'s opening`,
    body: 'curated by darta',
  },
  inquiredArtwork: {
    type: 'inquiredGallery',
    galleryId: 'inquired',
    artworkIds: images3,
    preview: image1Preview,
    tombstone:
      'featuring works by contemporary artists Robert Bordo, Tahnee Lonsdale, and more',
    text: `${days[today]}'s opening`,
    body: 'curated by darta',
  },
};

const fetchRawArtworkData = () => {
  return rawArtworkData;
};

interface IGalleryData {
  [id: string]: {
    id: string;
    fullDGallery: any;
    numberOfRatedWorks: number;
    artworkIds: string[];
    numberOfArtworks: number;
    userArtworkRatings: IUserArtworkRatings;
    galleryIndex: number;
    isLoaded: boolean;
  };
}

// Define the state type
export interface IState {
  galleryOnDisplayId: string;
  artworkOnDisplayId: string;
  globalGallery: IGalleryData;
  isPortrait: boolean;
  userArtworkRatings: IUserArtworkRatings;
  galleryTitle: string;
  tombstoneTitle: string;
  userSettings: PatUserData;
  artworkData: PatArtworkData;
  savedArtwork?: GalleryData;
}

export enum ETypes {
  setPortrait = 'PORTRAIT',
  rateArtwork = 'RATE',
  indexArt = 'INDEX',
  loadArt = 'LOAD_ART',
  setGalleryId = 'GALLERY_ID',
  setArtworkId = 'ARTWORK_ID',
  preLoadState = 'preLoadState',
  setTitle = 'SET_TITLE',
  setArtwork = 'SET_ARTWORK',
  setTombstone = 'SET_TOMBSTONE',
  setUserSettings = 'SET_USER_SETTINGS',
  setSaveArtwork = 'SET_UNSAVE',
}

// Define the action type
interface IAction {
  type: ETypes;

  // For RATE
  rating?: string;

  // for INDEX
  currentIndex?: number;
  galleryId?: string;
  artworkOnDisplayId?: string;

  // for LOAD
  loadedDGallery?: DataT[];

  // for title
  galleryTitle?: string;

  // for tombstone
  tombstoneTitle?: string;

  // for userSettings
  userSettings?: PatUserData;

  // for saving artwork
  artOnDisplay?: DataT;
  saveWork?: boolean;
}

// Define the initial state
const initialState: IState = {
  galleryOnDisplayId: '',
  artworkOnDisplayId: 'string',
  globalGallery: {},
  userArtworkRatings: {},
  isPortrait: true,
  galleryTitle: 'd a r t a',
  tombstoneTitle: 't o m b s t o n e',
  userSettings: fetchRawUserData(),
  artworkData: fetchRawArtworkData(),
};

// Define the reducer function
const reducer = (state: IState, action: IAction): IState => {
  const {
    type,
    rating = 'default',
    galleryId = '',
    currentIndex = 0,
    loadedDGallery = [],
    artworkOnDisplayId = 'string',
    galleryTitle = 'd a r t a',
    tombstoneTitle = 't o m b s t o n e',
    userSettings = {
      profilePicture: 'https://i.imgur.com/5ABY3J8.jpg',
      userName: 'error fetching data',
      legalName: 'legal Name',
      email: 'email',
      phone: 'phone',
    },
    artOnDisplay = {},
    saveWork = false,
  } = action;

  let tempGallery: any;
  let tempState: any;
  let galleryIds;
  let fullGallery: any;
  let currentRating: IUserArtworkRatings[0];
  const {galleryOnDisplayId} = state;
  const artworkId = state.artworkOnDisplayId;

  switch (type) {
    case ETypes.setUserSettings:
      return {...state, userSettings};
    case ETypes.setPortrait:
      return {...state, isPortrait: !state.isPortrait};
    case ETypes.rateArtwork:
      if (!rating && !artworkOnDisplayId) {
        return state;
      }
      currentRating = state.userArtworkRatings[artworkId];
      if (rating === RatingEnum.unrated) {
        // eslint-disable-next-line no-multi-assign, no-param-reassign
        tempState = state.userArtworkRatings[artworkId] = {};
        tempGallery = state.globalGallery[galleryOnDisplayId];
        if (tempGallery.numberOfRatedWorks > 0) {
          tempGallery.numberOfRatedWorks -= 1;
        }
        return {...state, ...tempState, ...tempGallery};
      } else {
        // eslint-disable-next-line no-multi-assign, no-param-reassign
        tempState = state.userArtworkRatings[artworkId] = {[rating]: true};
        tempGallery = state.globalGallery[galleryOnDisplayId];
        if (
          !currentRating[RatingEnum.like] &&
          !currentRating[RatingEnum.dislike] &&
          !currentRating[RatingEnum.save]
        ) {
          tempGallery.numberOfRatedWorks += 1;
        }
        return {...state, ...tempState, ...tempGallery};
      }

    case ETypes.preLoadState:
      if (Object.keys(state.artworkData).length === 0) {
        return state;
      }
      tempGallery = state.globalGallery;
      tempState = state;
      galleryIds = Object.keys(state.artworkData);
      galleryIds.forEach(itemId => {
        tempGallery[itemId] = {
          artworkIds: state.artworkData[itemId].artworkIds,
          id: itemId,
          numberOfRatedWorks: 0,
          numberOfArtworks: state.artworkData[itemId].artworkIds.length,
          galleryIndex: 0,
          fullDGallery: null,
          isLoaded: false,
        };
        state.artworkData[itemId].artworkIds.forEach(artId => {
          tempState.userArtworkRatings = {
            ...tempState.userArtworkRatings,
            [artId]: {},
          };
        });
      });
      return {...tempState, ...tempGallery};
    case ETypes.loadArt:
      if (!galleryId && Object.keys(loadedDGallery).length === 0) {
        return state;
      }
      tempGallery = state.globalGallery;
      if (tempGallery[galleryId].fullDGallery) {
        fullGallery = tempGallery[galleryId].fullDGallery;
        fullGallery = {
          ...loadedDGallery,
          ...fullGallery,
        };
      } else {
        fullGallery = loadedDGallery;
      }
      tempGallery[galleryId] = {
        artworkIds: tempGallery[galleryId].artworkIds,
        id: galleryId,
        numberOfRatedWorks: 0,
        numberOfArtworks: Object.keys(loadedDGallery).length,
        galleryIndex: 0,
        fullDGallery: {...fullGallery},
        isLoaded: true,
      };
      // const
      return {
        ...state,
        ...tempGallery,
      };
    case ETypes.setGalleryId:
      if (!galleryId) {
        return state;
      }
      return {...state, galleryOnDisplayId: galleryId};

    case ETypes.indexArt:
      if (!currentIndex && !artworkOnDisplayId) {
        return state;
      }
      tempGallery = state.globalGallery[galleryId];
      tempGallery.galleryIndex = currentIndex;
      return {
        ...state,
        ...tempGallery,
        artworkOnDisplayId:
          state.globalGallery[galleryId].artworkIds[currentIndex],
      };

    case ETypes.setTitle:
      return {...state, galleryTitle};
    case ETypes.setSaveArtwork:
      if (!artOnDisplay && !artOnDisplay.id) {
        return state;
      }
      if (saveWork) {
        tempState = _.cloneDeep(state);
        tempGallery = tempState.globalGallery;
        if (tempGallery.savedArtwork.fullDGallery) {
          tempGallery.savedArtwork.fullDGallery[artOnDisplay.id] = {
            ...artOnDisplay,
            savedAt: new Date(),
          };
        } else {
          tempGallery.savedArtwork = {
            fullDGallery: {
              [artOnDisplay.id]: {
                ...artOnDisplay,
                savedAt: new Date(),
              },
            },
          };
        }
        return {
          ...tempState,
        };
      } else {
        tempState = _.cloneDeep(state);
        tempGallery = tempState.globalGallery;
        delete tempGallery.savedArtwork.fullDGallery[artOnDisplay.id];
        console.log(Object.keys(tempGallery.savedArtwork.fullDGallery));
        if (state.userArtworkRatings[artworkId]) {
          if (tempGallery.numberOfRatedWorks > 0) {
            tempGallery.numberOfRatedWorks -= 1;
          }

          tempState.userArtworkRatings[artworkId] = {};
        }
        return {
          ...tempState,
          ...tempGallery,
        };
      }
    case ETypes.setTombstone:
      const tempSavedGallery = state.globalGallery?.savedArtwork;
    case ETypes.saveArtwork:
      return {...state, tombstoneTitle};
    default:
      return state;
  }
};

// Create the context
const StoreContext = createContext<{
  state: IState;
  dispatch: React.Dispatch<IAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Create the custom context provider
interface StoreProviderProps {
  children: ReactNode;
}

function StoreProvider({children}: StoreProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StoreContext.Provider value={{state, dispatch}}>
      {children}
    </StoreContext.Provider>
  );
}

export {StoreContext, StoreProvider};
