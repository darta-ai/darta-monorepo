import _ from 'lodash';
import React, {createContext, ReactNode, useReducer} from 'react';

import {RatingEnum} from '../typing/types';
import {Artwork, Exhibition, ExhibitionPreview, IGalleryProfileData, MapPinCities, ExhibitionMapPin, MobileUser, GalleryPreview} from '@darta-types'

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

const fetchRawUserData = async (): Promise<PatUserData> => {
  let data;
  try {
    const result = await fetch('http://localhost:1160/user');
    data = await result.json();
  } catch (e) {}
  return data;
};

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


interface IDartaData {
  [id: string]: {
    id: string;
    fullDGallery: any;
    numberOfRatedWorks: number;
    artworkIds: string[];
    numberOfArtworks: number;
    userArtworkRatings: IUserArtworkRatings;
    galleryIndex: number;
    isLoaded: boolean;
  };
}

// Define the state type
export interface IState {
  galleryOnDisplayId: string;
  artworkOnDisplayId: string;
  dartaData: IDartaData;
  isPortrait: boolean;
  userArtworkRatings: IUserArtworkRatings;
  galleryTitle: string;
  tombstoneTitle: string;
  savedArtwork?: IGalleryProfileData;
  // don't know what's going on up there. 

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


  galleryData?:{
    [key: string]: IGalleryProfileData
  },

  artworkData?: {
    [key: string]: Artwork
  }

  currentExhibitionHeader?: string;
  previousExhibitionHeader?: string;
  galleryHeader?: string;
  currentArtworkTombstoneHeader?: string;
  userExhibitionHeader?: string;

  mapPins?: {
    [city in MapPinCities]: {[key: string] : ExhibitionMapPin}
  }

  qrCodeExhibitionId?: string;
  qrCodeGalleryId?: string;

  user?: MobileUser;

  artworkId?: string;

  userSavedArtwork?: {[key: string] : boolean}
  userLikedArtwork?: {[key: string] : boolean}
  userInquiredArtwork?: {[key: string] : boolean}
  userDislikedArtwork?: {[key: string] : boolean}
  userGalleryFollowed?: {[key: string] : boolean}

  userArtworkViewTimes?: {[key: string] : number}

  galleryPreviews?: {[key: string] : GalleryPreview}

  fullyLoadedGalleries?: {[key: string] : boolean}
  fullyLoadedExhibitions?: {[key: string] : boolean}

  artworksToRate?: {[key: string] : Artwork}
  artworkRatingIndex?: number,
  exhibitionShareDetails?: {
    shareURL: string,
    shareURLMessage: string,
  },
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
  saveExhibition = 'SAVE_EXHIBITION',
  saveExhibitionMulti = 'SAVE_EXHIBITION_MULTI',
  saveExhibitionPreviews = 'SAVE_EXHIBITION_PREVIEWS',
  saveUserFollowsExhibitionPreviews = 'SAVE_USER_FOLLOWS_EXHIBITION_PREVIEWS',
  saveForthcomingExhibitionPreviews = 'SAVE_FORTHCOMING_EXHIBITION_PREVIEWS',
  saveCurrentExhibitionPreviews = 'SAVE_CURRENT_EXHIBITION_PREVIEWS',

  saveGallery = 'SAVE_GALLERY',
  saveGalleries= 'SAVE_GALLERIES',

  saveArtwork = 'SAVE_ARTWORK',
  saveArtworkMulti = 'SAVE_ARTWORK_MULTI',

  setCurrentHeader = 'SET_CURRENT_HEADER',
  setGalleryHeader = 'SET_GALLERY_HEADER',
  setPreviousExhibitionHeader = 'SET_PREVIOUS_EXHIBITION_HEADER',
  setTombstoneHeader = 'SET_TOMBSTONE_HEADER',
  setUserExhibitionHeader = 'SET_USER_EXHIBITION_HEADER',

  saveExhibitionMapPins = 'SAVE_EXHIBITION_MAP_PINS',

