import React from 'react';
import {View} from 'react-native';

import styles from '../../assets/styles';
import {TabBarIconT} from '../../types';
import IconElement from './IconElement';

function TabBarIcon({focused, icon, colors}: TabBarIconT) {
  const iconFocused = focused ? colors.focused : colors.notFocused;

  return (
    <View style={styles.iconMenu}>
      <IconElement icon={icon} size={25} iconColor={iconFocused} />
    </View>
  );
}

export default TabBarIcon;
