import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import IconElement from './Icon';
import styles, { DARK_GRAY } from '../assets/styles';

function City() {
  return (
    <TouchableOpacity style={styles.city}>
      <Text style={styles.cityText}>
        <IconElement name="location-sharp" size={13} color={DARK_GRAY} />
        {' '}
        New York
      </Text>
    </TouchableOpacity>
  );
}

export default City;
