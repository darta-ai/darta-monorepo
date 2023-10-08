import React from 'react';

import {AuthContext} from '../../../../pages/_app';
import {AuthEnum} from '../../Auth/types';
import {HeaderSignedIn} from './Headers/HeaderSignedIn';
import {HeaderSignedOut} from './Headers/HeaderSignedOut';

export function GalleryHeader() {
  const {user} = React.useContext(AuthContext);
  if (user) {
    return <HeaderSignedIn authType={AuthEnum.galleries} />;
  } 
    return <HeaderSignedOut authType={AuthEnum.galleries} />;
  
}
