import React from 'react';
import { View, Image} from 'react-native';
import * as Colors from '@darta-styles';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { dartaLogo } from '../../components/User/UserInquiredArtwork';
import { TextElement } from '../../components/Elements/TextElement';
import { ActivityIndicator } from 'react-native-paper';


export function GenericLoadingScreen({route}: {route: any}) {
  
  return (
    <View 
        style={{
        height: hp('100%'),
        width: '100%',
        backgroundColor: Colors.PRIMARY_600,
        display: 'flex',
        alignItems: 'center',
        }}>  
      <Image 
        source={require('../../assets/dartahousewhite.png')}
        style={dartaLogo.image}
      />
        <ActivityIndicator
        size="small"
        color="black"
        style={{
            alignItems: 'center',
                height: hp('7.5%'),
                alignSelf: 'center',
            }}
            />
    </View>     
  );
}
