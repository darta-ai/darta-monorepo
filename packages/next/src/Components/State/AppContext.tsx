/* eslint-disable no-case-declarations */
import {
  ArtworkObject,
  Exhibition,
  ExhibitionObject,
  GalleryState,
  IGalleryProfileData,
} from '@darta-types';
import {User} from 'firebase/auth';
import _ from 'lodash';
import React, {createContext, ReactNode, useContext, useReducer} from 'react';

import {AuthContext} from '../../../pages/_app';

type Action =
  | {type: 'SET_ARTWORK'; payload: ArtworkObject}
  | {type: 'SET_BATCH_ARTWORK'; payload: ArtworkObject}
  | {
      type: 'SAVE_NEW_ARTWORK_FROM_EXHIBITION';
      payload: ArtworkObject;
    }
  | {type: 'DELETE_ARTWORK'; artworkId: string}
  | {type: 'SET_PROFILE'; payload: IGalleryProfileData}
  | {type: 'SET_EXHIBITIONS'; payload: ExhibitionObject}
  | {type: 'SAVE_EXHIBITION'; payload: Exhibition; exhibitionId: string}
  | {type: 'DELETE_EXHIBITION'; exhibitionId: string}
  | {type: 'SET_ACCESS_TOKEN'; payload: string | null}
  | {
      type: 'SAVE_EXHIBITION_ARTWORK';
      artwork: ArtworkObject;
      exhibitionId: string;
    }
  | {
      type: 'SET_EXHIBITION_ORDER';
      exhibitionId: string;
      exhibitionOrder: string[];
    }
  | {type: 'DELETE_EXHIBITION_ARTWORK'; artworkId: string; exhibitionId: string}
  | {type: 'SET_GALLERY_USER'; user: User};

// Define the shape of your state
const initialState: GalleryState = {
  galleryArtworks: {},
  galleryProfile: {} as IGalleryProfileData,
  galleryExhibitions: {},
  accessToken: '',
  user: {},
};

export enum GalleryReducerActions {
  SET_ARTWORK = 'SET_ARTWORK',
  SET_BATCH_ARTWORK = 'SET_BATCH_ARTWORK',
  DELETE_ARTWORK = 'DELETE_ARTWORK',
  SAVE_NEW_ARTWORK = 'SAVE_NEW_ARTWORK_FROM_EXHIBITION',
  SET_PROFILE = 'SET_PROFILE',
  SET_EXHIBITIONS = 'SET_EXHIBITIONS',
  SAVE_EXHIBITION = 'SAVE_EXHIBITION',
  SAVE_EXHIBITION_ARTWORK = 'SAVE_EXHIBITION_ARTWORK',
  SET_EXHIBITION_ORDER = 'SET_EXHIBITION_ORDER',
  DELETE_EXHIBITION = 'DELETE_EXHIBITION',
  DELETE_EXHIBITION_ARTWORK = 'DELETE_EXHIBITION_ARTWORK',
  SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN',
  SET_GALLERY_USER = 'SET_GALLERY_USER',
}

// Define your reducer
const reducer = (state: GalleryState, action: Action): GalleryState => {
  switch (action.type) {
    case GalleryReducerActions.SET_ACCESS_TOKEN:
      return {...state, accessToken: action.payload};
    case GalleryReducerActions.SET_GALLERY_USER:
      return {...state, user: action.user};
    case GalleryReducerActions.SET_ARTWORK:
      const artworkId = action.payload?.artworkId;
      if (artworkId) {
        return {
          ...state,
          galleryArtworks: {
            ...state.galleryArtworks,
            ...action.payload,
          },
        };
      } 
        return state;
      
    case GalleryReducerActions.SET_BATCH_ARTWORK:
      return {
        ...state,
        galleryArtworks: {
          ...state.galleryArtworks,
          ...action.payload,
        },
      };
    case GalleryReducerActions.SAVE_NEW_ARTWORK:
      const payloadArtworks = action.payload;
      if (payloadArtworks) {
        return {
          ...state,
          galleryArtworks: {
            ...state.galleryArtworks,
            ...payloadArtworks,
          },
        };
      } 
        return state;
      
    case GalleryReducerActions.DELETE_ARTWORK:
      if (action?.artworkId) {
        const galleryArtworks = _.cloneDeep(state.galleryArtworks);
        delete galleryArtworks[action.artworkId];
        return {
          ...state,
          galleryArtworks,
        };
      } 
        return state;
      
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
      } 
        return state;
      
    case GalleryReducerActions.DELETE_EXHIBITION_ARTWORK:
      const galleryExhibitionsClone = _.cloneDeep(
        state.galleryExhibitions[action.exhibitionId],
      );
      if (
        galleryExhibitionsClone?.artworks &&
        galleryExhibitionsClone.artworks[action.artworkId]
      ) {
        delete galleryExhibitionsClone.artworks[action.artworkId];
      }
      if (action?.exhibitionId && action?.artworkId) {
        const {exhibitionId} = action;
        return {
          ...state,
          galleryExhibitions: {
            ...state.galleryExhibitions,
            [exhibitionId]: {
              ...galleryExhibitionsClone,
            },
          },
        };
      } 
        return state;
      
    case GalleryReducerActions.SAVE_EXHIBITION_ARTWORK:
      if (action?.exhibitionId && action?.artwork) {
        const {exhibitionId} = action;
        return {
          ...state,
          galleryExhibitions: {
            ...state.galleryExhibitions,
            [exhibitionId]: {
              ...state.galleryExhibitions[exhibitionId],
              artworks: {
                ...state.galleryExhibitions[exhibitionId].artworks,
                ...action.artwork,
              },
            },
          },
        };
      } 
        return state;
      
    case GalleryReducerActions.SET_EXHIBITION_ORDER:
      if (action?.exhibitionId && action?.exhibitionOrder) {
        const {exhibitionId} = action;
        return {
          ...state,
          galleryExhibitions: {
            ...state.galleryExhibitions,
            [exhibitionId]: {
              ...state.galleryExhibitions[exhibitionId],
              exhibitionOrder: action.exhibitionOrder,
            },
          },
        };
      } 
        return state;
      

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
      } 
        return state;
      
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

  const contextValue = React.useMemo(() => ({state, dispatch}), [state, dispatch]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export const useAppState = () => useContext(AppContext);
