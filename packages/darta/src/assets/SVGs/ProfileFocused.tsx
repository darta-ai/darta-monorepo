import React from 'react';
import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg';

export const ProfileFocusedIcon = () => (
  <Svg width="24" height="20" viewBox="0 0 24 20" fill="none">
    <Defs>
      <ClipPath id="clip0_349_4867">
        <Rect width="23.6853" height="18.4922" fill="white" transform="translate(0 0.571289)" />
      </ClipPath>
    </Defs>
    <G id="person.crop.rectangle.fill"  clipPath="url(#clip0_349_4867)">
      <G id="Group">
          <Path id="Vector" d="M3.15402 19.0635H20.5312C22.6407 19.0635 23.6853 18.0289 23.6853 15.9597V3.68513C23.6853 1.61593 22.6407 0.571289 20.5312 0.571289H3.15402C1.05469 0.571289 0 1.61593 0 3.68513V15.9597C0 18.0289 1.05469 19.0635 3.15402 19.0635ZM5.08259 17.5568C5.84598 15.0054 8.55804 13.1773 11.8527 13.1773C15.1373 13.1773 17.8493 15.0054 18.6228 17.5568H5.08259ZM11.8527 11.4898C9.93411 11.4697 8.42745 9.88269 8.41741 7.73312C8.40736 5.71415 9.93411 4.04674 11.8527 4.04674C13.7712 4.04674 15.2879 5.71415 15.2879 7.73312C15.2879 9.88269 13.7712 11.5099 11.8527 11.4898Z" fill="#333333"/>
        </G>
    </G>
  </Svg>
);

