import React from 'react';
import { Text, View } from 'react-native';
import IconElement from './Icon';
import styles, { DARK_GRAY, PRIMARY_COLOR } from '../assets/styles';
import { TabBarIconT } from '../types';

function TabBarIcon({
  emoji, text, focused,
}: TabBarIconT) {
  const iconFocused = focused ? PRIMARY_COLOR : DARK_GRAY;

  return (
    <View style={styles.iconMenu}>
      <Text style={[styles.tabButtonText, { color: iconFocused }, { fontSize: 15 }]}>{emoji}</Text>
      <Text style={[styles.tabButtonText, { color: iconFocused }]}>{text}</Text>
    </View>
  );
}

export default TabBarIcon;
