import React from 'react';
import {UIStoreContext, uiReducer, initialUIState} from './UIStore';
import {StoreContext, reducer, initialState} from './Store';
import {GalleryStoreContext, galleryReducer, initialGalleryState} from './GalleryStore';
import { ExhibitionStoreContext, exhibitionReducer, initialExhibitionState } from './ExhibitionStore';
import { ViewStoreContext, viewReducer, initialViewState} from './ViewStore';
import { UserStoreContext, userReducer, initialUserState } from './UserStore';

function StoreProvider({ children }) {
    const [uiState, uiDispatch] = React.useReducer(uiReducer, initialUIState);
    const [galleryState, galleryDispatch] = React.useReducer(galleryReducer, initialGalleryState);
    const [exhibitionState, exhibitionDispatch] = React.useReducer(exhibitionReducer, initialExhibitionState);
    const [viewState, viewDispatch] = React.useReducer(viewReducer, initialViewState);
    const [userState, userDispatch] = React.useReducer(userReducer, initialUserState);
    const [state, dispatch] = React.useReducer(reducer, initialState);
  
    return (
      <StoreContext.Provider value={{ state, dispatch }}>
        <ViewStoreContext.Provider value={{viewState, viewDispatch}}>
          <UIStoreContext.Provider value={{ uiState, uiDispatch }}>
            <GalleryStoreContext.Provider value={{galleryState, galleryDispatch}}>
                <ExhibitionStoreContext.Provider value={{exhibitionState, exhibitionDispatch}}>
                  <UserStoreContext.Provider value={{userState, userDispatch}}>
                    {children}
                  </UserStoreContext.Provider>
                </ExhibitionStoreContext.Provider>
            </GalleryStoreContext.Provider>
          </UIStoreContext.Provider>
          </ViewStoreContext.Provider>
      </StoreContext.Provider>
    );
  }
  
export default StoreProvider;

export {StoreContext, UIStoreContext, GalleryStoreContext, ExhibitionStoreContext, ViewStoreContext, UserStoreContext}

export {ETypes} from './Store'
export {UiETypes} from './UIStore'
export {GalleryETypes} from './GalleryStore'
export {ExhibitionETypes} from './ExhibitionStore'
export {ViewETypes} from './ViewStore'
export {UserETypes} from './UserStore'