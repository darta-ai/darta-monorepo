import { Database } from 'arangojs';
// import * as fs from 'fs';
import https from 'https';
import { Container } from 'inversify';
// import path from 'path';

import { config } from './config';

// const privateKey = fs.readFileSync(
//   path.join(__dirname, `/ssl/private-key.pem`),
//   'utf8',
// );
// const certificate = fs.readFileSync(
//   path.join(__dirname, `/ssl/certificate.pem`),
//   'utf8',
// );
const agent = new https.Agent({
  rejectUnauthorized: false,
});

const container = new Container();

const arangoContainer = container.bind<Database>('Database').toConstantValue(
  new Database({
    url: config.arango.url!,
    databaseName: config.arango.database!,
    auth: {
      username: config.arango.user!,
      password: '',
    },
    // agentOptions: {
    //   key: privateKey,
    //   cert: certificate,
    //   passphrase: 'darta',
    // },
    agent,
  }),
);

export {
  container,
  arangoContainer,
};