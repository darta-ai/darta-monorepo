import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {GlobalText} from '../../../GlobalElements';
import {globalTextStyles} from '../../../styles';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {DARK_GRAY, MILK} from '../../../../assets/styles';

export const SLIDER_WIDTH = Dimensions.get('window').width + 80;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

const defaultImage =
  'https://lh3.googleusercontent.com/7ml_zUm44Jxm7aONzLmoMo_ASodWApSLiFNYM20_bnSXW44Qrkx-CEkmFFCjYERLxv-N8KgQ9YjPxOqJu_Lpgq6E9m1qp3_R1EnF4OQZ3jwkfdheuI1z2SZf0Attk33teIXJoGvPzL_iVp2peiIa0DgmoWObEqOlJgkcTtX9I07YYP2XzbmF1u99sY9Qd7AumC8M1l6Kp3kvRr3lIs1IvVppdSatckx6xofZvkiNRngXIArv9MmHW7SzKaUCurE388ID9sH0ylbmwXuBXrBcxEmBlzCnwaxkctDpwk3wb7sHhV96m655-JycAXoR6Bw2rKWes7aECX9mYqg7P8Svk-QbsOP1-O-Y5n5LNyz7F93qL8Ft4suYNZGuvQKVNwPZCAnNJp4ix4oqgEiRoJ23d3Rj_rniFuoAJnoeBW-C7yXFVc8M1nn0VFS--Vl6mGrP9chYfOLLY6MVc1kne8ajaNe17-GXdyvW93moKNoiNoqedtzWVTOYXQqYM4ZAdBzP5JxjTQeqTYRsVpyMG-04BkXin7_9WkqFjWQdYYOo7B5YW2evK1xNrKMeNVTflwopBaTMUEz15JxG_Lgm1CNm5ExaL8_lNQmlp0s5VsVEK-9t550BASMMUQYg5tisYKY8AlOw1FrBq1Wh8hYmpdoL2oQvbMGJmXxPNsmNUYC507X9rfp3HUBXEEPlovLxIxBrtKOkmYyVD46QwMk4wPrwEXPuxiB-lm9Y3JshSo3vczEWxz8lChzP2X7qBgluKURUt53X_K9MyihFUssR3uMcoNXOtszuZ1kgXIl6Nxu88NtAWWsR3y41bkXLOgYetnbQyiZkXuml6Et2UszAqUzBID7QCqsHwmmqQ6BRAnNtCly-YE9CHfYa9ZS0T5t5iJK5yi8i_oY2i8WizXLsfKDFci4_cirdUmj-i2tBpyO7gsod_-P4cFiRHQJaDNU6QwMCej1epOoaDnQnN0adIlmdTM6dsnvFFm096DYmayGNMVfyGtn3NYMLAuxre-A=w872-h774-s-no?authuser=0';

export function CarouselCardItem({item, index}: {item: any; index: number}) {
  console.log({item, index});
  return (
    <TouchableOpacity>
      <View style={styles.container} key={index}>
        <View style={styles.fieldSet}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center',
              marginBottom: hp('1%'),
            }}>
            <View style={{flex: 1}}>
              <Image
                source={{uri: item.logo ?? defaultImage}}
                style={{
                  width: hp('4%'),
                  height: hp('4%'),
                }}
              />
            </View>
            <View style={{alignSelf: 'flex-end'}}>
              <GlobalText style={styles.legend}>{item.type}</GlobalText>
            </View>
          </View>

          <Image source={{uri: item.preview}} style={styles.image} />
          <GlobalText
            style={[
              globalTextStyles.boldTitleText,
              {
                paddingTop: hp('2%'),
                paddingLeft: hp('2%'),
              },
            ]}>
            {item.name}
          </GlobalText>
          <GlobalText
            style={[
              globalTextStyles.baseText,
              {
                paddingTop: hp('2%'),
                paddingLeft: hp('2%'),
              },
            ]}>
            {item.details}
          </GlobalText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: ITEM_WIDTH,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  image: {
    width: ITEM_WIDTH,
    height: hp('30%'),
  },
  body: {
    color: '#222',
    fontSize: 18,
    paddingLeft: 20,
    paddingRight: 20,
  },
  fieldSet: {
    margin: 10,
    paddingBottom: 10,
    alignItems: 'center',
  },
  legend: {
    borderRadius: 20,
    top: -10,
    fontFamily: 'AvenirNext-DemiBold',
  },
});
