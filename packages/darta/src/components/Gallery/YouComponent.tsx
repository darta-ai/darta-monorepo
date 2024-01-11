import * as Colors from '@darta-styles';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {globalTextStyles} from '../../styles/styles';
import {TextElement} from '../Elements/_index';
import * as SVGs from '../../assets/SVGs/index';

const SSGallerySelectorComponent = StyleSheet.create({
  componentContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.PRIMARY_100,
    justifyContent: 'center',
    height: 78,
    width: 345,
    padding: 16,
    borderRadius: 19,
  },
  badgeContainer: {
    flex: 0.15,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  forwardButtonContainer: {
    flex: 0.05,
    height: '100%',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 0.8,
    justifyContent: 'center',
    gap: 2
  },
});

// Define the prop types for the component
type DartaIconButtonWithTextProps = {
  headline: string,
  subHeadline: string,
  iconComponent: React.ElementType; // Use a more descriptive prop name
};


export const YouComponent: React.FC<DartaIconButtonWithTextProps> = ({
  headline,
  subHeadline,
  iconComponent : Icon,
}) => {
  return (
    <TouchableOpacity style={SSGallerySelectorComponent.componentContainer}>
      <View style={SSGallerySelectorComponent.badgeContainer}>
          <Icon />
      </View>
      <View style={SSGallerySelectorComponent.textContainer}>
        <TextElement
          style={globalTextStyles.boldTitleText}>
          {headline}
        </TextElement>
        <TextElement
          style={[
            globalTextStyles.paragraphTextSize14,
            {color: Colors.PRIMARY_600},
          ]}>
          {subHeadline}
        </TextElement>
      </View>
      <View style={SSGallerySelectorComponent.forwardButtonContainer}>
          <SVGs.ForwardIcon />
      </View>
    </TouchableOpacity>
  );
}
