import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextElement } from '../Elements/TextElement';
import {StyleSheet} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Colors from '@darta-styles'
import { EmailIcon } from '../../assets/SVGs';

const styles = StyleSheet.create({
  button: {
    alignContent: 'center',
    borderWidth: 1,
  },
  text: {
    fontFamily: 'Roboto-Regular',
  }
});

// Define the prop types for the component
type DartaIconButtonWithTextProps = {
  text: string;
  onPress: () => void;
  iconName?: string;
  iconComponent?: React.ElementType; // Use a more descriptive prop name
};

// Define the component with proper type annotations
export const DartaIconButtonWithText: React.FC<DartaIconButtonWithTextProps> = ({
  text,
  iconName,
  onPress,
  iconComponent: Icon
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
      {Icon && <Icon />} 
      {iconName && <MaterialCommunityIcons name={iconName} size={18} color={Colors.PRIMARY_950} />}
      <TextElement style={{marginLeft: 12, fontSize: 16, color: Colors.PRIMARY_900}}>{text}</TextElement>
    </TouchableOpacity>
  );
};
