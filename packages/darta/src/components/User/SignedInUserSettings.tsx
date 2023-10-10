import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Animated, Image, ScrollView, StyleSheet, View} from 'react-native';
// import {launchImageLibrary} from 'react-native-image-picker';
import {Button, IconButton, TextInput} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as ImagePicker from 'expo-image-picker';

import * as Colors from '@darta-styles';
import {TextElement} from '../Elements/_index';
import {buttonSizes, icons} from '../../utils/constants';
import {galleryInteractionStyles, globalTextStyles} from '../../styles/styles';
import {ETypes, StoreContext} from '../../state/Store';

type FieldState = {
  isEditing?: boolean;
  value?: string;
};

enum SignedInActions {
  profilePicture = 'profilePicture',
  userName = 'userName',
  legalName = 'legalName',
  email = 'email',
  phone = 'phone',
}

type FormData = {
  profilePicture: FieldState;
  userName: FieldState;
  legalFirstName: FieldState;
  legalLastName: FieldState;
  email: FieldState;
  uniqueId?: string;
};

export const SSSignedInUserSettings = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    marginBottom: hp('5%'),
  },
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    margin: hp('3%'),
  },
  image: {
    height: hp('8%'),
    width: hp('8%'),
    borderRadius: 20,
  },
  header: {
    ...globalTextStyles.italicTitleText,
    alignSelf: 'center',
    marginBottom: hp('0.5%'),
  },
  text: {
    fontFamily: 'AvenirNext-Bold',
    fontSize: 15,
    alignSelf: 'flex-start',
    color: Colors.PRIMARY_700,
  },
  textEditContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    width: wp('80%'),
    height: hp('4.5%'),
  },
});

