import _ from 'lodash';
import React, {createContext, ReactNode, useReducer} from 'react';

import {Artwork, Exhibition, ExhibitionPreview, IGalleryProfileData, MapPinCities, ExhibitionMapPin, MobileUser, GalleryPreview, ListPreview, List, FullList} from '@darta-types'


// Define the state type
export interface GalleryState {
  galleryData?:{
    [key: string]: IGalleryProfileData
  },
  galleryPreviews?: {[key: string] : GalleryPreview}
}

export enum GalleryETypes {
  saveGallery = 'SAVE_GALLERY',
  saveGalleries= 'SAVE_GALLERIES',
  setGalleryPreviewMulti = 'SET_GALLERY_PREVIEW_MULTI',
  refreshGallery = 'REFRESH_GALLERY'
}

// Define the action type
interface GalleryIAction {
  type: GalleryETypes;
  galleryData?: IGalleryProfileData;
  galleryDataMulti?: {[key: string]: IGalleryProfileData}
  galleryPreviews?: {[key: string] : GalleryPreview};
}

// Define the initial state
const initialGalleryState: GalleryState = {
  galleryData: {},
};

// Define the reducer function
const galleryReducer = (state: GalleryState, action: GalleryIAction): GalleryState => {
  const { type } = action;

  switch (type) {
    case GalleryETypes.saveGallery:
      if(!action.galleryData || !action.galleryData._id){
        return state
      }
      if (state?.galleryData && state?.galleryData.hasOwnProperty(action.galleryData._id)){
        return state
      }
      return {
        ...state,
        galleryData: {
          ...state.galleryData,
          [action.galleryData._id]: action.galleryData
        }
      }
      case GalleryETypes.refreshGallery: 
        if(!action.galleryData || !action.galleryData._id){
          return state
        }
        return {
          ...state,
          galleryData: {
            ...state.galleryData,
            [action.galleryData._id]: action.galleryData
          }
        };
      
      case GalleryETypes.saveGalleries:
        if(!action.galleryDataMulti){
          return state
        }
        return {
          ...state,
          galleryData: {
            ...state.galleryData,
            ...action.galleryDataMulti
          }
        }
        case GalleryETypes.setGalleryPreviewMulti:
          if (!action?.galleryPreviews){
            return state;
          }
          return {
            ...state,
            galleryPreviews: {
              ...state.galleryPreviews,
              ...action.galleryPreviews
            },
          };
    default:
      return state;
  }
};

// Create the context
export const GalleryStoreContext = createContext<{
  galleryState: GalleryState;
  galleryDispatch: React.Dispatch<GalleryIAction>;
}>({
  galleryState: initialGalleryState,
  galleryDispatch: () => null,
});

export {galleryReducer, initialGalleryState};


