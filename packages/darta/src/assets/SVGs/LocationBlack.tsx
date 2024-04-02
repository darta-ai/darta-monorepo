
import React from 'react';
import * as Colors from '@darta-styles';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';

export const LocationBlack = () => (
    <Svg width="24" height="24" viewBox="0 0 28 28" fill="none">
        <G clip-path="url(#clip0_2124_13908)">
            <Path d="M4.54974 14.7947L13.0927 14.8298C13.2685 14.8298 13.3271 14.8884 13.3271 15.0642L13.3505 23.5369C13.3505 25.283 15.4482 25.6931 16.2333 23.9939L24.8935 5.37277C25.6786 3.66184 24.331 2.53684 22.6904 3.29856L3.9638 11.9822C2.4638 12.6736 2.75677 14.783 4.54974 14.7947Z" fill={Colors.PRIMARY_950} fill-opacity="0.85"/>
        </G>
        <Defs>
            <ClipPath id="clip0_2124_13908">
                <Rect width="22.1234" height="22.0777" fill="white" transform="translate(3 3)"/>
            </ClipPath>
        </Defs>
    </Svg>
);
