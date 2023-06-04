import {app} from './firebaseApp';
import firebase from 'firebase/compat/app';
import 'firebase/auth';
type UserSignUp = {
  user: any | null;
  errorText: string | null;
};

// const firebaseAuth = app.auth();

// export async function firebaseSignUp(email: string, password: string): Promise<string> {
//   console.log('fired')
//   return await firebaseAuth.createUserWithEmailAndPassword(email, password).then((user: any) => {
//     user.setPersistence(firebase.auth.Auth.Persistence.SESSION);
//     return user.uid;
//   });
// }

// export function isSignedIn(): boolean {
//   return firebaseAuth.currentUser != null;
// }

// export const firebaseSignIn = async (email: string, password: string): Promise<UserSignedIn | null>=> {
//   firebase
//     .auth()
//     .signInWithEmailAndPassword(email, password)
//     .then((userCredential: any) => {
//       const user = userCredential.user;
//       return user;
//     })
//     .catch((error: any) => {
//       const errorCode = error.code;
//       return firebaseErrors(errorCode)
//     });
//     return null
// };

// export const isUserSignedIn = async (): Promise<IsUserSignedInType> => {
//   onAuthStateChanged(auth, user => {
//     if (user) {
//       const uid = user.uid;
//       return {isSignedIn: true, user};
//     }
//   });
//   return {isSignedIn: false, user: null};

// };

// export const firebaseSignOut = async () => {
//   signOut(auth).then(() => {
//     console.log('successfully signed out')
//   }).catch((error) => {
//     console.log('error signing out')
//   });
// }

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
      return 'The email address is already in use, please login';
    }
    case 'auth/email-already-in-use': {
      return 'The email address is already in use, please login';
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
