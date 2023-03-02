import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import IconElement from './GlobalElements/Icon';
import styles, { DARK_GRAY } from '../assets/styles';
import { GlobalText } from './GlobalElements/index';

function City() {
  return (
    <TouchableOpacity style={styles.city}>
      <GlobalText style={styles.cityText}>
        <IconElement name="location-sharp" size={13} color={DARK_GRAY} />
        {' '}
        New York
      </GlobalText>
    </TouchableOpacity>
  );
}

export default City;
