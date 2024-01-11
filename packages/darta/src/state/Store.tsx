import _ from 'lodash';
import React, {createContext, ReactNode} from 'react';

import {Artwork, MapPinCities, ExhibitionMapPin, ListPreview, FullList} from '@darta-types'

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
  legalFirstName: string;
  legalLastName: string;
  email: string;
  uniqueId?: string;
};

const rawDataUserData: PatUserData = {
  profilePicture:
    'https://www.shutterstock.com/image-photo/closeup-photo-amazing-short-hairdo-260nw-1617540484.jpg',
  userName: 'user name 10000',
  legalFirstName: 'firstName lastName',
  legalLastName: 'lastName',
  email: 'email@gmail.com',
};

// here is the test.
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

// Define the state type
export interface IState {
  isPortrait: boolean;

  mapPins?: {
    [city in MapPinCities]: {[key: string] : ExhibitionMapPin}
  }

  qrCodeExhibitionId?: string;
  qrCodeGalleryId?: string;

  artworkId?: string;

  userArtworkViewTimes?: {[key: string] : number}

  fullyLoadedGalleries?: {[key: string] : boolean}
  fullyLoadedExhibitions?: {[key: string] : boolean}

  userListPreviews?: {[key: string]: ListPreview}
  userLists?: {[key: string]: FullList}
  listId?: string;
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

  // look at above in future

  saveExhibitionMapPins = 'SAVE_EXHIBITION_MAP_PINS',

  setQRCodeExhibitionId = 'SET_QR_CODE_EXHIBITION_ID',
  setQRCodeGalleryId = 'SET_QR_CODE_GALLERY_ID',

  setUserArtworkViewTimes = 'SET_USER_ARTWORK_VIEW_TIMES',

  setUserListPreviews = 'SET_USER_LIST_PREVIEWS',
  setUserLists = 'SET_USER_LISTS',
  addArtworkToList = 'ADD_ARTWORK_TO_LIST',
  deleteList = 'DELETE_LIST',
}

// Define the action type
interface IAction {
  type: ETypes;

  // For RATE
  rating?: string;

  // for INDEX
  currentIndex?: number;
  artworkOnDisplayId?: string;

  // for LOAD
  loadedDGallery?: Artwork[];

  // for title
  galleryTitle?: string;

  // for tombstone
  tombstoneTitle?: string;

  // for userSettings
  userSettings?: PatUserData;

  // for saving artwork
  artOnDisplay?: Artwork;
  saveWork?: boolean;

  
  // see here after


  mapPins?: {[key: string] : ExhibitionMapPin}
  mapPinCity?: MapPinCities

  qRCodeExhibitionId?: string;
  qrCodeGalleryId?: string;

  fullyLoadedGalleries?: {[key: string] : boolean};
  fullyLoadedExhibitions?: {[key: string] : boolean};

  userListPreviews?: {[key: string]: ListPreview}
  userLists?: {[key: string]: FullList}
  artwork?: Artwork;
  listId?: string;
}

// Define the initial state
const initialState: IState = {
  isPortrait: true,
  mapPins: {} as any,
};

// Define the reducer function
const reducer = (state: IState, action: IAction): IState => {
  const {
    type,
    galleryTitle = 'darta',
  } = action;

  switch (type) {
    case ETypes.setPortrait:
      return {...state, isPortrait: !state.isPortrait};
      // SET_CURRENT_EXHIBITION
    case ETypes.saveExhibitionMapPins:
        if (!action.mapPins && !action.mapPinCity) {
          return state;
        }
        return {
          ...state,
          mapPins: {
            ...state.mapPins,
            [action.mapPinCity as string]: {
              ...action.mapPins,
            },
          },
        };
    case ETypes.setQRCodeExhibitionId:
    if (!action.qRCodeExhibitionId) {
      return state;
    }
    
    return {
      ...state,
      qrCodeExhibitionId: action.qRCodeExhibitionId,
    };
    case ETypes.setQRCodeGalleryId:
        if (!action.qrCodeGalleryId) {
          return state;
        }

        return {
          ...state,
          qrCodeGalleryId: action.qrCodeGalleryId,
        };
        
    case ETypes.setUserListPreviews:
      if (!action?.userListPreviews){
        return state;
      }
      return {
        ...state,
        userListPreviews: {
          ...state.userListPreviews,
          ...action.userListPreviews
        },
      };
    case ETypes.deleteList:
        if (!action?.listId){
          return state;
        }
        const userLists = _.omit(state.userLists, action.listId)
        const userListPreviews = _.omit(state.userListPreviews, action.listId)
        return {
          ...state,
          userListPreviews,
          userLists
      };
    case ETypes.setUserLists:
          if (!action?.userLists){
            return state;
          }
        return {
          ...state,
          userLists: {
            ...state.userLists,
            ...action.userLists
          },
        };
    case ETypes.addArtworkToList:
      if (!action?.artwork || !action?.artwork._id || !action?.listId || !state.userLists){
        return state;
      }
      return {
        ...state,
        userLists: {
          ...state.userLists,
          [action.listId]: {
            ...state.userLists[action.listId],
            artwork: {
              ...state.userLists[action.listId]?.artwork,
              [action.artwork._id]: action?.artwork
            }
          }
        },
      };
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

// function StoreProvider({children}: StoreProviderProps) {
//   const [state, dispatch] = useReducer(reducer, initialState);

//   return (
//     // eslint-disable-next-line react/jsx-no-constructed-context-values
//     <StoreContext.Provider value={{state, dispatch}}>
//       {children}
//     </StoreContext.Provider>
//   );
// }

export {StoreContext, reducer, initialState};
