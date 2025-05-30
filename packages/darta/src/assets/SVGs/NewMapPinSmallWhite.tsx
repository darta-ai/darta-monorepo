import React from 'react';
import Svg, { Path } from 'react-native-svg';
import * as Colors from '@darta-styles';


export const NewMapPinSmallWhite = () => (
    <Svg width="14" height="20" viewBox="0 0 24 39" fill="none">
        <Path fill-rule="evenodd" clip-rule="evenodd" d="M11 0C17.0751 0 22 4.92487 22 11C22 16.7218 17.6314 21.4232 12.0476 21.9508V33.5238C12.0476 34.1024 11.5786 34.5714 11 34.5714C10.4214 34.5714 9.95238 34.1024 9.95238 33.5238V21.9508C4.36864 21.4232 0 16.7218 0 11C0 4.92487 4.92487 0 11 0Z" fill={Colors.PRIMARY_50} />
        <Path d="M14.6667 11C14.6667 8.97496 13.025 7.33334 11 7.33334C8.97495 7.33334 7.33333 8.97496 7.33333 11C7.33333 13.025 8.97495 14.6667 11 14.6667C13.025 14.6667 14.6667 13.025 14.6667 11Z" fill={Colors.PRIMARY_900} />
        <Path opacity="0.3" d="M11 35.619C12.4465 35.619 13.619 35.0328 13.619 34.3095C13.619 33.5863 12.4465 33 11 33C9.55354 33 8.38095 33.5863 8.38095 34.3095C8.38095 35.0328 9.55354 35.619 11 35.619Z" fill={Colors.PRIMARY_50} />
    </Svg>

);