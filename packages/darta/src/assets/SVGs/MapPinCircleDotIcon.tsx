import React from 'react';
import Svg, { G, ClipPath, Rect, Defs, Path } from 'react-native-svg';
import * as Colors from '@darta-styles';

export const MapPinCircleDotIcon = () => (
  <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <G clipPath="url(#clip0_2124_89142)">
      <Path d="M10 5.41797C10 7.48047 11.3945 9.20312 13.3047 9.68359V20.5586C13.3047 24.0156 13.9258 25.9023 14.3945 25.9023C14.875 25.9023 15.4844 24.0273 15.4844 20.5586V9.68359C17.3945 9.21484 18.8008 7.48047 18.8008 5.41797C18.8008 2.99219 16.8438 1 14.3945 1C11.957 1 10 2.99219 10 5.41797Z" fill={Colors.PRIMARY_900} fill-opacity="1"/>
      <Path d="M13.1406 5.66407C12.332 5.66407 11.6289 4.96095 11.6289 4.14062C11.6289 3.33204 12.332 2.64062 13.1406 2.64062C13.9609 2.64062 14.6406 3.33204 14.6406 4.14062C14.6406 4.96095 13.9609 5.66407 13.1406 5.66407Z" fill={Colors.PRIMARY_50}/>
    </G>
    <Defs>
      <ClipPath id="clip0_2124_89142">
        <Rect width="8.80078" height="25.7461" fill={Colors.PRIMARY_900} transform="translate(10 1)" />
      </ClipPath>
    </Defs>
  </Svg>
);