  setQRCodeExhibitionId = 'SET_QR_CODE_EXHIBITION_ID',
  setQRCodeGalleryId = 'SET_QR_CODE_GALLERY_ID',

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

  setUserArtworkViewTimes = 'SET_USER_ARTWORK_VIEW_TIMES',

  setGalleryPreviewMulti = 'SET_GALLERY_PREVIEW_MULTI',

  setUserFollowGalleries = 'SET_USER_FOLLOW_GALLERIES',
  setUserFollowGalleriesMulti = 'SET_USER_FOLLOW_GALLERIES_MULTI',
  removeUserFollowGalleries = 'REMOVE_USER_FOLLOW_GALLERIES',

  setFullyLoadedGalleries = 'SET_FULLY_LOADED_GALLERIES',
  setFullyLoadedExhibitions = 'SET_FULLY_LOADED_EXHIBITIONS',

  setArtworksToRate = 'SET_ARTWORKS_TO_RATE',
  setRatingIndex = 'SET_RATING_INDEX',

  setExhibitionShareURL = 'SET_EXHIBITION_SHARE_URL',
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
  exhibitionData?: Exhibition;
  exhibitionDataMulti?: {[key: string] : Exhibition}
  exhibitionPreviews?: {[key: string] : ExhibitionPreview}
  galleryData?: IGalleryProfileData;
  galleryDataMulti?: {[key: string]: IGalleryProfileData}
  artworkData?: Artwork;
  artworkDataMulti?: {[key: string]: Artwork } | void 

  currentExhibitionHeader?: string;
  previousExhibitionHeader?: string;
  galleryHeader?: string;
  userExhibitionHeader?: string;
  currentArtworkHeader?: string;

  mapPins?: {[key: string] : ExhibitionMapPin}
  mapPinCity?: MapPinCities

  qRCodeExhibitionId?: string;
  qrCodeGalleryId?: string;

  userData?: MobileUser;

  artworkId?: string;
  artworkIds?: {[key: string] : boolean};

  galleryId?: string;
  galleryFollowIds?: {[key: string] : boolean};
  galleryPreviews?: {[key: string] : GalleryPreview};

  fullyLoadedGalleries?: {[key: string] : boolean};
  fullyLoadedExhibitions?: {[key: string] : boolean};

  artworksToRate?: {[key: string] : Artwork};
  artworkRatingIndex?: number;
  exhibitionShareDetails?: {
    shareURL: string,
    shareURLMessage: string,
  }
}

// Define the initial state
const initialState: IState = {
  galleryOnDisplayId: '',
  artworkOnDisplayId: 'string',
  dartaData: {},
  userArtworkRatings: {},
  isPortrait: true,
  galleryTitle: 'darta',
  tombstoneTitle: 't o m b s t o n e',
  // here
  artworkData: {} as any,
  exhibitionData : {},
  galleryData: {},
  mapPins: {} as any,
  userDislikedArtwork: {},
  artworkRatingIndex: 0,
  user: {}
};

