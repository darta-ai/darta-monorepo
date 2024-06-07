import React from 'react';
import { View } from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {globalTextStyles} from '../../styles/styles';
import {TextElement} from '../Elements/_index';
import * as SVGs from '../../assets/SVGs/index';
import {userListComponentStyles} from './UserListComponent';

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
