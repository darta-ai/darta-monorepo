import _ from 'lodash';
import React, { createContext } from 'react';
import {Artwork, MobileUser } from '@darta-types'


// Define the state type
export interface UserState {
  userGalleryFollowed?: {[key: string] : boolean}
  userSavedArtwork?: {[key: string] : boolean}
  userLikedArtwork?: {[key: string] : boolean}
  userInquiredArtwork?: {[key: string] : boolean}
  userDislikedArtwork?: {[key: string] : boolean}
  user?: MobileUser;
  artworkData?: {
    [key: string]: Artwork
  }
}

export enum UserETypes {
  setUser = 'SET_USER',

  setUserSavedArtwork = 'SET_USER_SAVED_ARTWORK',
  setUserSavedArtworkMulti = 'SET_USER_SAVED_ARTWORK_MULTI',
  removeUserSavedArtwork = 'REMOVE_USER_SAVED_ARTWORK',

  setUserLikedArtwork = 'SET_USER_LIKED_ARTWORK',
  setUserLikedArtworkMulti = 'SET_USER_LIKED_ARTWORK_MULTI',
  removeUserLikedArtwork = 'REMOVE_USER_LIKED_ARTWORK',

  setUserInquiredArtwork = 'SET_USER_INQUIRED_ARTWORK',
  setUserInquiredArtworkMulti = 'SET_USER_INQUIRED_ARTWORK_MULTI',
  removeUserInquiredArtwork = 'REMOVE_USER_INQUIRED_ARTWORK',

  setUserDislikedArtwork = 'SET_USER_DISLIKED_ARTWORK',
  setUserDislikedArtworkMulti = 'SET_USER_DISLIKED_ARTWORK_MULTI',
  removeUserDislikedArtwork = 'REMOVE_USER_DISLIKED_ARTWORK',

  setUserFollowGalleries = 'SET_USER_FOLLOW_GALLERIES',
  setUserFollowGalleriesMulti = 'SET_USER_FOLLOW_GALLERIES_MULTI',
  removeUserFollowGalleries = 'REMOVE_USER_FOLLOW_GALLERIES',

  saveArtwork = 'SAVE_ARTWORK',
  saveArtworkMulti = 'SAVE_ARTWORK_MULTI',

  setRoutesGenerated = 'SET_ROUTES_GENERATED',
}

// Define the action type
interface UserIAction {
  type: UserETypes;
  userData?: MobileUser;
  artworkId?: string;
  artworkIds?: {[key: string] : boolean};
  galleryId?: string;
  galleryFollowIds?: {[key: string] : boolean};
  artworkData?: Artwork;
  artworkDataMulti?: {[key: string]: Artwork } | void ;
  artworkGeneratedCount?: number;
}

// Define the initial state
const initialUserState: UserState = {
  user: {}
};

