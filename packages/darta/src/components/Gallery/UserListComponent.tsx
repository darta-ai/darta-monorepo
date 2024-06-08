import * as Colors from '@darta-styles';
import React from 'react';
import {StyleSheet, View, } from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {globalTextStyles} from '../../styles/styles';
import {TextElement} from '../Elements/_index';
import * as SVGs from '../../assets/SVGs/index';
import { ListPreview, PublicFields } from '@darta-types/dist';
// import FastImage from 'react-native-fast-image'

import { widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { DartaImageComponent } from '../Images/DartaImageComponent';


export const userListComponentStyles = StyleSheet.create({
  componentContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.PRIMARY_50,
    justifyContent: 'center',
    borderColor: Colors.PRIMARY_900,
    height: 78,
    width: wp('85%'),
    padding: 16,
    gap: 4,
  },
  badgeContainer: {
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  forwardButtonContainer: {
    width: '10%',
    height: '100%',
    justifyContent: 'center',
  },
  textContainer: {
    width: '70%',
    height: '100%',
    justifyContent: 'center',
    gap: 2,
  },
});

// Define the prop types for the component
type DartaIconButtonWithTextProps = {
  listPreview: ListPreview
  isAdding: boolean,
  handlePress: ({listId}: {listId: string}) => void,
};

const Icon = ({ artworkPreview }: { artworkPreview: PublicFields }) => {

  if (!artworkPreview) return null

  return (
      <DartaImageComponent 
      uri={{ value: artworkPreview.value ?? "" }} 
      style={{height: 50, width: 50}} 
      priority={"normal"}
      size={"smallImage"}
      />
  )
}



export const UserListComponent: React.FC<DartaIconButtonWithTextProps> = ({
  listPreview,
  isAdding,
  handlePress,
}) => {
  const [isPressed, setIsPressed] = React.useState(false);
  const onPress = async () => {
    isAdding && setIsPressed(!isPressed)
    handlePress({listId: listPreview._id})
  }

  return (
    <TouchableOpacity style={userListComponentStyles.componentContainer} onPress={onPress}>
      <View style={userListComponentStyles.badgeContainer}>
          <Icon 
            artworkPreview={listPreview.previewImage}
          />
      </View>
      <View style={userListComponentStyles.textContainer}>
        <TextElement
          style={globalTextStyles.boldTitleText}>
          {listPreview?.listName}
        </TextElement>
        <TextElement
          style={globalTextStyles.baseText}>
          List by {listPreview?.creatorName !== "undefined undefined" ? listPreview.creatorName :  "You"}
        </TextElement>
      </View>
      <View style={userListComponentStyles.forwardButtonContainer}>
          {isAdding && isPressed && <SVGs.CheckmarkCircleFill />}
          {isAdding && !isPressed && <SVGs.EmptyCircle /> }
          {!isAdding && <SVGs.ForwardIcon />}
      </View>
    </TouchableOpacity>
  );
}
