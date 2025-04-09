import React from 'react';
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

export const DartaImageComponent: React.FC<DartaImageComponentProps> = ({
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

    const handleLoadStart = React.useCallback(() => {
        setIsLoading(true);
        setHasError(false);
    }, []);

    const handleLoadEnd = React.useCallback(() => {
        setIsLoading(false);
    }, []);

    const handleError = React.useCallback((error: any) => {
        setIsLoading(false);
        setHasError(true);
    }, []);

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