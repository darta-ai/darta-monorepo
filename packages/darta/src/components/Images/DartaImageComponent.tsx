import React from 'react'
import * as Progress from 'react-native-progress';
import FastImage from 'react-native-fast-image';
import {FastImageProps, Priority} from 'react-native-fast-image'
import { createImageProgress } from 'react-native-image-progress';
import * as Colors from '@darta-styles'
const Image = createImageProgress(FastImage);

interface DartaImageComponentProps extends FastImageProps {
    uri: string;
    priority: Priority;
  }

  
export const DartaImageComponent: React.FC<DartaImageComponentProps> = ({style, uri, priority, ...props}) => {
    const renderIndicator = () => (
        <Progress.CircleSnail
            color={[Colors.PRIMARY_100, Colors.PRIMARY_200, Colors.PRIMARY_100]}
        />
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
