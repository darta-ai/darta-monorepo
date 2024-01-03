import React from 'react'
import * as Progress from 'react-native-progress';
// That's this module.
import FastImage from 'react-native-fast-image';
import {FastImageProps, Priority} from 'react-native-fast-image'
// react-native-image-progress is a bridge between the image component,
// or react-native-fast-image, and the progress views in react-native-progress. 
// Or you can use it to render a custom progress indicator.
import { createImageProgress } from 'react-native-image-progress';
// Wrap FastImage with react-native-image-progress.
const Image = createImageProgress(FastImage);

interface DartaImageComponentProps extends FastImageProps {
    uri: string;
    priority: Priority;
  }

  
export const DartaImageComponent: React.FC<DartaImageComponentProps> = ({style, uri, priority, ...props}) => {
    return (
        <Image
            style={style}
            source={{ uri, priority }}
            indicator={Progress.CircleSnail}
            {...props}
        />
    )
    }
