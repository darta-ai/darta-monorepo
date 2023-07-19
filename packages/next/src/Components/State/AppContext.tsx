/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-case-declarations */
import _ from 'lodash';
import React, {createContext, ReactNode, useContext, useReducer} from 'react';

import {
  ArtworkObject,
  Exhibition,
  ExhibitionObject,
  GalleryState,
  IGalleryProfileData,
} from '../../../globalTypes';
import {AuthContext} from '../../../pages/_app';

type Action =
  | {type: 'SET_ARTWORKS'; payload: ArtworkObject}
  | {
      type: 'SAVE_NEW_ARTWORKS_FROM_EXHIBITION';
      payload: ArtworkObject;
    }
  | {type: 'DELETE_ARTWORK'; artworkId: string}
  | {type: 'SET_PROFILE'; payload: IGalleryProfileData}
  | {type: 'SET_EXHIBITIONS'; payload: ExhibitionObject}
  | {type: 'SAVE_EXHIBITION'; payload: Exhibition; exhibitionId: string}
  | {type: 'DELETE_EXHIBITION'; exhibitionId: string}
  | {type: 'SET_ACCESS_TOKEN'; payload: string | null};

// Define the shape of your state
const initialState: GalleryState = {
  galleryArtworks: {},
  galleryProfile: {},
  galleryExhibitions: {},
  accessToken: '',
};

export enum GalleryReducerActions {
  SET_ARTWORKS = 'SET_ARTWORKS',
  DELETE_ARTWORKS = 'DELETE_ARTWORK',
  SAVE_NEW_ARTWORKS = 'SAVE_NEW_ARTWORKS_FROM_EXHIBITION',
  SET_PROFILE = 'SET_PROFILE',
  SET_EXHIBITIONS = 'SET_EXHIBITIONS',
  SAVE_EXHIBITION = 'SAVE_EXHIBITION',
  DELETE_EXHIBITION = 'DELETE_EXHIBITION',
  SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN',
}

// Define your reducer
const reducer = (state: GalleryState, action: Action): GalleryState => {
  switch (action.type) {
    case GalleryReducerActions.SET_ACCESS_TOKEN:
      return {...state, accessToken: action.payload};
    case GalleryReducerActions.SET_ARTWORKS:
      const artworkId = action.payload?.artworkId;
      if (artworkId) {
        return {
          ...state,
          galleryArtworks: {
            ...state.galleryArtworks,
            ...action.payload,
          },
        };
      } else {
        return state;
      }
    case GalleryReducerActions.SAVE_NEW_ARTWORKS:
      const payloadArtworks = action.payload;
      if (payloadArtworks) {
        return {
          ...state,
          galleryArtworks: {
            ...state.galleryArtworks,
            ...payloadArtworks,
          },
        };
      } else {
        return state;
      }
    case GalleryReducerActions.DELETE_ARTWORKS:
      if (action?.artworkId) {
        const galleryArtworks = _.cloneDeep(state.galleryArtworks);
        delete galleryArtworks[action.artworkId];
        return {
          ...state,
          galleryArtworks,
        };
      } else {
        return state;
      }
    case GalleryReducerActions.SET_PROFILE:
      return {...state, galleryProfile: action.payload};
    case GalleryReducerActions.SET_EXHIBITIONS:
      return {
        ...state,
        galleryExhibitions: {
          ...action.payload,
        },
      };
    case GalleryReducerActions.SAVE_EXHIBITION:
      if (action?.exhibitionId) {
        return {
          ...state,
          galleryExhibitions: {
            ...state.galleryExhibitions,
            [action?.exhibitionId]: action.payload,
          },
        };
      } else {
        return state;
      }
    case GalleryReducerActions.DELETE_EXHIBITION:
      if (action?.exhibitionId) {
        const galleryExhibitionsClone = _.cloneDeep(state.galleryExhibitions);
        delete galleryExhibitionsClone[action.exhibitionId];
        return {
          ...state,
          galleryExhibitions: {
            ...galleryExhibitionsClone,
          },
        };
      } else {
        return state;
      }
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: GalleryState;
  dispatch: React.Dispatch<Action>;
}>({state: initialState, dispatch: () => undefined});

type AppContextProviderProps = {
  children: ReactNode;
};

export function AppContextProvider({children}: AppContextProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {user} = React.useContext(AuthContext);
  React.useEffect(() => {
    dispatch({
      type: GalleryReducerActions.SET_ACCESS_TOKEN,
      payload: user?.accessToken as string,
    });
  }, []);

  const contextValue = React.useMemo(() => {
    return {state, dispatch};
  }, [state, dispatch]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export const useAppState = () => useContext(AppContext);
