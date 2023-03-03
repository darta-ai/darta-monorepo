import React from 'react';
import {
  View, Image, Dimensions, TouchableOpacity,
} from 'react-native';
import IconElement from './GlobalElements/IconElement';
import { CardItemT } from '../types';
import styles, {
  DISLIKE_ACTIONS,
  FLASH_ACTIONS,
  LIKE_ACTIONS,
  STAR_ACTIONS,
  WHITE,
} from '../assets/styles';
import { GlobalText } from './GlobalElements/index';

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
          <GlobalText style={styles.matchesTextCardItem}>
            <IconElement name="heart" color={WHITE} size={13} />
            {' '}
            {matches}
            % Match!
          </GlobalText>
        </View>
      )}

      {/* NAME */}
      <GlobalText style={nameStyle}>{name}</GlobalText>

      {/* DESCRIPTION */}
      {description && (
        <GlobalText style={styles.descriptionCardItem}>{description}</GlobalText>
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
      {hasActions && (
        <View style={styles.actionsCardItem}>
          <TouchableOpacity style={styles.miniButton}>
            <IconElement name="star" color={STAR_ACTIONS} size={14} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <IconElement name="heart" color={LIKE_ACTIONS} size={25} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <IconElement name="close" color={DISLIKE_ACTIONS} size={25} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.miniButton}>
            <IconElement name="flash" color={FLASH_ACTIONS} size={14} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default CardItem;
