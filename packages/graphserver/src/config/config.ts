import sgMail from '@sendgrid/mail';
import * as dotenv from 'dotenv';
import { Expo } from 'expo-server-sdk';



dotenv.config();

export const config = {
  arango: {
    url: process.env.ARANGO_URL,
    user: process.env.ARANGO_USER,
    database: process.env.ARANGO_DATABASE,
    password: process.env.ARANGO_PASSWORD,
  },
  minio: {
    endpoint: process.env.MINIO_ENDPOINT,
    port: process.env.MINIO_PORT,
    useSSL: process.env.MINIO_USE_SSL,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
  },
};

export const expoClient = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
  useFcmV1: true, // default false
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export const {ADMIN_PASSWORD, ENV, SENDGRID_INQUIRE_TEMPLATE_ID} = process.env;

export {sgMail}