export function UserSettingsSignedIn() {
  const {state, dispatch} = useContext(StoreContext);

  const [showOnlyOne, setShowOnlyOne] = useState(false);

  const [heightAnim] = useState(new Animated.Value(Math.floor(hp('15%'))));

  const handleShrinkElements = useCallback(() => {
    Animated.timing(heightAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [heightAnim]);

  const handleExpandElements = useCallback(() => {
    Animated.timing(heightAnim, {
      toValue: Math.floor(hp('15%')),
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [heightAnim]);

  const [formData, setFormData] = useState<FormData>({
    profilePicture: {
      isEditing: false,
    },
    userName: {
      isEditing: false,
    },
    legalFirstName: {
      isEditing: false,
    },
    legalLastName: {
      isEditing: false,
    },
    email: {
      isEditing: false,
    },
  });
  const {handleSubmit, control, getValues, setValue} = useForm({
    defaultValues: {
      profilePicture: state.user?.profilePicture?.value,
      userName: state.user?.userName,
      legalFirstName: state.user?.legalFirstName,
      legalLastName: state.user?.legalLastName,
      email: state.user?.email
    },
  });

  useEffect(() => {
    const isShowing =
      (formData.profilePicture.isEditing as boolean) ||
      (formData.userName.isEditing as boolean) ||
      (formData.legalFirstName.isEditing as boolean) ||
      (formData.legalLastName.isEditing as boolean) ||
      (formData.email.isEditing as boolean) 
    setShowOnlyOne(isShowing);
  }, [formData]);

  const defaultFieldState = () => ({
    isEditing: false,
  });

  const resetUi = () => {
    setFormData({
      profilePicture: defaultFieldState(),
      userName: defaultFieldState(),
      legalFirstName: defaultFieldState(),
      legalLastName: defaultFieldState(),
      email: defaultFieldState()
    });
    setShowOnlyOne(false);
    handleExpandElements();
  };

  const [tempImage, setTempImage] = useState<any>({uri: '', type: ''});
  const [tempValue, setTempValue] = useState<string>('');

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      // setImage(result.assets[0].uri);
    }
  };


  const handleButtonClick = async (formName: SignedInActions) => {
    // profile picture stuff

    switch (formName) {
      case SignedInActions.profilePicture:
        if (!formData[formName].isEditing) {
          setFormData({
            ...formData,
            [formName]: {isEditing: true},
          });
          handleShrinkElements();
          pickImage()
        } else {
          setFormData({
            ...formData,
            [formName]: {isEditing: false},
          });
          setTempImage({uri: ''});
          handleExpandElements();
        }
        break;
      default:
        // eslint-disable-next-line no-case-declarations
        const {isEditing} = formData[formName];
        if (!isEditing) {
          handleShrinkElements();
          setTempValue(getValues(formName));
          setFormData({
            ...formData,
            [formName]: {isEditing: true},
          });
        } else {
          setValue(formName, tempValue);
          resetUi();
        }
        break;
    }
  };

  const onSave = async () =>
    // data: unknown
    {
      // here need to do some backend stuff

      /// need to make this a blob and then upload to s3

      if (formData.profilePicture.isEditing) {
        setValue('profilePicture', tempImage.uri);
        resetUi();
        setTempImage({uri: ''});
      }
      // dispatch({
      //   type: ETypes.setUserSettings,
      //   userSettings: {
      //     ...getValues(),
      //   },
      // });
      resetUi();
    };

  return (
    <ScrollView style={{height: hp('100%')}}>
      <View style={[SSSignedInUserSettings.divider, {borderBottomWidth: 0}]} />
      <TextElement style={SSSignedInUserSettings.header}>
        profile picture
      </TextElement>
      <View style={[SSSignedInUserSettings.textEditContainer]}>
        {formData.profilePicture.isEditing && tempImage.uri ? (
          <Image
            source={{
              uri: tempImage.uri,
            }}
            style={SSSignedInUserSettings.image}
          />
        ) : (
          <Image
            source={{
              uri: state.user?.profilePicture?.value!,
            }}
            style={SSSignedInUserSettings.image}
          />
        )}

        <IconButton
          icon={formData.profilePicture.isEditing ? icons.cancel : icons.cog}
          iconColor={
            formData.profilePicture.isEditing
              ? Colors.ADOBE_900
              : Colors.PRIMARY_700
          }
          mode="outlined"
          size={buttonSizes.extraSmall}
          containerColor={Colors.PRIMARY_50}
          style={galleryInteractionStyles.secondaryButton}
          accessibilityLabel="edit photo"
          testID="editPhoto"
          animated
          onPress={() => {
            handleButtonClick(SignedInActions.profilePicture);
          }}
        />
      </View>
      <Animated.View
        style={!formData.userName.isEditing && {height: heightAnim}}>
        <View style={SSSignedInUserSettings.divider} />
        <View
          style={
            !formData.userName.isEditing && showOnlyOne && {display: 'none'}
          }>
          <TextElement style={[SSSignedInUserSettings.header, {height: 'auto'}]}>
            user name
          </TextElement>
          <View style={SSSignedInUserSettings.textEditContainer}>
            <View style={{width: wp('60%')}}>
              {formData.userName.isEditing ? (
                <Controller
                  name="userName"
                  rules={{required: true}}
                  control={control}
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      onChangeText={onChange}
                      value={value}
                      multiline
                      autoFocus
                      inputAccessoryViewID="userNameInput"
                      label="user name"
                      testID="userNameInput"
                      mode="outlined"
                      activeOutlineColor={Colors.PRIMARY_600}
                      theme={{
                        fonts: {default: {fontFamily: 'AvenirNext-Bold'}},
                      }}
                      style={{
                        backgroundColor: Colors.PRIMARY_50,
                        fontFamily: 'AvenirNext-Bold',
                      }}
                    />
                  )}
                />
              ) : (
                <TextElement style={SSSignedInUserSettings.text}>
                  {state.user?.userName}
                </TextElement>
              )}
            </View>
            <IconButton
              icon={formData.userName.isEditing ? icons.cancel : icons.cog}
              iconColor={
                formData.userName.isEditing
                  ? PRIMARY_DARK_RED
                  : PRIMARY_DARK_GREY
              }
              mode="outlined"
              size={buttonSizes.extraSmall}
              containerColor={MILK}
              style={galleryInteractionStyles.secondaryButton}
              accessibilityLabel="edit username"
              testID="editUserName"
              animated
              onPress={() => handleButtonClick(SignedInActions.userName)}
            />
          </View>
        </View>
      </Animated.View>
      <Animated.View
        style={!formData.legalFirstName && {height: heightAnim}}>
        <View style={SSSignedInUserSettings.divider} />
        <View
          style={
            !formData.legalFirstName.isEditing && showOnlyOne && {display: 'none'}
          }>
          <TextElement style={SSSignedInUserSettings.header}>name</TextElement>
          <View style={SSSignedInUserSettings.textEditContainer}>
            <View style={{width: wp('60%')}}>
              {formData.legalFirstName.isEditing ? (
                <Controller
                  name="legalFirstName"
                  rules={{required: true}}
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextInput
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      multiline
                      autoFocus
                      testID="fullNameInput"
                      label="full name"
                      mode="outlined"
                      autoComplete="name"
                      activeOutlineColor={PRIMARY_600}
                      style={{
                        backgroundColor: PRIMARY_MILK,
                        fontFamily: 'AvenirNext-Bold',
                      }}
                    />
                  )}
                />
              ) : (
                <TextElement style={SSSignedInUserSettings.text}>
                  {state.user?.legalFirstName}
                </TextElement>
              )}
            </View>
            <View>
              <IconButton
                icon={formData.legalFirstName.isEditing ? icons.cancel : icons.cog}
                iconColor={
                  formData.legalFirstName.isEditing
                    ? PRIMARY_DARK_RED
                    : PRIMARY_DARK_GREY
                }
                mode="outlined"
                size={buttonSizes.extraSmall}
                containerColor={Colors.PRIMARY_50}
                style={galleryInteractionStyles.secondaryButton}
                accessibilityLabel="edit name"
                testID="editName"
                animated
                onPress={() => handleButtonClick(SignedInActions.legalName)}
              />
            </View>
          </View>
        </View>
      </Animated.View>
      <Animated.View style={!formData.email.isEditing && {height: heightAnim}}>
        <View style={SSSignedInUserSettings.divider} />
        <View
          style={!formData.email.isEditing && showOnlyOne && {display: 'none'}}>
          <TextElement style={SSSignedInUserSettings.header}>email</TextElement>
          <View style={SSSignedInUserSettings.textEditContainer}>
            <View style={{width: wp('60%')}}>
              {formData.email.isEditing ? (
                <Controller
                  name="email"
                  rules={{required: true}}
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextInput
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      multiline
                      autoFocus
                      label="email"
                      testID="emailInput"
                      mode="outlined"
                      autoComplete="email"
                      activeOutlineColor={PRIMARY_600}
                      style={{
                        backgroundColor: PRIMARY_MILK,
                        fontFamily: 'AvenirNext-Bold',
                      }}
                    />
                  )}
                />
              ) : (
                <TextElement style={SSSignedInUserSettings.text}>
                  {getValues().email}
                </TextElement>
              )}
            </View>
            <IconButton
              icon={formData.email.isEditing ? icons.cancel : icons.cog}
              iconColor={
                formData.email.isEditing ? PRIMARY_DARK_RED : PRIMARY_DARK_GREY
              }
              mode="outlined"
              size={buttonSizes.extraSmall}
              containerColor={MILK}
              style={galleryInteractionStyles.secondaryButton}
              accessibilityLabel="edit name"
              testID="editName"
              animated
              onPress={() => handleButtonClick(SignedInActions.email)}
            />
          </View>
        </View>
      </Animated.View>
      <Animated.View style={!formData.legalLastName.isEditing && {height: heightAnim}}>
        <View style={SSSignedInUserSettings.divider} />
        <View
          style={!formData.legalLastName.isEditing && showOnlyOne && {display: 'none'}}>
          <TextElement style={SSSignedInUserSettings.header}>phone</TextElement>
          <View style={SSSignedInUserSettings.textEditContainer}>
            <View style={{width: wp('60%')}}>
              {formData.legalLastName.isEditing ? (
                <Controller
                  name="legalLastName"
                  rules={{required: true}}
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextInput
                      autoFocus
                      multiline
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      label="phone number"
                      testID="phoneInput"
                      mode="outlined"
                      autoComplete="tel"
                      activeOutlineColor={PRIMARY_600}
                      style={{
                        backgroundColor: PRIMARY_MILK,
                        fontFamily: 'AvenirNext-Bold',
                      }}
                    />
                  )}
                />
              ) : (
                <TextElement style={SSSignedInUserSettings.text}>
                  {state.user?.legalLastName}
                </TextElement>
              )}
            </View>
            <IconButton
              icon={formData.legalLastName.isEditing ? icons.minus : icons.cog}
              mode="outlined"
              size={buttonSizes.extraSmall}
              iconColor={
                formData.legalLastName.isEditing ? PRIMARY_DARK_BLUE : PRIMARY_DARK_GREY
              }
              containerColor={MILK}
              style={galleryInteractionStyles.secondaryButton}
              accessibilityLabel="edit name"
              testID="editName"
              animated
              onPress={() => handleButtonClick(SignedInActions.phone)}
            />
          </View>
        </View>
      </Animated.View>

      {showOnlyOne && (
        <View style={{alignContent: 'center'}}>
          <Button
            icon={icons.saveSettings}
            mode="contained"
            buttonColor={PRIMARY_600}
            textColor={MILK}
            style={{
              width: wp('80%'),
              marginTop: hp('5%'),
              alignSelf: 'center',
            }}
            onPress={handleSubmit(onSave)}>
            Save
          </Button>
        </View>
      )}
    </ScrollView>
  );
}
