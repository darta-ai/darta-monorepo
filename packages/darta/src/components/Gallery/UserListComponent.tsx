import * as Colors from '@darta-styles';
import React from 'react';
import {StyleSheet, View, } from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {globalTextStyles} from '../../styles/styles';
import {TextElement} from '../Elements/_index';
import * as SVGs from '../../assets/SVGs/index';
import { ListPreview, PreviewArtwork } from '@darta-types/dist';
import FastImage from 'react-native-fast-image'

import { widthPercentageToDP as wp} from 'react-native-responsive-screen';


export const userListComponentStyles = StyleSheet.create({
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
    gap: 4,
  },
  badgeContainer: {
    width: '15%',
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
    width: '75%',
    height: '100%',
    justifyContent: 'center',
    gap: 2
  },
});

// Define the prop types for the component
type DartaIconButtonWithTextProps = {
  listPreview: ListPreview
  isAdding: boolean,
  handlePress: ({listId}: {listId: string}) => void,
};

const styles = StyleSheet.create({
  image: {
    width: '33%', // Adjust width based on the number of columns
    height: 100,  // Set your desired height
    // Add any additional styling
  },
  // You can add more styles if needed
});

const Icon = ({ artworkPreview }: { artworkPreview: { [key: string]: PreviewArtwork } }) => {

  if (!artworkPreview) return null

  const data = Object?.values(artworkPreview)[0]

  if (!data || !data?.artworkImage?.value) return null

  return (
    <View style={{height: 25, width: 25}}>
    <FastImage source={{ uri: data.artworkImage.value ?? "" }} />
  </View>
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
            artworkPreview={listPreview.artworkPreviews}
          />
      </View>
      <View style={userListComponentStyles.textContainer}>
        <TextElement
          style={globalTextStyles.boldTitleText}>
          {listPreview?.listName}
        </TextElement>
      </View>
      <View style={userListComponentStyles.forwardButtonContainer}>
          {isAdding && isPressed && <SVGs.PlusCircleIcon />}
          {isAdding && !isPressed && <SVGs.EmptyCircle /> }
          {!isAdding && <SVGs.ForwardIcon />}
      </View>
    </TouchableOpacity>
  );
}
