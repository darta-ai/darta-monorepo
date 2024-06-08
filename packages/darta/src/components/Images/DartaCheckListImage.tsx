import React from 'react'
import { Image } from 'expo-image';

import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Images } from '@darta-types/dist';
import * as Colors from '@darta-styles';

interface DartaImageComponentProps {
    uri: Images | null;
    priority: "normal" | "high" | "low" | undefined;
    size: "largeImage" | "mediumImage" | "smallImage";
    style: any;
  }


const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
    },
    image: {
      width: 200,
      height: 200,
    },
    activityIndicator: {
      position: 'absolute',
    },
  });

  
  export const DartaCheckListImage: React.FC<DartaImageComponentProps> = ({
    style,
    uri,
    size,
    priority,
    ...props
  }) => {
    if (uri === null || !uri?.value) {
      return null;
    }
  
    const [imageUri, setImageUri] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(true);
    const [hasError, setHasError] = React.useState(false);
  
    React.useEffect(() => {
      let isMounted = true;
  
      const getImageUri = () => {
        if (size === 'mediumImage' && uri.mediumImage?.value) {
          return uri.mediumImage.value;
        } else if (size === 'smallImage' && uri.smallImage?.value) {
          return uri.smallImage.value;
        } else if (uri.value) {
          return uri.value;
        }
        return '';
      };
  
      if (isMounted) {
        setImageUri(getImageUri());
      }
  
      return () => {
        isMounted = false;
      };
    }, [uri, size]);
  
    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
    };
  
    const handleLoadEnd = () => {
      setIsLoading(false);
    };
  
    const handleError = (error: any) => {
      // console.log('Image load error in checklistImage:', error);
      setIsLoading(false);
    
      if (error.error === 'file is directory') {
        // Handle the specific error case
        // console.log('Invalid image URL:', imageUri);
        // You can set a default image URL or show an error message to the user
        setImageUri(imageUri);
      } else {
        // Handle other error cases
        setHasError(true);
      }
    };
  
    if (hasError) {
      return null;
    }
  
    return (
      <View style={styles.container}>
        <Image
          style={style}
          source={{ uri: imageUri }}
          contentFit="contain"
          transition={100}
          priority={priority}
          {...props}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          cachePolicy="memory-disk" 
        />
        {isLoading && (
          <ActivityIndicator
            style={styles.activityIndicator}
            size="small"
            color={Colors.PRIMARY_950}
          />
        )}
      </View>
    );
  };

// return (
//     // <ImageProgress
//     //     style={style}
//     //     source={{ uri: imageUri, priority }}
//     //     indicator={renderIndicator}
//     //     {...props}
//     // />
// )