// Define the reducer function
const userReducer = (state: UserState, action: UserIAction): UserState => {
  const { type } = action;

  switch (type) {

    case UserETypes.setUser:
      if (!action.userData) {
        return state;
      }
      return {
        ...state,
        user: {
          ...state.user,
          ...action.userData,
        },
      };
    case UserETypes.setUserInquiredArtwork:
      if (!action?.artworkId){
        return state;
      }
      if (state.userInquiredArtwork && state.userInquiredArtwork[action.artworkId] === true){
        return state;
      }
      return {
        ...state,
        userInquiredArtwork: {
          ...state.userInquiredArtwork,
          [action.artworkId]: true,
        },
      };
    case UserETypes.setUserInquiredArtworkMulti:
        if (!action?.artworkIds){
          return state;
        }
        return {
          ...state,
          userInquiredArtwork: {
            ...state.userInquiredArtwork,
            ...action.artworkIds
          },
        };
    case UserETypes.removeUserInquiredArtwork:
      if (!action?.artworkId){
          return state;
        }
        if (state.userInquiredArtwork && state.userInquiredArtwork[action.artworkId] === false){
          return state;
        }
        return {
          ...state,
          userInquiredArtwork: {
            ...state.userInquiredArtwork,
            [action.artworkId]: false,
          },
        };
    case UserETypes.setUserDislikedArtwork:
      if (!action?.artworkId){
        return state;
      }
      return {
        ...state,
        userDislikedArtwork: {
          ...state.userDislikedArtwork,
          [action.artworkId]: true,
        },
      };
    case UserETypes.removeUserDislikedArtwork:
      if (!action?.artworkId){
          return state;
        }
        return {
          ...state,
          userDislikedArtwork: {
            ...state.userDislikedArtwork,
            [action.artworkId]: false,
          },
        };
    case UserETypes.setUserLikedArtwork:
      if (!action?.artworkId){
        return state;
      }
      return {
        ...state,
        userLikedArtwork: {
          ...state.userLikedArtwork,
          [action.artworkId]: true,
        },
      };
    case UserETypes.setUserLikedArtworkMulti:
        if (!action?.artworkIds){
          return state;
        }
        return {
          ...state,
          userLikedArtwork: {
            ...state.userLikedArtwork,
            ...action.artworkIds
          },
        };
    case UserETypes.removeUserLikedArtwork:
      if (!action?.artworkId){
          return state;
        }
        return {
          ...state,
          userLikedArtwork: {
            ...state.userLikedArtwork,
            [action.artworkId]: false,
          },
        };
    case UserETypes.setUserSavedArtwork:
      if (!action?.artworkId){
        return state;
      }
      return {
        ...state,
        userSavedArtwork: {
          ...state.userSavedArtwork,
          [action.artworkId]: true,
        },
      };
    case UserETypes.setUserSavedArtworkMulti:
        if (!action?.artworkIds){
          return state;
        }
        return {
          ...state,
          userSavedArtwork: {
            ...state.userSavedArtwork,
            ...action.artworkIds
          },
        };
    case UserETypes.removeUserSavedArtwork:
      if (!action?.artworkId){
          return state;
        }
        return {
          ...state,
          userSavedArtwork: {
            ...state.userSavedArtwork,
            [action.artworkId]: false,
          },
        };
    case UserETypes.setUserFollowGalleries:
      if (!action?.galleryId){
          return state;
        }
        return {
          ...state,
          userGalleryFollowed: {
            ...state.userGalleryFollowed,
            [action.galleryId]: true,
          },
      };
    case UserETypes.removeUserFollowGalleries:
        if (!action?.galleryId){
          return state;
        }
        return {
          ...state,
          userGalleryFollowed: {
            ...state.userGalleryFollowed,
            [action.galleryId]: false,
          },
      };
    case UserETypes.setUserFollowGalleriesMulti:
      if (!action?.galleryFollowIds){
        return state;
        }
        return {
          ...state,
          userGalleryFollowed: {
            ...state.userGalleryFollowed,
            ...action.galleryFollowIds
          },
      };
    case UserETypes.saveArtwork:
      if(!action.artworkData || !action.artworkData?._id){
        return state
      }
      return {
        ...state,
        artworkData: {
          ...state.artworkData,
          [action.artworkData._id]: action.artworkData
        }
    }

  case UserETypes.saveArtworkMulti:
    if(!action.artworkDataMulti){
      return state
    }
    return {
      ...state,
      artworkData: {
        ...state.artworkData,
        ...action.artworkDataMulti
      }
    }
    case UserETypes.setRoutesGenerated:
      if(!action.artworkGeneratedCount){
        return state
      }
      return {
        ...state,
        user: {
          ...state.user,
          routeGenerationCount: {
            routeGeneratedCountWeekly: action.artworkGeneratedCount
          }
        }
      }
    default:
      return state;
  }
};

// Create the context
export const UserStoreContext = createContext<{
  userState: UserState;
  userDispatch: React.Dispatch<UserIAction>;
}>({
  userState: initialUserState,
  userDispatch: () => null,
});

export {userReducer, initialUserState};


