import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Alert, Animated, Image, ScrollView, StyleSheet, View} from 'react-native';
import { RefreshControl } from 'react-native';
import {Button, IconButton, TextInput} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image'

import * as ImagePicker from 'expo-image-picker';
import auth from '@react-native-firebase/auth';
import * as FileSystem from 'expo-file-system';

import * as Colors from '@darta-styles';
import {TextElement} from '../Elements/_index';
import {buttonSizes, icons} from '../../utils/constants';
import {galleryInteractionStyles, globalTextStyles} from '../../styles/styles';
import {ETypes, StoreContext} from '../../state/Store';
import { createUser, deleteDartaUser, editDartaUserAccount, getDartaUser } from '../../api/userRoutes';
import { firebaseDeleteUser } from '../../api/firebase';

type FieldState = {
  isEditing?: boolean;
  value?: string;
};

enum SignedInActions {
  profilePicture = 'profilePicture',
  userName = 'userName',
  legalFirstName= 'legalFirstName',
  legalLastName = 'legalLastName',
  email = 'email',
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
    height: hp('100%'),
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
    fontFamily: 'DMSans_500Medium',
  },
  text: {
    fontFamily: 'DMSans_500Medium',
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
    height: hp('3.5%'),
  },
});

export function EditUserProfile({navigation} : {navigation: any}) {
  const {state, dispatch} = useContext(StoreContext);

  const [showOnlyOne, setShowOnlyOne] = useState(false);

  const [heightAnim] = useState(new Animated.Value(Math.floor(hp('15%'))));

  React.useEffect(() => {
    heightAnim.addListener(() => {});
  }, [])

  const handleShrinkElements = useCallback(() => {
    Animated.timing(heightAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [heightAnim]);

  const handleExpandElements = useCallback(() => {
    Animated.timing(heightAnim, {
      toValue: Math.floor(hp('15%')),
      duration: 502,
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
      email: state.user?.email as string | null,
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

    const setEmail = async () => {
      const user = auth().currentUser;
      if (user && user.email) {
        setValue('email', user.email);
      } else if (state.user?.email) {
        setValue('email', state.user?.email);
      }
    }

    setEmail()
  }, [,formData]);

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
  const [tempBuffer, setTempBuffer] = useState<any>(null);

  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const pickImage = async () => {
    if (status?.granted === false && status?.canAskAgain !== false) {
      const { status: newStatus } = await requestPermission();
      
      if (newStatus === ImagePicker.PermissionStatus.DENIED) {
        alert('Permission to access media library is required to select images.');
        return;
      }
    } 
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result && !result.canceled && result.assets && result.assets[0]) {
      const { uri, type } = result.assets[0];
      // Read the file content using Expo's FileSystem
      const fileContent = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      const dataUrl = `data:image/png;base64,${fileContent}`;
      setTempBuffer(dataUrl)
      
      // Now, the fileContent is the base64 encoded string of your image
      setTempImage({ uri, type });
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
        const values = getValues(formName)
        if (!isEditing) {
          handleShrinkElements();
          setTempValue(values ? values : '');
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

  const [loading, setLoading] = React.useState<boolean>(false);

  const onSave = async () =>
  {
      setLoading(true)
      const uid = auth().currentUser?.uid
      const value = getValues()
     if (formData.userName.isEditing && uid) {
      try{
        const results = await editDartaUserAccount({userName: value.userName, uid})
        dispatch({
          type: ETypes.setUser,
          userData: {
            ...state.user,
            userName: results.userName
          }
       })
      } catch(error){
        console.log(error)
      }
     }
    else if (formData.legalFirstName.isEditing && uid) {
      try{
        const results = await editDartaUserAccount({legalFirstName: value.legalFirstName, uid})
        dispatch({
            type: ETypes.setUser,
            userData: {
              ...state.user,
              legalFirstName: results.legalFirstName
            }
       })
      } catch(error){
        console.log(error)
      }
   }
   else if (formData.legalLastName.isEditing && uid) {
    try{
      const results = await editDartaUserAccount({legalLastName: value.legalLastName, uid})
      dispatch({
          type: ETypes.setUser,
          userData: {
            ...state.user,
            legalLastName: results.legalLastName
          }
      })
    } catch(error){
      console.log(error)
    }
  }
    else if (formData.profilePicture.isEditing && uid) {
      try{
        const results = await editDartaUserAccount({profilePicture: {
          fileData: tempBuffer
        }, uid})
        if (results?.profilePicture?.value) {
          dispatch({
            type: ETypes.setUser,
            userData: {
              ...state.user,
              profilePicture: {
                value: results.profilePicture.value
              }
            }
          })
          setTempImage({uri: results.profilePicture.value});
        }
        setValue('profilePicture', tempImage.uri);
        resetUi();
      } catch(error){
        console.log(error)
      }
      }
    else if (formData.email.isEditing && uid && value.email) {
      try{
        const results = await editDartaUserAccount({email: value.email, uid})
        dispatch({
          type: ETypes.setUser,
          userData: {
            ...state.user,
            email: results.email
          }
      })
      } catch(error){
        console.log(error)
      }
    }
      resetUi();
      setLoading(false)
    };

    const [dialogVisible, setDialogVisible] = useState<boolean>(false)

      
  const deleteAccount = async () => {
    setLoading(true)
    try {      
      const uid = auth().currentUser?.uid
      await firebaseDeleteUser();
      if (uid) {
        await deleteDartaUser({ uid });
        await createUser({uid})
      }
    } catch (err) {
      console.log(err)
    } finally{
      navigation.goBack()
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    Alert.alert(`Delete Profile?`, ``, [
      {
        text: `Yes`,
        onPress: () => deleteAccount(),
        style: 'destructive',
      },
      {
        text: 'Cancel',
        onPress: () => {},
      },
    ])

  }


    const [refreshing, setRefreshing] = React.useState(false)
    
    const onRefresh = React.useCallback(async () => {
      setRefreshing(true);
      try{
          const uid = auth().currentUser?.uid
          if (!uid) return
          const user = await getDartaUser({uid});
          dispatch({
            type: ETypes.setUser,
            userData: user
          });
      } catch {
          setRefreshing(false);
      }
      setTimeout(() => {
        setRefreshing(false);
      }, 500)
    }, []);

  return (
    <ScrollView style={showOnlyOne && {marginTop: hp('5%')}} 
    refreshControl={
      <RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_600} onRefresh={onRefresh} />}
    >
      <Animated.View
        style={!formData.profilePicture.isEditing && {height: heightAnim}}>
        <View style={[SSSignedInUserSettings.divider, {borderBottomWidth: 0}, showOnlyOne && {display: 'none'}]} />
        <View style={
            !formData.profilePicture.isEditing && showOnlyOne && {display: 'none'}
          }>
          <TextElement style={SSSignedInUserSettings.header}>
            profile picture
          </TextElement>
          <View style={[SSSignedInUserSettings.textEditContainer]}>
            {formData.profilePicture.isEditing && tempImage.uri ? (
              <FastImage
                source={{
                  uri: tempImage.uri,
                }}
                style={SSSignedInUserSettings.image}
                resizeMode={FastImage.resizeMode.contain}

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
                ? Colors.PRIMARY_500
                : Colors.PRIMARY_900
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
        </View>
      </Animated.View>
      <Animated.View
        style={!formData.userName.isEditing && {height: heightAnim}}>
        <View style={[SSSignedInUserSettings.divider, showOnlyOne && {display: 'none'}]} />
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
                      textColor={Colors.PRIMARY_700}
                      theme={{
                        fonts: {default: {fontFamily: 'DMSans_400Regular_Italic'}}
                      }}
                      style={{
                        backgroundColor: Colors.PRIMARY_50,
                        fontFamily: 'DMSans_700Bold',
                        color: Colors.PRIMARY_700,
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
                ? Colors.PRIMARY_500
                : Colors.PRIMARY_900
              }
              mode="outlined"
              size={buttonSizes.extraSmall}
              containerColor={Colors.PRIMARY_50}
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
        <View style={[SSSignedInUserSettings.divider, showOnlyOne && {display: 'none'}]} />
        <View
          style={
            !formData.legalFirstName.isEditing && showOnlyOne && {display: 'none'}
          }>
          <TextElement style={SSSignedInUserSettings.header}>first name</TextElement>
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
                      activeOutlineColor={Colors.PRIMARY_600}
                      textColor={Colors.PRIMARY_700}
                      style={{
                        backgroundColor: Colors.PRIMARY_50,
                        color: Colors.PRIMARY_700,
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
                  ? Colors.PRIMARY_500
                  : Colors.PRIMARY_900
                }
                mode="outlined"
                size={buttonSizes.extraSmall}
                containerColor={Colors.PRIMARY_50}
                style={galleryInteractionStyles.secondaryButton}
                accessibilityLabel="edit name"
                testID="editName"
                animated
                onPress={() => handleButtonClick(SignedInActions.legalFirstName)}
              />
            </View>
          </View>
        </View>
      </Animated.View>
      <Animated.View style={!formData.legalLastName.isEditing && {height: heightAnim}}>
        <View style={[SSSignedInUserSettings.divider, showOnlyOne && {display: 'none'}]} />
        <View
          style={!formData.legalLastName.isEditing && showOnlyOne && {display: 'none'}}>
          <TextElement style={SSSignedInUserSettings.header}>last name</TextElement>
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
                      label="last name"
                      testID="phoneInput"
                      mode="outlined"
                      autoComplete="tel"
                      textColor={Colors.PRIMARY_700}
                      activeOutlineColor={Colors.PRIMARY_600}
                      style={{
                        backgroundColor: Colors.PRIMARY_50,
                        fontFamily: 'AvenirNext-Bold',
                        color: Colors.PRIMARY_700,
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
                formData.legalLastName.isEditing 
                ? Colors.PRIMARY_500
                : Colors.PRIMARY_900
              }
              containerColor={Colors.PRIMARY_50}
              style={galleryInteractionStyles.secondaryButton}
              accessibilityLabel="edit name"
              testID="editName"
              animated
              onPress={() => handleButtonClick(SignedInActions.legalLastName)}
            />
          </View>
        </View>
      </Animated.View>
      <Animated.View style={!formData.email.isEditing && {height: heightAnim}}>
        <View style={[SSSignedInUserSettings.divider, showOnlyOne && {display: 'none'}]} />
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
                      value={value as string}
                      multiline
                      autoFocus
                      label="email"
                      testID="emailInput"
                      mode="outlined"
                      autoComplete="email"
                      textColor={Colors.PRIMARY_700}
                      activeOutlineColor={Colors.PRIMARY_600}
                      style={{
                        backgroundColor: Colors.PRIMARY_50,
                        fontFamily: 'AvenirNext-Bold',
                        color: Colors.PRIMARY_700,
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
              icon={formData.email.isEditing ? icons.minus : icons.cog}
              mode="outlined"
              size={buttonSizes.extraSmall}
              iconColor={
                formData.email.isEditing 
                ? Colors.PRIMARY_500
                : Colors.PRIMARY_900
              }
              containerColor={Colors.PRIMARY_50}
              style={galleryInteractionStyles.secondaryButton}
              accessibilityLabel="edit name"
              testID="editName"
              animated
              onPress={() => handleButtonClick(SignedInActions.email)}
            />
          </View>
        </View>
      </Animated.View>
      {showOnlyOne && (
        <View style={{alignContent: 'center'}}>
          <Button
            icon={icons.saveSettings}
            mode="contained"
            buttonColor={Colors.PRIMARY_600}
            textColor={Colors.PRIMARY_50}
            loading={loading}
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
      {!showOnlyOne && (
        <View>
          <View style={{alignContent: 'center'}}>
            {/* <Button
              icon="account-arrow-left"
              mode="contained"
              buttonColor={Colors.PRIMARY_400}
              textColor={Colors.PRIMARY_50}
              style={{
                width: wp('80%'),
                marginTop: hp('5%'),
                alignSelf: 'center',
              }}
              onPress={() => signOut()}>
              Sign Out
            </Button> */}
          </View>
          <View style={{alignContent: 'center'}}>
            <Button
              icon="delete-alert"
              mode="contained"
              buttonColor={Colors.PRIMARY_950}
              textColor={Colors.PRIMARY_50}
              style={{
                width: wp('80%'),
                marginTop: hp('5%'),
                alignSelf: 'center',
              }}
              onPress={() => handleDeleteAccount()}>
              Delete Profile
            </Button>
          </View>
        </View>
      )}
      {/* <DeleteAccountDialog 
        dialogVisible={dialogVisible}
        setDialogVisible={setDialogVisible}
      /> */}
    </ScrollView>
  );
}
