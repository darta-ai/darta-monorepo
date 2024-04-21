import React from 'react'
import FastImage from 'react-native-fast-image';
import {FastImageProps, Priority} from 'react-native-fast-image'
import { createImageProgress } from 'react-native-image-progress';

import { ActivityIndicator } from 'react-native';
import { Images } from '@darta-types/dist';
const Image = createImageProgress(FastImage);

interface DartaImageComponentProps extends FastImageProps {
    uri: Images | null;
    priority: Priority;
    size: "largeImage" | "mediumImage" | "smallImage";
  }

  
export const DartaImageComponent: React.FC<DartaImageComponentProps> = ({style, uri, size, priority, ...props}) => {

    const renderIndicator = () => (
        <ActivityIndicator size={"small"} />
    );
    if (uri === null || !uri?.value) {
        return null;
    }
    let imageUri: string = ""
     if (size === "mediumImage" && uri.mediumImage?.value) {
        imageUri = uri.mediumImage.value;
    } else if (size === "smallImage" && uri.smallImage?.value) {
        imageUri = uri.smallImage.value;
    } else if (uri.value) {
        imageUri = uri.value;
    }


    return (
        <Image
            style={style}
            source={{ uri: imageUri, priority }}
            indicator={renderIndicator}
            {...props}
        />
    )
    }
