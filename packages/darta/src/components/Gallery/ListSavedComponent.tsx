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
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import {userListComponentStyles} from './UserListComponent';

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
    width: wp('90%'),
    padding: 16,
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
  handlePress: ({listId} : {listId: string}) => void,
};


export const ListSavedComponent: React.FC<DartaIconButtonWithTextProps> = ({
  headline,
  subHeadline,
  iconComponent : Icon,
  isAdding,
  handlePress,
}) => {
  const [isPressed, setIsPressed] = React.useState(false);
  const pressHandler = () => {
    setIsPressed(!isPressed);
    handlePress({listId: 'saved'});
  }
  return (
    <TouchableOpacity style={userListComponentStyles.componentContainer} onPress={pressHandler}>
      <View style={userListComponentStyles.badgeContainer}>
          <Icon />
      </View>
      <View style={userListComponentStyles.textContainer}>
        <TextElement
          style={globalTextStyles.boldTitleText}>
          {headline}
        </TextElement>
        <TextElement
          style={globalTextStyles.paragraphTextSize14}>
          {subHeadline}
        </TextElement>
      </View>
      <View style={userListComponentStyles.forwardButtonContainer}>
        {isAdding && isPressed ? <SVGs.PlusCircleIcon /> : <SVGs.EmptyCircle />}
      </View>
    </TouchableOpacity>
  );
}
