import React, {createContext} from 'react';
import {Exhibition, ExhibitionPreview} from '@darta-types'
import _ from 'lodash';


// Define the state type
export interface ExhibitionState {
  exhibitionData?: {
    [key: string] : Exhibition
  }
  exhibitionPreviews?: {
    [key: string]: ExhibitionPreview
  }
  userFollowsExhibitionPreviews?: {
    [key: string]: ExhibitionPreview
  },
  forthcomingExhibitionPreviews?: {
    [key: string]: ExhibitionPreview
  },
  currentExhibitionPreviews?: {
    [key: string]: ExhibitionPreview
  },
  forthcomingFollowingExhibitionPreviews?: {
    [key: string]: ExhibitionPreview
  },
  userViewedExhibition: {[key: string] : boolean}
}

export enum ExhibitionETypes {

  saveExhibition = 'SAVE_EXHIBITION',
  saveExhibitionMulti = 'SAVE_EXHIBITION_MULTI',
  saveExhibitionPreviews = 'SAVE_EXHIBITION_PREVIEWS',
  saveUserFollowsExhibitionPreviews = 'SAVE_USER_FOLLOWS_EXHIBITION_PREVIEWS',
  saveForthcomingExhibitionPreviews = 'SAVE_FORTHCOMING_EXHIBITION_PREVIEWS',
  saveCurrentExhibitionPreviews = 'SAVE_CURRENT_EXHIBITION_PREVIEWS',
  saveForthcomingExhibitionPreviewsUserFollowing = 'SAVE_FORTHCOMING_EXHIBITION_PREVIEWS_USER_FOLLOWING',
  setUserViewedExhibition = 'SET_USER_VIEWED_EXHIBITION',

  removeUserFollowsExhibitionPreviews = 'REMOVE_USER_FOLLOWS_EXHIBITION_PREVIEWS',
}

// Define the action type
interface ExhibitionIAction {
  type: ExhibitionETypes;
  exhibitionData?: Exhibition;
  exhibitionDataMulti?: {[key: string] : Exhibition}
  exhibitionPreviews?: {[key: string] : ExhibitionPreview}
  userViewedExhibitionId?: string

  removeUserFollowsExhibitionPreviewsByGalleryId?: string
  galleryId?: string
}

// Define the initial state
const initialExhibitionState: ExhibitionState = {
  exhibitionData : {},
  userViewedExhibition: {},
};

// Define the reducer function
const exhibitionReducer = (state: ExhibitionState, action: ExhibitionIAction): ExhibitionState => {
  const { type } = action;

  switch (type) {
    case ExhibitionETypes.saveExhibition:
      if(!action.exhibitionData || !action.exhibitionData._id){
        return state
      }
      return {
        ...state,
        exhibitionData: {
          ...state.exhibitionData,
          [action.exhibitionData._id]: action.exhibitionData
        }
      }
      case ExhibitionETypes.saveExhibitionMulti:
        if(!action.exhibitionDataMulti){
          return state
        }
        return {
          ...state,
          exhibitionData: {
            ...state.exhibitionData,
            ...action.exhibitionDataMulti
          }
        }
    case ExhibitionETypes.saveExhibitionPreviews:
      if(!action.exhibitionPreviews){
        return state
      }
      return {
        ...state,
        exhibitionPreviews: {
          ...state.exhibitionPreviews,
          ...action.exhibitionPreviews
        }
      }
    case ExhibitionETypes.saveUserFollowsExhibitionPreviews:
        if(!action.exhibitionPreviews){
          return state
        }
        return {
          ...state,
          userFollowsExhibitionPreviews: {
            ...state.userFollowsExhibitionPreviews,
            ...action.exhibitionPreviews
          }
        }
      case ExhibitionETypes.saveForthcomingExhibitionPreviews:
        if(!action.exhibitionPreviews){
          return state
        }
        return {
          ...state,
          forthcomingExhibitionPreviews: {
            ...state.forthcomingExhibitionPreviews,
            ...action.exhibitionPreviews
          }
        }
      case ExhibitionETypes.saveCurrentExhibitionPreviews:
          if(!action.exhibitionPreviews){
            return state
          }
          return {
            ...state,
            currentExhibitionPreviews: {
              ...state.currentExhibitionPreviews,
              ...action.exhibitionPreviews
            }
          }
    case ExhibitionETypes.saveForthcomingExhibitionPreviewsUserFollowing:
      if(!action.exhibitionPreviews){
        return state
      }
      return {
        ...state,
        forthcomingFollowingExhibitionPreviews: {
          ...state.forthcomingExhibitionPreviews,
          ...action.exhibitionPreviews
        },
        userFollowsExhibitionPreviews: {
          ...state.userFollowsExhibitionPreviews,
          ...action.exhibitionPreviews
        }
      }
    case ExhibitionETypes.setUserViewedExhibition:
      if (!action?.userViewedExhibitionId){
        return state;
      }
      return {
        ...state,
        userViewedExhibition: {
          ...state.userViewedExhibition,
          [action.userViewedExhibitionId]: true,
        },
      };
    case ExhibitionETypes.removeUserFollowsExhibitionPreviews: 
      if (!action?.removeUserFollowsExhibitionPreviewsByGalleryId){
        return state;
      }
      const deepCloneState = _.cloneDeep(state.userFollowsExhibitionPreviews);
      for (const keys in deepCloneState){
        if (deepCloneState[keys].galleryId === action.removeUserFollowsExhibitionPreviewsByGalleryId){
          delete deepCloneState[keys]
        }
      }
      return {
        ...state,
        userFollowsExhibitionPreviews: deepCloneState
      }
    default:
      return state;
  }
};

// Create the context
export const ExhibitionStoreContext = createContext<{
  exhibitionState: ExhibitionState;
  exhibitionDispatch: React.Dispatch<ExhibitionIAction>;
}>({
  exhibitionState: initialExhibitionState,
  exhibitionDispatch: () => null,
});

export {exhibitionReducer, initialExhibitionState};


