import * as dotenv from 'dotenv';

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

export const {ADMIN_PASSWORD} = process.env;
