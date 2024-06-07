import * as dotenv from 'dotenv';
import admin, { ServiceAccount } from 'firebase-admin';
// eslint-disable-next-line import/no-unresolved
import {getAuth} from 'firebase-admin/auth';

import serviceAccount from '../serviceAccountKey.json';

dotenv.config();


export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
};

const app = admin.initializeApp(firebaseConfig);

export const remoteConfig = app.remoteConfig();

export const auth = getAuth(app);