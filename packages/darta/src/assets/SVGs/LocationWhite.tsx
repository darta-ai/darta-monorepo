import React from 'react';
import * as Colors from '@darta-styles';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';

export const LocationWhite = () => (
    <Svg width="24" height="24" viewBox="0 0 28 28" fill="none">
        <G clip-path="url(#clip0_2124_13907)">
            <Path d="M4.00008 11.9718C2.38289 12.7218 2.82821 14.8897 4.60946 14.9014L13.1524 14.9366C13.2931 14.9366 13.3282 14.9718 13.3282 15.1124L13.3516 23.585C13.3634 25.4366 15.5665 25.7647 16.3516 24.0655L25.0118 5.44447C25.8087 3.71009 24.4493 2.47962 22.7266 3.28822L4.00008 11.9718ZM6.03914 13.0733C5.99227 13.0733 5.98055 13.0264 6.03914 13.003L22.879 5.29212C22.961 5.25697 22.9962 5.2804 22.961 5.37415L15.2032 22.2022C15.1915 22.2491 15.1446 22.2374 15.1446 22.1905L15.2032 13.9054C15.2032 13.3897 14.8399 13.0264 14.3126 13.0264L6.03914 13.0733Z" fill={Colors.PRIMARY_950} fill-opacity="0.85"/>
        </G>
        <Defs>
            <ClipPath id="clip0_2124_13907">
                <Rect width="22.2455" height="22.174" fill={Colors.PRIMARY_50} transform="translate(3 3)"/>
            </ClipPath>
        </Defs>
    </Svg>
);
