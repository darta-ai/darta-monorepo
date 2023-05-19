import React from 'react';
import {TouchableOpacity} from 'react-native';

import styles, {DARK_GRAY} from '../../assets/styles';
import IconElement from './IconElement';
import {GlobalText} from './index';

function LocationIndicator() {
  return (
    <TouchableOpacity style={styles.city}>
      <GlobalText style={styles.cityText}>
        <IconElement icon="location-sharp" size={13} iconColor={DARK_GRAY} />{' '}
        New York
      </GlobalText>
    </TouchableOpacity>
  );
}

export default LocationIndicator;
