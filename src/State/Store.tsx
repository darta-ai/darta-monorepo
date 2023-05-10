import React, {createContext, ReactNode, useReducer} from 'react';

import {DataT, RatingEnum} from '../../types';
import {
  days,
  image1Preview,
  image2Preview,
  images1,
  images2,
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

const fetchRawUserData = () => {
  return rawDataUserData;
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
    artworkIds: images1,
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
  preLoadState = 'preLoadState',
  setTitle = 'SET_TITLE',
  setArtwork = 'SET_ARTWORK',
  setTombstone = 'SET_TOMBSTONE',
  setUserSettings = 'SET_USER_SETTINGS',
  saveArtwork = 'SAVE_ARTWORK',
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
    userSettings = fetchRawUserData(),
  } = action;

  let tempGallery: any;
  let tempState: any;
  let galleryIds;
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
      tempGallery[galleryId] = {
        artworkIds: tempGallery[galleryId].artworkIds,
        id: galleryId,
        numberOfRatedWorks: 0,
        numberOfArtworks: loadedDGallery.length,
        galleryIndex: 0,
        fullDGallery: loadedDGallery,
      };
      return {
        ...state,
        ...tempGallery,
        artworkOnDisplayId: tempGallery[galleryId].artworkIds[0],
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
    case ETypes.setTombstone:
      const tempSavedGallery = state.globalGallery?.savedArtwork;
      let;
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
