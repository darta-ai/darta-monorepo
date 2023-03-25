import React, {createContext, ReactNode, useReducer} from 'react';

import {DataT, GalleryLandingPage} from '../../types';
import * as globals from '../globalVariables';

//
export interface IUserArtworkRatings {
  [id: string]: {
    like?: boolean;
    save?: boolean;
    dislike?: boolean;
    default?: boolean;
  };
}

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
interface IState {
  galleryOnDisplayId: string;
  artworkOnDisplayId: string;
  globalGallery: IGalleryData;
  isPortrait: boolean;
  userArtworkRatings: {
    [key: string]: {
      like?: boolean;
      dislike?: boolean;
      save?: boolean;
      default?: boolean;
    };
  };
  galleryTitle: string;
  tombstoneTitle: string;
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
  userRatingsEmpty?: {};
  galleryLandingPageData?: GalleryLandingPage;

  // for title
  galleryTitle?: string;

  // for tombstone
  tombstoneTitle?: string;
}

// Define the initial state
const initialState: IState = {
  galleryOnDisplayId: '',
  artworkOnDisplayId: 'string',
  globalGallery: {},
  userArtworkRatings: {default: true},
  isPortrait: true,
  galleryTitle: 'd a r t a',
  tombstoneTitle: 't o m b s t o n e',
};

// Define the reducer function
const reducer = (state: IState, action: IAction): IState => {
  const {
    type,
    rating = {},
    galleryId = '',
    currentIndex = 0,
    loadedDGallery = [],
    galleryLandingPageData = {},
    artworkOnDisplayId = 'string',
    galleryTitle = 'd a r t a',
    tombstoneTitle = 't o m b s t o n e',
  } = action;

  let tempGallery: any;
  let tempState: any;
  let galleryIds;
  const galleryOnDisplayId = state.galleryOnDisplayId;
  const artworkId = state.artworkOnDisplayId;

  switch (type) {
    case ETypes.setPortrait:
      return {...state, isPortrait: !state.isPortrait};
    case ETypes.rateArtwork:
      if (!rating && !artworkOnDisplayId) {
        return state;
      }
      let currentRating = state.userArtworkRatings[artworkId];
      if (!currentRating[rating]) {
        tempState = state.userArtworkRatings[artworkId] = {[rating]: true};
        tempGallery = state.globalGallery[galleryOnDisplayId];
        tempGallery.numberOfRatedWorks += 1;
        return {...state, ...tempState, ...tempGallery};
      } else {
        tempState = state.userArtworkRatings[artworkId] = {};
        tempGallery = state.globalGallery[galleryOnDisplayId];
        tempGallery.numberOfRatedWorks -= 1;
        return {...state, ...tempState, ...tempGallery};
      }

    case ETypes.preLoadState:
      if (Object.keys(galleryLandingPageData).length === 0) {
        return state;
      }
      tempGallery = state.globalGallery;
      tempState = state;
      galleryIds = Object.keys(galleryLandingPageData);
      galleryIds.forEach(itemId => {
        (tempGallery[itemId] = {
          artworkIds: galleryLandingPageData[itemId].artworkIds,
          id: itemId,
          numberOfRatedWorks: 0,
          numberOfArtworks: galleryLandingPageData[itemId].artworkIds.length,
          galleryIndex: 0,
          fullDGallery: null,
        }),
          galleryLandingPageData[itemId].artworkIds.forEach(artworkId => {
            tempState.userArtworkRatings = {
              ...tempState.userArtworkRatings,
              [artworkId]: {},
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
      return {...state, galleryTitle: galleryTitle};
    case ETypes.setTombstone:
      return {...state, tombstoneTitle};
    default:
      return state;
  }
};

const galleryInfo = globals.galleryDummyData;

const emptyGalleryList = Object.keys(galleryInfo).reduce(
  (obj, id) => ({
    ...obj,
    [id]: {
      id,
      fullDGallery: false,
      numberOfRatedWorks: 0,
      artworkIds: galleryInfo[id].artworkIds,
      numberOfArtworks: galleryInfo[id].artworkIds.length,
      userArtworkRatings: false,
      galleryIndex: 0,
    },
  }),
  {},
);

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
