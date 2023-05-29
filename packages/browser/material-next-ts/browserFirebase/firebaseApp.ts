// import {initializeApp} from 'firebase/app';

import firebase from 'firebase/compat/app';
import {getFirestore, Firestore} from 'firebase/firestore/lite';
import { getAuth } from "firebase/auth";

console.log(process.env.REACT_APP_FIREBASE_API_KEY)

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

let app: firebase.app.App = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);

// let app: firebase.app.App = firebase.initializeApp({
//   apiKey: "AIzaSyAjZz2ggOnHZJ-g0_8Nuz5bJFSVh756YB4",
//   authDomain: "darta-desktop.firebaseapp.com",
//   projectId: "darta-desktop",
//   storageBucket: "darta-desktop.appspot.com",
//   messagingSenderId: "682927959309",
//   appId: "1:682927959309:web:0b421dab61449b97041444",
//   measurementId: "G-NRB3DG38JH"
// });

let db: Firestore = getFirestore(app);

export {app, db};
