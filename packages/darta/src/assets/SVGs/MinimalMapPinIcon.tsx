import React from 'react';
import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg';

export const MinimalMapPinIcon = () => {
  return (
    <Svg width="59" height="59" viewBox="0 0 59 59" fill="none">
      <Defs>
        <ClipPath id="clip0_1_1202">
          <Rect width="8.80078" height="25.7461" fill="white" transform="translate(26 17)"/>
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip0_1_1202)">
      <Path d="M26 21.418C26 23.4805 27.3945 25.2031 29.3047 25.6836V36.5586C29.3047 40.0156 29.9258 41.9023 30.3945 41.9023C30.875 41.9023 31.4844 40.0273 31.4844 36.5586V25.6836C33.3945 25.2148 34.8008 23.4805 34.8008 21.418C34.8008 18.9922 32.8437 17 30.3945 17C27.957 17 26 18.9922 26 21.418Z" fill="#272423"/>
      <Path d="M29.1406 21.6641C28.332 21.6641 27.6289 20.9609 27.6289 20.1406C27.6289 19.332 28.332 18.6406 29.1406 18.6406C29.9609 18.6406 30.6406 19.332 30.6406 20.1406C30.6406 20.9609 29.9609 21.6641 29.1406 21.6641Z" fill="white"/>
      </G>
    </Svg>
  );
};
