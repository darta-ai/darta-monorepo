import React from 'react';
import {Dimensions, Image, View} from 'react-native';

import styles from '../../assets/styles';
import {CardItemT} from '../../types';
import {GlobalText} from './index';

function CardItem({
  description,
  hasActions,
  hasVariant,
  image,
  isOnline,
  matches,
  name,
}: CardItemT) {
  // Custom styling
  const fullWidth = Dimensions.get('window').width;

  const imageStyle = [
    {
      borderRadius: 8,
      width: hasVariant ? fullWidth / 2 - 30 : fullWidth - 80,
      height: hasVariant ? 170 : 350,
      margin: hasVariant ? 0 : 20,
    },
  ];

  const nameStyle = [
    {
      paddingTop: hasVariant ? 10 : 15,
      paddingBottom: hasVariant ? 5 : 7,
      color: '#363636',
      fontSize: hasVariant ? 15 : 30,
    },
  ];

  return (
    <View style={styles.containerCardItem}>
      {/* IMAGE */}
      <Image source={image} style={imageStyle} />

      {/* MATCHES */}
      {matches && (
        <View style={styles.matchesCardItem}>
          <GlobalText style={styles.matchesTextCardItem} />
        </View>
      )}

      {/* NAME */}
      <GlobalText style={nameStyle}>{name}</GlobalText>

      {/* DESCRIPTION */}
      {description && (
        <GlobalText style={styles.descriptionCardItem}>
          {description}
        </GlobalText>
      )}

      {/* STATUS */}
      {!description && (
        <View style={styles.status}>
          <View style={isOnline ? styles.online : styles.offline} />
          <GlobalText style={styles.statusText}>
            {isOnline ? 'Online' : 'Offline'}
          </GlobalText>
        </View>
      )}

      {/* ACTIONS */}
      {hasActions && <View style={styles.actionsCardItem} />}
    </View>
  );
}

export default CardItem;
