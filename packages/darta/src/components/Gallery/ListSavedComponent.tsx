import * as Colors from '@darta-styles';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {globalTextStyles} from '../../styles/styles';
import {TextElement} from '../Elements/_index';
import * as SVGs from '../../assets/SVGs/index';
import { createArtworkRelationshipAPI } from '../../utils/apiCalls';
import { USER_ARTWORK_EDGE_RELATIONSHIP } from '@darta-types/dist';
import { ETypes, StoreContext } from '../../state/Store';

const SSGallerySelectorComponent = StyleSheet.create({
  componentContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.PRIMARY_100,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.PRIMARY_900,
    height: 78,
    width: 345,
    padding: 16,
    borderRadius: 19,
  },
  badgeContainer: {
    flex: 0.15,
    height: '100%',
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
    height: '100%',
    justifyContent: 'center',
    gap: 2
  },
});

// Define the prop types for the component
type DartaIconButtonWithTextProps = {
  headline: string,
  subHeadline: string,
  iconComponent: React.ElementType; // Use a more descriptive prop name
  isAdding: boolean,
  artworkId: string,
};


export const ListSavedComponent: React.FC<DartaIconButtonWithTextProps> = ({
  headline,
  subHeadline,
  iconComponent : Icon,
  isAdding,
  artworkId,
}) => {
  const {dispatch} = React.useContext(StoreContext);
  const onPress = async () => {
    if (isAdding) {
      await createArtworkRelationshipAPI({artworkId, action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE});
      dispatch({
        type: ETypes.setUserSavedArtworkMulti,
        artworkIds: {[artworkId]: true},
      })
    }
    else {
      // Navigate to list
    }
  }
  return (
    <TouchableOpacity style={SSGallerySelectorComponent.componentContainer} onPress={onPress}>
      <View style={SSGallerySelectorComponent.badgeContainer}>
          <Icon />
      </View>
      <View style={SSGallerySelectorComponent.textContainer}>
        <TextElement
          style={globalTextStyles.boldTitleText}>
          {headline}
        </TextElement>
        <TextElement
          style={globalTextStyles.paragraphTextSize14}>
          {subHeadline}
        </TextElement>
      </View>
      <View style={SSGallerySelectorComponent.forwardButtonContainer}>
          {isAdding ? <SVGs.PlusCircleIcon /> : <SVGs.ForwardIcon />}
      </View>
    </TouchableOpacity>
  );
}
