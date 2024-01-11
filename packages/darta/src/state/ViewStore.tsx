import _ from 'lodash';
import React, {createContext, ReactNode, useReducer} from 'react';
import {Artwork} from '@darta-types'


// Define the state type
export interface ViewState {
  artworksToRate?: {[key: string] : Artwork}
  artworkRatingIndex?: number,
}

export enum ViewETypes {
  setArtworksToRate = 'SET_ARTWORKS_TO_RATE',
  setRatingIndex = 'SET_RATING_INDEX',
}

// Define the action type
interface ViewIAction {
  type: ViewETypes;
  artworksToRate?: {[key: string] : Artwork};
  artworkRatingIndex?: number;
}

// Define the initial state
const initialViewState: ViewState = {

};

// Define the reducer function
const viewReducer = (state: ViewState, action: ViewIAction): ViewState => {
  const { type } = action;
  switch (type) {
    case ViewETypes.setArtworksToRate:
      if (!action?.artworksToRate){
        return state;
      }
      return {
        ...state,
        artworksToRate: {
          ...state.artworksToRate,
          ...action.artworksToRate
        },
      };
      case ViewETypes.setRatingIndex:
        if (!action?.artworkRatingIndex){
          return state;
        }
        return {
          ...state,
          artworkRatingIndex: action.artworkRatingIndex,
        };
    default:
      return state;
  }
};

// Create the context
export const ViewStoreContext = createContext<{
  viewState: ViewState;
  viewDispatch: React.Dispatch<ViewIAction>;
}>({
  viewState: initialViewState,
  viewDispatch: () => null,
});

export {viewReducer, initialViewState};


