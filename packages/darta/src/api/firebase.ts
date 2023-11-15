import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app'
import { editDartaUserAccount } from './userRoutes';

export const firebaseSignUp = async ({email, password}: {email: string, password: string}) => {

    try {
        const credential = firebase.auth.EmailAuthProvider.credential(email, password);
        const linking = await auth().currentUser?.linkWithCredential(credential);
        const res3 = await editDartaUserAccount({uid: auth().currentUser?.uid, email})
        return res3;
    } catch(e){
        if (e.code === 'auth/email-already-in-use') {
            throw new Error('That email address is already in use!');
          }
      
          if (e.code === 'auth/invalid-email') {
            throw new Error('That email address is invalid!');
          }
        console.log({e})
    }
}

export const firebaseSignIn = async ({email, password}: {email: string, password: string}) => {

  try {
      const res = await auth().signInWithEmailAndPassword(email, password);
      return res;
  } catch(e){
    console.log({e})
      if (e.code === 'auth/email-already-in-use') {
          throw new Error('That email address is already in use!');
        }
    
        if (e.code === 'auth/invalid-email') {
          throw new Error('That email address is invalid!');
        }
      throw new Error('Something went wrong, please try again')
  }
}

export enum FirebaseSetUserEnum {
    displayName = 'displayName',
    email = 'email',
    userName = 'userName',
}

export const firebaseSetUser = async ({type, data}: {type: FirebaseSetUserEnum, data: any}) => {

  try {
      const res = await auth().currentUser?.updateProfile({
        [type]: data,
      })
      return res;
  } catch(e){
      
  }
}

export const firebaseDeleteUser = async () => {
  try {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('No user found');
    }
    const results = await user?.delete()
    return results;
  } catch(e){
    throw new Error ('Unable to delete user')
  }
}


export const firebaseSignOut = async ({password} : {password: string}) => {
  try {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('No user found');
    }

    await auth().signOut()
    const results = await user?.delete()
    return results;
  } catch(e){
    throw new Error ('Unable to delete user')
  }
}