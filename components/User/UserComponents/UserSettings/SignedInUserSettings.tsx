import React, {useEffect, useState} from 'react';
import {ScrollView, View, Image, Keyboard} from 'react-native';
import {GlobalText} from '../../../GlobalElements';
import {settingsStyles} from '../../Screens/UserSettings';
import {IconButton, TextInput, Button} from 'react-native-paper';
import {icons} from '../../../globalVariables';
import {buttonSizes} from '../../../globalVariables';
import {
  MILK,
  PRIMARY_BLUE,
  PRIMARY_DARK_BLUE,
  PRIMARY_DARK_GREY,
  PRIMARY_MILK,
} from '../../../../assets/styles';
import {useForm, Controller} from 'react-hook-form';
import {galleryInteractionStyles} from '../../../Gallery/galleryStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

type FieldState = {
  isEditing: boolean;
};

type FormData = {
  profilePicture: FieldState;
  userName: FieldState;
  legalName: FieldState;
  email: FieldState;
  phone: FieldState;
};

export function UserSettingsSignedIn({uniqueId}: {uniqueId: string}) {
  console.log(uniqueId)
    const [showOnlyOne, setShowOnlyOne] = useState(false);

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
  const {
    handleSubmit,
    control,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: {
      profilePicture: '',
      userName: 'user name 10000',
      legalName: 'firstName lastName',
      email: 'email@gmail.com',
      phone: '(123) 123-4567',
    },
  });

  useEffect(() => {
    const isShowing =
      formData.profilePicture.isEditing ||
      formData.userName.isEditing ||
      formData.legalName.isEditing ||
      formData.email.isEditing ||
      formData.phone.isEditing;
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
  };

  const onSave = (data: unknown) => {
    // here need to do some backend stuff
    console.log('save', data);
    resetUi();
  };
  const [keyboardStatus, setKeyboardStatus] = useState<boolean>(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!keyboardStatus) {
      resetUi();
    }
  }, [keyboardStatus]);
  return (
    <>
      <ScrollView style={{height: hp('100%')}}>
        <View style={[settingsStyles.divider, {borderBottomWidth: 0}]} />
        <GlobalText style={settingsStyles.header}>profile picture</GlobalText>
        <View style={[settingsStyles.textEditContainer, {height: 'auto'}]}>
          <Image
            source={{
              uri: 'https://www.shutterstock.com/image-photo/closeup-photo-amazing-short-hairdo-260nw-1617540484.jpg',
            }}
            style={settingsStyles.image}
          />
          <IconButton
            icon={
              formData.profilePicture.isEditing ? icons.saveSettings : icons.cog
            }
            mode="outlined"
            size={buttonSizes.extraSmall}
            iconColor={
              formData.profilePicture.isEditing
                ? PRIMARY_DARK_BLUE
                : PRIMARY_DARK_GREY
            }
            containerColor={MILK}
            style={galleryInteractionStyles.secondaryButton}
            accessibilityLabel="edit photo"
            testID="editPhoto"
            animated
            onPress={() =>
              setFormData({
                ...formData,
                profilePicture: {isEditing: !formData.profilePicture.isEditing},
              })
            }
          />
        </View>
        {(!showOnlyOne || formData.userName.isEditing) && (
          <>
            <View style={settingsStyles.divider} />
            <GlobalText style={settingsStyles.header}>{'user name'}</GlobalText>
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
                    {console.log(getValues())}
                    {getValues().userName}
                  </GlobalText>
                )}
              </View>
              <IconButton
                icon={formData.userName.isEditing ? icons.minus : icons.cog}
                mode="outlined"
                size={buttonSizes.extraSmall}
                iconColor={
                  formData.userName.isEditing
                    ? PRIMARY_DARK_BLUE
                    : PRIMARY_DARK_GREY
                }
                containerColor={MILK}
                style={galleryInteractionStyles.secondaryButton}
                accessibilityLabel="edit username"
                testID="editUserName"
                animated
                onPress={() =>
                  setFormData({
                    ...formData,
                    userName: {isEditing: !formData.userName.isEditing},
                  })
                }
              />
            </View>
          </>
        )}
        {(!showOnlyOne || formData.legalName.isEditing) && (
          <>
            <View style={settingsStyles.divider} />
            <GlobalText style={settingsStyles.header}>{'name'}</GlobalText>
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
                    {getValues().legalName}
                  </GlobalText>
                )}
              </View>
              <View>
                <IconButton
                  icon={formData.legalName.isEditing ? icons.minus : icons.cog}
                  mode="outlined"
                  size={buttonSizes.extraSmall}
                  iconColor={
                    formData.legalName.isEditing
                      ? PRIMARY_DARK_BLUE
                      : PRIMARY_DARK_GREY
                  }
                  containerColor={MILK}
                  style={galleryInteractionStyles.secondaryButton}
                  accessibilityLabel="edit name"
                  testID="editName"
                  animated
                  onPress={() =>
                    setFormData({
                      ...formData,
                      legalName: {isEditing: !formData.legalName.isEditing},
                    })
                  }
                />
              </View>
            </View>
          </>
        )}
        {(!showOnlyOne || formData.email.isEditing) && (
          <>
            <View>
              <View style={settingsStyles.divider} />
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
                  icon={formData.email.isEditing ? icons.minus : icons.cog}
                  mode="outlined"
                  size={buttonSizes.extraSmall}
                  iconColor={
                    formData.email.isEditing
                      ? PRIMARY_DARK_BLUE
                      : PRIMARY_DARK_GREY
                  }
                  containerColor={MILK}
                  style={galleryInteractionStyles.secondaryButton}
                  accessibilityLabel="edit name"
                  testID="editName"
                  animated
                  onPress={() =>
                    setFormData({
                      ...formData,
                      email: {isEditing: !formData.email.isEditing},
                    })
                  }
                />
              </View>
            </View>
          </>
        )}
        {(!showOnlyOne || formData.phone.isEditing) && (
          <>
            <View>
              <View style={settingsStyles.divider} />
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
                    {getValues().phone}
                    </GlobalText>
                  )}
                </View>
                <IconButton
                  icon={formData.phone.isEditing ? icons.minus : icons.cog}
                  mode="outlined"
                  size={buttonSizes.extraSmall}
                  iconColor={
                    formData.phone.isEditing
                      ? PRIMARY_DARK_BLUE
                      : PRIMARY_DARK_GREY
                  }
                  containerColor={MILK}
                  style={galleryInteractionStyles.secondaryButton}
                  accessibilityLabel="edit name"
                  testID="editName"
                  animated
                  onPress={() =>
                    setFormData({
                      ...formData,
                      phone: {isEditing: !formData.phone.isEditing},
                    })
                  }
                />
              </View>
            </View>
          </>
        )}
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
    </>
  );
}
