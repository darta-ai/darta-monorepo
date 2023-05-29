import {app} from './firebaseApp';
import firebase from 'firebase/compat/app';
import {onAuthStateChanged} from 'firebase/auth';
import {getAuth, Auth, auth} from 'firebase/auth';

type UserSignUp = {
  user: any | null,
}

export const firebaseSignUp = async (email: string, password: string): Promise<UserSignUp | null> => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential: any) => {
      // Signed in
      const user = userCredential.user;
      return user;
    })
    .catch((error: any) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log({errorCode, errorMessage})
    });
    return null
};

type UserSignedIn = {
  isSignedIn?: boolean,
}

export const firebaseSignIn = async (email: string, password: string): Promise<UserSignedIn | null>=> {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential: any) => {
      // Signed in
      const user = userCredential.user;
      return user;
    })
    .catch((error: any) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log({errorCode, errorMessage})
    });
    return null
};

type IsUserSignedInType = {
  isSignedIn: boolean,
  user: any | null
}

export const isUserSignedIn = async (): Promise<IsUserSignedInType> => {
  onAuthStateChanged(auth, user => {
    if (user) {
      const uid = user.uid;
      return {isSignedIn: true, user};
    } 
  });
  return {isSignedIn: false, user: null};

};

export type FirebaseFunctions = {
  firebaseSignUp: (email: string, password: string) => Promise<UserSignUp | null>,
  firebaseSignIn: (email: string, password: string) => Promise<UserSignedIn | null>,
  isUserSignedIn: () => Promise<IsUserSignedInType> 
}