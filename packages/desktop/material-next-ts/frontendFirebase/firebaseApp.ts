import {initializeApp} from 'firebase/app';
import {getFirestore, collection, getDocs} from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get a list of cities from your database
export async function getPamphlet() {
  const pamphletData = collection(db, 'pamphlet');
  const pamphletSnapshot = await getDocs(pamphletData);
  const pamphletList = pamphletSnapshot.docs.map(doc => doc.data());
  return pamphletList;
}
