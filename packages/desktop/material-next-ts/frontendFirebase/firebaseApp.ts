// import {initializeApp} from 'firebase/app';
import {getAuth, Auth} from 'firebase/auth';
import firebase from 'firebase/compat/app';
import {getFirestore, Firestore} from 'firebase/firestore/lite';
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

let app;
let auth: Auth;
let db: Firestore;

if (firebaseConfig.apiKey) {
  app = firebase.initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}
export {app, auth, db};
