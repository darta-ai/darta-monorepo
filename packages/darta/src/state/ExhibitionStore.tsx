import React, {createContext} from 'react';
import {Exhibition, ExhibitionPreview} from '@darta-types'


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
}

export enum ExhibitionETypes {

  saveExhibition = 'SAVE_EXHIBITION',
  saveExhibitionMulti = 'SAVE_EXHIBITION_MULTI',
  saveExhibitionPreviews = 'SAVE_EXHIBITION_PREVIEWS',
  saveUserFollowsExhibitionPreviews = 'SAVE_USER_FOLLOWS_EXHIBITION_PREVIEWS',
  saveForthcomingExhibitionPreviews = 'SAVE_FORTHCOMING_EXHIBITION_PREVIEWS',
  saveCurrentExhibitionPreviews = 'SAVE_CURRENT_EXHIBITION_PREVIEWS',

}

// Define the action type
interface ExhibitionIAction {
  type: ExhibitionETypes;
  exhibitionData?: Exhibition;
  exhibitionDataMulti?: {[key: string] : Exhibition}
  exhibitionPreviews?: {[key: string] : ExhibitionPreview}
}

// Define the initial state
const initialExhibitionState: ExhibitionState = {
  exhibitionData : {},
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


