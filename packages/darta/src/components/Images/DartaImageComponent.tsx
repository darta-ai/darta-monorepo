import React from 'react'
import * as Progress from 'react-native-progress';
import FastImage from 'react-native-fast-image';
import {FastImageProps, Priority} from 'react-native-fast-image'
import { createImageProgress } from 'react-native-image-progress';

import { ActivityIndicator } from 'react-native';
const Image = createImageProgress(FastImage);

interface DartaImageComponentProps extends FastImageProps {
    uri: string;
    priority: Priority;
  }

  
export const DartaImageComponent: React.FC<DartaImageComponentProps> = ({style, uri, priority, ...props}) => {
    const renderIndicator = () => (
        <ActivityIndicator size={"small"} />
    );
    return (
        <Image
            style={style}
            source={{ uri, priority }}
            indicator={renderIndicator}
            {...props}
        />
    )
    }
