import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Icon } from 'react-native-elements';
import { IconT } from '../types';

function IconElement({
  color, name, size, style, type,
}: IconT) {
  return (
    <Icon />
  );
}

export default IconElement;
