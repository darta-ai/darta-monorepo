import React from 'react';
import { View } from 'react-native';
import IconElement from './IconElement';
import styles, { DARK_GRAY, PRIMARY_COLOR } from '../../assets/styles';
import { TabBarIconT } from '../../types';

function TabBarIcon({ focused, icon }: TabBarIconT) {
  const iconFocused = focused ? PRIMARY_COLOR : DARK_GRAY;

  return (
    <View style={styles.iconMenu}>
      <IconElement icon={icon} size={25} iconColor={iconFocused} />
    </View>
  );
}

export default TabBarIcon;