// Define the reducer function
const reducer = (state: IState, action: IAction): IState => {
  const {
    type,
    galleryTitle = 'darta',
  } = action;

  switch (type) {
    case ETypes.setUserSettings:
      return state
    case ETypes.setPortrait:
      return {...state, isPortrait: !state.isPortrait};

    case ETypes.setTitle:
      return {...state, galleryTitle};
    case ETypes.setTombstone:
      return state

      // starting over here

      // SET_CURRENT_EXHIBITION

    case ETypes.saveExhibition:
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
      case ETypes.saveExhibitionMulti:
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
    case ETypes.saveExhibitionPreviews:
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
    case ETypes.saveUserFollowsExhibitionPreviews:
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
      case ETypes.saveForthcomingExhibitionPreviews:
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
      case ETypes.saveCurrentExhibitionPreviews:
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
    case ETypes.saveGallery:
      if(!action.galleryData || !action.galleryData._id){
        return state
      }
      return {
        ...state,
        galleryData: {
          ...state.galleryData,
          [action.galleryData._id]: action.galleryData
        }
      }
      case ETypes.saveGalleries:
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
    case ETypes.saveArtwork:
      if(!action.artworkData || !action.artworkData.artworkId){
        return state
      }
      return {
        ...state,
        artworkData: {
          ...state.artworkData,
          [action.artworkData.artworkId]: action.artworkData
        }
      }

      case ETypes.saveArtworkMulti:
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
      case ETypes.setCurrentHeader:
        if (action.currentExhibitionHeader === undefined) {
          return state;
        }
        return {
          ...state,
          currentExhibitionHeader: action.currentExhibitionHeader,
        };
      case ETypes.setPreviousExhibitionHeader:
        if (!action.previousExhibitionHeader) {
          return state;
        }
        return {
          ...state,
          previousExhibitionHeader: action.previousExhibitionHeader,
        };
      case ETypes.setUserExhibitionHeader:
          if (!action.userExhibitionHeader) {
            return state;
          }
          return {
            ...state,
            userExhibitionHeader: action.userExhibitionHeader,
          };
      case ETypes.setTombstoneHeader:
        if (!action.currentArtworkHeader) {
          return state;
        }
        return {
          ...state,
          currentArtworkTombstoneHeader: action.currentArtworkHeader,
        };
      case ETypes.setGalleryHeader:
          if (action.galleryHeader !== undefined) {
            return state;
          }
          return {
            ...state,
            galleryHeader: action.galleryHeader,
          };
  
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
        case ETypes.setUser:
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
          case ETypes.setUserInquiredArtwork:
            if (!action?.artworkId){
              return state;
            }
            return {
              ...state,
              userInquiredArtwork: {
                ...state.userInquiredArtwork,
                [action.artworkId]: true,
              },
            };
          case ETypes.setUserInquiredArtworkMulti:
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
          case ETypes.removeUserInquiredArtwork:
            if (!action?.artworkId){
                return state;
              }
              return {
                ...state,
                userInquiredArtwork: {
                  ...state.userInquiredArtwork,
                  [action.artworkId]: false,
                },
              };
              case ETypes.setUserDislikedArtwork:
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
              case ETypes.removeUserDislikedArtwork:
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
          case ETypes.setUserLikedArtwork:
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
          case ETypes.setUserLikedArtworkMulti:
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
          case ETypes.removeUserLikedArtwork:
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
          case ETypes.setUserSavedArtwork:
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
          case ETypes.setUserSavedArtworkMulti:
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
          case ETypes.removeUserSavedArtwork:
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

        case ETypes.setGalleryPreviewMulti:
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
        case ETypes.setUserFollowGalleries:
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
        case ETypes.removeUserFollowGalleries:
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
        case ETypes.setUserFollowGalleriesMulti:
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
      case ETypes.setFullyLoadedGalleries:
        if (!action?.fullyLoadedGalleries){
          return state;
        }
        return {
          ...state,
          fullyLoadedGalleries: {
            ...state.fullyLoadedGalleries,
            ...action.fullyLoadedGalleries
          },
        };
      case ETypes.setFullyLoadedExhibitions:
        if (!action?.fullyLoadedExhibitions){
          return state;
        }
        return {
          ...state,
          fullyLoadedExhibitions: {
            ...state.fullyLoadedExhibitions,
            ...action.fullyLoadedExhibitions
          },
        };
        case ETypes.setArtworksToRate:
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
          case ETypes.setRatingIndex:
            if (!action?.artworkRatingIndex){
              return state;
            }
            return {
              ...state,
              artworkRatingIndex: action.artworkRatingIndex,
            };
      case ETypes.setExhibitionShareURL:
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

function StoreProvider({children}: StoreProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StoreContext.Provider value={{state, dispatch}}>
      {children}
    </StoreContext.Provider>
  );
}

export {StoreContext, StoreProvider};
