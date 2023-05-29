import {auth} from './firebaseApp';
import firebase from 'firebase/compat/app';
import {onAuthStateChanged} from 'firebase/auth';
import { createUserWithEmailAndPassword } from "firebase/auth";
type UserSignUp = {
  user: any | null,
}

export const firebaseSignUp = async (email: string, password: string): Promise<UserSignUp | null> => {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential: any) => {
      // Signed in
      const user = userCredential.user;
      return user;
    })
    .catch((error: any) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log({errorCode, errorMessage, error})
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
      return firebaseErrors(errorCode)
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


const firebaseErrors = (message: string) => {
  switch (message) {
    case 'auth/invalid-email': {
      return 'The email address is incorrect, please try again.';``
    }
    case 'auth/user-not-found': {
      return 'There is no user record corresponding to this email. Please double check or consider signing up.';
    }
    case 'auth/wrong-password': {
      return 'The password you entered does not match our records.';
    }
    case 'auth/too-many-requests': {
      return 'You\'ve attempted to log in too many times, please try again later';
    }
    case 'auth/email-already-exists': {
      return'The email address is already in use, please login';
      break;
    }
    case 'auth/email-already-in-use': {
      return'The email address is already in use, please login';
      break;
    }
    case 'auth/invalid-email': {
      return'Email is invalid, or is already in use, please double check';
      break;
    }
    case 'auth/invalid-password': {
     return 'Password is invalid, must be 6 characters';
      break;
    }
    case 'auth/too-many-requests': {
      return 'You\'ve attempted to log in too many times, please try again later';
      break;
    }
    default: {
      return 'Something went wrong, please refresh and try again';
    }
  }
}