import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Animated, Image, ScrollView, View} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Button, IconButton, TextInput} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {
  MILK,
  PRIMARY_BLUE,
  PRIMARY_DARK_BLUE,
  PRIMARY_DARK_GREY,
  PRIMARY_DARK_RED,
  PRIMARY_MILK,
} from '../../../../../assets/styles';
import {GlobalText} from '../../../../GlobalElements';
import {buttonSizes, icons} from '../../../../globalVariables';
import {ETypes, StoreContext} from '../../../../State/Store';
import {galleryInteractionStyles} from '../../../Gallery/galleryStyles';
import {settingsStyles} from '../../Screens/UserSettings';

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
  legalName: FieldState;
  email: FieldState;
  phone: FieldState;
  uniqueId?: string;
};

export function UserSettingsSignedIn({uniqueId}: {uniqueId: string}) {
  console.log(uniqueId);

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
    legalName: {
      isEditing: false,
    },
    email: {
      isEditing: false,
    },
    phone: {
      isEditing: false,
    },
  });
  const {handleSubmit, control, getValues, setValue} = useForm({
    defaultValues: {
      profilePicture: state.userSettings.profilePicture,
      userName: state.userSettings.userName,
      legalName: state.userSettings.legalName,
      email: state.userSettings.email,
      phone: state.userSettings.phone,
    },
  });

  useEffect(() => {
    const isShowing =
      (formData.profilePicture.isEditing as boolean) ||
      (formData.userName.isEditing as boolean) ||
      (formData.legalName.isEditing as boolean) ||
      (formData.email.isEditing as boolean) ||
      (formData.phone.isEditing as boolean);
    setShowOnlyOne(isShowing);
  }, [formData]);

  const defaultFieldState = () => ({
    isEditing: false,
  });

  const resetUi = () => {
    setFormData({
      profilePicture: defaultFieldState(),
      userName: defaultFieldState(),
      legalName: defaultFieldState(),
      email: defaultFieldState(),
      phone: defaultFieldState(),
    });
    setShowOnlyOne(false);
    handleExpandElements();
  };

  const [tempImage, setTempImage] = useState<any>({uri: '', type: ''});
  const [tempValue, setTempValue] = useState<string>('');

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
          await launchImageLibrary({mediaType: 'photo'}, response => {
            if (response?.assets) {
              const results = response.assets[0];
              setTempImage({uri: results.uri, type: results.type});
            }
          });
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
      dispatch({
        type: ETypes.setUserSettings,
        userSettings: {
          ...getValues(),
        },
      });
      resetUi();
    };

  return (
    <ScrollView style={{height: hp('100%')}}>
      <View style={[settingsStyles.divider, {borderBottomWidth: 0}]} />
      <GlobalText style={settingsStyles.header}>profile picture</GlobalText>
      <View style={[settingsStyles.textEditContainer]}>
        {formData.profilePicture.isEditing && tempImage.uri ? (
          <Image
            source={{
              uri: tempImage.uri,
            }}
            style={settingsStyles.image}
          />
        ) : (
          <Image
            source={{
              uri: state.userSettings.profilePicture,
            }}
            style={settingsStyles.image}
          />
        )}

        <IconButton
          icon={formData.profilePicture.isEditing ? icons.cancel : icons.cog}
          iconColor={
            formData.profilePicture.isEditing
              ? PRIMARY_DARK_RED
              : PRIMARY_DARK_GREY
          }
          mode="outlined"
          size={buttonSizes.extraSmall}
          containerColor={MILK}
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
        <View style={settingsStyles.divider} />
        <View
          style={
            !formData.userName.isEditing && showOnlyOne && {display: 'none'}
          }>
          <GlobalText style={[settingsStyles.header, {height: 'auto'}]}>
            user name
          </GlobalText>
          <View style={settingsStyles.textEditContainer}>
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
                      activeOutlineColor={PRIMARY_BLUE}
                      theme={{
                        fonts: {default: {fontFamily: 'AvenirNext-Bold'}},
                      }}
                      style={{
                        backgroundColor: PRIMARY_MILK,
                        fontFamily: 'AvenirNext-Bold',
                      }}
                    />
                  )}
                />
              ) : (
                <GlobalText style={settingsStyles.text}>
                  {state.userSettings.userName}
                </GlobalText>
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
        style={!formData.legalName.isEditing && {height: heightAnim}}>
        <View style={settingsStyles.divider} />
        <View
          style={
            !formData.legalName.isEditing && showOnlyOne && {display: 'none'}
          }>
          <GlobalText style={settingsStyles.header}>name</GlobalText>
          <View style={settingsStyles.textEditContainer}>
            <View style={{width: wp('60%')}}>
              {formData.legalName.isEditing ? (
                <Controller
                  name="legalName"
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
                      activeOutlineColor={PRIMARY_BLUE}
                      style={{
                        backgroundColor: PRIMARY_MILK,
                        fontFamily: 'AvenirNext-Bold',
                      }}
                    />
                  )}
                />
              ) : (
                <GlobalText style={settingsStyles.text}>
                  {state.userSettings.legalName}
                </GlobalText>
              )}
            </View>
            <View>
              <IconButton
                icon={formData.legalName.isEditing ? icons.cancel : icons.cog}
                iconColor={
                  formData.legalName.isEditing
                    ? PRIMARY_DARK_RED
                    : PRIMARY_DARK_GREY
                }
                mode="outlined"
                size={buttonSizes.extraSmall}
                containerColor={MILK}
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
        <View style={settingsStyles.divider} />
        <View
          style={!formData.email.isEditing && showOnlyOne && {display: 'none'}}>
          <GlobalText style={settingsStyles.header}>email</GlobalText>
          <View style={settingsStyles.textEditContainer}>
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
                      activeOutlineColor={PRIMARY_BLUE}
                      style={{
                        backgroundColor: PRIMARY_MILK,
                        fontFamily: 'AvenirNext-Bold',
                      }}
                    />
                  )}
                />
              ) : (
                <GlobalText style={settingsStyles.text}>
                  {getValues().email}
                </GlobalText>
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
      <Animated.View style={!formData.phone.isEditing && {height: heightAnim}}>
        <View style={settingsStyles.divider} />
        <View
          style={!formData.phone.isEditing && showOnlyOne && {display: 'none'}}>
          <GlobalText style={settingsStyles.header}>phone</GlobalText>
          <View style={settingsStyles.textEditContainer}>
            <View style={{width: wp('60%')}}>
              {formData.phone.isEditing ? (
                <Controller
                  name="phone"
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
                      activeOutlineColor={PRIMARY_BLUE}
                      style={{
                        backgroundColor: PRIMARY_MILK,
                        fontFamily: 'AvenirNext-Bold',
                      }}
                    />
                  )}
                />
              ) : (
                <GlobalText style={settingsStyles.text}>
                  {state.userSettings.phone}
                </GlobalText>
              )}
            </View>
            {/* <IconButton
              icon={formData.phone.isEditing ? icons.minus : icons.cog}
              mode="outlined"
              size={buttonSizes.extraSmall}
              iconColor={
                formData.phone.isEditing ? PRIMARY_DARK_BLUE : PRIMARY_DARK_GREY
              }
              containerColor={MILK}
              style={galleryInteractionStyles.secondaryButton}
              accessibilityLabel="edit name"
              testID="editName"
              animated
              onPress={() => handleButtonClick(SignedInActions.phone)}
            /> */}
          </View>
        </View>
      </Animated.View>

      {showOnlyOne && (
        <View style={{alignContent: 'center'}}>
          <Button
            icon={icons.saveSettings}
            mode="contained"
            buttonColor={PRIMARY_BLUE}
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
