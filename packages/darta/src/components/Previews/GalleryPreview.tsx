/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image'


import {TextElement, GalleryIcon} from '../Elements/_index';
import {DEFAULT_Gallery_Image} from '../../utils/constants';
import {globalTextStyles, galleryPreviewStyles} from '../../styles/styles';
import { Artwork } from '@darta-types';

const galleryWallRaw = DEFAULT_Gallery_Image;

// export function GalleryPreview({
//   body,
//   preview,
//   isLoading,
//   text,
//   personalGalleryId,
//   showGallery,
// }: {
//   body: string;
//   preview: any;
//   isLoading: boolean;
//   text: string;
//   personalGalleryId: string;
//   showGallery: (personalGalleryId: string) => void;
// }) {
//   const previewWorks = Object.keys(preview).map(id => (id = preview[id]));

//   const maxDimensions = 50;
//   const maxDimension = Math.floor(hp('20%') * 0.5);

//   const resizedPreviewWorks = previewWorks.map((artwork: Artwork) => {
//     let height;
//     let width;

//     if (artwork?.artworkDimensions 
//       && artwork?.artworkDimensions?.heightIn
//       && artwork?.artworkDimensions?.widthIn
//       && artwork?.artworkDimensions.heightIn.value
//       && artwork?.artworkDimensions.widthIn.value){
//         height = parseInt(artwork?.artworkDimensions?.heightIn.value);
//         width = parseInt(artwork?.artworkDimensions?.widthIn.value);
//       } else {
//         return null
//       }

//     let displayHeight;
//     let displayWidth;
//     if (height >= width) {
//       displayHeight = Math.floor((height / maxDimensions) * maxDimension);
//       displayWidth = Math.floor((width / height) * displayHeight);
//     } else {
//       displayWidth = Math.floor((width / maxDimensions) * maxDimension);
//       displayHeight = Math.floor((height / width) * displayWidth);
//     }
//     return {
//       ...artwork,
//       displayDimensions: {
//         displayHeight,
//         displayWidth,
//       },
//     };
//   });

//   return (
//     <>
//       <ImageBackground
//         imageStyle={galleryPreviewStyles.previewContainerPortrait}
//         source={{uri: galleryWallRaw}}
//       />
//       <View
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           height: hp('25%'),
//           marginTop: hp('1%'),
//           justifyContent: 'space-around',
//         }}>
//         <View style={{}}>
//           <TextElement
//             style={[globalTextStyles.titleText, globalTextStyles.centeredText]}>
//             {' '}
//             {text}
//           </TextElement>
//           <TextElement
//             style={[globalTextStyles.baseText, globalTextStyles.centeredText]}>
//             {' '}
//             {body}
//           </TextElement>
//         </View>
//         <TouchableOpacity
//           style={{
//             height: maxDimension,
//             alignItems: 'center',
//           }}
//           onPress={() => showGallery(personalGalleryId)}>
//           <FlatList
//             data={resizedPreviewWorks}
//             contentContainerStyle={{
//               alignItems: 'center',
//               height: maxDimension,
//               // columnGap: wp('10%'),
//             }}
//             horizontal
//             renderItem={({item}) => (
//               <View>
//                 {isLoading ? (
//                   <ActivityIndicator
//                     size="small"
//                     color="black"
//                     style={{
//                       alignItems: 'center',
//                       height: maxDimension,
//                       // columnGap: wp('15%'),
//                       alignSelf: 'center',
//                     }}
//                   />
//                 ) : (
//                   <FastImage
//                     source={{uri: item?.artworkImage?.value ?? ""}}
//                     style={{
//                       height: item?.displayDimensions.displayHeight,
//                       width: item?.displayDimensions.displayWidth,
//                       position: 'relative',
//                     }}
//                     resizeMode={FastImage.resizeMode.contain}
//                   />
//                 )}
//               </View>
//             )}
//           />
//         </TouchableOpacity>
//         <View
//           style={{
//             marginBottom: hp('1%'),
//             alignSelf: 'center',
//             backgroundColor: 'rgb(0, 0, 0)',
//             borderRadius: 20,
//           }}
//         />
//       </View>
//     </>
//   );
// }
