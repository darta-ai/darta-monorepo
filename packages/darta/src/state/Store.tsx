import _ from 'lodash';
import React, {createContext, ReactNode} from 'react';

import {Artwork, MapPinCities, ExhibitionMapPin, ListPreview, FullList, PublicFields, PrivateFields, Images, ExhibitionDates, ReceptionDates, MapRegion} from '@darta-types'

// export type CurrentlyViewingMapView = "all" | "savedGalleries" | "newOpenings" | "walkingRoute";

export const currentlyViewingMapView = {
  all: "all",
  savedGalleries: "savedGalleries",
  newOpenings: "newOpenings",
  newClosing: "newClosing",
  walkingRoute: "walkingRoute",
  openingTonight: "openingTonight",
  customView: "customView"
}

export interface CurrentlyViewingMapView {
  all: "all";
  savedGalleries: "savedGalleries";
  newOpenings: "newOpenings";
  newClosing: "newClosing";
  walkingRoute: "walkingRoute";
  openingTonight: "openingTonight",
  customView: "customView"
}

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

// Define the state type
export interface IState {
  isPortrait: boolean;

  allMapPins?: {[key: string] : ExhibitionMapPin}

  mapPins?: {
    [city in MapPinCities]: {
      [key in keyof CurrentlyViewingMapView] : Array<ExhibitionMapPin>
    }
  }

  mapPinStatus?: {
    [city in MapPinCities]: {
      [key in keyof CurrentlyViewingMapView] : {[key: string] : boolean}
    }
  }

  mapPinIds?: {
    [city in MapPinCities]: {
      walkingRoute : Array<string>
    }
  }

  walkingRoute? : {
    [city in MapPinCities]?: {
      [key in keyof CurrentlyViewingMapView] : Array<ExhibitionMapPin>
    }
  }

  customViews? : {
    [city in MapPinCities]?: {
      walkingRoute : string,
      mapPins?: Array<ExhibitionMapPin>,
    }
  }

  mapPinCategories?: {
    [city in MapPinCities]: {
      [key in keyof CurrentlyViewingMapView] : Array<string>
    }
  }

  isViewingWalkingRoute: boolean;
  currentlyViewingMapView: string;
  currentlyViewingCity: MapPinCities;

  qrCodeExhibitionId?: string;
  qrCodeGalleryId?: string;

  artworkId?: string;

  userArtworkViewTimes?: {[key: string] : number}

  fullyLoadedGalleries?: {[key: string] : boolean}
  fullyLoadedExhibitions?: {[key: string] : boolean}

  userAgreedToNavigationTerms: boolean;

  userListPreviews?: {[key: string]: ListPreview}
  userLists?: {[key: string]: FullList}
  listId?: string;
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

  saveExhibitionMapPins = 'SAVE_EXHIBITION_MAP_PINS',

  setQRCodeExhibitionId = 'SET_QR_CODE_EXHIBITION_ID',
  setQRCodeGalleryId = 'SET_QR_CODE_GALLERY_ID',

  setUserArtworkViewTimes = 'SET_USER_ARTWORK_VIEW_TIMES',

  setUserListPreviews = 'SET_USER_LIST_PREVIEWS',
  setUserLists = 'SET_USER_LISTS',
  addArtworkToList = 'ADD_ARTWORK_TO_LIST',
  deleteList = 'DELETE_LIST',
  setWalkingRoute = 'SET_WALKING_ROUTE',
  setCurrentViewingMapView = 'SET_CURRENT_VIEWING_MAP_VIEW',
  setIsViewingWalkingRoute = 'SET_IS_VIEWING_WALKING_ROUTE',

  setUserAgreedToNavigationTerms = 'SET_USER_AGREED_TO_NAVIGATION_TERMS',
  setPinStatus = 'SET_PIN_STATUS',
  setAllMapPins = 'SET_ALL_MAP_PINS',
  addLocationIdToSavedPins = 'ADD_LOCATION_ID_TO_SAVED_PINS',
  removeLocationIdToSavedPins = 'REMOVE_LOCATION_ID_FROM_MAP_PINS',
}

// Define the action type
interface IAction {
  type: ETypes;

  // for title
  galleryTitle?: string;
  
  // see here after
  mapPins?: {[key: string] : ExhibitionMapPin}
  mapPinCity?: MapPinCities
  isViewingSaved?: boolean;
  userGalleryFollowed?: {[key: string] : boolean};

  isViewingWalkingRoute?: boolean;
  walkingRoute?: string;
  currentlyViewingMapView?: string;

  qRCodeExhibitionId?: string;
  qrCodeGalleryId?: string;

  fullyLoadedGalleries?: {[key: string] : boolean};
  fullyLoadedExhibitions?: {[key: string] : boolean};

  userListPreviews?: {[key: string]: ListPreview}
  userLists?: {[key: string]: FullList}
  artwork?: Artwork;
  listId?: string;

