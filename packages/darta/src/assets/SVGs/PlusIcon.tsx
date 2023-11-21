import React from 'react';
import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg';

export const PlusIcon = () => {
  return (
    <Svg width="17" height="16" viewBox="0 0 17 16" fill="none">
      <Defs>
        <ClipPath id="clip0_174_5276">
          <Rect width="16" height="16" fill="white" transform="translate(0.5)" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip0_174_5276)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.83333 15.3333C6.83333 15.7015 7.13181 16 7.5 16H9.5C9.86819 16 10.1667 15.7015 10.1667 15.3333V9.66667H15.8333C16.2015 9.66667 16.5 9.36819 16.5 9V7C16.5 6.63181 16.2015 6.33333 15.8333 6.33333H10.1667V0.666667C10.1667 0.298477 9.86819 0 9.5 0H7.5C7.13181 0 6.83333 0.298476 6.83333 0.666666V6.33333H1.16667C0.798477 6.33333 0.5 6.63181 0.5 7V9C0.5 9.36819 0.798476 9.66667 1.16667 9.66667H6.83333V15.3333Z"
          fill="white"
        />
      </G>
    </Svg>
  );
};
