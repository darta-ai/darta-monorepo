import React from 'react';
import {View} from 'react-native';

import styles from '../../styles/styles';
import {TabBarElementT} from '../../typing/types';
import {IconElement} from './IconElement';

export function TabBarElement({focused, icon, colors}: TabBarElementT) {
  const iconFocused = focused ? colors.focused : colors.notFocused;
  return (
    <View style={styles.iconMenu}>
      <IconElement icon={icon} size={25} iconColor={iconFocused} />
    </View>
  );
}
