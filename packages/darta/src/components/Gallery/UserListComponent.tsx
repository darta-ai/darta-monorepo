import * as Colors from '@darta-styles';
import React from 'react';
import {StyleSheet, View, } from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {globalTextStyles} from '../../styles/styles';
import {TextElement} from '../Elements/_index';
import * as SVGs from '../../assets/SVGs/index';
import { ListPreview, PreviewArtwork } from '@darta-types/dist';
import FastImage from 'react-native-fast-image'


import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


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

const Icon = ({ artworkPreviews }: { artworkPreviews: { [key: string]: PreviewArtwork } }) => {

  if (!artworkPreviews) return null

  const artworkPreviewValues = Object.values(artworkPreviews).map((artworkPreview) => {
    if (!artworkPreview?.artworkImage?.value) return null;
    return { uri: artworkPreview?.artworkImage?.value }
  }).filter(Boolean); // Filter out any undefined values

  const numColumns = 2; // Change to 2 for a 2x2 grid

  const dataProvider = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(artworkPreviewValues);

  const layoutProvider = new LayoutProvider(
    () => 1,
    (type, dim) => {
      dim.width = wp('50%'); // Set width to 50% for 2 columns
      dim.height = hp('25%'); // Adjust height as needed, assuming equal width and height for square cells
    }
  );

  const imageStyle = StyleSheet.create({
    image: {
      width: '100%',
      height: '100%'
    },
  });

  const rowRenderer = (_, data) => {
    return (
      <View style={{height: 25, width: 25}}>
        <FastImage source={{ uri: data.uri }} style={imageStyle.image} />
      </View>
    );
  };

  return (
    <RecyclerListView
      layoutProvider={layoutProvider}
      dataProvider={dataProvider}
      rowRenderer={rowRenderer}
      scrollEnabled={false}
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
            artworkPreviews={listPreview.artworkPreviews}
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
