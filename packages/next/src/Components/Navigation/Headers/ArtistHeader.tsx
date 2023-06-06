import * as React from 'react';

import {AuthContext} from '../../../../pages/_app';
import {AuthEnum} from '../../Auth/types';
import {HeaderSignedIn} from './Headers/HeaderSignedIn';
import {HeaderSignedOut} from './Headers/HeaderSignedOut';

export function ArtistHeader() {
  const {user} = React.useContext(AuthContext);
  if (user) {
    return <HeaderSignedIn authType={AuthEnum.galleries} />;
  } else {
    return <HeaderSignedOut authType={AuthEnum.galleries} />;
  }
}
