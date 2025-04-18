import React from 'react';
import {IconButton} from 'react-native-paper';

import {IconT} from '../../typing/types';

export function IconElement({iconColor, icon, size, style}: IconT) {
  return (
    <IconButton icon={icon} size={size} iconColor={iconColor} style={style} />
  );
}

