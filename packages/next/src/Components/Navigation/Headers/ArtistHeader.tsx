import * as React from 'react';
import {HeaderSignedIn} from './Headers/HeaderSignedIn';
import {HeaderSignedOut} from './Headers/HeaderSignedOut';
import {AuthEnum} from '../../Auth/types';
import {AuthContext} from '../../../../pages/_app';

export const ArtistHeader = () => {
  const {user} = React.useContext(AuthContext);
  if (user) {
    return <HeaderSignedIn authType={AuthEnum.galleries} />;
  } else {
    return <HeaderSignedOut authType={AuthEnum.galleries} />;
  }
};
