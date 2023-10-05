import {initializeApp} from 'firebase/app';
import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  getIdTokenResult,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_REACT_APP_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

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
    case 'auth/invalid-password': {
      return 'Password is invalid, must be 6 characters';
    }
    default: {
      return 'Something went wrong, please refresh and try again';
    }
  }
};

export async function firebaseSignUp({
  email,
  password,
  userName,
}: {
  email: string;
  password: string;
  userName: string;
}) {
  try {
    await auth.setPersistence(browserSessionPersistence);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    await updateProfile(userCredential.user, {
      displayName: userName,
    });
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
    return {error: false, user: userCredential.user, errorMessage: ''};
  } catch (error: any) {
    return {
      error: true,
      user: undefined,
      errorMessage: firebaseErrors(error.code),
      verifiedEmail: false,
    };
  }
}

export async function isSignedIn() {
  const {currentUser} = auth;
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
    const idToken = auth.currentUser?.getIdToken();

    return {error: false, user: userCredential.user, errorMessage: '', idToken};
  } catch (error: any) {
    return {
      error: true,
      user: undefined,
      errorMessage: firebaseErrors(error.code),
    };
  }
}

export async function resendEmailVerification() {
  try {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      return {success: true};
    } 
      throw new Error();
    
  } catch (error) {
    return {success: false};
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

export async function firebaseVerifyTest(user: any) {
  try {
    await getIdTokenResult(user);
    return {success: true, errorMessage: ''};
  } catch (error: any) {
    const errorCode = error.code;
    return {success: false, errorMessage: firebaseErrors(errorCode)};
  }
}

// getIdTokenResult

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

export {app, auth, db};
