/* eslint-disable react/jsx-props-no-spreading */
// authRequired.js
import {useRouter} from 'next/router';
import React, {useEffect} from 'react';

import {AuthContext} from '../../../pages/_app';

export default function authRequired(WrappedComponent: any) {
  return function (props: any) {
    const Router = useRouter();
    const {user} = React.useContext(AuthContext);

    useEffect(() => {
      if (!user) {
        Router.replace('/Authenticate/Galleries');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return <WrappedComponent {...props} />;
  };
}