  userAgreedToNavigationTerms?: boolean;
  customMapLocationIds?: Array<string>;
  exhibitionId?: string;
  locationId?: string;
  pinStatus?: boolean;
  setWalkingRouteRender?: boolean;
  addLocationIdToSavedPins?: string;
}

// Define the initial state
const initialState: IState = {
  isPortrait: true,
  mapPins: {} as any,
  currentlyViewingMapView: currentlyViewingMapView.all,
  currentlyViewingCity: MapPinCities.newYork,
  userAgreedToNavigationTerms: false,
  isViewingWalkingRoute: false,
};

// Define the reducer function
const reducer = (state: IState, action: IAction): IState => {
  const { type } = action;

  switch (type) {
    case ETypes.setPortrait:
      return {...state, isPortrait: !state.isPortrait};
      // SET_CURRENT_EXHIBITION
    case ETypes.saveExhibitionMapPins:
        if (!action.mapPins || !action.mapPinCity || !action?.userGalleryFollowed) {
          return state;
        }
        const allPins : ExhibitionMapPin[] = Object.values(action.mapPins).sort((a, b) => {
            if (a.exhibitionDates?.exhibitionStartDate?.value && b.exhibitionDates?.exhibitionStartDate?.value) {
              return new Date(a.exhibitionDates.exhibitionStartDate.value).getTime() - new Date(b.exhibitionDates.exhibitionStartDate.value).getTime();
            } else {
              return 0;
            }
        }) 

        const userFollowsPins: ExhibitionMapPin[] = allPins.filter((pin: ExhibitionMapPin) => {
          const galleryId = pin?.galleryId;
          return action?.userGalleryFollowed?.[galleryId] && pin?.exhibitionLocation?.coordinates?.latitude && pin?.exhibitionLocation?.coordinates?.longitude
        })

        const today = new Date(); 
        // Calculate the date 7 days before today
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const newOpeningsPins: ExhibitionMapPin[] = allPins.filter((pin: ExhibitionMapPin) => {
          if (!pin?.exhibitionDates?.exhibitionStartDate?.value ){
            return false;
          }
          const startDate = new Date(pin.exhibitionDates.exhibitionStartDate.value);
        
          // Check if the start date is on or after tenDaysAgo and ensure the exhibition has valid coordinates
          return startDate >= sevenDaysAgo && startDate <= today &&
                 pin?.exhibitionLocation?.coordinates?.latitude && 
                 pin?.exhibitionLocation?.coordinates?.longitude;
        });  

        const sevenDaysFromNow = new Date(today);
        sevenDaysFromNow.setDate(today.getDate() + 7); // Add 7 days to today.

        const newClosingPins = allPins.filter((pin: ExhibitionMapPin) => {
          if (!pin?.exhibitionDates?.exhibitionEndDate?.value){
            return false;
          }
          const endDate = new Date(pin.exhibitionDates.exhibitionEndDate.value);
          
          // Check if the end date is between today and sevenDaysFromNow and ensure the exhibition has valid coordinates
          return endDate >= today && endDate <= sevenDaysFromNow &&
                 pin?.exhibitionLocation?.coordinates?.latitude && 
                 pin?.exhibitionLocation?.coordinates?.longitude;
        });

        const openingTonightPins: ExhibitionMapPin[] = allPins.filter((pin: ExhibitionMapPin) => {
          if (!pin.receptionDates?.receptionStartTime?.value) {
            return false;
          }
          const startDate = new Date(pin.receptionDates.receptionStartTime.value);
          const today = new Date();
        
          // Compare only the date part by setting the time to midnight
          const startDateWithoutTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
          const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
          return startDateWithoutTime.getTime() === todayWithoutTime.getTime();
        }); 
      
        return {
          ...state,
          allMapPins: {
            ...state.allMapPins,
            ...action.mapPins
          },
          mapPinIds: {
            ...state.mapPinIds,
            [action.mapPinCity]: {
              [currentlyViewingMapView?.all]: allPins.map(pin => pin?.locationId),
              [currentlyViewingMapView?.savedGalleries]: userFollowsPins.map(pin => pin?.locationId),
              [currentlyViewingMapView?.newOpenings]: newOpeningsPins.map(pin => pin?.locationId),
              [currentlyViewingMapView?.walkingRoute]: [],
              [currentlyViewingMapView?.openingTonight]: openingTonightPins.map(pin => pin?.locationId),
              [currentlyViewingMapView?.newClosing]: newClosingPins.map(pin => pin?.locationId),
              [currentlyViewingMapView?.customView]: []
            } as {
              all: Array<string>;
              savedGalleries: Array<string>;
              newOpenings: Array<string>;
              newClosing: Array<string>;
              walkingRoute: Array<string>;
              openingTonight: Array<string>;
              customView: Array<string>;
            }
          },
          mapPinStatus: {
            ...state.mapPinStatus,
            [action.mapPinCity]: {
              all: allPins.reduce((acc, el) => ({ ...acc, [el.locationId]: false }), {}),
              savedGalleries: userFollowsPins.reduce((acc, el) => ({ ...acc, [el.locationId]: false }), {}),
              newOpenings: newOpeningsPins.reduce((acc, el) => ({ ...acc, [el.locationId]: false }), {}),
              newClosing: newClosingPins.reduce((acc, el) => ({ ...acc, [el.locationId]: false }), {}),
              walkingRoute: {} as { [key: string]: boolean },
              openingTonight: openingTonightPins.reduce((acc, el) => ({ ...acc, [el.locationId]: false }), {}),
              customView: {}, // Ensure this matches the expected structure
            } as {
              all: { [key: string]: boolean };
              savedGalleries: { [key: string]: boolean };
              newOpenings: { [key: string]: boolean };
              newClosing: { [key: string]: boolean };
              walkingRoute: { [key: string]: boolean };
              openingTonight: { [key: string]: boolean };
              customView: {};
            },
          }
        };
    case ETypes.setWalkingRoute:
      if (!action.walkingRoute || !action.customMapLocationIds || action.setWalkingRouteRender === undefined || !state.currentlyViewingCity) {
        return state;
      }
      
      return {
        ...state,
        customViews: {
          ...state.customViews,
          [state.currentlyViewingCity]: {
            walkingRoute: action.walkingRoute
          }
        },
        mapPinIds: {
          ...state.mapPinIds,
          [state.currentlyViewingCity]: {
            ...state.mapPinIds?.[state.currentlyViewingCity],
            walkingRoute: action.customMapLocationIds
          }
        },
        currentlyViewingMapView: action.setWalkingRouteRender ? currentlyViewingMapView.walkingRoute : state.currentlyViewingMapView
      };
    case ETypes.setPinStatus: {
      if (!action.locationId || action.pinStatus === undefined){
        return state;
      }      
      return {
        ...state,
        mapPinStatus: {
          ...state.mapPinStatus,
          [state.currentlyViewingCity]: {
            ...state.mapPinStatus?.[state.currentlyViewingCity],
            [state.currentlyViewingMapView]: {
              ...state.mapPinStatus?.[state.currentlyViewingCity][state.currentlyViewingMapView],
              [action.locationId]: action.pinStatus
            },
            walkingRoute: {
              ...state.mapPinStatus?.[state.currentlyViewingCity].walkingRoute,
              [action.locationId]: action.pinStatus
            }
          }
        }
      }
    }
    case ETypes.addLocationIdToSavedPins:{
      if (!action.locationId){
        return state;
      }
      return {
        ...state,
        mapPinIds: {
          ...state.mapPinIds,
          [state.currentlyViewingCity]: {
            ...state.mapPinIds?.[state.currentlyViewingCity],
            [currentlyViewingMapView?.savedGalleries]: [...state.mapPinIds?.[state.currentlyViewingCity]?.[currentlyViewingMapView?.savedGalleries], action.locationId]
          } 
        },
      }
    }
    case ETypes.removeLocationIdToSavedPins:{
      if (!action.locationId){
        return state;
      }
      return {
        ...state,
        mapPinIds: {
          ...state.mapPinIds,
          [state.currentlyViewingCity]: {
            ...state.mapPinIds?.[state.currentlyViewingCity],
            [currentlyViewingMapView?.savedGalleries]: state.mapPinIds?.[state.currentlyViewingCity]?.[currentlyViewingMapView?.savedGalleries].filter((el) => el !== action.locationId)
          } 
        },
      }
    }
    case ETypes.setUserAgreedToNavigationTerms: {
      if (action.userAgreedToNavigationTerms === undefined) {
        return state;
      }
      return {
        ...state,
        userAgreedToNavigationTerms: action.userAgreedToNavigationTerms,
      };
    }
    case ETypes.setCurrentViewingMapView: {
      if (!action.currentlyViewingMapView) {
        return state;
      }
      return {
        ...state,
        currentlyViewingMapView: action.currentlyViewingMapView,
      };
    }
    case ETypes.setIsViewingWalkingRoute: {
      if (action.isViewingWalkingRoute === undefined) {
        return state;
      }
      return {
        ...state,
        isViewingWalkingRoute: action.isViewingWalkingRoute,
      };
    }
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
        
    case ETypes.setUserListPreviews:
      if (!action?.userListPreviews){
        return state;
      }
      return {
        ...state,
        userListPreviews: {
          ...state.userListPreviews,
          ...action.userListPreviews
        },
      };
    case ETypes.deleteList:
        if (!action?.listId){
          return state;
        }
        const userLists = _.omit(state.userLists, action.listId)
        const userListPreviews = _.omit(state.userListPreviews, action.listId)
        return {
          ...state,
          userListPreviews,
          userLists
      };
    case ETypes.setUserLists:
          if (!action?.userLists){
            return state;
          }
          const listArtwork = Object.values(action.userLists)[0].artwork
          let minLat = Number.MAX_VALUE;
          let maxLat = -Number.MAX_VALUE;
          let minLng = Number.MAX_VALUE;
          let maxLng = -Number.MAX_VALUE;
          const formattedListPins: ExhibitionMapPin[] = Object.values(listArtwork).map((artwork) => {
            if (!artwork.exhibition?.exhibitionLocation?.coordinates?.latitude 
              || !artwork.exhibition?.exhibitionLocation?.coordinates?.longitude || !artwork.exhibition?.isCurrentlyShowing) return {} as ExhibitionMapPin
              const latitude = Number(artwork.exhibition?.exhibitionLocation?.coordinates?.latitude?.value);
              const longitude = Number(artwork.exhibition?.exhibitionLocation?.coordinates?.longitude?.value);
      
              if(latitude && longitude){
                // Update min and max values
                minLat = Math.min(minLat, latitude);
                maxLat = Math.max(maxLat, latitude);
                minLng = Math.min(minLng, longitude);
                maxLng = Math.max(maxLng, longitude);
              }

            return {
              exhibitionId: artwork.exhibition?.exhibitionId as string,
              galleryId: artwork.gallery?.galleryId as string,
              artworkId: artwork.artwork?.artworkId as string,
              exhibitionName: artwork.artwork?.artworkTitle as PublicFields,
              exhibitionArtist: artwork.artwork?.artistName as PublicFields,
              exhibitionLocation: {
                isPrivate: false,
                coordinates: {
                  latitude: {
                    value: artwork.exhibition?.exhibitionLocation?.coordinates?.latitude.value as string,
                  },
                  longitude: {
                    value: artwork.exhibition?.exhibitionLocation?.coordinates?.longitude.value as string,
                  }, 
                  googleMapsPlaceId: { value: ""}
                }, 
                locationString: artwork.exhibition?.exhibitionLocation?.locationString as PrivateFields,
              },
              exhibitionPrimaryImage: artwork.artwork?.artworkImage as Images,
              galleryName: artwork.gallery?.galleryName as PublicFields,
              galleryLogo: {} as Images,
              exhibitionTitle: artwork.artwork?.artworkTitle as PublicFields,
              exhibitionType: {value: "Solo Show" as "Solo Show" | "Group Show"},
              exhibitionDates: artwork.exhibition?.exhibitionDates as ExhibitionDates,
              receptionDates: {} as ReceptionDates,
            }
          }).filter((el) => el.exhibitionId)


          let mapRegion: MapRegion = {} as MapRegion  

          const centerLat = (minLat + maxLat) / 2;
          const centerLng = (minLng + maxLng) / 2;
          const latitudeDelta = maxLat - minLat + 0.04; // Added padding
          const longitudeDelta = maxLng - minLng + 0.04; // Added padding


          if (centerLat && centerLng && latitudeDelta && longitudeDelta){
            mapRegion = {
              latitude: centerLat,
              longitude: centerLng,
              latitudeDelta,
              longitudeDelta
            };
          } else {
            mapRegion = {
              latitudeDelta: 0.01,
              longitudeDelta: 0.06,
              latitude: 40.719, 
              longitude: -73.990
            }
          }

          // const objectPins = formattedListPins.reduce((accumulator, artwork) => {
    //     // Use artworkId as a unique key for each artwork
    //     const key = artwork.exhibitionId;
    //     if (!key) return accumulator;
    
    //     // Assign the artwork to its key in the accumulator
    //     accumulator[key] = artwork;

    //     //confirm that there is a value 
    //     if (artwork?.exhibitionLocation?.coordinates?.latitude.value && artwork.exhibitionLocation.coordinates.longitude.value){
    //       return accumulator;
    //     } 
    
    //     return {};
    //   }, {} as {[key: string]: ExhibitionMapPin});


          const id = Object.keys(action.userLists)[0]
          action.userLists[id].mapRegion = mapRegion
          action.userLists[id].listPins = formattedListPins

          return {
            ...state,
            userLists: {
              ...state.userLists,
              ...action.userLists,
            },
          };
    case ETypes.addArtworkToList:
      if (!action?.artwork || !action?.artwork._id || !action?.listId || !state.userLists){
        return state;
      }
      return {
        ...state,
        userLists: {
          ...state.userLists,
          [action.listId]: {
            ...state.userLists[action.listId],
            artwork: {
              ...state.userLists[action.listId]?.artwork,
              [action.artwork._id]: action?.artwork
            }
          }
        },
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

export {StoreContext, reducer, initialState};
