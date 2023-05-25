import {auth, app} from './firebaseApp';
import firebase from 'firebase/compat/app';
import {onAuthStateChanged} from 'firebase/auth';

export const firebaseSignUp = async (email: string, password: string) => {
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
      // ..
    });
};

export const firebaseSignIn = async (email: string, password: string) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential: any) => {
      // Signed in
      const user = userCredential.user;
      // ...
    })
    .catch((error: any) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
};

export const isUserSignedIn = () => {
  onAuthStateChanged(auth, user => {
    if (user) {
      const uid = user.uid;
      return {isSignedIn: true, user};
    } else {
      return {isSignedIn: false};
    }
  });
};
