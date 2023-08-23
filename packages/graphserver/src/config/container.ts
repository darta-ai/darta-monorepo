import { Container } from 'inversify';
import { Database } from 'arangojs';
import * as Services from '../services'
import * as Controllers from '../controllers'
import https from 'https';

import { config } from './config';

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
      password: config.arango.password,
    },
    agent,
  }),
);

console.log(arangoContainer)

// Bind services
container.bind<Services.IGalleryService>('IGalleryService').to(Services.GalleryService);

// Bind controllers
container.bind<Controllers.GalleryController>('GalleryController').to(Controllers.GalleryController);

export {
  container,
  arangoContainer,
};