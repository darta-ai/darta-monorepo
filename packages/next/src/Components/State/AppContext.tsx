/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-case-declarations */
import React, {createContext, ReactNode, useContext, useReducer} from 'react';

import {
  ArtworkObject,
  ExhibitionObject,
  GalleryState,
  IGalleryProfileData,
} from '../../../globalTypes';
import {AuthContext} from '../../../pages/_app';

type Action =
  | {type: 'SET_ARTWORKS'; payload: ArtworkObject}
  | {type: 'SET_PROFILE'; payload: IGalleryProfileData}
  | {type: 'SET_EXHIBITIONS'; payload: ExhibitionObject}
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
  SET_PROFILE = 'SET_PROFILE',
  SET_EXHIBITIONS = 'SET_EXHIBITIONS',
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
    case GalleryReducerActions.SET_PROFILE:
      return {...state, galleryProfile: action.payload};
    case GalleryReducerActions.SET_EXHIBITIONS:
      const exhibitionId = action.payload?.exhibitionId;
      if (exhibitionId) {
        return {
          ...state,
          galleryExhibitions: {
            ...state.galleryExhibitions,
            ...action.payload,
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
