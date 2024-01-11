import _ from 'lodash';
import React, {createContext, ReactNode, useReducer} from 'react';

import {Artwork, Exhibition, ExhibitionPreview, IGalleryProfileData, MapPinCities, ExhibitionMapPin, MobileUser, GalleryPreview, ListPreview, List, FullList} from '@darta-types'


// Define the state type
export interface UiState {
  currentExhibitionHeader?: string;
  previousExhibitionHeader?: string;
  galleryHeader?: string;
  currentArtworkTombstoneHeader?: string;
  userExhibitionHeader?: string;
  listHeader?: string;
  exhibitionShareDetails?: {
    shareURL: string,
    shareURLMessage: string,
  }
  listUrl: string | undefined;
}

export enum UiETypes {
  setCurrentHeader = 'SET_CURRENT_HEADER',
  setGalleryHeader = 'SET_GALLERY_HEADER',
  setPreviousExhibitionHeader = 'SET_PREVIOUS_EXHIBITION_HEADER',
  setTombstoneHeader = 'SET_TOMBSTONE_HEADER',
  setUserExhibitionHeader = 'SET_USER_EXHIBITION_HEADER',
  setListHeader = 'SET_LIST_HEADER',
  setListURL = 'SET_LIST_URL',
  setExhibitionShareURL = 'SET_EXHIBITION_SHARE_URL',
}

// Define the action type
interface UiIAction {
  type: UiETypes;
  currentExhibitionHeader?: string;
  previousExhibitionHeader?: string;
  galleryHeader?: string;
  userExhibitionHeader?: string;
  currentArtworkHeader?: string;
  listHeader?: string;
  exhibitionShareDetails?: {
    shareURL: string,
    shareURLMessage: string,
  },
  listUrl?: string;
}

// Define the initial state
const initialUIState: UiState = {
  currentExhibitionHeader: undefined,
  previousExhibitionHeader: undefined,
  galleryHeader: undefined,
  currentArtworkTombstoneHeader: undefined,
  userExhibitionHeader: undefined,
  listHeader: undefined,
  listUrl: undefined  
};

// Define the reducer function
const uiReducer = (state: UiState, action: UiIAction): UiState => {
  const { type } = action;

  switch (type) {
    case UiETypes.setCurrentHeader:
      if (action.currentExhibitionHeader === undefined) {
        return state;
      }
      return {
          ...state,
          currentExhibitionHeader: action.currentExhibitionHeader,
      };
      case UiETypes.setPreviousExhibitionHeader:
        if (!action.previousExhibitionHeader) {
          return state;
        }
        return {
          ...state,
          previousExhibitionHeader: action.previousExhibitionHeader,
        };
      case UiETypes.setUserExhibitionHeader:
          if (!action.userExhibitionHeader) {
            return state;
          }
          return {
            ...state,
            userExhibitionHeader: action.userExhibitionHeader,
          };
      case UiETypes.setTombstoneHeader:
        if (!action.currentArtworkHeader) {
          return state;
        }
        return {
          ...state,
          currentArtworkTombstoneHeader: action.currentArtworkHeader,
        };
      case UiETypes.setGalleryHeader:
          if (action.galleryHeader !== undefined) {
            return state;
          }
          return {
            ...state,
            galleryHeader: action.galleryHeader,
          };
      case UiETypes.setListHeader:
        if (!action.listHeader) {
          return state;
        }
        return {
          ...state,
          listHeader: action.listHeader,
        };
      case UiETypes.setListURL:
          if (!action.listUrl) {
            return state;
          }
          return {
            ...state,
            listUrl: action.listUrl,
          };
      case UiETypes.setExhibitionShareURL:
          if (!action?.exhibitionShareDetails){
            return state;
          }
          return {
            ...state,
            exhibitionShareDetails: action.exhibitionShareDetails,
          };
    default:
      return state;
  }
};

// Create the context
export const UIStoreContext = createContext<{
  uiState: UiState;
  uiDispatch: React.Dispatch<UiIAction>;
}>({
  uiState: initialUIState,
  uiDispatch: () => null,
});

export {uiReducer, initialUIState};


