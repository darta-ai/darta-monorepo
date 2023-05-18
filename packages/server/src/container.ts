import 'reflect-metadata';

import {Database} from 'arangojs';
import * as fs from 'fs';
import https from 'https';
import {Container} from 'inversify';
import path from 'path';

import {config} from './config';
import {
  ArangoArtworkRepository,
  ArangoRatingRepository,
  ArangoUserRepository,
  CreateCollectionsRepository,
} from './Repositories';
import {UserService} from './Services/UserService';
import {
  IArtworkRepository,
  ICreateCollections,
  IRatingRepository,
  IUserRepository,
  IUserService,
} from './types';

console.log('here');

const privateKey = fs.readFileSync(
  path.join(__dirname, `/ssl/private-key.pem`),
  'utf8',
);
const certificate = fs.readFileSync(
  path.join(__dirname, `/ssl/certificate.pem`),
  'utf8',
);
const agent = new https.Agent({
  rejectUnauthorized: false,
});

const container = new Container();

container.bind(Database).toConstantValue(
  // Configure the ArangoDB connection
  new Database({
    url: config.arango.url!,
    databaseName: config.arango.database!,
    auth: {
      username: config.arango.user!,
      password: '',
    },
    agentOptions: {
      key: privateKey,
      cert: certificate,
      passphrase: 'darta',
    },
    agent,
  }),
);

container
  .bind<IArtworkRepository>('ArtworkRepository')
  .to(ArangoArtworkRepository);
container
  .bind<IRatingRepository>('RatingsRepository')
  .to(ArangoRatingRepository);
container
  .bind<ICreateCollections>('CollectionsRepository')
  .to(CreateCollectionsRepository);
container.bind<IUserRepository>('UserRepository').to(ArangoUserRepository);
container.bind<IUserService>('UserService').to(UserService);

export const userRepository = container.get<IUserRepository>('UserRepository');
export const artworkRepository =
  container.get<IArtworkRepository>('ArtworkRepository');
export const ratingRepository =
  container.get<IRatingRepository>('RatingsRepository');

export const createCollections = container.get<ICreateCollections>(
  'CollectionsRepository',
);

export {container};
