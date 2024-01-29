import 'reflect-metadata';

import cors from 'cors';
import * as dotenv from 'dotenv';
import express, {Request, Response} from 'express';
import http from 'http';
import {InversifyExpressServer} from 'inversify-express-utils';

import {container} from './config/container';
import { ArtworkService, ExhibitionService } from './services';

const cron = require('node-cron');

const artworkService = container.get('IArtworkService') as ArtworkService
const exhibitionService = container.get('IExhibitionService') as ExhibitionService

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const bodyParser = require('body-parser');

dotenv.config();

const server = new InversifyExpressServer(container);


const corsOptions = {
  origin: ['http://localhost:1169', 'exp://192.168.1.35:8081', 'http://192.168.1.35:8081', 'https://darta.art', 'https://www.darta.art']
};

// Configure and start the server
server.setConfig((app : any) => {
  app.use(cors(corsOptions));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
});

const app = server.build();

const {PORT: port, VERSION: version} = process.env;

const httpServer = http.createServer(app);

let n = 0;
app.get('/', (req: Request, res: Response) => {
  n += 1;
  res.send(`${n}`);
});

app.get('/ping', (req: Request, res: Response) => {
  res.send('pong');
});

app.get('/pong', (req: Request, res: Response) => {
  res.send('ping');
});

app.get('/version', (req: Request, res: Response) => {
  res.send(version);
});

// cron job to update artwork every 24 hours 
cron.schedule('0 3 * * *', async () => {
  try{
    const start = new Date()
    await artworkService.readAllArtworks()
    const end = new Date()
    // eslint-disable-next-line no-console
    console.log(`artwork cron job ran at${  new Date()}, and took ${end.getTime() - start.getTime()}ms`)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('error running cronjob', e)
  }
});
cron.schedule('0 4 * * *', async () => {
  try{
    const start = new Date()
    await exhibitionService.readAllExhibitions()
    const end = new Date()
    // eslint-disable-next-line no-console
    console.log(`exhibition cron job ran at${  new Date()}, and took ${end.getTime() - start.getTime()}ms`)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('error running cronjob', e)
  }
});

httpServer.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}, version ${version}`);
});
