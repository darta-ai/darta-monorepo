import React from 'react';
import {getFirestore} from 'firebase/firestore';
import firebase, {initializeApp} from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  browserSessionPersistence,
  updateProfile,
  signInWithEmailAndPassword,
  setPersistence,
  sendPasswordResetEmail,
} from 'firebase/auth';

export const firebaseConfig = {
  apiKey: 'AIzaSyAjZz2ggOnHZJ-g0_8Nuz5bJFSVh756YB4',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export async function firebaseSignUp(
  email: string,
  password: string,
  signInType: string,
) {
  try {
    await auth.setPersistence(browserSessionPersistence);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    await updateProfile(userCredential.user, {
      displayName: signInType,
    });
    return {error: false, user: userCredential.user, errorMessage: ''};
  } catch (error: any) {
    return {
      error: true,
      user: undefined,
      errorMessage: firebaseErrors(error.code),
    };
  }
}

export async function isSignedIn() {
  const currentUser = auth.currentUser;
  return currentUser != null;
}

export async function firebaseSignOut() {
  await auth.signOut();
}

export async function firebaseSignIn(
  email: string,
  password: string,
  signInType: string,
) {
  try {
    await auth.setPersistence(browserSessionPersistence);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    await updateProfile(userCredential.user, {
      displayName: signInType,
    });
    return {error: false, user: userCredential.user, errorMessage: ''};
  } catch (error: any) {
    return {
      error: true,
      user: undefined,
      errorMessage: firebaseErrors(error.code),
    };
  }
}

export async function firebaseForgotPassword(
  email: string,
): Promise<{success: boolean; errorMessage: string} | void> {
  try {
    await sendPasswordResetEmail(auth, email);
    return {success: true, errorMessage: ''};
  } catch (error: any) {
    const errorCode = error.code;
    return {success: false, errorMessage: firebaseErrors(errorCode)};
  }
}

const db: any = getFirestore(app);

type IsUserSignedInType = {
  isSignedIn: boolean;
  user: any | null;
};

type UserSignedIn = {
  isSignedIn?: boolean;
};

export type FirebaseFunctions = {
  firebaseSignUp: (
    email: string,
    password: string,
    signInType?: string,
  ) => Promise<any | null>;
  firebaseSignIn: (
    email: string,
    password: string,
    signInType?: string,
  ) => Promise<UserSignedIn | null>;
  isUserSignedIn: () => Promise<IsUserSignedInType>;
};

export {app, db, auth};

export const firebaseErrors = (message: string) => {
  switch (message) {
    case 'auth/invalid-email': {
      return 'The email address is incorrect, please try again.';
    }
    case 'auth/user-not-found': {
      return 'There is no user record corresponding to this email. Please double check or consider signing up.';
    }
    case 'auth/wrong-password': {
      return 'The password you entered does not match our records.';
    }
    case 'auth/too-many-requests': {
      return "You've attempted to log in too many times, please try again later";
    }
    case 'auth/email-already-exists': {
      return 'The email address is already in use, please log in';
    }
    case 'auth/email-already-in-use': {
      return 'The email address is already in use, please log in';
    }
    case 'auth/invalid-email': {
      return 'Email is invalid, or is already in use, please double check';
    }
    case 'auth/invalid-password': {
      return 'Password is invalid, must be 6 characters';
    }
    case 'auth/too-many-requests': {
      return "You've attempted to log in too many times, please try again later";
    }
    default: {
      return 'Something went wrong, please refresh and try again';
    }
  }
};
